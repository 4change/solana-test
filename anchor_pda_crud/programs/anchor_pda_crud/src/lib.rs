use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

declare_id!("3dTgUegNtphEnDmnLRsnL97SFHXih6tCKeAy8gCk5tAj");

#[program]
pub mod anchor_pda_crud {
    use super::*;

    pub fn create(ctx: Context<Create>, message: String) -> Result<()> {
        msg!("Create Message---------------------------------------------------: {}", message);
        let account_data = &mut ctx.accounts.message_account;
        account_data.user = ctx.accounts.user.key();        // 这里是什么用法？
        account_data.message = message;
        account_data.bump = ctx.bumps.message_account;     // 这里是什么用法？
        Ok(())
    }

    pub fn update(ctx: Context<Update>, message: String) -> Result<()> {
        msg!("Update Message---------------------------------------------------: {}", message);
        let account_data = &mut ctx.accounts.message_account;
        account_data.message = message;

        let transfer_accounts = Transfer {
            from: ctx.accounts.user.to_account_info(),              // 资金来源
            to: ctx.accounts.vault_account.to_account_info(),       // 资金接收方
        };
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            transfer_accounts,
        );
        // 执行 CPI 调用，将 1,000,000 lamport 从用户账户转账到资金账户
        transfer(cpi_context, 1_000_000)?;
        Ok(())
    }

    pub fn delete(ctx: Context<Delete>) -> Result<()> {
        msg!("Delete Message------------------------------");
        let user_key = ctx.accounts.user.key();
        let signer_seeds: &[&[&[u8]]] =
            &[&[b"vault", user_key.as_ref(), &[ctx.bumps.vault_account]]];

        let transfer_accounts = Transfer {
            from: ctx.accounts.vault_account.to_account_info(),
            to: ctx.accounts.user.to_account_info(),
        };
        // 构建 CPI 上下文，包含系统程序和转账账户信息，以及签名者种子
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            transfer_accounts,
        ).with_signer(signer_seeds);
        // 执行 CPI 调用，将资金账户中的所有 lamport 转账到用户账户
        transfer(cpi_context, ctx.accounts.vault_account.lamports())?;
        Ok(())
    }
}

// 定义 Create 指令所需的账户
// Anchor 程序中的 #[derive(Accounts)] 属性用于注解定义指令所需账户的结构体。结构体中的每个字段表示一个账户。
#[derive(Accounts)]
#[instruction(message: String)]
pub struct Create<'info> {
    #[account(mut)]         // 需要可变状态 (#[account(mut)])，因为它为新账户支付费用，必须签署交易以批准从该账户扣除 lamport
    pub user: Signer<'info>,           // 创建消息账户的用户

    #[account(
        init,                                                   // init 约束在指令执行期间创建账户
        seeds = [b"message", user.key().as_ref()],              // seeds 和 bump 约束将账户地址派生为程序派生地址 (PDA)
        bump,
        payer = user,                                           // payer = user 确定谁为新账户的创建支付费用
        space = 8 + 32 + 4 + message.len() + 1
    )]
    pub message_account: Account<'info, MessageAccount>,        // 存储用户消息的新账户

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(message: String)]
pub struct Update<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [b"vault", user.key().as_ref()],
        bump,
    )]
    pub vault_account: SystemAccount<'info>,                    // 资金账户

    #[account(
        mut,
        seeds = [b"message", user.key().as_ref()],              // message 为派生用户 PDA 的种子
        bump = message_account.bump,
        realloc = 8 + 32 + 4 + message.len() + 1,
        realloc::payer = user,
        realloc::zero = true,
    )]
    pub message_account: Account<'info, MessageAccount>,        // 消息账户

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Delete<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [b"vault", user.key().as_ref()],
        bump,
    )]
    pub vault_account: SystemAccount<'info>,

    #[account(
        mut,
        seeds = [b"message", user.key().as_ref()],
        bump = message_account.bump,
        close= user,
    )]
    pub message_account: Account<'info, MessageAccount>,
    
    pub system_program: Program<'info, System>,
}

// Anchor 程序中的 #[account] 属性用于注解表示账户数据的结构（存储在账户数据字段中的数据类型）。
// 在创建账户时，程序会将 MessageAccount 数据序列化并存储在新账户的数据字段中。
#[account]
pub struct MessageAccount {
    pub user: Pubkey,          // 标识创建消息账户的用户
    pub message: String,       // 用户消息
    pub bump: u8,              // 存储用于派生程序派生地址（PDA）的 "bump" 种子。存储此值可以节省计算资源，无需在后续指令中重新计算。
}

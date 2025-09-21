use anchor_lang::prelude::*;
 
declare_id!("7wv1BvhHJYYuG3BTbaHfu5FztGgm2vdjMvC3aTkwhynC");
 
#[program]
pub mod anchor_typescript_counter {
    use super::*;
 
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &ctx.accounts.counter;
        msg!("计数器账户已创建！当前计数：{}", counter.count);
        Ok(())
    }
 
    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        msg!("之前的计数器：{}", counter.count);
 
        counter.count += 1;
        msg!("计数器已增加！当前计数：{}", counter.count);
        Ok(())
    }
}
 
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
 
    #[account(
        init,
        payer = payer,
        space = 8 + 8
    )]
    pub counter: Account<'info, Counter>,
    pub system_program: Program<'info, System>,
}
 
#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    pub counter: Account<'info, Counter>,
}
 
#[account]
pub struct Counter {
    pub count: u64,
}
use anchor_lang::prelude::*;

declare_id!("5RzXHEH1P1fzVBhG9md9qubsRNyRmk7NqD4kG9TKZbPx");

#[program]
pub mod anchor_first {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings -----------------------------------------------from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

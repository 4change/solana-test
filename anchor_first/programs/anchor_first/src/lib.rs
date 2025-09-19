use anchor_lang::prelude::*;

declare_id!("847TB4moVxmXCzAR4s6yeW2EpMw4m7xGtV3DiB1g9DtK");

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

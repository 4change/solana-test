use anchor_lang::prelude::*;
 
declare_id!("7eYaKCdAeMvX3w2bhXBctdx5MrfCqgPZxWybLKsuymgV");
 
#[program]
pub mod anchor_event_cpi_test {
    use super::*;
 
    pub fn emit_event(ctx: Context<EmitEvent>, input: String) -> Result<()> {
        emit_cpi!(CustomEvent { message: input });
        Ok(())
    }
}
 

#[event_cpi]                    // 触发 CPI 事件时，必须添加该约束
#[derive(Accounts)]
pub struct EmitEvent {}
 

#[event]
pub struct CustomEvent {
    pub message: String,
}
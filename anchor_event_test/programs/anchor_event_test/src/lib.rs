use anchor_lang::prelude::*;
 
declare_id!("AmxeLGZxKmAu28w3wVknqB9QTkiNrpZPRrnAN4Dytf4d");
 
#[program]
pub mod anchor_event_test {
    use super::*;
 
    pub fn emit_event(_ctx: Context<EmitEvent>, input: String) -> Result<()> {
        emit!(CustomEvent { message: input });          // 触发事件
        Ok(())
    }
}
 
#[derive(Accounts)]
pub struct EmitEvent {}
 
// 定义事件
#[event]
pub struct CustomEvent {
    pub message: String,
}
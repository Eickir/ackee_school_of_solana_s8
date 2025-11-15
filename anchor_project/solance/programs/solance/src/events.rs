use anchor_lang::prelude::*;

#[event]
pub struct ClientInitialized {
    pub owner: Pubkey,
    pub timestamp: i64,
}
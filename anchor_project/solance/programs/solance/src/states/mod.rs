use anchor_lang::prelude::*;

#[account]
pub struct Client { 
    pub owner: Pubkey, 
    pub next_contract_id: Option<u64>,
}

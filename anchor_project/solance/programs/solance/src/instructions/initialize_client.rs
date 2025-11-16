// src/handlers/initialize_client.rs
use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock::INITIAL_RENT_EPOCH;
use anchor_lang::solana_program::program_error::ACCOUNT_NOT_RENT_EXEMPT;
use crate::states::Client;
use crate::constants::CLIENT_SEED;
use crate::errors::SolanceError;
use crate::events::ClientInitialized;

pub fn initialize_client(ctx: Context<InitializeClient>) -> Result<()> {

    let clock = Clock::get()?;

    let client_account = &mut ctx.accounts.client_account;

    require!(!client_account.to_account_info().data_is_empty(), SolanceError::ClientAlreadyInitialized);

    client_account.owner = ctx.accounts.client.key();
    client_account.next_contract_id = 0;

    emit!(ClientInitialized {
        owner: ctx.accounts.client.key(),
        timestamp: clock.unix_timestamp,
    });
    
    Ok(())
}

#[derive(Accounts)]
pub struct InitializeClient<'info> {
    #[account(mut)]
    pub client: Signer<'info>,

    #[account(
        init,
        payer = client,
        seeds = [CLIENT_SEED, client.key().as_ref()],
        bump,
        space = 8 + 32 + 1 + 8,
    )]
    pub client_account: Account<'info, Client>,

    pub system_program: Program<'info, System>,
}

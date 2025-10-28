//-------------------------------------------------------------------------------
///
/// TASK: Implement the withdraw functionality for the on-chain vault
/// 
/// Requirements:
/// - Verify that the vault is not locked
/// - Verify that the vault has enough balance to withdraw
/// - Transfer lamports from vault to vault authority
/// - Emit a withdraw event after successful transfer
/// 
///-------------------------------------------------------------------------------

use anchor_lang::prelude::*;
use crate::state::Vault;
use crate::errors::VaultError;
use crate::events::WithdrawEvent;
use anchor_lang::solana_program::program::invoke;
use anchor_lang::solana_program::system_instruction::transfer;

#[derive(Accounts)]
#[instruction(amount_to_withdraw: u64)]
pub struct Withdraw<'info> {
    // TODO: Add required accounts and constraints
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut, 
        constraint = vault.to_account_info().lamports() >= amount_to_withdraw @ VaultError::Overflow, 
        constraint = vault.locked != true @ VaultError::VaultLocked
        )]
    pub vault: Account<'info, Vault>,
    pub system_program: UncheckedAccount<'info>,
}

pub fn _withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
    // TODO: Implement withdraw functionality
    let ix = transfer(&ctx.accounts.vault.vault_authority.key(), &ctx.accounts.user.key(), amount);

    invoke(
        &ix,
        &[
            ctx.accounts.user.to_account_info(),
            ctx.accounts.vault.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
    )?;
    
    
    emit!(WithdrawEvent{
        amount: amount, 
        vault: ctx.accounts.user.key(),
        vault_authority: ctx.accounts.vault.vault_authority.key()
    });

    Ok(())

}
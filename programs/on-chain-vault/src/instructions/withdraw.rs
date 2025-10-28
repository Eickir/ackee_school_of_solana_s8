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

#[derive(Accounts)]
#[instruction(amount_to_withdraw: u64)]
pub struct Withdraw<'info> {
    // TODO: Add required accounts and constraints
    #[account(mut, 
    constraint = vault.vault_authority == vault_authority.key())]
    pub vault_authority: Signer<'info>,
    #[account(mut, 
        constraint = vault.to_account_info().lamports() >= amount_to_withdraw @ VaultError::InsufficientBalance, 
        constraint = vault.locked == false @ VaultError::VaultLocked
        )]
    pub vault: Account<'info, Vault>,
    pub system_program: Program<'info, System>,
}

pub fn _withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
    // TODO: Implement withdraw functionality
    **ctx.accounts.vault.to_account_info().try_borrow_mut_lamports()? -= amount;
    **ctx.accounts.vault_authority.to_account_info().try_borrow_mut_lamports()? += amount;
    
    
    emit!(WithdrawEvent{
        amount,
        vault: ctx.accounts.vault.key(),                    
        vault_authority: ctx.accounts.vault_authority.key()
    });

    Ok(())

}
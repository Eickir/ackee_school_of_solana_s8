//-------------------------------------------------------------------------------
///
/// TASK: Implement the toggle lock functionality for the on-chain vault
/// 
/// Requirements:
/// - Toggle the locked state of the vault (locked becomes unlocked, unlocked becomes locked)
/// - Only the vault authority should be able to toggle the lock
/// - Emit a toggle lock event after successful state change
/// 
///-------------------------------------------------------------------------------

use anchor_lang::prelude::*;
use crate::state::Vault;
use crate::events::ToggleLockEvent;

#[derive(Accounts)]
pub struct ToggleLock<'info> {
    // TODO: Add required accounts and constraints
    #[account(constraint = user.key() == vault.vault_authority.key())]
    pub user: Signer<'info>,
    #[account(mut)]
    pub vault: Account<'info, Vault>
}

pub fn _toggle_lock(ctx: Context<ToggleLock>) -> Result<()> {
    
    // TODO: Implement toggle lock functionality
    ctx.accounts.vault.locked = !ctx.accounts.vault.locked;
    
    emit!(ToggleLockEvent{
        vault: ctx.accounts.user.key(), 
        vault_authority: ctx.accounts.vault.vault_authority.key(), 
        locked: ctx.accounts.vault.locked
    });

    Ok(())
    
}
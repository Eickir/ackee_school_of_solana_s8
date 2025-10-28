//-------------------------------------------------------------------------------
///
/// TASK: Implement the deposit functionality for the on-chain vault
/// 
/// Requirements:
/// - Verify that the user has enough balance to deposit
/// - Verify that the vault is not locked
/// - Transfer lamports from user to vault using CPI (Cross-Program Invocation)
/// - Emit a deposit event after successful transfer
/// 
///-------------------------------------------------------------------------------

use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_lang::solana_program::system_instruction::transfer;
use crate::state::Vault;
use crate::errors::VaultError;
use crate::events::DepositEvent;

#[derive(Accounts)]
#[instruction(amount_to_deposit: u64)]
pub struct Deposit<'info> {
    // TODO: Add required accounts and constraints
    #[account(mut, constraint = depositor.to_account_info().lamports() > amount_to_deposit @ VaultError::InsufficientBalance)]
    pub depositor: Signer<'info>,
    #[account(mut, constraint = vault.locked != false @ VaultError::VaultLocked)]
    pub vault: Account<'info, Vault>,
    pub system_program: Program<'info, System>,
}

pub fn _deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
    
    // TODO: Implement deposit functionality
    let ix = transfer(&ctx.accounts.depositor.key(), &ctx.accounts.vault.key(), amount);

    invoke(
        &ix,
        &[
            ctx.accounts.depositor.to_account_info(),
            ctx.accounts.vault.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
        ],
    )?;
    
    emit!(DepositEvent{
        amount: amount, 
        user: ctx.accounts.depositor.key(), 
        vault: ctx.accounts.vault.key()
    });

    Ok(())

}
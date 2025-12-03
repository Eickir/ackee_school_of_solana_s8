use anchor_lang::prelude::*;
use crate::states::{Contract, Contractor, Status};
use crate::errors::SolanceError;

pub fn mark_work_done(ctx: Context<MarkWorkDone>) -> Result<()> {
    let contract = &mut ctx.accounts.contract;

    require!(contract.status == Status::Accepted, SolanceError::ContractNotAccepted);
    contract.status = Status::Closed;

    Ok(())
}

#[derive(Accounts)]
pub struct MarkWorkDone<'info> {
    #[account(mut)]
    pub contractor: Signer<'info>,
    #[account(
        mut,
        constraint = contractor_account.owner == contractor.key() @ SolanceError::UnauthorizedAccount
    )]
    pub contractor_account: Account<'info, Contractor>,
    #[account(
        mut,
        constraint = contract.contractor == Some(contractor_account.key())
            @ SolanceError::UnauthorizedAccount
    )]
    pub contract: Account<'info, Contract>,
}

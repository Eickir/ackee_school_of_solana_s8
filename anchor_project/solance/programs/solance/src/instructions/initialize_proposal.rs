use anchor_lang::prelude::*;
use crate::ProposalInitialized;
use crate::states::{Contractor, Proposal, Contract};
use crate::constants::PROPOSAL_SEED;
use crate::errors::SolanceError;



pub fn initialize_proposal(ctx: Context<InitializeProposal>, amount: u64) -> Result<()> {

    let proposal_account = &mut ctx.accounts.proposal_account;

    proposal_account.contract = ctx.accounts.contract.key();
    proposal_account.contractor = ctx.accounts.contractor_account.key();
    proposal_account.proposal_id = ctx.accounts.contractor_account.next_proposal_id;
    proposal_account.amount = amount;

    let contractor_account = &mut ctx.accounts.contractor_account;
    contractor_account.next_proposal_id += 1;
    
    emit!(ProposalInitialized{
        contract: proposal_account.contract, 
        contractor: proposal_account.contractor, 
        proposal_id: proposal_account.proposal_id, 
        amount: proposal_account.amount
    });

    Ok(())

}



#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct InitializeProposal<'info> {
    #[account(mut)]
    pub contractor: Signer<'info>, 
    #[account(
        mut, 
        constraint = contractor_account.owner == contractor.key() @ SolanceError::UnauthorizedAccount, 
    )]
    pub contract: Account<'info, Contract>,
    #[account(mut)]
    pub contractor_account: Account<'info, Contractor>, 
    #[account(
        init, 
        payer = contractor, 
        seeds = [PROPOSAL_SEED, contractor_account.key().as_ref(), contractor_account.next_proposal_id.to_le_bytes().as_ref()], 
        bump, 
        space = 8 + 32 + 32 + 8 + 8,
    )] 
    pub proposal_account: Account<'info, Proposal>, 
    pub system_program: Program<'info, System>

}
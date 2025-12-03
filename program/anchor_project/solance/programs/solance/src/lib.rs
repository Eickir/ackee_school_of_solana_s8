use anchor_lang::prelude::*;

pub mod constants;
pub mod states;
pub mod instructions;
pub use instructions::*;
pub mod errors;
pub use errors::SolanceError;
pub mod events;
pub use events::*;

declare_id!("9os8f9dUNrZzg53kjGb1wj1stMabFFj4fuRnrF9pCjR6");

#[program]
pub mod solance {
    use super::*;

    pub fn initialize_client_ix(ctx: Context<InitializeClient>) -> Result<()> {
        initialize_client(ctx)
    }

    pub fn initialize_contractor_ix(ctx: Context<InitializeContractor>) -> Result<()> {
        initialize_contractor(ctx)
    }

    pub fn initialize_contract_ix(ctx: Context<InitializeContract>, title: String, topic: String) -> Result<()> {
        initialize_contract(ctx, title, topic)
    }

    pub fn initialize_proposal_ix(ctx: Context<InitializeProposal>, amount: u64) -> Result<()> {
        initialize_proposal(ctx,  amount)
    }

    pub fn update_proposal_ix(ctx: Context<UpdateProposal>, amount: u64) -> Result<()> {
        update_proposal(ctx, amount)
    }

    pub fn choose_proposal_ix(ctx: Context<ChooseProposal>) -> Result<()> {
        choose_proposal(ctx)
    }

    pub fn mark_work_done_ix(ctx: Context<MarkWorkDone>) -> Result<()> {
        mark_work_done(ctx)
    }

    pub fn claim_payment_ix(ctx: Context<ClaimPayment>) -> Result<()> {
        claim_payment(ctx)
    }

}

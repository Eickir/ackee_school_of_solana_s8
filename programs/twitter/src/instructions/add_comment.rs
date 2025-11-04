//-------------------------------------------------------------------------------
///
/// TASK: Implement the add comment functionality for the Twitter program
/// 
/// Requirements:
/// - Validate that comment content doesn't exceed maximum length
/// - Initialize a new comment account with proper PDA seeds
/// - Set comment fields: content, author, parent tweet, and bump
/// - Use content hash in PDA seeds for unique comment identification
/// 
///-------------------------------------------------------------------------------

use anchor_lang::prelude::*;
use crate::errors::TwitterError;
use crate::states::*;
use anchor_lang::solana_program::hash::hash;



pub fn add_comment(ctx: Context<AddCommentContext>, comment_content: String) -> Result<()> {

    let comment_account = &mut ctx.accounts.comment;
    comment_account.comment_author = ctx.accounts.comment_author.key();
    comment_account.parent_tweet = ctx.accounts.tweet.key();
    comment_account.bump = ctx.bumps.comment;
    comment_account.content = comment_content;

    Ok(())

}

#[derive(Accounts)]
#[instruction(comment_content: String)]
pub struct AddCommentContext<'info> {
    // TODO: Add required account constraints
    #[account(mut)]
    pub comment_author: Signer<'info>,
    #[account(init, 
        payer = comment_author, 
        space = 8 + 32 + 32 + 4 + 500 + 8, 
        seeds = [COMMENT_SEED.as_bytes(),
                comment_author.key().as_ref(),
                {&hash(comment_content.as_bytes()).to_bytes()},
                tweet.key().as_ref()],
        bump, 
        constraint = comment_content.len() <= COMMENT_LENGTH @ TwitterError::CommentTooLong)]
    pub comment: Account<'info, Comment>,
    pub tweet: Account<'info, Tweet>,
    pub system_program: Program<'info, System>,
}

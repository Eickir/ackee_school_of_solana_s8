//-------------------------------------------------------------------------------
///
/// TASK: Implement the add reaction functionality for the Twitter program
/// 
/// Requirements:
/// - Initialize a new reaction account with proper PDA seeds
/// - Increment the appropriate counter (likes or dislikes) on the tweet
/// - Set reaction fields: type, author, parent tweet, and bump
/// - Handle both Like and Dislike reaction types
/// 
///-------------------------------------------------------------------------------

use anchor_lang::prelude::*;

use crate::errors::TwitterError;
use crate::states::*;

pub fn add_reaction(ctx: Context<AddReactionContext>, reaction: ReactionType) -> Result<()> {
    
    let reaction_account = &mut ctx.accounts.tweet_reaction;
    reaction_account.reaction_author = ctx.accounts.reaction_author.key();
    reaction_account.parent_tweet = ctx.accounts.tweet.key();
    reaction_account.reaction = reaction.clone();
    reaction_account.bump = ctx.bumps.tweet_reaction;

    let tweet = &mut ctx.accounts.tweet;

    match reaction {
        ReactionType::Like => tweet.likes += 1, 
        ReactionType::Dislike => tweet.dislikes += 1
    }

    Ok(())

}

#[derive(Accounts)]
pub struct AddReactionContext<'info> {
    // TODO: Add required account constraints
    #[account(mut)]
    pub reaction_author: Signer<'info>,
    #[account(
        init, 
        payer = reaction_author,
        space = 8 + 32 + 32 + 8, 
        seeds = [TWEET_REACTION_SEED.as_bytes(), reaction_author.key().as_array(), tweet.key().as_array()], 
        bump
    )]
    pub tweet_reaction: Account<'info, Reaction>,
    #[account(mut)]
    pub tweet: Account<'info, Tweet>,
    pub system_program: Program<'info, System>,
}

/*
2. **Adding Reactions**: Users can like or dislike tweets. 
Each reaction creates a new PDA account with seeds designed to prevent multiple reactions per user per tweet.
*/
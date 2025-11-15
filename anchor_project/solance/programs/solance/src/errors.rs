use anchor_lang::prelude::*;

#[error_code]
pub enum SolanceError {
    #[msg("Client is already initialized")]
    ClientAlreadyInitialized,
}
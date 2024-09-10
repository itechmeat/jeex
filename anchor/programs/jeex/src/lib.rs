use anchor_lang::prelude::*;

declare_id!("Gkspqei1iisV5gbqiTw78henHkLbcaKCFKdbmTTpFmcF");

#[program]
pub mod jeex {
    use super::*;

    pub fn setup_game(ctx: Context<SetupGame>) -> Result<()> {
        let game = &mut ctx.accounts.game;
        game.player = ctx.accounts.player.key();
        game.score = 0;
        Ok(())
    }

    pub fn set_score(ctx: Context<SetScore>, score: u32) -> Result<()> {
        let game = &mut ctx.accounts.game;
        game.score = score;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct SetupGame<'info> {
    #[account(zero)]
    pub game: Account<'info, Game>,
    pub player: Signer<'info>,
}

#[derive(Accounts)]
pub struct SetScore<'info> {
    #[account(mut)]
    pub game: Account<'info, Game>,
    pub player: Signer<'info>,
}

#[account]
pub struct Game {
    pub player: Pubkey,
    pub score: u32,
}

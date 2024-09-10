use anchor_lang::prelude::*;

declare_id!("Gkspqei1iisV5gbqiTw78henHkLbcaKCFKdbmTTpFmcF");

#[program]
pub mod jeex {
    use super::*;

    pub fn setup_game(ctx: Context<SetupGame>) -> Result<()> {
      msg!("Starting setup_game");
      ctx.accounts.game.start(ctx.accounts.player.key()).map_err(|e| {
          msg!("Error in start: {:?}", e);
          e
      })
  }

    pub fn place_chips(ctx: Context<PlaceChips>, attacker: Tile, runner: Tile) -> Result<()> {
        ctx.accounts.game.place_chips(ctx.accounts.player.key(), &attacker, &runner)
    }

    pub fn play(ctx: Context<Play>, attacker_move: Tile, runner_move: Tile) -> Result<()> {
        ctx.accounts.game.play(ctx.accounts.player.key(), &attacker_move, &runner_move)
    }
}

#[derive(Accounts)]
pub struct SetupGame<'info> {
    #[account(init, payer = player, space = 8 + Game::MAXIMUM_SIZE)]
    pub game: Account<'info, Game>,
    #[account(mut)]
    pub player: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PlaceChips<'info> {
    #[account(mut)]
    pub game: Account<'info, Game>,
    pub player: Signer<'info>,
}

#[derive(Accounts)]
pub struct Play<'info> {
    #[account(mut)]
    pub game: Account<'info, Game>,
    pub player: Signer<'info>,
}

#[account]
pub struct Game {
    players: [Pubkey; 16], // Ограничим игру 16 игроками
    player_count: u8,
    current_round: u8,
    board: [u8; 200], // 10x10 поле, 2 байта на клетку
    state: u8, // Используем битовые флаги для состояния
}

impl Default for Game {
    fn default() -> Self {
        Self {
            players: [Pubkey::default(); 16],
            player_count: 0,
            current_round: 0,
            board: [0; 200],
            state: 0,
        }
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, PartialEq, Eq, Clone, Copy)]
pub struct Tile {
    row: u8,
    column: u8,
}

impl Game {
    pub const MAXIMUM_SIZE: usize = 8 + // discriminator
        (32 * 16) + // players (16 players maximum)
        1 + // player_count
        1 + // current_round
        200 + // board
        1; // state

    pub fn start(&mut self, first_player: Pubkey) -> Result<()> {
        require!(self.state == 0, JeexError::GameAlreadyStarted);
        self.players[0] = first_player;
        self.player_count = 1;
        self.state = 1; // PlacingChips
        self.current_round = 0;
        Ok(())
    }

    pub fn place_chips(&mut self, player: Pubkey, attacker: &Tile, runner: &Tile) -> Result<()> {
        require!(self.state == 1, JeexError::InvalidGameState);
        require!(self.is_valid_tile(attacker) && self.is_valid_tile(runner), JeexError::InvalidTile);
        require!(attacker != runner, JeexError::SameTileForBothChips);

        let player_index = self.add_player(player)?;
        self.set_chip(attacker, player_index, true);
        self.set_chip(runner, player_index, false);

        if self.player_count == 16 {
            self.state = 2; // Active
            self.current_round = 1;
        }

        Ok(())
    }

    pub fn play(&mut self, player: Pubkey, attacker_move: &Tile, runner_move: &Tile) -> Result<()> {
        require!(self.state == 2, JeexError::GameNotActive);
        require!(self.is_valid_tile(attacker_move) && self.is_valid_tile(runner_move), JeexError::InvalidTile);
        require!(attacker_move != runner_move, JeexError::SameTileForBothChips);

        let _player_index = self.get_player_index(player)?;

        // Implement move logic here
        // Remove player's chips from old positions and add to new positions
        // Calculate scores, etc.

        self.current_round += 1;
        if self.current_round > 10 {
            self.state = 3; // Finished
        }

        Ok(())
    }

    fn is_valid_tile(&self, tile: &Tile) -> bool {
        tile.row < 10 && tile.column < 10
    }

    fn add_player(&mut self, player: Pubkey) -> Result<u8> {
        require!(self.player_count < 16, JeexError::MaxPlayersReached);
        let index = self.player_count;
        self.players[index as usize] = player;
        self.player_count += 1;
        Ok(index)
    }

    fn get_player_index(&self, player: Pubkey) -> Result<u8> {
        self.players.iter().position(|&p| p == player)
            .map(|i| i as u8)
            .ok_or(JeexError::PlayerNotFound.into())
    }

    fn set_chip(&mut self, tile: &Tile, player_index: u8, is_attacker: bool) {
        let cell_index = (tile.row as usize * 10 + tile.column as usize) * 2;
        let chip_type = if is_attacker { 0 } else { 1 };
        self.board[cell_index + chip_type] |= 1 << player_index;
    }
}

#[error_code]
pub enum JeexError {
    InvalidTile,
    SameTileForBothChips,
    GameAlreadyStarted,
    InvalidGameState,
    GameNotActive,
    MaxPlayersReached,
    PlayerNotFound,
}

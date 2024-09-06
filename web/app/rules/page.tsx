import Link from 'next/link';

export default async function GamesPage() {
  return (
    <div className="text-content">
      <div role="tablist" className="tabs tabs-lifted tabs-lg">
        <Link href="/rules" role="tab" className="tab tab-active">
          🇬🇧 English
        </Link>
        <Link href="/rules/rs" role="tab" className="tab">
          🇷🇸 Serbian
        </Link>
        <Link href="/rules/ru" role="tab" className="tab">
          🇷🇺 Russian
        </Link>
      </div>

      <h1>JEEX Game Rules</h1>

      <ol>
        <li>
          <strong>Game Start:</strong>
          <ul>
            <li>The game is played on a 10x10 grid.</li>
            <li>
              Each player starts with two chips: a purple (attacking) chip and a
              green (running) chip.
            </li>
            <li>
              The green chip starts with points equal to the total number of
              players.
            </li>
            <li>The purple chip starts with 0 points.</li>
          </ul>
        </li>
        <li>
          <strong>First Move:</strong>
          <ul>
            <li>
              At the beginning of the game, you have 10 seconds to place both of
              your chips on the board.
            </li>
            <li>Place the green chip first, then the purple chip.</li>
            <li>Chips cannot be placed on the same cell.</li>
          </ul>
        </li>
        <li>
          <strong>Gameplay:</strong>
          <ul>
            <li>The game consists of 10 rounds, each lasting 10 seconds.</li>
            <li>
              In each round, you can move each of your chips to an adjacent cell
              (horizontally, vertically, or diagonally).
            </li>
            <li>
              If you haven't moved both chips by the end of the round, you are
              eliminated from the game.
            </li>
          </ul>
        </li>
        <li>
          <strong>Scoring:</strong>
          <ul>
            <li>After each round, points are calculated and redistributed.</li>
            <li>
              When a purple chip meets a green chip in the same cell:
              <ol type="a">
                <li>
                  If there are more or an equal number of purple chips than
                  green chips:
                  <ul>
                    <li>
                      The green chip gives 5 points multiplied by 2 to the power
                      of (number of purple chips minus 1).
                    </li>
                    <li>
                      For example, if there are 2 purple chips and 1 green chip,
                      the green chip will give 10 points.
                    </li>
                    <li>
                      If there are 3 purple chips and 1 green chip, the green
                      chip will give 20 points.
                    </li>
                  </ul>
                </li>
                <li>
                  If there are more green chips:
                  <ul>
                    <li>Each green chip gives 2 points to each purple chip.</li>
                  </ul>
                </li>
              </ol>
            </li>
            <li>
              All given points are evenly distributed among the purple chips in
              the cell.
            </li>
            <li>Points are rounded to two decimal places.</li>
            <li>
              If a green chip runs out of points, it is eliminated from the
              game.
            </li>
          </ul>
        </li>
        <li>
          <strong>Strategy:</strong>
          <ul>
            <li>Purple chips try to "catch" green chips to gain points.</li>
            <li>
              Green chips try to avoid meeting purple chips to preserve their
              points.
            </li>
            <li>
              Players must balance between attack and defense for maximum
              results.
            </li>
          </ul>
        </li>
        <li>
          <strong>Game End:</strong>
          <ul>
            <li>
              The game ends after 10 rounds or when only one player remains.
            </li>
            <li>
              A player's final score is the sum of points from their green and
              purple chips.
            </li>
          </ul>
        </li>
        <li>
          <strong>Determining Winners:</strong>
          <ul>
            <li>Players are ranked by their final score.</li>
            <li>
              The higher the score, the higher the place in the final standings.
            </li>
            <li>In case of a tie, players share the corresponding place.</li>
          </ul>
        </li>
      </ol>
      <p>
        JEEX is a dynamic game that requires quick decision-making and strategic
        thinking. Good luck and enjoy the game!
      </p>
    </div>
  );
}

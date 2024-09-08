/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/jeex.json`.
 */
export type Jeex = {
  "address": "Gkspqei1iisV5gbqiTw78henHkLbcaKCFKdbmTTpFmcF",
  "metadata": {
    "name": "jeex",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "placeChips",
      "discriminator": [
        185,
        164,
        216,
        73,
        145,
        23,
        130,
        62
      ],
      "accounts": [
        {
          "name": "game",
          "writable": true
        },
        {
          "name": "player",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "attacker",
          "type": {
            "defined": {
              "name": "tile"
            }
          }
        },
        {
          "name": "runner",
          "type": {
            "defined": {
              "name": "tile"
            }
          }
        }
      ]
    },
    {
      "name": "play",
      "discriminator": [
        213,
        157,
        193,
        142,
        228,
        56,
        248,
        150
      ],
      "accounts": [
        {
          "name": "game",
          "writable": true
        },
        {
          "name": "player",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "attackerMove",
          "type": {
            "defined": {
              "name": "tile"
            }
          }
        },
        {
          "name": "runnerMove",
          "type": {
            "defined": {
              "name": "tile"
            }
          }
        }
      ]
    },
    {
      "name": "setupGame",
      "discriminator": [
        180,
        218,
        128,
        75,
        58,
        222,
        35,
        82
      ],
      "accounts": [
        {
          "name": "game",
          "writable": true,
          "signer": true
        },
        {
          "name": "player",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "game",
      "discriminator": [
        27,
        90,
        166,
        125,
        74,
        100,
        121,
        18
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidTile"
    },
    {
      "code": 6001,
      "name": "sameTileForBothChips"
    },
    {
      "code": 6002,
      "name": "gameAlreadyStarted"
    },
    {
      "code": 6003,
      "name": "invalidGameState"
    },
    {
      "code": 6004,
      "name": "gameNotActive"
    },
    {
      "code": 6005,
      "name": "maxPlayersReached"
    },
    {
      "code": 6006,
      "name": "playerNotFound"
    }
  ],
  "types": [
    {
      "name": "game",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "players",
            "type": {
              "array": [
                "pubkey",
                16
              ]
            }
          },
          {
            "name": "playerCount",
            "type": "u8"
          },
          {
            "name": "currentRound",
            "type": "u8"
          },
          {
            "name": "board",
            "type": {
              "array": [
                "u8",
                200
              ]
            }
          },
          {
            "name": "state",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "tile",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "row",
            "type": "u8"
          },
          {
            "name": "column",
            "type": "u8"
          }
        ]
      }
    }
  ]
};

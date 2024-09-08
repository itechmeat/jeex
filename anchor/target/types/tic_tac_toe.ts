/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/tic_tac_toe.json`.
 */
export type TicTacToe = {
  "address": "7JJLT2Repd6HzTxPXLroWSGZffmJWkJDz2VgCNQaPGDe",
  "metadata": {
    "name": "ticTacToe",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
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
          "name": "tile",
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
          "name": "playerOne",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "playerTwo",
          "type": "pubkey"
        }
      ]
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
      "name": "tileOutOfBounds"
    },
    {
      "code": 6001,
      "name": "tileAlreadySet"
    },
    {
      "code": 6002,
      "name": "gameAlreadyOver"
    },
    {
      "code": 6003,
      "name": "notPlayersTurn"
    },
    {
      "code": 6004,
      "name": "gameAlreadyStarted"
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
                2
              ]
            }
          },
          {
            "name": "turn",
            "type": "u8"
          },
          {
            "name": "board",
            "type": {
              "array": [
                {
                  "array": [
                    {
                      "option": {
                        "defined": {
                          "name": "sign"
                        }
                      }
                    },
                    3
                  ]
                },
                3
              ]
            }
          },
          {
            "name": "state",
            "type": {
              "defined": {
                "name": "gameState"
              }
            }
          }
        ]
      }
    },
    {
      "name": "gameState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "active"
          },
          {
            "name": "tie"
          },
          {
            "name": "won",
            "fields": [
              {
                "name": "winner",
                "type": "pubkey"
              }
            ]
          }
        ]
      }
    },
    {
      "name": "sign",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "x"
          },
          {
            "name": "o"
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

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
      "name": "setScore",
      "discriminator": [
        218,
        167,
        25,
        121,
        208,
        190,
        8,
        87
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
          "name": "score",
          "type": "u32"
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
          "writable": true
        },
        {
          "name": "player",
          "signer": true
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
  "types": [
    {
      "name": "game",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "player",
            "type": "pubkey"
          },
          {
            "name": "score",
            "type": "u32"
          }
        ]
      }
    }
  ]
};

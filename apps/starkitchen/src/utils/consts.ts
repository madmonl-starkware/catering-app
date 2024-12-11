import { Abi } from '@starknet-react/core';

/// A prefix to be added to the src path of resources (images, etc.) in order to correctly load them.
/// Production mode is when deploying the app to a server, github pages in our case.
export const SrcPrefix = import.meta.env.MODE === 'production' ? '/freech' : '';

/// The address of the deployed contract.
export const CONTRACT_ADDRESS =
  '0x07667704d6aaca69526c6deffca722a57d18c02569ed9a8604935554d4827a89';
/// The ABI of the deployed contract. Can be found on starkscan.
/// For the above contract, the ABI can be found at:
/// https://sepolia.starkscan.co/contract/0x049c75609bb077a9427bc26a9935472ec75e5508ed216ef7f7ad2693397deebc
/// And the ABI is accessible under the 'Class Code/History' tab -> 'Copy ABI Code' button.
export const ABI = [
  {
    "name": "RegistrationImpl",
    "type": "impl",
    "interface_name": "freech::freech::IRegistration"
  },
  {
    "name": "core::byte_array::ByteArray",
    "type": "struct",
    "members": [
      {
        "name": "data",
        "type": "core::array::Array::<core::bytes_31::bytes31>"
      },
      {
        "name": "pending_word",
        "type": "core::felt252"
      },
      {
        "name": "pending_word_len",
        "type": "core::integer::u32"
      }
    ]
  },
  {
    "name": "freech::freech::ExtendedPreach",
    "type": "struct",
    "members": [
      {
        "name": "id",
        "type": "core::felt252"
      },
      {
        "name": "preacher_id",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "data",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "echos",
        "type": "core::felt252"
      }
    ]
  },
  {
    "name": "freech::freech::IRegistration",
    "type": "interface",
    "items": [
      {
        "name": "post",
        "type": "function",
        "inputs": [
          {
            "name": "data",
            "type": "core::byte_array::ByteArray"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "like",
        "type": "function",
        "inputs": [
          {
            "name": "event_id",
            "type": "core::felt252"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "get_last_post_offset",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::felt252"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "fetch_posts",
        "type": "function",
        "inputs": [
          {
            "name": "start",
            "type": "core::integer::u64"
          },
          {
            "name": "end",
            "type": "core::integer::u64"
          }
        ],
        "outputs": [
          {
            "type": "core::array::Array::<freech::freech::ExtendedPreach>"
          }
        ],
        "state_mutability": "view"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "freech::freech::registration::Event",
    "type": "event",
    "variants": []
  }
] as const satisfies Abi;

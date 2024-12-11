use starknet::ContractAddress;

/// Basic information about an event, to be stored in the contract.
#[derive(Drop, Serde, starknet::Store)]
struct Preach {
    id: felt252,
    preacher_id: ContractAddress,
    time: felt252,
    data: ByteArray,
}

#[derive(Drop, Serde)]
struct ExtendedPreach {
    id: felt252,
    preacher_id: ContractAddress,
    data: ByteArray,
    time: felt252,
    echo: felt252,
}

#[starknet::interface]
trait IRegistration<T> {
    fn post(ref self: T, time: felt252, data: ByteArray);
    fn like(ref self: T, event_id: felt252);
    fn get_last_post_offset(self: @T) -> felt252;
    fn fetch_posts(self: @T, start: u64, end: u64) -> Array<ExtendedPreach>;
}

#[starknet::contract]
mod registration {
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};

    use starknet::storage::{
        Map, Vec, StoragePathEntry,
        StoragePointerWriteAccess, StoragePointerReadAccess, VecTrait,
        MutableVecTrait
    };
    use starknet::ContractAddress;
    use super::{ExtendedPreach, Preach};


    #[storage]
    struct Storage {
        // Next unused event ID.
        next_event_id: felt252,
        // Vec of all preaches.
        preaches: Vec<Preach>,
        /// A map from tweet event ID to number of echos.
        echos: Map<felt252, felt252>,
        erc_token: ContractAddress,
    }

    #[constructor]
    fn constructor(ref self: ContractState, erc_token: ContractAddress) {
        self.erc_token.write(erc_token);
    }

    /// Helper functions that are not part of the interface.
    #[generate_trait]
    impl PrivateFunctionsImpl of PrivateFunctions {
        fn _get_preach(self: @ContractState, event_id: u64) -> ExtendedPreach {
            let preach = self.preaches.at(event_id).read();
            let echo = self.echos.entry(event_id.try_into().unwrap()).read();
            ExtendedPreach { 
                id: preach.id,
                preacher_id: preach.preacher_id,
                data: preach.data,
                time: preach.time,
                echo
            }
        }
    }

    #[abi(embed_v0)]
    impl RegistrationImpl of super::IRegistration<ContractState> {
        fn post(ref self: ContractState, time: felt252, data: ByteArray) {
            let preacher_id = starknet::get_caller_address();
            let event_id = self.next_event_id.read();
            self.next_event_id.write(event_id + 1);
            // self.emit(Preach { id: event_id, preacher_id, data });
            self.preaches.append().write(Preach { id: event_id, preacher_id, time, data });
        }

        fn like(ref self: ContractState, event_id: felt252) {
            let token_dispatcher = IERC20Dispatcher { contract_address: self.erc_token.read() };
            let preacher = self.preaches.at(event_id.try_into().unwrap()).read().preacher_id;
            token_dispatcher.transfer_from(starknet::get_caller_address(), preacher, 1);
            let echos = self.echos.entry(event_id).read();
            self.echos.entry(event_id).write(echos + 1);
        }

        fn get_last_post_offset(self: @ContractState) -> felt252 {
            self.next_event_id.read()
        }

        fn fetch_posts(self: @ContractState, start: u64, end: u64) -> Array<ExtendedPreach> {
            let mut feed = ArrayTrait::<ExtendedPreach>::new();
            let last_event: u64 = self.next_event_id.read().try_into().unwrap();
            let new_end = if end > last_event { last_event } else { end };
            for id in start..new_end {
                feed.append(self._get_preach(id));
            };
            feed
        }
    }
}
use starknet::ContractAddress;


/// Basic information about an event, to be stored in the contract.
#[derive(Drop, Serde, starknet::Store)]
struct Preach {
    id: felt252,
    preacher_id: ContractAddress,
    data: ByteArray,
}

#[derive(Drop)]
struct ExtendedPreach {
    id: felt252,
    preacher_id: ContractAddress,
    data: ByteArray,
    echos: felt252,
}


#[starknet::contract]
mod registration {

    use starknet::storage::{
        Map, Vec, StoragePathEntry,
        StoragePointerWriteAccess, StoragePointerReadAccess, VecTrait,
        MutableVecTrait
    };

    use super::{ExtendedPreach, Preach};


    #[storage]
    struct Storage {
        // Next unused event ID.
        next_event_id: felt252,
        // Vec of all preaches.
        preaches: Vec<Preach>,
        /// A map from tweet event ID to number of echos.
        echos: Map<felt252, felt252>,
    }

    // #[generate_trait] is useful for traits with only one implementation. It generates a trait
    // with the same functions as the implementation.
    /// Helper functions that are not part of the interface.
    #[generate_trait]
    impl PrivateFunctionsImpl of PrivateFunctions {

        fn _get_preach(self: @ContractState, event_id: u64) -> ExtendedPreach {
            let preach = self.preaches.at(event_id).read();
            let echo = self.echos.entry(event_id.try_into().unwrap()).read();
            ExtendedPreach { id: preach.id, preacher_id: preach.preacher_id, data: preach.data, echos: echo }
        }
    }

    fn post(ref self: ContractState, data: ByteArray) {
        let preacher_id = starknet::get_caller_address();
        let event_id = self.next_event_id.read();
        self.next_event_id.write(event_id + 1);
        // self.emit(Preach { id: event_id, preacher_id, data });
        self.preaches.append().write(Preach { id: event_id, preacher_id, data });
    }

    fn like(ref self: ContractState, event_id: felt252) {
        let echos = self.echos.entry(event_id).read();
        self.echos.entry(event_id).write(echos + 1);
    }

    fn get_last_post_offset(self: @ContractState) -> felt252 {
        self.next_event_id.read()
    }

    fn fetch_posts(self: @ContractState, start: u64, end: u64) -> Array<ExtendedPreach> {
        let mut feed = ArrayTrait::<ExtendedPreach>::new();
        for id in start..end {
            feed.append(self._get_preach(id));
        };
        feed
    }
}
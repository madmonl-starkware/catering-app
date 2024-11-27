# Get the contract address as a command line argument
CONTRACT_ADDRESS=$1
ACCOUNT_ADDRESS=$(cat $STARKNET_ACCOUNT | jq -r .deployment.address)
FE_ADDRESS=0x03dab0cc9d86baff214b440b6bf322806685a2242c3a7adf865b11ca19754a69

# Add admin
starkli invoke $CONTRACT_ADDRESS add_admin $FE_ADDRESS
sleep 10
# Set the address as allowed.
starkli invoke $CONTRACT_ADDRESS add_allowed_user $ACCOUNT_ADDRESS
sleep 10
starkli invoke $CONTRACT_ADDRESS add_allowed_user $FE_ADDRESS
sleep 10

# Add events, for the next year, Monday, Tuesday and Wednesday at 12:00 (UTC+2). inputs are time and price.
BASE_TIME=1732528800
SECONDS_IN_DAY=60*60*24
SECONDS_IN_WEEK=60*60*24*7
PRICE=10
for i in {0..52}
do
  starkli invoke $CONTRACT_ADDRESS add_event $((BASE_TIME + i * SECONDS_IN_WEEK)) && sleep 10
  starkli invoke $CONTRACT_ADDRESS add_event $((BASE_TIME + i * SECONDS_IN_WEEK + SECONDS_IN_DAY)) && sleep 10
  starkli invoke $CONTRACT_ADDRESS add_event $((BASE_TIME + i * SECONDS_IN_WEEK + 2 * SECONDS_IN_DAY)) && sleep 10
done
#!/usr/bin/env sh

# move to subfolder
# cd scripts

# create db directory
# [ ! -d "./db_ganache" ] && mkdir db_ganache

# start ganache
npx ganache-cli \
    --mnemonic "swarm choose host odor often raise toss viable theme rally style abuse adapt month quarter" \
    --defaultBalanceEther 1000000 \
    --gasLimit 0xfffffffffff \
    --gasPrice 0 \
    --port 8545 \
    --networkId 5777 \
    --host 0.0.0.0 &

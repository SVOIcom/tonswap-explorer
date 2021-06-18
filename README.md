# Introduction
![photo_2020-12-15_20-21-41](https://user-images.githubusercontent.com/18599919/111032509-ac9fbd80-841d-11eb-9639-843ef2d758b3.jpg)
Hello there! \
SVOI dev team greets you and would like to present the results of created Decentralized Exchange for the FreeTON Community contest: \
#23 FreeTon DEX Implementation Stage 2 Contest.

Goal of this work is to create Decentralized Exchange based on Liquidity Pool mechanism and develop instruments, such as 
debot and [site](https://tonswap.com) for interacting with developed smart contracts.
 
# Links
[![Channel on Telegram](https://img.shields.io/badge/-TON%20Swap%20TG%20chat-blue)](https://t.me/tonswap) 

Repository for smart contracts compilation and deployment - [https://github.com/SVOIcom/ton-testing-suite](https://github.com/SVOIcom/ton-testing-suite)

Used ton-solidity compiler - [solidity compiler v0.39.0](https://github.com/broxus/TON-Solidity-Compiler/tree/98892ddbd2817784857b54436d75b64a3fdf6eb1)

Used tvm-linker - [latest tvm linker](https://github.com/tonlabs/TVM-linker)

# Prerequirements

To run data collection and than use that data for explorer you need to configure MySQL database [sql file](https://github.com/SVOIcom/tonswap-explorer/blob/master/models/_sql/tonswap_explorer.sql) \
and change [config](https://github.com/SVOIcom/tonswap-explorer/blob/master/config.js) according to your settings. 

# Usage

## Install
1. Clone all files from repo
2. In cloned folder  ```npm i```

## Data collection from graphQL

To collect data from graphQL you need to install dependencies: 

```shell
npm install .
```

Next, you need to run tonDataCollector:

```shell
npm run startDB
```

## Explorer backend running
We recommend using forever to run the service as a daemon.

Custom start
```shell
node index.js config.js
```

With Forever
```shell
forever index.js config.js
```


By default http server runs on port 3001. We recommend proxify http/https requests with nginx 

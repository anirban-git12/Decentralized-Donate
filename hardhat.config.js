require("@matterlabs/hardhat-zksync-solc");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  zksolc: {
    version: "1.3.9",
    defaultnetwork: 'lineasepolia',
    compilerSource: "binary",
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },
  networks: {
    hardhat: {},
    lineasepolia: {
      url: 'https://rpc.sepolia.linea.build',
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    }  
  },
  paths: {
    artifacts: "./artifacts-zk",
    cache: "./cache-zk",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};

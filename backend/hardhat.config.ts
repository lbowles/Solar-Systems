import { HardhatUserConfig, task } from "hardhat/config"
import "@typechain/hardhat"
import "@nomiclabs/hardhat-waffle"
import "@nomiclabs/hardhat-ethers"
import "hardhat-deploy"
import "hardhat-gas-reporter"
import dotenv from "dotenv"
import { HardhatNetworkUserConfig, NetworksUserConfig } from "hardhat/types"
dotenv.config()

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(await account.address)
  }
})

let hardhatNetwork: HardhatNetworkUserConfig = {}

if (process.env.FORK) {
  if (process.env.FORK === "mainnet") {
    console.log("forking mainnet")
    hardhatNetwork = {
      chainId: 1,
      forking: {
        url: `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      },
    }
  }
}

const networks: NetworksUserConfig = {
  hardhat: hardhatNetwork,
}

if (process.env.DEFAULT_DEPLOYER_KEY && process.env.INFURA_PROJECT_ID) {
  networks["goerli"] = {
    chainId: 5,
    url: `https://goerli.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
    accounts: [process.env.DEFAULT_DEPLOYER_KEY],
    verify: {
      etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY || "",
      },
    },
  }
}

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.12",
      },
      {
        version: "0.8.0",
      },
    ],
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },
  networks,
  typechain: {
    outDir: "types",
    target: "ethers-v5",
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  gasReporter: {
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
}

export default config

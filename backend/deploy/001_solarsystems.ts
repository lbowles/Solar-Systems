import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ethers } from "hardhat"
import readline from "readline"

function userInput(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close()
      resolve(ans)
    }),
  )
}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  let name = "SolarSystems"
  let symbol = "SOLSYS"

  if (hre.network.name !== "mainnet") {
    name = "Test"
    symbol = "TEST"
  }

  // Prompt user to confirm if network, name, symbol are correct each on its own line
  console.log(`\nDeploying to ${hre.network.name}`)
  console.log(`Name: ${name}`)
  console.log(`Symbol: ${symbol}`)
  if (hre.network.name !== "hardhat") {
    const confirm = await userInput("Continue? (y/n)\n> ")
    if (confirm !== "y") {
      console.log("Aborting deployment")
      return
    }
  }

  const utilitiesLibrary = await deploy("utils", {
    from: deployer,
  })

  const trigonometryLibrary = await deploy("Trigonometry", {
    from: deployer,
  })

  const rendererLibrary = await deploy("Renderer", {
    from: deployer,
  })

  await deploy("SolarSystems", {
    from: deployer,
    log: true,
    libraries: {
      Utilities: utilitiesLibrary.address,
      Trigonometry: trigonometryLibrary.address,
      Renderer: rendererLibrary.address,
    },
    args: [name, symbol, ethers.utils.parseEther("0.01"), 1000],
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  })
}
export default func
func.tags = ["SolarSystems"]

// import {HardhatRuntimeEnvironment} from "hardhat/types"
// import {DeployFunction} from "hardhat-deploy/types"

// const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
//   const {deployments, getNamedAccounts} = hre
//   const {deploy} = deployments

//   const {deployer} = await getNamedAccounts()

//   await deploy("Greeter", {
//     from: deployer,
//     log: true,
//     args: ["Hello, Hardhat!"],
//     autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
//   })
// }
// export default func
// func.tags = ["Greeter"]

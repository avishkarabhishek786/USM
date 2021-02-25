const func = async function ({ deployments, getNamedAccounts, getChainId }) {
    const { deploy, get, read, execute } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = await getChainId()

    console.log("deployer", deployer);
  
    const wethAddresses = {
      '1' : '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      '42' : '0xa1C74a9A3e59ffe9bEe7b85Cd6E91C0751289EbD',
    }
    
    let wethAddress, usmAddress
  
    if (chainId === '31337') { // buidlerevm's chainId
      weth = await deploy('WETH9', {
        from: deployer,
        deterministicDeployment: true
      })
      wethAddress = weth.address

      // Mint some weth for our funders
    //   await execute('WETH9', { 
    //       from: "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199", 
    //       value: '100000000000000000000' 
    //     }, 'deposit')
    //   console.log(`100 ethers sent to 0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199 from weth ${wethAddress}`);
        
    }
    else {
      wethAddress = wethAddresses[chainId]
    }
  
    usmAddress = (await get('USM')).address;
  
    const proxy = await deploy('Proxy', {
      from: deployer,
      deterministicDeployment: true,
      args: [usmAddress, wethAddress]
    })
  
    console.log(`Deployed WETH to ${wethAddress}`);
    console.log(`Deployed Proxy to ${proxy.address}`);
  }
  
  module.exports = func;
  module.exports.tags = ["Proxy"];
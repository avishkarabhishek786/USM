const func = async function ({ deployments, getNamedAccounts, getChainId }) {
  const { deploy, execute, get, read } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId()

  usmAddress = (await get('USM')).address;

  const usmView = await deploy('USMView', {
    from: deployer,
    deterministicDeployment: true,
    args: [usmAddress],
  })
  console.log(`Deployed USMView to ${usmView.address}`);


  if(chainId==31337) {
    // Added by Abhishek
    //const MockUniswapV2Pair = await get('MockUniswapV2Pair');
    await execute('MockUniswapV2Pair', { from: deployer }, 'setReserves', '0', '0', '1606782003')
    await execute('MockUniswapV2Pair', { from: deployer }, 'setCumulativePrices', '0', '31377639132666967530700283664103')
    await execute('USM', { from: deployer }, 'refreshPrice');  
  }

};

module.exports = func;
module.exports.tags = ["USMView"];

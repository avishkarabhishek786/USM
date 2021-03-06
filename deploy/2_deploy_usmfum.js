const fs = require('fs').promises;
const func = async function ({ deployments, getNamedAccounts, getChainId }) {
  const { deploy, execute, get, read } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId()

  let oracleAddress
  if (chainId === '42') {
    oracleAddress = (await get('MockChainlinkOracle')).address;
  } else {
    oracleAddress = (await get('MedianOracle')).address;
  }

  let args;
  if(chainId==31337) {
    args = await fs.readFile(`./deploy/.args/usm-args-${chainId}.js`, 'utf8');
    args = require(`./.args/usm-args-${chainId}`)
      
  } else {
      args = require(`./.args/usm-args-${chainId}`)
  }

  const usm = await deploy('USM', {
    from: deployer,
    deterministicDeployment: true,
    args: require(`./.args/usm-args-${chainId}`),
  })
  console.log(`Deployed USM to ${usm.address}`);
  const fumAddr = await read('USM', { from: deployer }, 'fum');
  console.log(`Deployed FUM to ${fumAddr}`);
};

module.exports = func;
module.exports.tags = ["USM"];

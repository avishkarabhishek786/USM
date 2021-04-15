import { ethers } from "ethers"
import { fum, usm, USMView, oracle, proxy } from "./token"

export const loadNetwork = async (dispatch) => {
    //const provider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/1be1f8b7b85a47e4949bc1057660a81d")
    const provider = new ethers.providers.JsonRpcProvider()
    let usm = await loadUSM(dispatch, provider)
    let fum = await loadFUM(dispatch, provider)

    return {
        usm, fum, loadMetamask
    }
}

export const loadUSM = async (dispatch, provider) => {
    const network = await provider.getNetwork()
    const abi = usm.abi
    const address = usm.address[network.chainId]
    const usmContract = new ethers.Contract(address, abi, provider)
    console.log(usmContract);
    return usmContract;
    // loadERC20Data(dispatch, usm, usmContract)
    // loadCollateralData(dispatch, usmContract)
    // loadOracleData(dispatch, usmContract)
}

export const loadFUM = async (dispatch, provider) => {
    const network = await provider.getNetwork()
    const abi = fum.abi
    const address = fum.address[network.chainId]
    const fumContract = new ethers.Contract(address, abi, provider)
    console.log(fumContract);
    return loadFUM;
    // dispatch(fumLoaded(fumContract))
    // loadERC20Data(dispatch, fum, fumContract)
}

export const loadProxy = async (dispatch, provider) => {
    const network = await provider.getNetwork()
}

export const loadMetamask = async (dispatch) => {
    try {
        await window.ethereum.enable()
        const provider = await new ethers.providers.Web3Provider(window.ethereum)
        const signer = await provider.getSigner()
        const network = await provider.getNetwork()

        // if (network.chainId !== 1) {
        //     throw new Error("Must be on mainnet. Please alter Metamask network and refresh the page.")
        // }

        //load USM with Metamask
        // const usmAbi = usm.abi
        // const usmAddress = usm.address[network.chainId]
        // const usmContract = new ethers.Contract(usmAddress, usmAbi, signer)
        // //load FUM with Metamask
        // const fumAbi = fum.abi
        // const fumAddress = fum.address[network.chainId]
        // const fumContract = new ethers.Contract(fumAddress, fumAbi, signer)
        //dispatch(metamaskLoaded(provider, signer, usmContract, fumContract))

        return {provider, signer, network}
    }
    catch (e) {
        console.warn(e);
        //dispatch(metamaskError(e))
        return (false, false)
    }
}
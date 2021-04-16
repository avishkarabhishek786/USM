import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from "ethers";
import { fum, usm, usmView, oracle, proxy, weth } from "./token"
import { Navbar, showMessage } from './elems'
import USER_FUNC from './components/USER_FUNC';

function App() {

    const [provider, setProvider] = useState(undefined);
    const [metamask, setMetamask] = useState(undefined);
    const [usmContract, setUsmContract] = useState(undefined);
    const [fumContract, setFumContract] = useState(undefined);
    const [proxyContract, setProxyContract] = useState(undefined);
    const [usmViewContract, setUsmViewContract] = useState(undefined);
    const [wethContract, setWethContract] = useState(undefined);
    const [network, setNetwork] = useState(undefined);
    const [signer, setSigner] = useState(undefined);
    const [signerAddress, setSignerAddress] = useState(undefined);
    const [signerEthBalance, setSignerEthBalance] = useState(undefined);
    const [isError, setIsError] = useState({
        state: false,
        msg: ""
    });  
    
    const [mintUSMAmount, setMintUSMAmount] = useState(undefined);
    const [fundFUMAmount, setFundFUMAmount] = useState(undefined);
    const [burnUSMAmount, setBurnUSMAmount] = useState(undefined);
    const [defundFUMAmount, setDefundFUMAmount] = useState(undefined);

    const MAX = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

    const init = async () => {

        let provider = new ethers.providers.JsonRpcProvider(" http://127.0.0.1:8545");
        setProvider(provider);
        const metamask = await new ethers.providers.Web3Provider(window.ethereum)
        setMetamask(metamask);
        let network = await metamask.getNetwork();
        setNetwork(network.chainId);
        console.log("network.chainId", network.chainId);

        console.log(metamask.getNetwork());
        console.log(provider.getNetwork());

        console.log(metamask);
        
        const signer = await metamask.getSigner(0);
        setSigner(signer);
        const signerAddress = await signer.getAddress();
        setSignerAddress(signerAddress);
        console.log(signerAddress);
        const signerEthBalance = (await signer.getBalance()).toString();
        setSignerEthBalance(signerEthBalance);
        console.log(signerEthBalance);

        const usmContract = new ethers.Contract(
            usm.address[network.chainId], usm.abi, signer
        );

        setUsmContract(usmContract);        
        
        const fumContract = new ethers.Contract(
            fum.address[network.chainId], fum.abi, signer
        );

        setFumContract(fumContract);

        const proxyContract = new ethers.Contract(
            proxy.address[network.chainId], proxy.abi, signer
        );

        setProxyContract(proxyContract);

        console.log(proxyContract);

        const usmViewContract = new ethers.Contract(
            usmView.address[network.chainId], usmView.abi, provider
        );

        setUsmViewContract(usmViewContract);

        const wethContract = new ethers.Contract(
            weth.address[network.chainId], weth.abi, signer
        );

        setWethContract(wethContract);
        console.log(wethContract);

        //await usmContract.refreshPrice()

    }

    useEffect(() => {

        init();

        window.ethereum.on('accountsChanged', loginAcc => {
            setSigner(loginAcc[0]);
            console.log(loginAcc[0]);
        });

    }, []);


    const isReady = useCallback(() => {
        return (
            typeof provider !== 'undefined'
            && typeof metamask !== 'undefined'
            && typeof network !== 'undefined'
            && typeof signer !== 'undefined'
            && typeof proxyContract !== 'undefined'
            && typeof usmViewContract !== 'undefined'
            && typeof wethContract !== 'undefined'
            && isError.state !== true
        )
    }, [provider, metamask, signer, proxyContract, usmViewContract, wethContract, network, isError.state]);

    const unsetStates = () => {
        //
    }

    if (!isReady()) {
        return (
            <>
                <Navbar />
                {(isError.state && isError.msg) ?
                    <div className="alert alert-danger" role="alert">{isError.msg}</div> : ""}
                <p>Loading...</p>
            </>
        )
    } else {

        const updateMintUSMAmountFunc = (e) => setMintUSMAmount(e);
        const updateBurnUSMAmountFunc = (e) => setBurnUSMAmount(e);
        const updateFundFUMAmountFunc = (e) => setFundFUMAmount(e);
        const updateDefundFUMAmountFunc = (e) => setDefundFUMAmount(e);

        const getUserWETHBalance = async () => {
            const weth_bal = await wethContract.balanceOf(signerAddress);
            console.log(Number(weth_bal._hex));
            return Number(weth_bal._hex);
        }

        // Mint weth to use mint and fund functions (Only useful in local testing)
        const mintWeth = async (eth) => {
            eth = Number(eth).toString();
            if(eth<1) {
                showMessage("Please provide at least 1 Ether as input.", false);
                return false;
            }
            let getWeth = await wethContract.deposit({
                from: signerAddress,
                value: ethers.utils.parseEther(eth)
            });
            console.log(getWeth);
            showMessage(`Minted ${eth} weths`)
        }

        // Add proxy.sol as delegate for user's function calls
        const addProxyAsDelegate = async () => {
            try {
                await wethContract.approve(proxy.address[network],
                   MAX, { from: signerAddress });
                await usmContract.addDelegate(proxy.address[network], { from: signerAddress })
                await usmContract.approve(signerAddress, MAX, { from: signerAddress })
                showMessage('Proxy added as delegate');
            } catch (e) {
                console.log(e);
            }
        }

        const mintUSM = async (amount) => {
            const user_weth_balance = await getUserWETHBalance();
            if(Number(user_weth_balance< amount)) {
                alert("You do not have sufficient WETH in your wallet. Available WETH: "+user_weth_balance+" .Tx reverted.");
                return false;
            }
            amount = ethers.utils.parseEther(amount)['_hex'];
            console.log(Number(amount));
            let data = await proxyContract.mint(signerAddress, amount, 0);
            console.log(data);
        }

        const burnUSM = async (amount) => {
            amount = ethers.utils.parseEther(amount);
            let data = await proxyContract.burn(signerAddress, amount, 0);
            console.log(data);
        }

        const fundFUM = async (amount) => {
            const user_weth_balance = await getUserWETHBalance();
            if(Number(user_weth_balance< amount)) {
                alert("You do not have sufficient WETH in your wallet. Available WETH: "+user_weth_balance+" .Tx reverted.");
                return false;
            }
            amount = ethers.utils.parseEther(amount)['_hex'];
            console.log(amount);
            let fundFum = await proxyContract.fund(signerAddress, amount, 0);
            console.log(fundFum);
        }

        const defundFUM = async (amount) => {
            amount = ethers.utils.parseEther(amount);
            let defundFum = await proxyContract.defund(signerAddress, amount, 0);
            console.log(defundFum);
        }

        // Stats functions
        const ethBufferView = async () => {
            const ethBuffer = await usmViewContract.ethBuffer(0);
            console.log(ethers.utils.formatEther(ethBuffer));
        }

        const debtRatioView = async () => {
            const debtRatio = await usmViewContract.debtRatio();
            console.log(debtRatio.toString());
        }

        const usmPriceView = async () => {
            const usmBuyPrice = await usmViewContract.usmPrice(0); // buy price
            const usmSellPrice = await usmViewContract.usmPrice(1); // sell price

            console.log(ethers.utils.formatEther(usmBuyPrice), ethers.utils.formatEther(usmSellPrice));
        }

        const fumPriceView = async () => {
            const fumBuyPrice = await usmViewContract.fumPrice(0);
            const fumSellPrice = await usmViewContract.fumPrice(1);

            console.log(ethers.utils.formatEther(fumBuyPrice), ethers.utils.formatEther(fumSellPrice));
        }

        //debtRatioView();
        //usmPriceView();

        return (
            <div class="container">
                <div class="row align-items-start">
                    <div class="col">
                        Stat 1
                    </div>
                    <div class="col">
                        Stat 2
                    </div>
                    <div class="col">
                        <div className="row">
                            <div class="col">
                                <button onClick={() => {
                                    const _amount = prompt("Enter input ETH amount", 100);
                                    mintWeth(_amount);
                                }}>Mint Weth</button>
                            </div>
                            <div class="col">
                                <button onClick={() => addProxyAsDelegate()}>Add Proxy As Delegate</button>
                            </div>
                            <div class="col">
                                <button onClick={() => getUserWETHBalance()}>Check WETH Balance</button>
                            </div>

                            
                        </div>
                    </div>
                </div>
                <div class="row align-items-center">
                    <div class="col">
                        <USER_FUNC
                            title="Mint USM"
                            label="Enter the amount of Ether as input"
                            id="mint_usm_amount"
                            value={mintUSMAmount}
                            onchangefunc={updateMintUSMAmountFunc}
                            func={mintUSM}
                        />
                    </div>
                    <div class="col">
                        <USER_FUNC
                            title="Burn USM"
                            label="Enter the amount of USM to burn"
                            id="burn_usm_amount"
                            value={burnUSMAmount}
                            onchangefunc={updateBurnUSMAmountFunc}
                            func={burnUSM}
                        />
                    </div>
                </div>
                <div class="row align-items-end">
                    <div class="col">
                        <USER_FUNC
                            title="Fund FUM"
                            label="Enter the amount of Ether as input"
                            id="fund_fum_amount"
                            value={fundFUMAmount}
                            onchangefunc={updateFundFUMAmountFunc}
                            func={fundFUM}
                        />
                    </div>
                    <div class="col">
                        <USER_FUNC
                            title="Defund FUM"
                            label="Enter the amount of FUM to defund"
                            id="defund_fum_amount"
                            value={defundFUMAmount}
                            onchangefunc={updateDefundFUMAmountFunc}
                            func={defundFUM}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;

/*_______ ____  _   _  _____
 |__   __/ __ \| \ | |/ ____|
    | | | |  | |  \| | (_____      ____ _ _ __
    | | | |  | | . ` |\___ \ \ /\ / / _` | '_ \
    | | | |__| | |\  |____) \ V  V / (_| | |_) |
    |_|  \____/|_| \_|_____/ \_/\_/ \__,_| .__/
                                         | |
                                         |_| */
/**
 * @name TONSwap project - tonswap.com
 * @copyright SVOI.dev Labs - https://svoi.dev
 * @license Apache-2.0
 */




import SwapPairContract from "../../modules/tonswap/contracts/SwapPairContract.mjs";
import TokenRootContract from "../../modules/tonswap/contracts/TokenRootContract.mjs";
import TokenWalletContract from "../../modules/tonswap/contracts/TokenWalletContract.mjs";
import utils from "../../modules/utils.mjs";
import ChartController from "/app/modules/tonswap/chartController.mjs";


function initCharts(leftTokenInfo){
    let data = window.chartsVolumes || {};

    let ox = Object.keys(data)
                   .sort((a,b) => a.localeCompare(b))
                   .slice(-30);
    let oy = ox.map( key => {
        return utils.unsignedNumberToSigned( Math.round(data[key].volume) || 0, leftTokenInfo.decimals)
    });

    // Object.values(data).map(function(x) { oy.push( utils.unsignedNumberToSigned(Math.round(x.volume), leftTokenInfo.decimals )) } );
    
    let chartController = new ChartController();
    chartController.initConfig("bar", "volume", ox, oy);
    chartController.drawChart("chartBar");
}


window.startPageController = async (moduleHead) => {
    const {TON, pairAddress} = moduleHead;

    const pairContract = await new SwapPairContract(TON, null).init(pairAddress);

    let pairInfo = await pairContract.getPairInfo();

    const leftToken = await new TokenRootContract(TON, {}).init(pairInfo.tokenRoot1);
    const rightToken = await new TokenRootContract(TON, {}).init(pairInfo.tokenRoot2);

    const leftTokenWallet = await new TokenWalletContract(TON, {}).init(pairInfo.tokenWallet1);
    const rightTokenWallet = await new TokenWalletContract(TON, {}).init(pairInfo.tokenWallet2);

    let leftTokenInfo = await leftToken.getDetails();
    let rightTokenInfo = await rightToken.getDetails();

    let exchangeRate = await pairContract.getCurrentExchangeRate();

    console.log(leftTokenInfo, rightTokenInfo);

   // $('.pairTicker').text(` ${utils.hex2String(leftTokenInfo.symbol)} - ${utils.hex2String(rightTokenInfo.symbol)}`);
   // $('.leftTokenInPoolTicker').text(utils.hex2String(leftTokenInfo.symbol));
  //  $('.rightTokenInPoolTicker').text(utils.hex2String(rightTokenInfo.symbol));

  //  $('.leftTokenInPoolAmount').text(utils.unsignedNumberToSigned(exchangeRate.lp1, leftTokenInfo.decimals));
  //  $('.rightTokenInPoolAmount').text(utils.unsignedNumberToSigned(exchangeRate.lp2, rightTokenInfo.decimals));

  //  $('.leftTokenRootContract').text(utils.shortenPubkey(pairInfo.tokenRoot1)).data('copy', pairInfo.tokenRoot1);
 //   $('.rightTokenRootContract').text(utils.shortenPubkey(pairInfo.tokenRoot2)).data('copy', pairInfo.tokenRoot2);


    utils.setupSelfCopyElements();

    console.log('PAIR address', pairContract);

    console.log('Page PIR started');

    // Charts adding
    initCharts(leftTokenInfo);
}

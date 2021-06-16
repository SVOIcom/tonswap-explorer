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


import utils from "../../modules/utils.mjs";
import ChartController from "/app/modules/tonswap/chartController.mjs";


window.startPageController = async (moduleHead) => {

    
    // Charts add

    let chartController = new ChartController();

    let data = window.chartsTrCount

    let ox = [];
    let oy = [];

    ox = Object.keys(data);

    console.log(data)

    Object.values(data).map(function(x) { oy.push( utils.unsignedNumberToSigned(Math.round(x.count) )) } );

    let ox30 = [];
    let oy30 = [];

    if (ox.length > 30) {
        ox30 = ox.slice(-30);
    } else {
        ox30 = ox;
    }

    if (ox.length > 30) {
        oy30 = oy.slice(-30);
    } else {
        oy30 = oy;
    }

    chartController.initConfig("line", "transactions count", ox30, oy30);
    chartController.drawChart("transactionsCountChart");

}


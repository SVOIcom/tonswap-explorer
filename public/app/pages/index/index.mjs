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


import ChartController from "/app/modules/tonswap/chartController.mjs";


window.startPageController = async (moduleHead) => {   
    // Charts
    let data = window.chartsTrCount || {};

    let ox = Object.keys(data)
                   .sort((a,b) => a.localeCompare(b))
                   .slice(-30);
    let oy = ox.map( key => data[key].count || 0);

    let chartController = new ChartController();
    chartController.initConfig("line", "transactions count", ox, oy);
    chartController.drawChart("transactionsCountChart");
}
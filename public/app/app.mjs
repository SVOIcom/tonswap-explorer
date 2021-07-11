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

import darkside from './modules/darkside.mjs';
import {default as globalize} from './modules/globalize.mjs';
import getProvider from "./modules/freeton/getProvider.mjs";
import utils from "./modules/utils.mjs";


//Go async
(async () => {

    /**
     * Provide elements visibility
     */
    //Make dark theme controller globally
    globalize.makeVisible(darkside, 'darkside');

    /**
     * Configuration
     */
    //Disable dark theme if white enabled
    if(window.localStorage.theme) {
        if(window.localStorage.theme === 'dark') {
            darkside.makeDark();
        } else {
            darkside.makeLight();
        }
    } else if(!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        console.log('Make light')
        darkside.makeLight();
    } else {
        darkside.makeDark();
    }

    const TON = await getProvider(config).init();
    globalize.makeVisible('TON', TON);

    //console.log(TON);

    //TonWallet bug workaround
   // await TON.provider.setServers(TON.networkServer)

    $('.footerSign').html('Connected <span></span>');

    //Start awaiting controllers
    if(window.startPageController) {
        await window.startPageController({TON, ...(window.frontendData ? window.frontendData : {})});
    }


    $('.searchInput').on('keyup', async function () {
        let query = $(this).val();
        if(query.length < 1) {
            $('.searchElement').html(' Start typing address or token name').fadeIn(100);
            return;
        }
        let results = await utils.fetchJSON('/index/search/' + query);
        console.log('Search result', results);
        let searchResults = 'No results found';
        if(results.length > 0) {
            searchResults = '';
            for (let result of results) {
                searchResults += `<a href="/pair/pair/${result.swap_pair_address}">${result.swap_pair_name}</a><br>`
            }
            searchResults += '';
        }

        $('.searchElement').html(searchResults).fadeIn(100);
    })

    $('.searchInput').on('focusout', () => {
        $('.searchElement').fadeOut(500)
    });

    $('.searchInput').on('focusin', () => {
        $('.searchElement').fadeIn(100)
    })

})();
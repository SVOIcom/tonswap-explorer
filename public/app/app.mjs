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
    if(!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        console.log('Make light')
        darkside.makeLight();
    } else {
        darkside.makeDark();
    }

    const TON = await getProvider().init();
    globalize.makeVisible('TON', TON);

    $('.footerSign').html('Connected <span></span>');

    //Start awaiting controllers
    if(window.startPageController) {
        await window.startPageController({TON, ...(window.frontendData ? window.frontendData : {})});
    }

})();
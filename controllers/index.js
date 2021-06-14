/**
 * Test controller
 * @author Andrey Nedobylsky (admin@twister-vl.ru)
 */
const _App = require('./_App');


class Index extends _App {

    async index() {
        await this.tset('topPairs', [
            {
                name: 'TST-STS',
                tokenRoot1: '',
                tokenRoot2: '',
                tokenIcon1: '/img/exchange/eth.png',
                tokenIcon2: '/img/exchange/eth.png',
                address: '0:6c9736602c18d00c2a4540963700f8c2259353c92bfde034b74f9a8641fb53e2',

            },
            {
                name: 'AAA-BBB',
                tokenRoot1: '',
                tokenRoot2: '',
                tokenIcon1: '/img/exchange/eth.png',
                tokenIcon2: '/img/exchange/eth.png',
                address: '0:94ed278f77833248b25707d0632d78d7a990f98950577a287ac6117c75b77487',
            },
        ]);


        await this.tset('topTokens', [
            {
                name: 'Token2',
                ticker: 'TT2',
                tokenRoot: '',
                tokenIcon: '/img/exchange/eth.png',

            },
            {
                name: 'Token1',
                ticker: 'TT1',
                tokenRoot: '',
                tokenIcon: '/img/exchange/eth.png',

            },
        ]);
        return await this.render();
    }

    async config(){
        return {};
    }
}

module.exports = Index;
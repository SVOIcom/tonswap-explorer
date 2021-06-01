function chooseNet(s) {
    let network = '';
    if (s == 'mainnet') network = 'http://main.ton.dev/';
    if (s == 'devnet') network = 'http://net.ton.dev/';
    if (s == 'local') network = 'http://localhost:80/';
    return network;
}

module.exports = chooseNet;
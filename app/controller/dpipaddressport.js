/**
 * Created by guomiaoyou on 2017/1/21.
 */

'use strict'

let getHostIP = require('../public/js/QRcode/hostNetworkInfo').getHostIP;


module.exports = function* () {
    const result = {
        title: 'ipAddressPort',
    };

    let url = 'https://www.dumplings.alibaba-inc.com/qr?dumplingsServerAddress='
    // let url = 'tmall://page.tm/oreopreview?dumplingsServerAddress='
    let port = (process.env.PORT === undefined) ? '7001' : process.env.PORT;


    this.response.body = url + getHostIP()[0] + ':' + port;
};

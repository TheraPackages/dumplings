/**
 * Created by guomiaoyou on 2017/3/23.
 */

'use strict'

let getHostIP = require('../public/hostnetworkinfo').getHostIP;


module.exports = function * () {
    const result = {
        title: 'tmall preview',
    };

    let url = 'tmall://page.tm/oreopreview?dumplingsServerAddress='
    let port = (process.env.PORT === undefined) ? '7001' : process.env.PORT;
    this.response.body = url + getHostIP()[0] + ':' + port;
};

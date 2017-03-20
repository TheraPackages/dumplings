/**
 * Copyright(c) Alibaba Group Holding Limited.
 *
 * Authors:
 *   离央<miaoyou.gmy@alibaba-inc.com>
 */

'use strict'

let os = require('os')

function hostIPconfig () {
    let infs = os.networkInterfaces()
    let adds = []
    for (let k in infs) {
        for (let k1 in infs[k]) {
            let add = infs[k][k1];
            if (add.family === 'IPv4' && !add.internal) {
                adds.push(add.address);
            }
        }
    }
    return adds
}

module.exports.getHostIP = hostIPconfig

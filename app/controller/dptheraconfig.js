/**
 * Created by guomiaoyou on 2017/1/21.
 * https://github.com/TheraPackages/dumplings/wiki/%E6%94%AF%E6%8C%81Thera-%E5%B7%A5%E7%A8%8B%E9%85%8D%E7%BD%AE
 */

'use strict';

const fs = require('fs')
const mockMessageUtil = require('../model/dp-mockmessage')

function objToStrMap (objc) {
    let strMap = new Map();
    for (let k of Object.keys(objc)) {
        strMap.set(k, objc[k]);
    }
    return strMap;
}

function strMapToObj (strMap) {
    let obj = Object.create(null);
    for (let [k, v] of strMap) {
        obj[k] = v;
    }
    return obj;
}

module.exports = function * () {
    const result = {
        title: 'theraConfig',
    };

    if (this.req.method === 'POST') {
        var that = this;
        this.app.mockfileMap.forEach((val, key, map) => {
            that.app.gazeWather.remove(key);
        })

        let data = this.request.body.data
        this.app.theraConfig = objToStrMap(data)
        // 1. watch main.we/main.vue
        if (data.hasOwnProperty('main')) {
            const w = this.app.gazeWather.watched()
            for (let k of Object.keys(w)) {
                this.app.gazeWather.remove(k)
            }
            this.app.gazeWather.add(data.main)
            this.app.transformer.transform(data.main, this.app.clientPool, this.app.theraConfig.get('transformPath'))
        }
    }
    this.response.body = JSON.stringify(strMapToObj(this.app.theraConfig));
};



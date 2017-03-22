/**
 * Created by guomiaoyou on 2017/1/21.
 * https://github.com/TheraPackages/dumplings/wiki/%E6%94%AF%E6%8C%81Thera-%E5%B7%A5%E7%A8%8B%E9%85%8D%E7%BD%AE
 */

'use strict';

const fs = require('fs')
const createMockMessageObject = require('../model/dp-mockmessage')
const TRANSFORM_PATH = 'transformPath' // store js file path


function objToStrMap(objc){
    let strMap = new Map();
    for( let k of Object.keys(objc)){
        strMap.set(k,objc[k]);
    }
    return strMap;
}

function strMapToObj(strMap){
    let obj = Object.create(null);
    for ( let [k,v] of strMap ){
        obj[k] = v;
    }
    return obj;
}

module.exports = function * () {
    const result = {
        title: 'mockConfig',
    };

    if (this.req.method === 'POST') {
        var that = this;
        this.app.mockfileMap.forEach((val, key, map) => {
            that.app.gazeWather.remove(key);
        })

        let data = this.request.body.data
        this.app.theraConfig = objToStrMap(data)
        // 1. watch main.we/main.vue
        this.app.gazeWather.add(data.main)
        // 2. watch mock file
        data.mock.forEach(function (element) {
            that.app.gazeWather.add(element.file)
            fs.readFile(element.file, 'utf8', (error, data) => {
                if (error) {
                    console.log(error)
                } else {
                    var mockModel = createMockMessageObject(element.file, element.api, element.path, data)
                    that.app.mockfileMap.set(element.file, mockModel)
                    that.app.clientPool.sendAllClientMessage(JSON.stringify(mockModel))
                }
            })
        })
    }
    this.response.body = JSON.stringify(strMapToObj(this.app.theraConfig));
};



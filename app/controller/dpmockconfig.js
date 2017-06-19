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
        title: 'mockConfig',
    };

    if (this.req.method === 'POST') {
        var that = this;
        this.app.mockfileMap.forEach((val, key, map) => {
            that.app.gazeWather.remove(key);
        })

        let data = this.request.body.data
        this.app.mockConfig = data
        // 2. watch mock file
        
        if (data.hasOwnProperty('mockData') && data.mockData instanceof Array) {
            this.app.mockfileMap.forEach((val, key, map) => {
                that.app.gazeWather.remove(key);
            })
            
            data.mockData.forEach(function (element) {
                that.app.gazeWather.add(element.file)
                fs.readFile(element.file, 'utf8', (error, data) => {
                    if (error) {
                        console.error(error)
                    } else if(data){
                        var mockDataMsg = mockMessageUtil.createMockDataMessageObject(element.file, element.api, element.path, data)
                        that.app.mockfileMap.set(element.file, mockDataMsg)
                        that.app.clientPool.sendAllClientMessage(JSON.stringify(mockDataMsg))
                    }
                })
            })
        }
        if (data.hasOwnProperty('mockModules')) {
            var mockModulesMsg = mockMessageUtil.createMockModulesMessageObject(data.mockModules)
            that.app.clientPool.sendAllClientMessage(JSON.stringify(mockModulesMsg))
        }
        }
    this.response.body = JSON.stringify(this.app.mockConfig);
};



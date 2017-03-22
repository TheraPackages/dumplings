/**
 * Created by guomiaoyou on 2017/1/21.
 */

/**

 {
  "message" : "theraConfig",
  "version": "0.1.0",
  "data" : {
    "main": "${workspaceRoot}/page.we",
    "transformPath": "${workspaceRoot}/transform",
    "mock" : [
      {
        "api" : "mtop.tmall.search.searchproduct", // MTOP API
        "file" : "\/Users\/guomiaoyou\/.oreo\/mockData.json", // 存放mock数据的文件
        "path" : "data.data.cmAboveResult.modules" // mock数据挂载的API路径节点。注意前面的data是必带的
      }
      ]
    }
  }
 */

'use strict'

const fs = require('fs')
const createMockMessageObject = require('../model/dp-mockmessage')
const TRANSFORM_PATH = 'transformPath' // store js file path

module.exports = function * () {
    const result = {
        title: 'mockConfig',
    };
    var that = this;
    this.app.mockfileMap.forEach((val, key, map) => {
        that.app.gazeWather.remove(key);
    })

    try {
        if (this.req.method === 'POST') {
            let data = this.request.body.data
            this.app[TRANSFORM_PATH] = data.transformPath
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
    } catch (err) {
        console.log(err);
    }


    this.response.body = 'ok'
};


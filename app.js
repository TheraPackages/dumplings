/** *********************************************
 * Copyright (C) 2017 All rights reserved.
 ***********************************************
 * Filename:   app.js
 * Author:     miaoyou.gmy
 * Date:       2017-03-04
 * Description:
 *
 * Modification:
 *
 ***********************************************/

'use strict'
const fs = require('fs');
let Gaze = require('gaze').Gaze;                    // https://github.com/shama/gaze
let WebSocketServer = require('websocket').server;  // https://github.com/theturtle32/WebSocket-Node

let clientPool = require('./app/model/dp-connectclientpool')
let WeexTransformHelper = require('./app/model/dp-weexhelper')
let createMockMessageObject = require('./app/model/dp-mockmessage')
let mockMessageUtil = require('./app/model/dp-mockmessage')


module.exports = function (app) {
    app.on('server', function (server) {
        let wsServer = new WebSocketServer({
            httpServer: server,
            autoAcceptConnections: false,
        });

        wsServer.on('request', (req) => {
            clientPool.addNewClient(req);
        })
    })

    // config
    app.mockfileMap = new Map();
    app.theraConfig = new Map();
    // register responder
    app.clientPool = clientPool;
    app.transformer = new WeexTransformHelper()

    let gaze = new Gaze([], {'interval': 1, 'mode': 'watch', 'debounceDelay': 1000});
    gaze.on('changed', function (filepath) {
        app.transformer.transform(filepath, app.clientPool, app.theraConfig.get('transformPath'))

        setTimeout(function(){
            fs.readFile(filepath, 'utf8', function (err, data) {
                if (err) {
                    throw err;
                } else if (app.mockfileMap.get(filepath) && data) {
                    var mockModel = app.mockfileMap.get(filepath)
                    mockModel.data.mockList.forEach((element) => {
                        if (filepath === element.file) {
                            clientPool.sendAllClientMessage(JSON.stringify(mockMessageUtil.createMockDataMessageObject(filepath, element.api, element.path, data)))
                        }
                    })
                }
            })
            },500);
    });

    app.gazeWather = gaze;
};

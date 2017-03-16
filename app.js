/***********************************************
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
const            fs = require('fs');
const          weex = require('weex-transformer');
let webSocketServer = require('websocket').server;//https://github.com/theturtle32/WebSocket-Node
let            Gaze = require('gaze').Gaze;       //https://github.com/shama/gaze

let createOreoMessageObject = require('./app/model/dp-oreomessage')
let createMockMessageObject = require('./app/model/dp-mockmessage')
let       connectClientPool = require('./app/model/dp-connectclientpool')
let                  helper = require('./app/model/dp-helper')
let           newestMessage = "";
let                 theraConnect;

module.exports = function(app) {
    app.on('server', function (server) {
        let wsServer = new webSocketServer({
            httpServer: server,
            autoAcceptConnections: false
        });

        wsServer.on('request', (req) => {
            connectClientPool.addNewClient(req,newestMessage);
        })
    })

    // map key:filePath value:renderProtocol(weex/weapp)
    app.watchFilesMap = new Map();
    // map key:filePath value:MockMessageModel
    app.mockfileMap = new Map();
    // connectClientPool
    app.connectClientPool = connectClientPool;

    let gaze = new Gaze([], {'interval': 1, 'mode': 'watch', 'debounceDelay': 1000});
    gaze.on('changed', function (filepath) {
        fs.readFile(filepath,'utf8',function (err,data) {
            if(err) throw err;

            // watch weex file
            if(app.watchFilesMap.get(filepath) === 'weex'){
                let template = data;
                let weexLogs = "";
                let arr = filepath.split('\/');
                let fileName = arr[arr.length - 1];
                try {
                    const tf = weex.transform(fileName, data, '.', {})
                    template = tf.result;
                    weexLogs = tf.logs;
                } catch (err){
                    connectClientPool.sendTransformFailedNotify(err)
                }
                connectClientPool.sendTransformSuccessNotify(weexLogs)

                let type = app.watchFilesMap.get(filepath);
                let name = (fileName || "").replace(/\.we$/, '.js');
                let bundleUrl = (filepath || "").replace(/\.we$/, '.js');
                newestMessage = JSON.stringify(createOreoMessageObject(type,template,weexLogs,name,bundleUrl));
                connectClientPool.sendAllClientMessage(newestMessage);
                helper.saveJSFile(data,template,filepath,app['transformPath']);
            }

            // watch mock data file
            if(app.mockfileMap.get(filepath)) {
                var mockModel = app.mockfileMap.get(filepath)
                mockModel['data']['mockList'].forEach((element)=>{
                    if(filepath === element['file'] ){
                        connectClientPool.sendAllClientMessage(JSON.stringify(createMockMessageObject(filepath,element['api'],element['path'],data)))
                    }
                })
            }
        })
    });

    app.gazeWather = gaze;
};

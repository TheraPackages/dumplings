/**
 * Copyright(c) Alibaba Group Holding Limited.
 *  2016/03/16
 * Authors:
 *   离央(miaoyou@alibaba-inc.com)
 */

'use strict'

const fs = require('fs')
const path = require('path')
const helper = require('./dp-helper')
const builder = require('weex-builder')
const transformer = require('weex-transformer')
const createOreoMessage = require('./dp-oreomessage')

class WeexTransformHelper {
    constructor () {
        this._vueTransformer = builder;
        this._weTransformer = transformer;
        this._clientPool = undefined;
    }

    transform (filePath, clientPool, savePath) {
        this._clientPool = clientPool
        savePath = savePath === undefined ? path.dirname(filePath) : savePath;

        switch (path.extname(filePath)) {
            case '.we':
                this.weTransformToJS(filePath, savePath)
                break
            case '.vue':
                this.vueTransformToJS(filePath, savePath)
                break
            default:
                break
        }
    }

    weTransformToJS (filePath, savePath) {
        fs.readFile(filePath, 'utf8', this.readWefile.bind(this, filePath, savePath))
    }

    vueTransformToJS (filePath, savePath) {
        try {
            this._vueTransformer.build(filePath, savePath, {}, this.vueBuildJsFileCallBack.bind(this, savePath))
        } catch (err) {
            console.error('vue build err ' + err)
            this._clientPool.sendTransformFailedNotify(err)
        }
    }

    vueBuildJsFileCallBack (savePath, errorString, result, jsonStats) {
        if (result.length > 0) {fs.readFile(result[0].to, 'utf8', this.readVuefile.bind(this, result[0].to, savePath))}
    }

    // read .we file content
    readWefile (filePath, savePath, err, data) {
        if (err) {
            this._clientPool.sendTransformFailedNotify(err)
        } else {
            const arr = filePath.split('\/')
            const weFileName = arr.length > 1 ? arr[arr.length - 1] : 'unkown'
            let content
            try {
                content = this._weTransformer.transform(weFileName, data, '.')
                this._clientPool.sendTransformSuccessNotify(content.logs)
                let name = (weFileName || '').replace(/\.we$/, '.js')
                let bundleUrl = path.join(savePath, name);
                let oreoMessage = JSON.stringify(createOreoMessage('weex', content.result, content.logs, name, bundleUrl, weFileName))
                this._clientPool.sendAllClientMessage(oreoMessage)
                helper.saveJSFile(data, content.result, name, savePath)
            } catch (err) {
                console.error('weex transform err ' + err)
                this._clientPool.sendTransformFailedNotify(err)
            }
        }
    }

    // read .vue file content
    readVuefile (filePath, savePath, err, data) {
        if (err) {
            this._clientPool.sendTransformFailedNotify(err)
        } else {
            const arr = filePath.split('\/')
            const fileName = arr.length > 1 ? arr[arr.length - 1] : 'unkown'
            this._clientPool.sendTransformSuccessNotify([])
            let oreoMessage = JSON.stringify(createOreoMessage('weex', data, [], fileName, filePath))
            this._clientPool.sendAllClientMessage(oreoMessage)
        }
    }
}

module.exports = WeexTransformHelper

/**
 * Copyright(c) Alibaba Group Holding Limited.
 *  2016/03/16
 * Authors:
 *   离央(miaoyou@alibaba-inc.com)
 */

'use strict'

const fs = require('fs')
const path = require('path')
// const helper = require('./dp-helper')
const builder = require('weex-builder')
const transformer = require('weex-transformer')
const createOreoMessage = require('./dp-oreomessage')

class WeexTransformHelper {
    constructor () {
        this._vueTransformer = builder;
        this._weTransformer = transformer;
        this._clientPool = undefined;
    }

    transform (filepath, clientPool) {
        this._clientPool = clientPool

        switch (path.extname(filepath)) {
            case '.we':
                this.weTransformToJS(filepath)
                break
            case '.vue':
                this.vueTransformToJS(filepath)
                break
            default:
                break
        }
    }

    weTransformToJS (filepath) {
        fs.readFile(filepath, 'utf8', this.readWefile.bind(this, filepath))
    }

    vueTransformToJS (filepath) {
        this._vueTransformer.build(filepath, path.dirname(filepath), {}, this.vueBuildJsFileCallBack.bind(this))
    }

    vueBuildJsFileCallBack (errorString, result, jsonStats) {
        if (result.length > 0) {fs.readFile(result[0].to, 'utf8', this.readVuefile.bind(this, result[0].to))}
    }

    // read .we file content
    readWefile (filepath, err, data) {
        if (err) {
            this._clientPool.sendTransformFailedNotify(err)
        } else {
            const arr = filepath.split('\/')
            const fileName = arr.length > 1 ? arr[arr.length - 1] : 'unkown'
            let content
            try {
                content = this._weTransformer.transform(fileName, data, '.')
            } catch (err) {
                this._clientPool.sendTransformFailedNotify(err)
            }

            this._clientPool.sendTransformSuccessNotify(content.logs)
            let name = (fileName || '').replace(/\.we$/, '.js')
            let bundleUrl = (filepath || '').replace(/\.we$/, '.js')
            let oreoMessage = JSON.stringify(createOreoMessage('weex', content.result, content.logs, name, bundleUrl, fileName))
            this._clientPool.sendAllClientMessage(oreoMessage)
        }
    }

    // read .vue file content
    readVuefile (filepath, err, data) {
        if (err) {
            this._clientPool.sendTransformFailedNotify(err)
        } else {
            const arr = filepath.split('\/')
            const fileName = arr.length > 1 ? arr[arr.length - 1] : 'unkown'
            this._clientPool.sendTransformSuccessNotify([])

            let oreoMessage = JSON.stringify(createOreoMessage('weex', data, [], fileName, filepath))
            this._clientPool.sendAllClientMessage(oreoMessage)
        }
    }
}

module.exports = WeexTransformHelper

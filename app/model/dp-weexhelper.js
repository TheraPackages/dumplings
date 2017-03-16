/**
 * Copyright(c) Alibaba Group Holding Limited.
 *  2016/03/16
 * Authors:
 *   离央(miaoyou@alibaba-inc.com)
 */

'use strict'

const fs = require('fs')
const helper = require('./dp-helper')
const builder = require('weex-builder')
const transformer = require('weex-transformer')
const createOreoMessage = require('./dp-oreomessage')

class WeexTransformHelper {
    constructor() {
        this._vueTransformer = builder;
        this._weTransformer = transformer;
        this._clientPool = undefined;
    }

    transform(filepath, clientPool) {
        this._clientPool = clientPool
        const arr = filepath.split('.')
        const fileType = arr[arr.length > 1 ? arr.length - 1 : 0]

        switch (fileType) {
            case 'we':
                return this.weTransformToJS(filepath)
            case 'vue':
                return this.vueTransformToJS(filepath)
            default:
                return ''
        }

        return ''
    }

    weTransformToJS(filepath) {
        console.log(`transform we file : ${filepath}`)
        fs.readFile(filepath, 'utf8', this.readWefile.bind(this, filepath))
    }

    vueTransformToJS(filepath) {
        console.log(`transform vue file : ${filepath}`)
    }
    // read .we file content 
    readWefile(filepath, err, data) {
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
            let name = (fileName || "").replace(/\.we$/, '.js');
            let bundleUrl = (filepath || "").replace(/\.we$/, '.js');
            let oreoMessage = JSON.stringify(createOreoMessage('weex', content.result, content.logs, name, bundleUrl));
            this._clientPool.sendAllClientMessage(oreoMessage);
            // helper.saveJSFile(data, template, filepath, app['transformPath']);
            return oreoMessage
        }
        return ''
    }
    // read .vue file content
    readVuefile(filepath, err, data) {

    }
}

module.exports = WeexTransformHelper
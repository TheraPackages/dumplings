/**
 * Created by guomiaoyou on 2016/10/19.
 */

/**
 * {'message':'oreo',
 *     'data':{'oreoList':[{'template':output.result,
 *                              'type':contentType,
 *                              'logs':[],
 *                          'initData':''}]
 *            }
 * }
 */

'use strict'

const message = 'oreo';

/*
*   向Preview Client只发送 Error 的weex logs
*   若logs不为数组(可能是transform抛出的异常对象) 则直接返回，不过滤
* */
function filterLogs (logs, logLevel) {
    if (!(logs instanceof Array)) {return logs;}

    logLevel = logLevel ? logLevel.toUpperCase() : 'NOTE'
    var logLevels = ['OFF', 'ERROR', 'WARNING', 'NOTE']
    if (logLevel === 'ALL' || logLevels.indexOf(logLevel) === -1) {
        logLevel = 'NOTE'
    }
    var specifyLevel = logLevels.indexOf(logLevel)

    return logs.filter(function (log) {
        var curLevel = logLevels.indexOf(log.reason.match(/^(ERROR|WARNING|NOTE): /)[1])
        return curLevel <= specifyLevel
    })
}

/**
 *
 * @param {string} type     监听文件对应的渲染方式，目前仅支持 weex
 * @param {string} template 文件转化之后的js模板内容
 * @param {array}  logs      文件转化产生的日志
 * @param {string} name     转出文件名(.js)
 * @param {string} bundleUrl 转出文件路径(/xx/x.js)
 * @param {string} fileName  原文件名(.we/.vue)
 */
let createOreoMessage = function (type, template, logs, name, bundleUrl, fileName) {
    const model = {
        'message': message,
        'data': {
            'oreoList': [
                {
                    'name': name,
                    'bundleUrl': bundleUrl,
                    'type': type,
                    'template': template,
                    'logs': filterLogs(logs, 'ERROR'),
                    'fileName': fileName,
                },
            ],
        },
    }

    return model;
};

module.exports = createOreoMessage

/**
 * Copyright(c) Alibaba Group Holding Limited.
 *  2016/11/04
 * Authors:
 *   离央(miaoyou@alibaba-inc.com)
 */

'use strict'

module.exports = function (app) {

  /* GET method*/
    app.get('/', app.controller.home)
    app.get('/theraConfig', app.controller.dptheraconfig)
    app.get('/tmallpreview',app.controller.dptmallpreviewpage)
    app.get('/ipAddressPort', app.controller.dpipaddressport)
    app.get('/connectClients', app.controller.dpconnectclients)
    app.get('/iOSSimulatorList', app.controller.dpiossimulator)
    app.get('/removeMockConfig', app.controller.dpremovemockconfig)

  /* POST method*/
    app.post('/theraConfig', app.controller.dptheraconfig)
};

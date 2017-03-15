/**
 * Copyright(c) Alibaba Group Holding Limited.
 *  2016/11/04
 * Authors:
 *   离央(miaoyou@alibaba-inc.com)
 */

'use strict';


module.exports = function (app) {
  /*GET method*/
  app.get('/', app.controller.home);
  app.get('/iOSSimluatorList', app.controller.iOSSimluator)
  app.get('/watchFiles', app.controller.watchFiles)
  app.get('/connectClients', app.controller.connectClients)
  app.get('/ipAddressPort', app.controller.ipAddressPort)
  app.get('/removeMockConfig', app.controller.removeMockConfig)


  /*POST method*/
  app.post('/watchFiles', app.controller.watchFiles);
  app.post('/theraConfig', app.controller.theraConfig);
};

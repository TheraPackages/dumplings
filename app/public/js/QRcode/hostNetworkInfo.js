/**
 * Copyright(c) Alibaba Group Holding Limited.
 *
 * Authors:
 *   离央<miaoyou.gmy@alibaba-inc.com>
 */

'use strict'

var os = require('os');

function hostIPconfig(){
  var infs = os.networkInterfaces();
  var adds = [];
  for( var k in infs){
    for( var k1 in infs[k]){
        var add = infs[k][k1];
        if(add.family === 'IPv4' && !add.internal){
            adds.push(add.address);
        }
    }
  }
  return adds;
}

module.exports.getHostIP = hostIPconfig;

/**
 * Copyright(c) Alibaba Group Holding Limited.
 * Created by guomiaoyou on 2017/05/22.
 *
 * Authors:
 *   离央<miaoyou.gmy@alibaba-inc.com>
 */
/* http://koajs.com/#response */

'use strict'


module.exports = function * () {
    const result = {
        title: 'knock',
    };
    this.response.type = 'application/json';
    this.response.body = JSON.stringify({'msg':'it\'s me, dumpling!','authors':'miaoyou.gmy@alibaba.com'})
};

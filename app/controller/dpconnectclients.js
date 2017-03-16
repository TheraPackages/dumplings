/**
 * Created by guomiaoyou on 2016/11/4.
 */


'use strict'


module.exports = function* () {
    const result = {
        title: 'connected clients',
    };


    this.response.body = JSON.stringify(this.app.connectClientPool.allClientHeaders());
};
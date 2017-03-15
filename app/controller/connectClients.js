/**
 * Created by guomiaoyou on 2016/11/4.
 */


'use strict'


module.exports = function* () {
    const result = {
        title: 'connectClients',
    };


    this.response.body = JSON.stringify(this.app.connectClientPool.allClientHeaders());
};
/**
 * Created by guomiaoyou on 2016/10/28.
 */
/* http://koajs.com/#response */

'use strict'

let shprocess = require('child_process');
module.exports = function* () {
    const result = {
        title: 'iOS',
    };
    this.response.type = 'application/json';
    this.response.body = shprocess.execSync('xcrun simctl list --json devices')
};

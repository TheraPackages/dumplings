/**
 * Created by guomiaoyou on 2016/11/3.
 */


'use strict'

module.exports = function * () {
    const result = {
        title: 'watchFiles',
    };

    this.response.body = JSON.stringify(this.app.gazeWather.watched());
};

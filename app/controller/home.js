/**
 * Copyright(c) Alibaba Group Holding Limited.
 *
 * Authors:
 *   离央<miaoyou.gmy@alibaba-inc.com>
 */

'use strict';

module.exports = function * () {
    const result = {
        title: 'dumplings',
    };
    yield this.render('index.html', result);
};

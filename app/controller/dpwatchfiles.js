/**
 * Created by guomiaoyou on 2016/11/3.
 */


'use strict'

module.exports = function * () {
    const result = {
        title: 'watchFiles',
    };

    if (this.req.method === 'POST') {
        if (this.request.body.cmd === 'run') {
            this.app.gazeWather.add(this.request.body.file);
            this.app.watchFilesMap.set(this.request.body.file, this.request.body.renderProtocol);
        } else if (this.request.body.cmd === 'stop') {
            this.app.gazeWather.remove(this.request.body.file);
            this.app.watchFilesMap.delete(this.request.body.file);
        }
    }

    this.response.body = JSON.stringify(this.app.gazeWather.watched());
};

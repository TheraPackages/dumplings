/**
 * Created by guomiaoyou on 2017/1/23.
 */

module.exports = function * () {
    const result = {
        title: 'removeMockConfig',
    };

    var that = this;
    this.app.mockfileMap.forEach((val, key, map) => {
        that.app.gazeWather.remove(key);
    })

    this.app.clientPool.sendAllClientMessage(JSON.stringify({ 'message': 'removeMockConfig' }));

    this.response.body = 'ok'
};

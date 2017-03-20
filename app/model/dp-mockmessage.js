/**
 * Created by guomiaoyou on 2017/1/21.
 */


'use strict'

const message = 'mock';

let createMockMessageObject = function (file, api, path, content) {
    const model = {
        'message': message,
        'data': {
            'mockList': [
                {
                    'file': file,
                    'api': api,
                    'path': path,
                    'content': content,
                },
            ],
        },
    }

    return model;
};

module.exports = createMockMessageObject;

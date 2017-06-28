/**
 * Created by guomiaoyou on 2017/1/21.
 */


'use strict'


module.exports = (function () {
    function createMockDataMessageObject(file, api, path, content) {
        const model = {
            'message': 'mockData',
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
    }

    function createMockApiListMessageObject(apis) {
        const json = {
            'message': 'mockApiList',
            'data': {
                'apiList': []
            },
        }
        json.data.apiList = apis
        return json;
    }

    function createMockModulesMessageObject(modules) {
        var json  = {
            'message': 'mockModules',
            'data': {
                'mockModules': [],
            },
        }
        json.data.mockModules = modules
        return json
    }

    return {
        createMockDataMessageObject: createMockDataMessageObject,
        createMockModulesMessageObject: createMockModulesMessageObject,
        createMockApiListMessageObject: createMockApiListMessageObject,
    }
}())
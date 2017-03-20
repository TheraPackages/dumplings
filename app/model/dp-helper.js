/**
 * Created by guomiaoyou on 2016/12/28.
 */

'use strict'

const fs = require('fs-extra')

let DumplingsHelper = module.exports = {}


DumplingsHelper.saveJSFile = function (originData, content, originFilePath, filePath) {
    if (originData === content) {
        return false
    }
    if (originFilePath.substr(originFilePath.length - 2) === 'we') {
        // check file type
        let nowDate = new Date().toLocaleString('cn')
        let newContent = content + '\n/* auto created by dumplings server with weex-devtool ' + nowDate + ' */\n';
        var newpath = originFilePath.substr(0, originFilePath.length - 2) + 'js'


        if (filePath !== undefined) {
            let arr = originFilePath.split('\/');
            var fileName = arr[arr.length - 1];
            fileName = (fileName || '').replace(/\.we$/, '.js')
            newpath = filePath + '\/' + fileName;
            fs.ensureDirSync(filePath, (err) => {
                if (err) {console.log(err);}
            })


        }

        fs.writeFile(newpath, newContent, (err) => {
            if (err) {console.log(err)}
        })

        return true
    }
}

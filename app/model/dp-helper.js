/**
 * Created by guomiaoyou on 2016/12/28.
 */

'use strict'

const fs = require('fs-extra')

let DumplingsHelper = module.exports = {}


DumplingsHelper.saveJSFile = function (originData, content, fileName, filePath) {
    if (originData === content) {
        return false;
    }

    // check file type
    let nowDate = new Date().toLocaleString('cn');
    let newContent = content + '\n/* auto created by dumplings server with weex-devtool ' + nowDate + ' */\n';
    const newpath = filePath + '\/' + fileName;

    fs.ensureDirSync(filePath, (err) => {
        if (err) {console.error(err);}
    });

    fs.writeFile(newpath, newContent, (err) => {
        if (err) {console.error(err)}
    })

    return true;
}

'use strict'

const fs = require('fs')

class Test{
    constructor(){
        this._path = '/Users/guomiaoyou/.oreo/a.we'
    }

    tranform(){
        fs.readFile(this._path,'utf8',this.readFile.bind(this))
    }

    readFile(err,data){
        console.log(data);
    }
}

let test = new Test()

test.tranform()
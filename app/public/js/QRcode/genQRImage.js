'use strict'
let ipAddress = require('./hostNetworkInfo').getHostIP();
let genQr = require('./genqr');
let Jimp = require('jimp');// https://github.com/oliver-moran/jimp

module.exports.genQRImage = function genQRimage(path){
  // 将host的ip地址转化为 01 矩阵，并写入图片中. 大小为 256 * 256
  if(Array.isArray(ipAddress) && ipAddress.length > 0){
    // tmall://page.tm/oreopreview?dumplingsServerAddress=127.0.0.1:7001
      let url = 'http://www.dumplings.com/qr?dumplingsServerAddress='
      let port = (process.env.DUMPLINGSPORT === undefined) ? '7001':process.env.DUMPLINGSPORT;
    let matrix = genQr(url + ipAddress[0] + ':' + port);
    // let row = matrix.length,col = matrix[0].length,padding = 0;
    //
    // let img = new Jimp(row + 2*padding,col + 2*padding,0xFFFFFFFF,function(err,img){
    //     if(err){
    //        console.log(err);
    //     } else{
    //        for(let i = 0;i < row;i++){
    //          for(let j = 0;j < col;j++){
    //              if(matrix[i][j] === 0){
    //                img.setPixelColor(0x000000FF,i + padding,j + padding);
    //              }
    //          }
    //        }
		// 	img.resize(256,256,'nearestNeighbor').write(path+'hostIP_QRcode.png', (error) =>{
		// 		 if (error) throw error;
		//    });
    //     }
    // });
  }
}

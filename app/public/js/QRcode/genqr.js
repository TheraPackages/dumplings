/***********************************************
 * Copyright (C) 2016 All rights reserved.
 ***********************************************
 * Filename:   gen_qrcode.js
 * Author:     codesky.club
 * Date:       2016-02-02
 * Description: 
 * 
 * Modification: 
 * 
 ***********************************************/

var qrjs = require('./qrcode');

module.exports = function(options) {

	// if options is string, 
	if( typeof options === 'string' ){
		options	= { text: options };
	}
	console.log(`inputText : ${options.text}`);

	// set default values
	// typeNumber < 1 for automatic calculation
	baseOptions = {
		padding		: 10,
		render		: "matrix",
		width		: 256,
		height		: 256,
		typeNumber	: -1,
		correctLevel	: qrjs.QRErrorCorrectLevel.H,
        background      : "#ffffff",
        foreground      : "#000000"
	};
	for (var key in options) {
		baseOptions[key] = options[key];
	}
	options = baseOptions;

	// 生成html上显示的canvas元素
	var createCanvas = function() {
		// create the qrcode itself
		var qrcode	= new qrjs.QRCode(options.typeNumber, options.correctLevel);
		qrcode.addData(options.text);
		qrcode.make();

		// create canvas element
		var canvas	= document.createElement('canvas');
		canvas.width	= options.width;
		canvas.height	= options.height;
		var ctx		= canvas.getContext('2d');

		//background
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// compute tileW/tileH based on options.width/options.height
		var tileW	= (options.width - options.padding * 2) / qrcode.getModuleCount();
		var tileH	= (options.height - options.padding * 2) / qrcode.getModuleCount();

		// draw in the canvas
		for( var row = 0; row < qrcode.getModuleCount(); row++ ){
			for( var col = 0; col < qrcode.getModuleCount(); col++ ){
				ctx.fillStyle = qrcode.isDark(row, col) ? options.foreground : options.background;
				var w = (Math.ceil((col+1)*tileW) - Math.floor(col*tileW));
				var h = (Math.ceil((row+1)*tileW) - Math.floor(row*tileW));
				ctx.fillRect(Math.round(col*tileW) + options.padding, Math.round(row*tileH) + options.padding, w, h);
			}	
		}
		// return just built canvas
		return canvas;
	}

	// 生成html上显示的table元素
	var createTable = function() {
		console.log('create qr table');
		// create the qrcode itself
		var qrcode	= new qrjs.QRCode(options.typeNumber, options.correctLevel);
		qrcode.addData(options.text);
		qrcode.make();

		// create table element
		var $table	= $('<table></table>')
			.css("width", options.width+"px")
			.css("height", options.height+"px")
			.css("border", "0px")
			.css("border-collapse", "collapse")
			.css('background-color', options.background);
	  
		// compute tileS percentage
		var tileW	= options.width / qrcode.getModuleCount();
		var tileH	= options.height / qrcode.getModuleCount();

		// draw in the table
		for(var row = 0; row < qrcode.getModuleCount(); row++ ){
			var $row = $('<tr></tr>').css('height', tileH+"px").appendTo($table);
			
			for(var col = 0; col < qrcode.getModuleCount(); col++ ){
				$('<td></td>')
					.css('width', tileW+"px")
					.css('background-color', qrcode.isDark(row, col) ? options.foreground : options.background)
					.appendTo($row);
			}	
		}
		// return just built canvas
		return $table;
	}

	// 生成二维码矩阵
	var createMatrix = function() {
		console.log('create qr matrix');
		// create the qrcode itself
		var qrcode	= new qrjs.QRCode(options.typeNumber, options.correctLevel);
		qrcode.addData(options.text);
		qrcode.make();

		// compute tileW/tileH based on options.width/options.height
		var tileW	= (options.width - options.padding * 2) / qrcode.getModuleCount();
		var tileH	= (options.height - options.padding * 2) / qrcode.getModuleCount();

		// draw in the matrix
		mat = []
//		console.log();
		for( var row = 0; row < qrcode.getModuleCount(); row++ ) {
			matLine = [];
			var line = row + "\t";
			for( var col = 0; col < qrcode.getModuleCount(); col++ ) {
				color = qrcode.isDark(row, col) ? options.foreground : options.background;
				var w = (Math.ceil((col+1)*tileW) - Math.floor(col*tileW));
				var h = (Math.ceil((row+1)*tileW) - Math.floor(row*tileW));

				matLine.push(qrcode.isDark(row, col) ? 0 : 1);
				line += qrcode.isDark(row, col) ? String.fromCharCode(65) : String.fromCharCode(32);
				line += qrcode.isDark(row, col) ? String.fromCharCode(65) : String.fromCharCode(32);
			}
			mat.push(matLine);
//			console.log(line);
		}
//		console.log();
		return mat;
	}

	if (options.render === 'canvas') {
		return createCanvas();
	} else if (options.render === 'table') {
		return createTable();
	} else if (options.render === 'matrix') {
		return createMatrix();
	} else {
		console.log('please specify a format to output qrcode [canvas, table, matrix]');
	}
}

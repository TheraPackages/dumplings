'use strict';
const path = require('path')
module.exports = appInfo => {
  const config = {
	view:{
	  root: path.join(appInfo.baseDir, 'app/view'),
	  defaultExtension: '.html',
	  defaultViewEngine: 'nunjucks',
	  mapping: {'.nj':'nunjucks'},
	},
	security: {
		csrf: {
		  queryName: '', // 通过 query 传递 CSRF token 的默认字段为 _csrf
		  bodyName: '', // 通过 body 传递 CSRF token 的默认字段为 _csrf
		},
	},
  };
  config.keys = appInfo.name + '778477';
  return config;
};



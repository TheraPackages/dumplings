'use strict';
const path = require('path')
module.exports = appInfo => {
	const config = {
		view: {
			root: path.join(appInfo.baseDir, 'app/view'),
			defaultExtension: '.html',
			defaultViewEngine: 'nunjucks',
			mapping: { '.nj': 'nunjucks' },
		},
		security: {
			csrf: {
				enable: false,
			},
		},
	};
	config.keys = appInfo.name + '778477';
	return config;
};



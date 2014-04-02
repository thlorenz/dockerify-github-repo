'use strict';

var log = require('npmlog');
log.level = 'verbose';

var dockerifyRepo = require('../');

dockerifyRepo('thlorenz/browserify-markdown-editor', function (err, streamfns) {
  if (err) return console.error(err);
  console.log(Object.keys(streamfns));    
})
.on('info', log.info.bind(log))
.on('debug', log.verbose.bind(log))

'use strict';

var log = require('npmlog');
log.level = 'verbose';

var dockerifyRepo = require('../');

dockerifyRepo('thlorenz/browserify-markdown-editor', function (err, streamfns) {
  if (err) return console.error(err);

  console.log('\ntags for which streams were resolved:\n', Object.keys(streamfns));    

  // pipe first stream into docker or (to demo) to the console 
  // note the function call `()`
  console.log('\nStreaming first stream:\n');
  streamfns['000-nstarted']().pipe(process.stdout);
})
.on('info', log.info.bind(log))
.on('debug', log.verbose.bind(log))

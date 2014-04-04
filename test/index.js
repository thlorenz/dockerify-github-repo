'use strict';
/*jshint asi: true */

var test = require('tap').test
var log = require('npmlog');
log.level = 'verbose';

var dockerifyRepo = require('../');

test('\ndockerifying thlorenz/browserify-markdown-editor', function (t) {
  var infos = 0, debugs = 0;

  dockerifyRepo('thlorenz/browserify-markdown-editor', function (err, streamfns) {
    if (err) { t.fail(err); return t.end(); }

    var keys = Object.keys(streamfns);
    t.ok(keys.length > 10, 'gets at more than 10 streamfns')
    t.equal(keys[0], '000-nstarted', 'first key is 000-nstarted') 
    t.equal(infos, keys.length * 2 + 1, 'emits how many tags will be processed and processing and processed info for each tag')
    t.ok(typeof streamfns['000-nstarted'] === 'function', 'values are functions')
    t.ok(streamfns['000-nstarted']().readable, 'functions return readable stream')

    // this may fail if github changes redirect strategy
    t.equal(debugs, keys.length, 'emits redirect debug message for each tag')

    t.end()
  })
  .on('info', function (x) { infos++ })
  .on('debug', function (x) { debugs++ })
  .on('info', log.info.bind(log))
  .on('debug', log.verbose.bind(log))
})

test('\ndockerifying thlorenz/browserify-markdown-editor filtering out all but 2 tags', function (t) {
  var infos = 0, debugs = 0;

  function filter(tag) {
    return tag === '000-nstarted' || tag === '009-improved-styling';
  }

  dockerifyRepo('thlorenz/browserify-markdown-editor', { filter: filter }, function (err, streamfns) {
    if (err) { t.fail(err); return t.end(); }

    var keys = Object.keys(streamfns);
    t.equal(keys.length, 2, 'gets 2 streamfns')
    t.equal(keys[0], '000-nstarted', 'first key is 000-nstarted') 
    t.equal(keys[1], '009-improved-styling', 'last key is 009-improved-styling') 
    t.equal(infos, keys.length * 2 + 1, 'emits how many tags will be processed and processing and processed info for each tag')
    t.ok(typeof streamfns['000-nstarted'] === 'function', 'values are functions')
    t.ok(streamfns['000-nstarted']().readable, 'functions return readable stream')

    // this may fail if github changes redirect strategy
    t.equal(debugs, keys.length, 'emits redirect debug message for each tag')

    t.end()
  })
  .on('info', function (x) { infos++ })
  .on('debug', function (x) { debugs++ })
  .on('info', log.info.bind(log))
  .on('debug', log.verbose.bind(log))
})

'use strict';

var zlib              = require('zlib')
  , hyperquest        = require('hyperquest')

var si = typeof setImmediate === 'function' ? setImmediate : function (fn) { setTimeout(fn, 0) };

function getBody(res, cb) {
  var data = '';
  res
    .on('error', cb)
    .on('data', function (d) { data += d })
    .on('end', function () { cb(null, data);  });
}

function getTarStream(url, events, cb) {

  // resolves redirects very naively hoping that github keeps these straight forward
  hyperquest(url, function (err, res) {
    if (err) return cb(err);

    var isredirect = 300 < res.statusCode && res.statusCode <= 399;

    if (isredirect) {
      var redirecturl = res.headers && res.headers.location;
      events.emit('debug', 'Got redirect for: ' +  url);

      if (!redirecturl) return cb(new Error('Got redirect, but no redirect location for ' + url));

      return si(getTarStream.bind(null, redirecturl, events, cb)); 
    } else {
      if (res.statusCode === 200) { 
        events.emit('info', 'Resolved stream for: ' + url);
        return cb(null, res);
      }
      
      events.emit('debug', 'Non 200 status code (' + res.statusCode + ') for: ' + url);

      // let's hope we never get here although we may get a 404 and then we are basically screwed
      getBody(res, function (err, body) {
        if (err) return cb({ statusCode: res.statusCode, err: err });
        cb({ statusCode: res.statusCode, body: body });
      })
    }
  });  
}

function tarStream(hub, repo, ext, tag, events, cb) {
  var root = hub + '/' + repo + '/archive'
    , url = root + '/' + tag + ext

  events.emit('info', 'Processing: ' +  url);
  getTarStream(url, events, function (err, res) {
    if (err) return cb(err);

    var stream;
    if (ext === '.tar.gz' || ext === 'tgz') {
      stream = res.pipe(zlib.createGunzip());
      // bubble errors
      res.on('error', stream.emit.bind(stream, 'error'))
    } else {
      stream = res;
    }
    
    cb(null, stream);
  });

}

module.exports = function githubTarStream(repo, tag, events, cb) {
  var hub = 'https://github.com'
    , ext = '.tar.gz'

  return tarStream(hub, repo, ext, tag, events, cb);
}


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

function getTarStream(url, cb) {

  // resolves redirects very naively hoping that github keeps these straight forward
  hyperquest(url, function (err, res) {
    if (err) return cb(err);

    var isredirect = 300 < res.statusCode && res.statusCode <= 399;

    if (isredirect) {
      var redirecturl = res.headers && res.headers.location;
      if (!redirecturl) return cb(new Error('Got redirect, but no redirect location for ' + url));

      return si(getTarStream.bind(null, redirecturl, cb)); 
    } else {
      if (res.statusCode === 200) return cb(null, res);
      
      // let's hope we never get here although we may get a 404 and then we are basically screwed
      getBody(res, function (err, body) {
        if (err) return cb({ statusCode: res.statusCode, err: err });
        cb({ statusCode: res.statusCode, body: body });
      })
    }
  });  
}

function tarStream(hub, repo, ext, tag, cb) {
  var root = hub + '/' + repo + '/archive'
    , url = root + '/' + tag + ext

  getTarStream(url, function (err, res) {
    if (err) return cb(err);

    var stream = ext === '.tar.gz' || ext === 'tgz'
      ? res.pipe(zlib.createGunzip())
      : res;

    cb(null, stream);
  });

}

module.exports = function githubTarStream(repo, tag, cb) {
  var hub = 'https://github.com'
    , ext = '.tar.gz'

  return tarStream(hub, repo, ext, tag, cb);
}


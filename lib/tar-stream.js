'use strict';

var zlib              = require('zlib')
  , hyperquest        = require('hyperquest')

function tarStream(hub, repo, ext, tag) {
  var root = hub + '/' + repo + '/archive'
    , url = root + '/' + tag + ext

  return ext === '.tar.gz' || ext === 'tgz'
    ? hyperquest(url).pipe(zlib.createGunzip())
    : hyperquest(url);
}

module.exports = function githubTarStream(repo, tag) {
  var hub = 'https://github.com'
    , ext = '.tar.gz'

  return tarStream(hub, repo, ext, tag);
}

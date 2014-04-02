'use strict';

var resolveGithubRefs = require('resolve-github-refs')
  , dockerify         = require('dockerify')
  , path              = require('path')
  , xtend             = require('xtend')
  , asyncreduce       = require('asyncreduce')
  , tarStream         = require('./lib/tar-stream')

var defaultDockerfile = path.join(__dirname, 'lib', 'Dockerfile');

function imageName(repo, tag) {
  return repo + ':' + tag;
}

var go = module.exports =

/**
 * Creates a tar stream for each released tag of the given repo.
 * Each tar stream has a Dockerfile injected unless one was found already.
 *
 * @name dockerifyGithubRepo
 * @function
 * @param {string} repo github repo of the form `user/reponame`
 * @param {Object=} dockerifyOpts passed to [dockerify](https://github.com/thlorenz/dockerify#tarstream-opts--readablestream)
 * @param {function} cb called back with an error or an array of tar streams that can be piped into docker to create an image
 */
function (repo, dockerifyOpts, cb) {

  if (typeof dockerifyOpts === 'function') {
    cb = dockerifyOpts;
    dockerifyOpts = {};
  }

  dockerifyOpts = xtend({ strip: 1, dockerfile: defaultDockerfile }, dockerifyOpts);

  resolveGithubRefs(repo, function (err, refs) {
    if (err) return cb(err);
    if (!refs || !refs.tags || !refs.tags.length) return cb(null, []);

    var tarStreams = 
    asyncreduce(
        refs.tags
      , {}
      , function (acc, tag, cb_) {
          tarStream(repo, tag, function (err, intar) {
            if (err) return cb_(err);
            acc[tag] = intar;
            cb_(null, acc)
          })
        }
      , cb
    )
  })
}

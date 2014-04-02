# dockerify-github-repo [![build status](https://secure.travis-ci.org/thlorenz/dockerify-github-repo.png)](http://travis-ci.org/thlorenz/dockerify-github-repo)

Given a github repository url, returns a tar stream for each release with Dockerfile injected that can be piped into docker to create an image.

```js
var log = require('npmlog');
log.level = 'verbose';

var dockerifyRepo = require('dockerify-github-repo');

dockerifyRepo('thlorenz/browserify-markdown-editor', function (err, streamfns) {
  if (err) return console.error(err);
  console.log(Object.keys(streamfns));    
})
.on('info', log.info.bind(log))
.on('debug', log.verbose.bind(log))
```

```
info Resolving tar streams for 12 tags
info Processing: https://github.com/thlorenz/browserify-markdown-editor/archive/000-nstarted.tar.gz
verb Got redirect for: https://github.com/thlorenz/browserify-markdown-editor/archive/000-nstarted.tar.gz
info Resolved stream for: https://codeload.github.com/thlorenz/browserify-markdown-editor/tar.gz/000-nstarted
[ .. ]
info Resolved stream for: https://codeload.github.com/thlorenz/browserify-markdown-editor/tar.gz/011-finished-product
[ '000-nstarted',
  '001-start',
  [ .. ]
  '010-finished-dev-version',
  '011-finished-product' ]

```

## Installation

    npm install dockerify-github-repo

## API


## License

MIT

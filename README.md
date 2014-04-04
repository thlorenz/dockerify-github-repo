# dockerify-github-repo [![build status](https://secure.travis-ci.org/thlorenz/dockerify-github-repo.png)](http://travis-ci.org/thlorenz/dockerify-github-repo)

Given a github repository url, returns a tar stream for each release with Dockerfile injected that can be piped into docker to create an image.

```js
var log = require('npmlog');
log.level = 'verbose';

var dockerifyRepo = require('dockerify-github-repo');

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
```

#### Output

```
info Resolving tar streams for 12 tags
info Processing: https://github.com/thlorenz/browserify-markdown-editor/archive/000-nstarted.tar.gz
verb Got redirect for: https://github.com/thlorenz/browserify-markdown-editor/archive/000-nstarted.tar.gz
info Resolved stream for: https://codeload.github.com/thlorenz/browserify-markdown-editor/tar.gz/000-nstarted
[ .. ]
info Resolved stream for: https://codeload.github.com/thlorenz/browserify-markdown-editor/tar.gz/011-finished-product

tags for which streams were resolved:

[ '000-nstarted',
  '001-start',
  [ .. ]
  '010-finished-dev-version',
  '011-finished-product' ]

Streaming first stream:

.000666 000000 000000 00000000064 12216176030 011116 0ustar00rootroot000000 000000 52 comment=d4c6d5abfce89add3128fbee5d3981a20484534b
.000775 000000 000000 00000000000 12216176030 011112 5ustar00rootroot000000 000000 .gitignore000664 000000 000000 00000000141 12216176030 013020 0ustar00rootroot000000 000000 lib-cov
*.seed
*.log
*.csv
[..]
```

## Installation

    npm install dockerify-github-repo

## API


<!-- START docme generated API please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN docme TO UPDATE -->

<div>
<div class="jsdoc-githubify">
<section>
<article>
<div class="container-overview">
<dl class="details">
</dl>
</div>
<dl>
<dt>
<h4 class="name" id="dockerifyGithubRepo"><span class="type-signature"></span>dockerifyGithubRepo<span class="signature">(repo, <span class="optional">opts</span>, cb)</span><span class="type-signature"> &rarr; {EventEmitter}</span></h4>
</dt>
<dd>
<div class="description">
<p>Provides a tar stream for each released tag of the given repo.
Each tar stream has a Dockerfile injected unless one was found already.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th>Argument</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>repo</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="attributes">
</td>
<td class="description last"><p>github repo of the form <code>user/reponame</code></p></td>
</tr>
<tr>
<td class="name"><code>opts</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="attributes">
&lt;optional><br>
</td>
<td class="description last">
<h6>Properties</h6>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th>Argument</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>dockerify</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="attributes">
&lt;optional><br>
</td>
<td class="description last"><p>passed to <a href="https://github.com/thlorenz/dockerify#tarstream-opts--readablestream">dockerify</a></p></td>
</tr>
<tr>
<td class="name"><code>filter</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="attributes">
&lt;optional><br>
</td>
<td class="description last"><p>allows filtering tags for which images are created, return <code>false</code> to ignore it or <code>true</code> to include</p></td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="attributes">
</td>
<td class="description last"><p>called back with an error or a hash of the form <code>{Object.&lt;github-tag:string, value:(function:ReadableStream)&gt;}</code>
each function can be invoked to return a stream that can be piped into docker to create an image.</p>
<p><strong>Note</strong> that each stream emits all <a href="https://github.com/thlorenz/dockerify#note">dockerify events</a>.</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/dockerify-github-repo/blob/master/index.js">index.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/dockerify-github-repo/blob/master/index.js#L19">lineno 19</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>event emitter which emits <code>'info'</code> and <code>'debug'</code> messages</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">EventEmitter</span>
</dd>
</dl>
</dd>
</dl>
</article>
</section>
</div>

*generated with [docme](https://github.com/thlorenz/docme)*
</div>
<!-- END docme generated API please keep comment here to allow auto update -->

## License

MIT

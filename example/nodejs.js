'use strict';

var dockerifyRepo = require('../');

dockerifyRepo('joyent/node', function (err, streams) {
  if (err) return console.error(err);
  console.log(streams);
});

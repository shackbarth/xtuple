
var _path       = require('path');

var builder     = require('build-tools');

builder.set({
  'root': _path.join(__dirname, '../../../../client'),
  'socket-server-port': 9000,
  'socket-server': 'clinuz.xtuple.org'
}).serve();

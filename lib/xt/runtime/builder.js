
var _path       = require('path');

var builder     = require('build-tools');

builder.set({
  'root': _path.join(__dirname, '../../../../client'),
  'socket-server-port': 9000,
  'socket-server': 'localhost',
  'builder-server': 'localhost',
  'builder-server-port': 4020,
  'builder-server-namespace': 'build'
}).serve();

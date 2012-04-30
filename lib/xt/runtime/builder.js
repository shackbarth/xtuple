
var _path       = require('path');

var builder     = require('build-tools');

builder.set({
  projectRoot: _path.join(__dirname, '../../../../client'),
  projectMode: 'inlined',
  projectPackageMode: 'normal',
  datasourceHost: 'localhost',
  datasourceHostPort: 9000,
  builderHostPort: 4020,
  builderHost: 'localhost',
  builderHostNamespace: 'build'
}).serve();

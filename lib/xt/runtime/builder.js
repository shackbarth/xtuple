
if (!XT.opts.buildClient) return;

var _path       = require('path');

var builder     = require('build-tools');

builder.set({
  projectRoot: _path.join(__dirname, '../../../../client'),
  projectMode: 'inlined',
  projectPackageMode: 'normal',
  datasourceHost: 'localhost',
  datasourceHostPort: XT.opts.port || 9000,
  builderHostPort: XT.opts['app-port'] || 4020,
  builderHost: 'localhost',
  builderHostNamespace: 'build'
}).serve();

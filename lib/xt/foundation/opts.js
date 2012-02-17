
/** @namespace
  Options parsing using the third-party module node-optimist.
*/

// XT.options = require('../../optimist').options(
XT.options = require('optimist').options(
  /** @scope XT.opts.prototype */ {
  
  p: {
    alias: 'port',
    describe: 'Port to use to communicate with Postgres server',
    default: 5432
  },
  d: {
    alias: 'database',
    describe: 'The name of the target database to use',
    string: YES
  },
  u: {
    alias: 'user',
    describe: 'The default username to communicate with Postgres database',
    string: YES
  },
  P: {
    alias: 'password',
    describe: 'The password for the default database user',
    string: YES
  },
  H: {
    alias: 'host',
    describe: 'The host (or address) of the Postgres server',
    default: 'localhost',
    string: YES
  },
  c: {
    alias: 'config',
    describe: 'Path to the configuration file',
    string: YES
  },
  D: {
    alias: 'debug',
    describe: 'Turn debugging on/off',
    boolean: YES
  },
  b: {
    alias: 'server-port',
    describe: 'The port for the HTTP/HTTPS server to use',
    default: 7000
  },
  h: {
    alias: 'help',
    describe: 'Show this message and exit',
    boolean: YES
  },
  
  // during transition where metasql is proxied
  M: {
    alias: 'metasql-server',
    describe: 'The MetaSQL proxy server hostname or IP',
    default: 'localhost',
    string: YES
  },
  m: {
    alias: 'metasql-server-port',
    describe: 'The port for the MetaSQL proxy server',
    default: 80
  },
  t: {
    alias: 'session-timeout',
    describe: 'The number of minutes before a session is considered expired',
    default: 15
  },
  'redis-host': {
    describe: "The hostname/IP for the Redis/cache server",
    default: 'localhost'
  },
  'redis-port': {
    describe: "The port the Redis/cache server is listening on",
    default: 6379
  },
  'dev-ui-port': {
    describe: "The port for the Developer User Interface server",
    default: 8080
  }
})
  .check(function() {
    var a = args()[0];
    if(
      (!a.c || !a.config)
      && (
        (!a.u || !a.user)
        || (!a.P || !a.password)
        || (!a.d || !a.database)
      )
    ) throw "If no configuration file specified, you must provide a user, password and database name (minimum)";
  })
  .usage(
    "Usage: ./server [options]"
  ) ;

XT.opts = XT.options.argv;

XT.DEBUGGING = XT.opts.debug ? YES : NO;
  
// if the user requests the help message display it and exit
if(XT.opts.h) {
  XT.io.__console__(
    XT.string.buffer.create({ color: 'blue', prefix: '' }),
    XT.options.help()
  );
  process.exit();
}

if(XT.opts.c) {
  XT.parseConfiguration(XT.opts.c);
} else { process.emit('xtReady'); }

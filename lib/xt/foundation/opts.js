
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
  H: {
    alias: 'host',
    describe: 'The host (or address) of the Postgres server',
    default: 'localhost',
    string: true
  },
  c: {
    alias: 'config',
    describe: 'Path to the configuration file',
    string: true
  },
  D: {
    alias: 'debug',
    describe: 'Turn debugging on/off',
    boolean: true
  },
  b: {
    alias: 'server-port',
    describe: 'The port for the HTTP/HTTPS server to use',
    default: 7000
  },
  h: {
    alias: 'help',
    describe: 'Show this message and exit',
    boolean: true
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
  },
  'orm-installer-debugging': {
    describe: "Publish additional debugging information from the ORM installer [DEV]",
    boolean: false
  },
  'generated-models-directory': {
    describe: "The path to the directory where generated models should be installed",
    default: "../client/frameworks/xm/packages"
  },
  'generated-subclass-models-directory': {
    describe: "The path to the directory where generated sub-class template models should be installed",
    default: "../TEMPLATE_MODELS"
  },
  'mode': {
    describe: "The mode the datasource will run under",
    default: "develop"
  },
  'target-app': {
    describe: "The Blossom application name to build/host depending on the mode",
    default: "console"
  },
  'app-port': {
    describe: "The port from which to host the application",
    default: 4020
  },
  'databaseUser': {
    describe: "The default database user to connect with"
  },
  'databasePassword': {
    describe: "The password for the default database user"
  },
  'defaultOrganization': {
    describe: "The default organization to use (database name usually)"
  },
  'buildClient': {
    describe: "Whether or not to use the build tools",
    boolean: true
  }
})
  .usage(
    "Usage: ./server [options]"
  ) ;

XT.opts = XT.options.argv;

XT.DEBUGGING = XT.opts.debug ? true : false;
  
// if the user requests the help message display it and exit
if(XT.opts.h) {
  XT.io.__console__(
    XT.String.buffer.create({ color: 'blue', prefix: '' }),
    XT.options.help()
  );
  process.exit();
}

if(XT.opts.c) {
  XT.parseConfiguration(XT.opts.c);
}

var _path       = require('path');

module.exports = {

  //.......................................
  // DATABASE CONFIGURATION OPTIONS
  //
  
  database: {

    // the port to connect to the database
    port: 19689,

    // the hostname/url/ip of the database
    hostname: 'asteroidbelt.xtuple.com',

    //.........................
    // TEMPORARY DATABASE OPTIONS THAT WILL BE
    // REPLACED FOR MULTIPLE ENTRY

    user: 'admin',
    password: 'Assemble!Aurora',
    organization: 'aurora',

    //.........................
  },

  //.......................................
  // DATASOURCE CONFIGURATION OPTIONS
  //

  datasource: {

    // allow debugging output from the datasource
    debugging: true,

    // the port for the datasource to listen on for
    // socket data requests
    port: 9000,

    // amount in minutes to wait before designating
    // a session as inactive (timeout out)
    sessionTimeout: 15,

    // the mode under which to run the datasource
    mode: 'development'
  },

  //.......................................
  // REDIS (NETWORK CACHE) CONFIGURATION OPTIONS
  //

  cache: {

    // the port to use to connect to the cache
    port: 6379,

    // the hostname to use to connect to the cache
    hostname: 'asteroidbelt.xtuple.com',
  },

  //.......................................
  // BUILDER CONFIGURATION OPTIONS
  //

  builder: {


    // DEVELOPMENT ONLY DEFAULT CLIENT CONNECTION CREDENTIALS
    // -- ARE INSERTED INTO CLIENT SOURCE
    databaseUser: 'admin',
    databaseUserPassword: 'Assemble!Aurora',
    databaseOrganization: 'aurora',


    // whether or not the datasource should include the
    // client builder
    useBuilder: true,

    // project structure file path
    projectStructure: _path.join(__dirname, '../../client', 'postbooks.json'),

    // project mode
    projectMode: 'development',

    // project root directory
    projectRoot: _path.join(__dirname, '../../client'),

    // project package mode
    projectPackageMode: 'normal',

    // project title (display in browser)
    projectTitle: 'Postbooks (development)',

    // project www directory for static files and builder index
    projectWWW: _path.join(__dirname, '../../client', 'www'),

    // datasource hostname to insert into the index
    datasourceHost: 'localhost',

    // datasource host port
    datasourceHostPort: 9000,

    // builder hostname for clients to connect to via socket
    builderHost: 'localhost',

    // builder host port
    builderHostPort: 4020,

    // builder host namespace for sockets to connect to the builder
    builderHostNamespace: 'build',

    // development mode only option
    printTreeOnBuild: true,

    // development mode only option
    sortedFilesListInIndex: true
  },

  //.......................................
  // TEMPORARILY ALLOW THESE TO REMAIN HERE
  // ORM OPTIONS AND DEV UI
  //

  dev: {
    port: 9080
  }
};

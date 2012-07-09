var _path       = require('path');

module.exports = {

  //.......................................
  // LOGGING CONFIGURATION OPTIONS
  //  
  
  // NOTE: CURRENTLY DOES NOTHING!
  
  logging: {
    
    // whether or not to use file logging
    useFileLogs: true,
    
    // the path where log files should be stored/managed
    path: './logs'
  },

  //.......................................
  // DATABASE CONFIGURATION OPTIONS
  //
  
  database: {

    // the port to connect to the database
    port: 5432,

    // the hostname/url/ip of the database
    hostname: 'localhost',

    //.........................
    // TEMPORARY DATABASE OPTIONS THAT WILL BE
    // REPLACED FOR MULTIPLE ENTRY

    user: 'admin',
    password: '',
    organization: '',

    //.........................
  },
  
  //.......................................
  // Mongoose (?)
  //
  
  mongo: {
    schemas: "lib/xt/database/mongo_schemas"
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
  // CACHE CONFIGURATION OPTIONS
  //

  cache: {

    // the port to use to connect to the cache
    port: 6379,

    // the hostname to use to connect to the cache
    hostname: 'localhost',
  },

  //.......................................
  // TEMPORARILY ALLOW THESE TO REMAIN HERE
  // ORM OPTIONS AND DEV UI
  //

  dev: {
    port: 9080
  }
};

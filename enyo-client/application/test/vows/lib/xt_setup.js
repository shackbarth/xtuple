(function () {

  // we are going to rely on the node-xt framework for access
  // to certain tools and convenience mechanisms
  require("xt");

  // native
  _fs             = X.fs;
  _util           = X.util;
  _path               = X.path;

  // third-party
  vows                = require("vows");
  assert              = require("assert");
  _                   = require("underscore");
  io                  = require("socket.io-client");
  request             = require("request");
  program             = require("commander");
  require("tinycolor"); /*tinycolor*/
  Backbone = require("backbone");
  require("backbone-relational");

  DOCUMENT_HOSTNAME = "";
  // setup the framework to use only what we need...
  X.setup({
    autoStart: true,
    debugging: true,
    requireCache: true,
    cache: {
      session: {

        // special note, because this test suite bypasses
        // the authentication system you should NOT use this
        // with any production setup, instead run mongo locally
        hostname: "localhost",
        port: 27017,
        schemaDirectory: "./lib/node-schemas/session",
        database: "xtdb"
      },
      user: {
        hostname: "localhost",
        port: 27017,
        schemaDirectory: "./lib/node-schemas/users",
        database: "xtusers"
      }
    }
  });

  // taken from node-datasource code...
  md5hash = function (){return X.crypto.createHash('md5')};
  generateSID = function () {return md5hash().update(Math.random().toString()).digest('hex')};
  timestamp = function () {return new Date().getTime()};

  X.md5hash = md5hash;
  X.generateSID = generateSID;
  X.timestamp = timestamp;

}());

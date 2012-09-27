(function () {

  // we are going to rely on the node-xt framework for access
  // to certain tools and convenience mechanisms
  require("xt");

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
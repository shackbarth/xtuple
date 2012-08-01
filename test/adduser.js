#!/usr/bin/env node

require("xt");

var _fs = XT.fs, _path = XT.path;

XT.debugging = true;

XT.setup({
  autoStart: true,
  requireCache: true,
  cache: {
    user: {
      hostname: "localhost",
      port: 27017,
      schemaDirectory: "../mongo_schemas/users",
      database: "xtusers"
    }
  },
  setupCache: function () {
    XT.run(function () {
      XT.userCache = XT.Cache.create({prefix: "user"});
    });
  },
  auth: {
    // SPECIAL NOTE - THE SALT FILE IS NOT INCLUDED
    // IN THE REPO AND NOT JUST ANY SALT WILL DO...
    saltFile: "../salt.txt",
    adminFile: "./admin.txt"
  }
});

(function () {
  var K = XT.userCache.model("User"), salt, crypt, adminPassword;
  
  salt = _fs.readFileSync(_path.join(XT.basePath, XT.options.auth.saltFile), "utf8").trim();
  adminPassword = _fs.readFileSync(_path.join(XT.basePath, XT.options.auth.adminFile), "utf8").trim();
  
  crypt = function (password) {
    var md5 = XT.crypto.createHash('md5');
    md5.update(salt + password);
    return md5.digest('hex');
  };

  function createAdmin() {
    var k = new K({
      id: "admin@xtuple.com",
      password: crypt(adminPassword)
    });
    k.organizations.push({name: "production"});
    // testing
    k.organizations.push({name: "40beta"});
    k.save(function () { XT.debug("ok, created admin"); });
  }
  
  K.findOne({id:"admin"}, function (err, res) {
    if (err || !res) return createAdmin();
  });
}());

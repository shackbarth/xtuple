#!/usr/bin/env node

/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, Backbone:true, _:true, XM:true, XT:true*/
var _ = require('underscore'),
  async = require('async'),
  exec = require('child_process').exec,
  fs = require('fs'),
  path = require('path'),
  rimraf = require('rimraf');

  // critical
  // TODO: get rid of xtuple-extensions/scripts/buildExtensions
  // TODO: keep a copy of the scripts in case multiple databases want to use them

  // noncritical
  // TODO: you need to sudo to save these files, but with sudo I have to type the admin password.

(function () {
  "use strict";

  var enyoBuild = function (extPath, callback) {
    // regex: remove trailing slash
    var extName = path.basename(extPath).replace(/\/$/, ""), // the name of the extension
      jsFilename = extName + ".js";

    // create the package file for enyo to use
    var rootPackageContents = 'enyo.depends("' + extPath + '/client");';
    fs.writeFile(path.join(__dirname, "package.js"), rootPackageContents, function (err) {
      if (err) {
        callback(err);
        return;
      }
      // run the enyo deployment method asyncronously
      var rootDir = path.join(extPath, "../..");
      // we run the command from /scripts/lib, so that is where build directories and other
      // temp files are going to go.
      console.log("building " + extName);
      exec(path.join(rootDir, "/tools/deploy.sh"),
        {
          maxBuffer: 40000 * 1024, /* 200x default */
          cwd: __dirname
        },
        function (err, stdout) {
          if (err) {
            callback(err);
            return;
          }
          // rename the file with the name of the extension so that we won't need to recreate it
          // in the case of multiple databases wanting the same client code
          fs.rename(path.join(__dirname, "build/app.js"), path.join(__dirname, "build", jsFilename), function (err) {
            callback(err);
          });
        }
      );
    });
  };

  var constructQuery = function (contents, extension, version, language) {
    // TODO: sqli guard, not that we distrust the payload
    return "select xt.insert_client($$" + contents +
      "$$, '" + extension +
      "', '" + version +
      "', '" + language + "');";
  };


  // TODO: version 1.0.0 must be a real number
  exports.getClientSql = function (extPath, callback) {
    var extName;

    if (extPath.indexOf("/lib/orm") >= 0) {
      // this is lib/orm. There is nothing here to install on the client.
      callback(null, "");
      return;

    } else if (extPath.indexOf("extensions") < 0) {
      // this is the core app, which has a different deploy process.
      fs.readFile(path.join(__dirname, "build/core.js"), "utf8", function (err, jsCode) {
        if (err) {
          callback(err);
          return;
        }
        fs.readFile(path.join(__dirname, "build/core.css"), "utf8", function (err, cssCode) {
          if (err) {
            callback(err);
            return;
          }
          callback(null, constructQuery(cssCode, "_core", "1.0.0", "css") +
            constructQuery(jsCode, "_core", "1.0.0", "js"));
        });
      });


    } else {
      extName = path.basename(extPath).replace(/\/$/, ""); // the name of the extension
      fs.readFile(path.join(__dirname, "build", extName + ".js"), "utf8", function (err, code) {
        if (err) {
          callback(err);
          return;
        }
        callback(null, constructQuery(code, extName, "1.0.0", "js"));
      });

    }
  };

  var buildExtension = function (extPath, callback) {
    if (extPath.indexOf("/lib/orm") >= 0) {
      // this is lib/orm. There is nothing here to install on the client.
      callback();
      return;
    }


    if (extPath.indexOf("extensions") < 0) {
      // this is the core app, which has a different deploy process.
      console.log("building client core");
      exec(path.join(__dirname, "../../enyo-client/application/tools/deploy.sh"), function (err, stdout) {
        if (err) {
          callback(err);
          return;
        }
        fs.readdir(path.join(__dirname, "../../enyo-client/application/build"), function (err, files) {
          var readFile;
          if (err) {
            callback(err);
            return;
          }
          readFile = function (filename, callback) {
            var callbackAdaptor = function (err, contents) {
              callback(err, {name: filename, contents: contents});
            };
            filename = path.join(__dirname, "../../enyo-client/application/build", filename);
            fs.readFile(filename, "utf8", callbackAdaptor);
          };
          async.map(files, readFile, function (err, results) {
            var cssResults = _.filter(results, function (result) {
                return path.extname(result.name) === ".css";
              }),
              sortedCssResults = _.sortBy(cssResults, function (result) {
                return path.basename(result.name) === "app.css";
              }),
              cssString = _.reduce(sortedCssResults, function (memo, result) {
                return memo + result.contents;
              }, ""),
              jsResults = _.filter(results, function (result) {
                return path.extname(result.name) === ".js";
              }),
              sortedJsResults = _.sortBy(jsResults, function (result) {
                return path.basename(result.name) === "app.js";
              }),
              jsString = _.reduce(sortedJsResults, function (memo, result) {
                return memo + result.contents;
              }, "");

            fs.writeFile(path.join(__dirname, "build/core.js"), jsString, function (err) {
              if (err) {
                console.log("couldn't write core.js");
                callback(err);
                return;
              }

              fs.writeFile(path.join(__dirname, "build/core.css"), cssString, function (err) {
                if (err) {
                  callback(err);
                  return;
                }
                callback();
              });
            });
          });
        });
      });
      return;
    }

    var rootDir = path.join(extPath, "../..");

    //
    //Symlink the enyo directories if they're not there
    //
    // TODO async
    if (!fs.existsSync(path.join(rootDir, 'enyo'))) {
      console.log("symlinking", path.join(rootDir, 'enyo'));
      fs.symlinkSync(path.join(__dirname, "../../enyo-client/application/enyo"), path.join(rootDir, 'enyo'));
    }

    enyoBuild(extPath, callback);
  };

  //
  // Define cleanup function
  //
  exports.cleanup = function (specs, callback) {
    // these are the unique extension root directories
    var rootDirs = _.unique(_.compact(_.flatten(_.map(specs, function (spec) {
      return _.map(spec.extensions, function (extension) {
        return extension.indexOf("extensions") >= 0 ? path.join(extension, "../..") : null;
      });
    }))));

    var unlinkEnyo = function (rootDir, callback) {
      var enyoDir = path.join(rootDir, "enyo");
      fs.exists(enyoDir, function (exists) {
        if (exists) {
          fs.unlink(enyoDir, function (err) {
            if (err) {
              callback(err);
              return;
            }
            callback();
          });
        } else {
          // no symlink = no need to remove it
          callback();
        }
      });
    };
    async.map(rootDirs, unlinkEnyo, function (err, res) {
      if (err) {
        callback(err);
        return;
      }
      fs.unlink(path.join(__dirname, "package.js"), function (err) {
        if (err) {
          callback(err);
          return;
        }
        rimraf(path.join(__dirname, "build"), function (err) {
          if (err) {
            callback(err);
            return;
          }
          rimraf(path.join(__dirname, "deploy"), function (err) {
            callback(err);
          });
        });
      });
    });
  };

  /**
    Build all the client code we know we're going to need.
    Leave it sitting in the scripts/lib/build directory.
  */
  exports.buildClient = function (specs, callback) {
    // these are the unique extensions
    var extDirs = _.unique(_.flatten(_.map(specs, function (spec) {
      return spec.extensions;
    })));
    // start by making the build directory, where all our built clientside code will go
    fs.mkdir(path.join(__dirname, "build"), function (err, res) {
      if (err) {
        callback(err);
        return;
      }
      async.mapSeries(extDirs, buildExtension, function (err, res) {
        callback(err, res);
      });
    });
  };

}());

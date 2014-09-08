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

(function () {
  "use strict";

  /**
    Get the sql to insert client-side code into the database. Presupposes that
    the client code has already been built, and is in the build directory,
    with the filename as the extension name.
   */
  exports.getClientSql = function (extPath, callback) {
    var extName,
      constructQuery = function (contents, extension, version, language) {
        if (!contents || contents === "undefined") {
          return "";
        }
        return "select xt.js_init();select xt.insert_client($$" + contents +
          "$$, '" + extension +
          "', '" + version +
          "', '" + language + "');";
      };

    if (extPath.indexOf("/lib/orm") >= 0 || extPath.indexOf("foundation-database") >= 0) {
      // There is nothing here to install on the client.
      callback(null, "");
      return;

    } else if (extPath.indexOf("extensions") < 0 && extPath.indexOf("node_modules") < 0) {
      // this is the core app, which has a slightly different process.
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
          fs.readFile(path.join(__dirname, "../../package.json"), "utf8", function (err, packageJson) {
            if (err) {
              callback(err);
              return;
            }
            var packageDetails = JSON.parse(packageJson);
            callback(null, constructQuery(cssCode, "_core", packageDetails.version, "css") +
              constructQuery(jsCode, "_core", packageDetails.version, "js"));
          });
        });
      });

    } else {
      extName = path.basename(extPath).replace(/\/$/, ""); // the name of the extension
      fs.readFile(path.join(__dirname, "build", extName + ".js"), "utf8", function (err, jsCode) {
        if (err) {
          if (err.code === 'ENOENT') {
            // it's not necessarily an error if there's no code here.
            console.log("No built client file for " + extName + ". There is probably no client-side code in the extension.");
            callback(null, "");
            return;
          }
          callback(err);
          return;
        }
        fs.readFile(path.join(__dirname, "build", extName + ".css"), "utf8", function (err, cssCode) {
          var version;
          if (fs.existsSync(path.resolve(extPath, "package.json"))) {
            version = require(path.resolve(extPath, "package.json")).version;
          } else {
            version = JSON.parse(fs.readFileSync(path.resolve(extPath, "database/source/manifest.js"))).version;
          }
          if (!version) {
            // if the extensions don't declare their version, default to the package version
            version = require(path.resolve(__dirname, "../../package.json")).version;
          }
          callback(null, constructQuery(cssCode, extName, version, "css") +
            constructQuery(jsCode, extName, version, "js"));
        });
      });
    }
  };

  /**
    Builds an extension (as opposed to the core). Saves it by extension name in the builds folder.
   */
  var buildExtension = function (extPath, callback) {
    // regex: remove trailing slash
    var extName = path.basename(extPath).replace(/\/$/, ""), // the name of the extension
      cssFilename = extName + ".css",
      jsFilename = extName + ".js";

    // create the package file for enyo to use
    var rootPackageContents = 'enyo.depends("' + extPath + '/client");';
    fs.writeFile(path.join(__dirname, "package.js"), rootPackageContents, function (err) {
      if (err) {
        callback(err);
        return;
      }
      // run the enyo deployment method asyncronously
      var rootDir = path.join(extPath, extPath.indexOf("node_modules") >= 0 ? "../../enyo-client/extensions/" : "../..");
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
          fs.renameSync(path.join(__dirname, "build/app.js"), path.join(__dirname, "build", jsFilename));
          if (fs.existsSync(path.join(__dirname, "build/app.css"))) {
            fs.renameSync(path.join(__dirname, "build/app.css"), path.join(__dirname, "build", cssFilename));
          }
          callback();
        }
      );
    });
  };

  /**
    Builds the core. Saves it as core.js and core.css in the builds folder. Core is enyo + app smooshed together.
   */
  var buildCore = function (callback) {
    console.log("building client core");
    exec(path.join(__dirname, "../../enyo-client/application/tools/deploy.sh"),
    {
      maxBuffer: 40000 * 1024 /* 200x default */
    },
    function (err, stdout) {
      if (err) {
        callback(err);
        return;
      }
      fs.readdir(path.join(__dirname, "../../enyo-client/application/build"), function (err, files) {
        var readFile;
        if (err) {
          callback("Error: cannot find 'enyo-client/application/build'. Ensure that the " +
            "git submodules are up to date." + err);
          return;
        } else if (files.length < 4) {
          callback("Error: was not able to build all core files. Built files are: " +
            JSON.stringify(files) +
            ". Try running the enyo deploy by itself in enyo-client/application/tools " +
            "and if that fails there's probably a problem in your package files.");
        }
        readFile = function (filename, callback) {
          var callbackAdaptor = function (err, contents) {
            callback(err, {name: filename, contents: contents});
          };
          filename = path.join(__dirname, "../../enyo-client/application/build", filename);
          fs.readFile(filename, "utf8", callbackAdaptor);
        };
        async.map(files, readFile, function (err, results) {
          // smash together enyo css and app css into core css
          var cssResults = _.filter(results, function (result) {
              return path.extname(result.name) === ".css";
            }),
            sortedCssResults = _.sortBy(cssResults, function (result) {
              return path.basename(result.name) === "app.css";
            }),
            cssString = _.reduce(sortedCssResults, function (memo, result) {
              return memo + result.contents;
            }, ""),
            // smash together enyo js and app js into core js
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
  };

  var build = function (extPath, callback) {
    var isNodeModule = extPath.indexOf("node_modules") >= 0;

    if (extPath.indexOf("/lib/orm") >= 0 || extPath.indexOf("foundation-database") >= 0) {
      // There is nothing here to install on the client.
      callback();
      return;
    }

    if (extPath.indexOf("extensions") < 0 && !isNodeModule) {
      // this is the core app, which has a different deploy process.
      buildCore(callback);
      return;
    }

    var enyoDir = path.join(extPath, isNodeModule ? "../../enyo-client/extensions/enyo" : "../../enyo");
    fs.exists(path.join(extPath, "client"), function (exists) {
      if (!exists) {
        console.log(extPath + " has no client code. Not trying to build it.");
        callback();
        return;
      }
      //
      //Symlink the enyo directories if they're not there
      //
      fs.exists(enyoDir, function (exists) {
        if (!exists) {
          fs.symlink(path.join(__dirname, "../../enyo-client/application/enyo"), enyoDir, function (err) {
            if (err) {
              callback(err);
              return;
            }
            buildExtension(extPath, callback);
          });
        } else {
          buildExtension(extPath, callback);
        }
      });
    });
  };

  //
  // Cleanup by deleting all the client files we've built
  //
  exports.cleanup = function (specs, callback) {
    if (specs[0].databaseOnly) {
      // actually, don't clean up
      callback();
      return;
    }
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
      var buildDirs = [
        path.join(__dirname, "package.js"),
        path.join(__dirname, "build"),
        path.join(__dirname, "deploy"),
        path.join(__dirname, "../../enyo-client/application/build"),
        path.join(__dirname, "../../enyo-client/application/deploy"),
        path.join(__dirname, "../../enyo-client/extensions/build"),
        path.join(__dirname, "../../enyo-client/extensions/builds"),
        path.join(__dirname, "../../enyo-client/extensions/deploy")
      ];
      async.map(buildDirs, rimraf, callback);
    });
  };

  /**
    Build all the client code we know we're going to need.
    Leave it sitting in the scripts/lib/build directory.
  */
  exports.buildClient = function (specs, callback) {
    if (specs[0].databaseOnly) {
      // actually, don't build the client!
      callback();
      return;
    }
    // these are the unique extensions
    var extDirs = _.unique(_.flatten(_.map(specs, function (spec) {
      return spec.extensions;
    })));
    // start by clearing/making the build directory, where all our built clientside code will go
    rimraf(path.join(__dirname, "build"), function (err) {
      fs.mkdir(path.join(__dirname, "build"), function (err, res) {
        if (err) {
          callback(err);
          return;
        }
        async.mapSeries(extDirs, build, function (err, res) {
          callback(err, res);
        });
      });
    });
  };

}());

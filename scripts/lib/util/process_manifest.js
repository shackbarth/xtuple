/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global _:true */

(function () {
  "use strict";

  var _ = require('underscore'),
    async = require('async'),
    exec = require('child_process').exec,
    fs = require('fs'),
    path = require('path'),
    conversionMap = require("./convert_specialized").conversionMap,
    dataSource = require('../../../node-datasource/lib/ext/datasource').dataSource,
    inspectDatabaseExtensions = require("./inspect_database").inspectDatabaseExtensions;

  // register extension and dependencies
  var getRegistrationSql = function (options, extensionLocation) {
    var registerSql = 'do $$ plv8.elog(NOTICE, "About to register extension ' +
      options.name + '"); $$ language plv8;\n';

    registerSql = registerSql + "select xt.register_extension('%@', '%@', '%@', '', %@);\n"
      .f(options.name, options.description || options.comment, extensionLocation, options.loadOrder || 9999);

    registerSql = registerSql + "select xt.grant_role_ext('ADMIN', '%@');\n"
      .f(options.name);

    // TODO: infer dependencies from package.json using peerDependencies
    var dependencies = options.dependencies || [];
    _.each(dependencies, function (dependency) {
      var dependencySql = "select xt.register_extension_dependency('%@', '%@');\n"
          .f(options.name, dependency),
        grantDependToAdmin = "select xt.grant_role_ext('ADMIN', '%@');\n"
          .f(dependency);

      registerSql = registerSql + dependencySql + grantDependToAdmin;
    });
    return registerSql;
  };

  var composeExtensionSql = function (scriptSql, packageFile, options, callback) {
    // each String of the scriptContents is the concatenated SQL for the script.
    // join these all together into a single string for the whole extension.
    var extensionSql = _.reduce(scriptSql, function (memo, script) {
      return memo + script;
    }, "");

    if (options.registerExtension) {
      extensionSql = getRegistrationSql(packageFile, options.extensionLocation) +
        extensionSql;
    }
    if (options.runJsInit) {
      // unless it it hasn't yet been defined (ie. lib/orm),
      // running xt.js_init() is probably a good idea.
      extensionSql = "select xt.js_init();" + extensionSql;
    }

    if (options.wipeViews) {
      // If we want to pre-emptively wipe out the views, the best place to do it
      // is at the start of the core application code
      fs.readFile(path.join(__dirname, "../../../enyo-client/database/source/wipe_views.sql"),
          function (err, wipeSql) {
        if (err) {
          callback(err);
          return;
        }
        extensionSql = wipeSql + extensionSql;
        callback(null, extensionSql);
      });

    } else if (options.wipeOrms) {
      // If we want to pre-emptively wipe out the views, the best place to do it
      // is at the start of the core application code
      fs.readFile(path.join(__dirname, "../../../enyo-client/database/source/delete_system_orms.sql"),
          function (err, wipeSql) {
        if (err) {
          callback(err);
          return;
        }
        extensionSql = wipeSql + extensionSql;
        callback(null, extensionSql);
      });
    } else {
      callback(null, extensionSql);
    }
  };

  var explodeManifest = function (options, manifestCallback) {
    var manifestFilename = options.manifestFilename;
    var packageJson;
    var dbSourceRoot = path.dirname(manifestFilename);

    if (options.extensionPath && fs.existsSync(path.resolve(options.extensionPath, "package.json"))) {
      packageJson = require(path.resolve(options.extensionPath, "package.json"));
    }
    //
    // Step 2:
    // Read the manifest files.
    //

    if (!fs.existsSync(manifestFilename) && packageJson) {
      console.log("No manifest file " + manifestFilename + ". There is probably no db-side code in the extension.");
      composeExtensionSql([], packageJson, options, manifestCallback);
      return;

    } else if (!fs.existsSync(manifestFilename)) {
      // error condition: no manifest file
      manifestCallback("Cannot find manifest " + manifestFilename);
      return;
    }
    fs.readFile(manifestFilename, "utf8", function (err, manifestString) {
      var manifest,
        databaseScripts,
        extraManifestPath,
        defaultSchema,
        extraManifest,
        extraManifestScripts,
        alterPaths = dbSourceRoot.indexOf("foundation-database") < 0;

      try {
        manifest = JSON.parse(manifestString);
        databaseScripts = manifest.databaseScripts;
        defaultSchema = manifest.defaultSchema;

      } catch (error) {
        // error condition: manifest file is not properly formatted
        manifestCallback("Manifest is not valid JSON" + manifestFilename);
        return;
      }

      //
      // Step 2b:
      //

      // supported use cases:

      // 1. add mobilized inventory to quickbooks
      // need the frozen_manifest, the foundation/manifest, and the mobile manifest
      // -e ../private-extensions/source/inventory -f
      // useFrozenScripts, useFoundationScripts

      // 2. add mobilized inventory to masterref (foundation inventory is already there)
      // need the the foundation/manifest and the mobile manifest
      // -e ../private-extensions/source/inventory
      // useFoundationScripts

      // 3. add unmobilized inventory to quickbooks
      // need the frozen_manifest and the foundation/manifest
      // -e ../private-extensions/source/inventory/foundation-database -f
      // useFrozenScripts (useFoundationScripts already taken care of by -e path)

      // 4. upgrade unmobilized inventory
      // not sure if this is necessary, but it would look like
      // -e ../private-extensions/source/inventory/foundation-database

      if (options.useFoundationScripts) {
        extraManifest = JSON.parse(fs.readFileSync(path.join(dbSourceRoot, "../../foundation-database/manifest.js")));
        defaultSchema = defaultSchema || extraManifest.defaultSchema;
        extraManifestScripts = extraManifest.databaseScripts;
        extraManifestScripts = _.map(extraManifestScripts, function (path) {
          return "../../foundation-database/" + path;
        });
        databaseScripts.unshift(extraManifestScripts);
        databaseScripts = _.flatten(databaseScripts);
      }
      if (options.useFrozenScripts) {
        // Frozen files are not idempotent and should only be run upon first registration
        extraManifestPath = alterPaths ?
         path.join(dbSourceRoot, "../../foundation-database/frozen_manifest.js") :
         path.join(dbSourceRoot, "frozen_manifest.js");

        extraManifest = JSON.parse(fs.readFileSync(extraManifestPath));
        defaultSchema = defaultSchema || extraManifest.defaultSchema;
        extraManifestScripts = extraManifest.databaseScripts;
        if (alterPaths) {
          extraManifestScripts = _.map(extraManifestScripts, function (path) {
            return "../../foundation-database/" + path;
          });
        }
        databaseScripts.unshift(extraManifestScripts);
        databaseScripts = _.flatten(databaseScripts);
      }

      //
      // Step 3:
      // Concatenate together all the files referenced in the manifest.
      //
      var getScriptSql = function (filename, scriptCallback) {
        var fullFilename = path.join(dbSourceRoot, filename);
        if (!fs.existsSync(fullFilename)) {
          // error condition: script referenced in manifest.js isn't there
          scriptCallback(path.join(dbSourceRoot, filename) + " does not exist");
          return;
        }
        fs.readFile(fullFilename, "utf8", function (err, scriptContents) {
          // error condition: can't read script
          if (err) {
            scriptCallback(err);
            return;
          }
          var beforeNoticeSql = "do $$ BEGIN RAISE NOTICE 'Loading file " + path.basename(fullFilename) +
              "'; END $$ language plpgsql;\n",
            extname = path.extname(fullFilename).substring(1);

          // convert special files: metasql, uiforms, reports, uijs
          scriptContents = conversionMap[extname](scriptContents, fullFilename, defaultSchema);

          //
          // Incorrectly-ended sql files (i.e. no semicolon) make for unhelpful error messages
          // when we concatenate 100's of them together. Guard against these.
          //
          scriptContents = scriptContents.trim();
          if (scriptContents.charAt(scriptContents.length - 1) !== ';') {
            // error condition: script is improperly formatted
            scriptCallback("Error: " + fullFilename + " contents do not end in a semicolon.");
          }

          scriptCallback(null, '\n' + scriptContents);
        });
      };
      async.mapSeries(databaseScripts || [], getScriptSql, function (err, scriptSql) {
        var registerSql,
          dependencies;

        if (err) {
          manifestCallback(err);
          return;
        }

        composeExtensionSql(scriptSql, packageJson || manifest, options, manifestCallback);

      });
      //
      // End script installation code
      //
    });
  };

  exports.explodeManifest = explodeManifest;
}());

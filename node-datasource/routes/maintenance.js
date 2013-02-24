/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true XM:true, _:true */

(function () {
  "use strict";

  var exec = require('child_process').exec,
    path = require('path'),
    ormInstaller = require('../installer/orm');

  /**
    Pushes the results from the exec calls into the resp object, which will be sent back to
    the client.
   */
  var logAll = function (respObject, stdout, stderr, error) {
    if (X.options.datasource.verboseMaintenanceLogging) {
      X.log(stdout);
    }
    respObject.log.push(stdout);
    //if (stderr) {
    // was too verbose
    //  respObject.errorLog.push(stderr);
    //}
    if (error !== null) {
      respObject.isError = true;
      respObject.errorLog.push("Execution error: " + error);
    }
  };

  /**
   * The ORM installer commands need to be run sequentially. We create an array of the commands that
   * we have to run and then use recursion to do them one at a time here.
   */
  var runOrmCommands = function (ormArray, respObject, orgCallback) {
    var ormCommand,
      ormCallback;

    // exit strategy
    if (ormArray.length === 0) {
      orgCallback(respObject);
      return;
    }

    ormCommand = ormArray.shift();
    ormCallback = function (error, stdout) {
      // log any relevant information from the orm exec call
      X.log("ORM command returned. " + ormArray.length + " left");
      logAll(respObject, stdout, null, error);

      // recurse down an ever-shortening array
      runOrmCommands(ormArray, respObject, orgCallback);
    };

    X.log("Running ORM command: ", ormCommand);
    respObject.commandLog.push("Installing orms: " + ormCommand.ormDir);
    ormInstaller.run(ormCommand.ormCreds, ormCommand.ormDir, ormCallback);
  };

  var runPsqlCommands = function (psqlArray, ormArray, respObject, orgCallback) {
    var psqlCommand,
      psqlCallback;

    // exit strategy: work thrpugh the orm array
    if (psqlArray.length === 0) {
      runOrmCommands(ormArray, respObject, orgCallback);
      return;
    }

    psqlCommand = psqlArray.shift();
    psqlCallback = function (error, stdout, stderr) {
      // log any relevant information from the orm exec call
      X.log("psql command returned. " + psqlArray.length + " left");
      logAll(respObject, stdout, stderr, error);

      // recurse down an ever-shortening array
      runPsqlCommands(psqlArray, ormArray, respObject, orgCallback);
    };

    X.log("Running psql command: ", psqlCommand);
    respObject.commandLog.push("Running pqsl command: " + psqlCommand);
    exec(psqlCommand, psqlCallback);
  };

  var addLock = function (org) {
    var now = new Date().getTime(),
      timeoutInMinutes = 5,
      expires = now + 1000 * 60 * timeoutInMinutes,
      lockConflicts;

    org = org || "_all"; // the org is blank for all-org maintenance requests
    // let's hope we never have a database named "_all"

    // the keys of the maintenanceLocks object are org names (or _all), and
    // the values are the expiration time in milliseconds.
    X.maintenanceLocks = X.maintenanceLocks || {};

    lockConflicts = _.map(X.maintenanceLocks, function (value, key) {
      // if the orgs are the same (note that _all hits every org)
      // and the expiration has not passed, then there's a lock conflict
      return (key === org || key === '_all' || org === '_all') && value > now;
    });

    if (_.indexOf(lockConflicts, true) >= 0) {
      // there is a lock conflict. Do not allow this maintenance to happen
      return false;
    }

    // no lock conflict. Add a lock.
    X.maintenanceLocks[org] = expires;
    return true;
  };


  var releaseLock = function (org) {
    org = org || "_all"; // the org is blank for all-org maintenance requests
    delete X.maintenanceLocks[org];
  };


  /**
    This is the function that does all the work. It can be run after a successful
    session load, or through the localhost backdoor.
   */
  var install = function (res, args, username) {

    if (!addLock(args.organization)) {
      res.send({data:{isError: true, message: "Maintenance already underway."}});
      return;
    }


    var respObject = {commandLog: [], log: [], errorLog: []},
      // TODO: run each organization's commands in parallel
      psqlArray = [],
      ormArray = [],
      orgCallback = function (respObj) {
        X.log("Maintenance is complete", JSON.stringify(respObj.commandLog));
        releaseLock(args.organization);
        res.send(JSON.stringify({data: respObj}));
      },
      organizationColl = new XM.OrganizationCollection(),
      //
      // practically all the code is in the success callback of the initial fetch
      // on the organization collection
      //
      fetchSuccess = function (collection, response) {
        _.each(collection.models, function (org) {
          var scriptName = "init_script.sql",
            host = org.get("databaseServer").get("hostname"),
            port = org.get("databaseServer").get("port"),
            pgUser = org.get("databaseServer").get("user"),
            pgPassword = org.get("databaseServer").get("password"),
            psqlPath = X.options.datasource.psqlPath || "psql",
            orgName = org.get("name"),
            flags = " -U " + pgUser + " -h " + host + " -p " + port + " -d " + orgName,
            psqlCommand = psqlPath + flags + " -f " + scriptName,
            ormCreds = {
              hostname: host,
              organization: orgName,
              username: pgUser,
              port: port,
              password: pgPassword
            },
            group = org.get("group"),
            initInstanceDbDirectory = X.options.datasource.initInstanceDbDirectory || "./scripts",
            initInstanceDbCommand = "initInstanceDb.sh " + flags + " -g " + group + " -t " + args.initialize,
            corePsqlCommand = psqlPath + flags + " -f init_instance.sql",
            coreScriptDir = '../enyo-client/database/source',
            coreOrmDir = '../enyo-client/database/orm';

          X.log("Running scripts for organization: ", orgName);

          if (args.initialize) {
            // this is a brand-new instance database. First run the instance db
            // initialization script

            // guard against something terrible that shouldn't be possible in the UI.
            // intialization should only happen to one DB at a time.
            if (!args.organization) {
              releaseLock(); // args.organization is falsy so no reason to pass it
              res.send({data:{isError: true, message: "Initialize every instance DB. Are you crazy?"}});
              return;
            }
            X.log("Initializing organization: ", orgName);

            psqlArray.push({
              command: "%@/%@".f(initInstanceDbDirectory, initInstanceDbCommand),
              loadOrder: -9999
            });
          }

          if (args.initialize || args.core) {
            // the user wants us to run the core init script and install the core orms as well
            // might as well do this for newly initialized dbs as well
            X.log("Processing core: ", orgName);
            psqlArray.push({command: "(cd %@ && exec %@)".f(coreScriptDir, corePsqlCommand), loadOrder: -9990});
            ormArray.push({ormCreds: ormCreds, ormDir: coreOrmDir, loadOrder: -9990});
          }

          _.each(org.get("extensions").models, function (ext) {
            //
            // go through all of the extensions of all the organizations...
            //
            if (args.extensions && JSON.parse(args.extensions).indexOf(ext.get("extension").id) < 0) {
              // if the user has specified that only some extensions are to be loaded,
              // then we stop here if this extension at hand is not on that list
              return;
            }

            var extLoc = ext.get("extension").get("location");
            if (extLoc === '/public-extensions') {
              // reverse-compatibility requires us to honor the path '/public-extensions'
              // even if that's not the actual path anymore.
              extLoc = '/enyo-client/extensions';
            } else if (extLoc === '/private-extensions') {
              // likewise with /private-extensions
              extLoc = '/../private-extensions';
            }

            var extName = ext.get("extension").get("name"),
              extLoadOrder = ext.get("extension").get("loadOrder"),
              scriptDir = ".." + extLoc + "/source/" + extName + "/database/source",
              execCommand = "(cd %@ && exec %@)".f(scriptDir, psqlCommand),
              ormDir = ".." + extLoc + "/source/" + extName + "/database/orm";

            X.log("Processing extension: %@ %@ ".f(orgName, extName));

            //
            // Within each organization, we have to run each psql command
            // sequentially, and then we need to run all the orm scripts
            // sequentially. We do this by pushing them to arrays here,
            // and then recursing down the arrays once they've been built
            //

            //
            // Build psql command array
            //
            psqlArray.push({command: execCommand, loadOrder: extLoadOrder});

            //
            // Build orm command array
            //
            // XXX use fs.existsSync in node 0.8 instead of path.existsSync
            if (path.existsSync(ormDir)) {
              ormArray.push({ormCreds: ormCreds, ormDir: ormDir, loadOrder: extLoadOrder});
            }
          });


        }); // end loop of organizations

        //
        // We've gotten all of the commands into arrays. First sort them by
        // the appropriate load order, then run through them all.
        //
        psqlArray = _.sortBy(psqlArray, function (obj) {
          return obj.loadOrder;
        });
        // don't need the load order anymore
        psqlArray = _.map(psqlArray, function (obj) {
          return obj.command;
        });
        ormArray = _.sortBy(ormArray, function (obj) {
          return obj.loadOrder;
        });
        runPsqlCommands(psqlArray, ormArray, respObject, orgCallback);
      },
      fetchError = function (model, error) {
        respObject.isError = true;
        respObject.message = "Error while fetching organizations";
        releaseLock(args.organization);
        res.send({data: respObject});
      },
      options,
      query = {
        parameters: [{
          attribute: "isActive",
          value: true
        }]
      };

    // allow the user to single out a particular organization
    // for updating if they want.
    if (args.organization) {
      query.parameters.push({
        attribute: "name",
        value: args.organization
      });
    }

    options = {
      success: fetchSuccess,
      error: fetchError,
      query: query,
      username: username
    };

    // Ok, NOW we've finally finished setting up all our callbacks. So now there's only one thing left
    // to do, is actually make the call.
    organizationColl.fetch(options);

  };


  /**
    Runs extension init scripts and installs extension orms
    for organizations with the extensions activated. Saves
    a bunch of manual script running whenever an extension
    is updated or when an organization adds a new extension.

    @extends X.Route
    @class
   */
  var maintenance = function (req, res) {
    var host = req.headers.host,
      args = req.query;

    if (host === "localhost:442") {
      // users accessing this route through the unexposed server don't have to
      // get authenticated. Do the fetch under the node user authority.
      install(res, args, X.options.globalDatabase.nodeUsername);
      return;
    }

    //
    // If they're not coming in through localhost, make sure the global user
    // requesting this route has MaintainOrganizations privileges
    //
    // XXX not sure if the word Maintain Organizations should be hardcoded
    if (_.indexOf(req.session.passport.user.globalPrivileges, "MaintainOrganizations") < 0) {
      res.send({isError: true, message: "You don't have the privileges to do this"});
      return;
    }

    // access through the main server uses the logged in user's authority
    install(res, args, req.session.passport.user.id);
  };

  exports.maintenance = maintenance;
}());


/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true XM:true, _:true */

(function () {
  "use strict";

  var exec = require('child_process').exec,
    fs = require('fs'),
    ormInstaller = require('../installer/orm');

  /**
    Pushes the results from the exec calls into the resp object, which will be sent back to
    the client.
   */
  var logAll = function (respObject, stdout, stderr, error) {
    if (X.options.datasource.debugging) {
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
    The commands need to be run sequentially. We've already created an array of the
    commands that we have to run and then use recursion to do them one at a time here.

    Note that the psql commands and the orm commands are in the same array, so we
    have to figure out which kind of a command it is before we act on it.
   */
  var runCommands = function (commandArray, respObject, masterCallback) {
    var command,
      ormCallback,
      psqlCallback;

    // exit strategy
    if (commandArray.length === 0) {
      masterCallback(respObject);
      return;
    }

    // regard! our next command
    command = commandArray.shift();

    //
    // ... but what kind of command is it?
    //

    if (command.ormCreds) {
      // this command is an ORM command
      ormCallback = function (error, stdout) {
        // log any relevant information from the orm exec call
        X.log("ORM command returned. " + commandArray.length + " left");
        logAll(respObject, stdout, null, error);

        // recurse down an ever-shortening array
        runCommands(commandArray, respObject, masterCallback);
      };

      X.log("Running ORM command: ", command);
      respObject.commandLog.push("Installing orms on " + command.orgName + ": " + command.ormDir);
      ormInstaller.run(command.ormCreds, command.ormDir, ormCallback);


    } else {
      // this command is a psql command
      psqlCallback = function (error, stdout, stderr) {
        // log any relevant information from the orm exec call
        X.log("command returned. " + commandArray.length + " left");
        logAll(respObject, stdout, stderr, error);

        // recurse down an ever-shortening array
        runCommands(commandArray, respObject, masterCallback);
      };

      X.log("Running command: ", command);
      respObject.commandLog.push("Running pqsl command: " + command.psqlCommand);
      exec(command.psqlCommand, psqlCallback);
    }
  };

  /**
    We keep track in memory of which installs are currently being run. This
    function checks the pre-existing locks and, if there are none, sets a lock
    and gives a go-ahead.

    @param {String} org The name of the organization that is being installed.
      Falsey if the request is to run all organzations.

    @returns {Boolean} true if you get the lock and can run, false if someone
      already has a lock and you should not run.
   */
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
      res.send({data: {isError: true, message: "Maintenance already underway."}});
      return;
    }


    var respObject = {commandLog: [], log: [], errorLog: []},
      commandArray = [],
      masterCallback = function (respObj) {
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
        _.each(response, function (org, index) {
          var scriptName = "init_script.sql",
            host = org.databaseServer.hostname,
            port = org.databaseServer.port,
            pgUser = org.databaseServer.user,
            pgPassword = org.databaseServer.password,
            psqlPath = X.options.datasource.psqlPath || "psql",
            psqlDir,
            orgName = org.name,
            flags = " -U " + pgUser + " -h " + host + " -p " + port + " -d " + orgName,
            psqlCommand = psqlPath + flags + " -f " + scriptName,
            ormCreds = {
              hostname: host,
              organization: orgName,
              username: pgUser,
              port: port,
              password: pgPassword
            },
            group = org.group,
            initInstanceDbDir = X.options.datasource.initInstanceDbDirectory || "./scripts",
            initInstanceDbCommand,
            xTupleDbDir,
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
              res.send({data: {isError: true, message: "Initialize every instance DB. Are you crazy?"}});
              return;
            }
            X.log("Initializing organization: ", orgName);
            // this is ugly. We have to pass the path to the pqsl commands to the script
            psqlDir = psqlPath === 'psql' ? "implicit" : psqlPath.substring(0, psqlPath.length - 4);
            xTupleDbDir = X.options.datasource.xTupleDbDir || "/usr/local/xtuple/databases";

            initInstanceDbCommand = "initInstanceDb.sh " +
              flags + " -g " + group +
              " -t " + args.initialize +
              " -r " + psqlDir +
              " -x " + xTupleDbDir;

            commandArray.push({
              psqlCommand: "(cd %@ && exec ./%@)".f(initInstanceDbDir, initInstanceDbCommand),
              orgName: orgName,
              loadOrder: -9999
            });
          }

          if (args.initialize || args.core) {
            // the user wants us to run the core init script and install the core orms as well
            // might as well do this for newly initialized dbs as well
            X.log("Processing core: ", orgName);
            commandArray.push({
              psqlCommand: "(cd %@ && exec %@)".f(coreScriptDir, corePsqlCommand),
              orgName: orgName,
              loadOrder: -9990
            });
            commandArray.push({
              ormCreds: ormCreds,
              ormDir: coreOrmDir,
              orgName: orgName,
              loadOrder: -9990
            });
          }

          _.each(org.extensions, function (ext) {
            //
            // go through all of the extensions of all the organizations...
            //
            if (args.extensions && JSON.parse(args.extensions).indexOf(ext.extension.id) < 0) {
              // if the user has specified that only some extensions are to be loaded,
              // then we stop here if this extension at hand is not on that list
              return;
            }

            var extLoc = ext.extension.location;
            if (extLoc === '/public-extensions') {
              // reverse-compatibility requires us to honor the path '/public-extensions'
              // even if that's not the actual path anymore.
              extLoc = '/enyo-client/extensions';
            } else if (extLoc === '/private-extensions') {
              // likewise with /private-extensions
              extLoc = '/../private-extensions';
            }

            var extName = ext.extension.name,
              extLoadOrder = ext.extension.loadOrder,
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
            commandArray.push({
              psqlCommand: execCommand,
              orgName: orgName,
              loadOrder: extLoadOrder
            });

            //
            // Build orm command array
            //
            if (fs.existsSync(ormDir)) {
              commandArray.push({
                ormCreds: ormCreds,
                ormDir: ormDir,
                orgName: orgName,
                loadOrder: extLoadOrder
              });
            }
          });


        }); // end loop of organizations

        //
        // We've gotten all of the commands into arrays. Note that both
        // the orm commands and the psql commands are housed in the same
        // array. An easy way to tell which command is which is to see
        // if the object has an ormCreds attribute.
        //
        // We want to sort the commands by three criteria:
        // -First sort them by organization. We want to run all the commands
        //   for an organization before we move on to the next
        // -Second sort by command type. We want to run all the psql commands
        //   before we run any of the orm commands (for that org)
        // -Third sort by the load order, which will put the extensions in the
        //  right order.
        //
        // We use a very sneaky trick to have our comparator consider each of
        // these fields in turn, which is to return an array.
        //
        commandArray = _.sortBy(commandArray, function (obj) {
          var isOrm = !!obj.ormCreds;
          return [obj.orgName, isOrm, obj.loadOrder];
        });
        runCommands(commandArray, respObject, masterCallback);
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
      // get authenticated. Do the fetch under the admin user authority.
      install(res, args, X.options.databaseServer.user);
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


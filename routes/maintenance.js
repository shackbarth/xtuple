/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true XM:true, _:true */

(function () {
  "use strict";

  var exec = require('child_process').exec,
    url = require("url"),
    querystring = require("querystring"),
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
    if (stderr) {
      respObject.errorLog.push(stderr);
    }
    if (error !== null) {
      respObject.status = "ERROR";
      respObject.errorCount++;
      respObject.errorLog.push("execution error: " + error);
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
      respObject.status = respObject.status || "SUCCESS";
      orgCallback(respObject);
      return;
    }

    ormCommand = ormArray.pop();
    ormCallback = function (error, stdout) {
      // log any relevant information from the orm exec call
      X.log("ORM command returned. " + ormArray.length + " left");
      logAll(respObject, stdout, null, error);

      // recurse down an ever-shortening array
      runOrmCommands(ormArray, respObject, orgCallback);
    };
    X.log("Running ORM command: ", ormCommand);

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

    psqlCommand = psqlArray.pop();
    psqlCallback = function (error, stdout, stderr) {
      // log any relevant information from the orm exec call
      X.log("psql command returned. " + psqlArray.length + " left");
      logAll(respObject, stdout, stderr, error);

      // recurse down an ever-shortening array
      runPsqlCommands(psqlArray, ormArray, respObject, orgCallback);
    };

    exec(psqlCommand, psqlCallback);
  };
  /**
    This is the function that does all the work. It can be run after a successful
    session load, or through the localhost backdoor.
   */
  var install = function (res, args, username) {
    var respObject = {commandLog: [], log: [], errorLog: [], errorCount: 0},
      organizationColl = new XM.OrganizationCollection(),
      //
      // practically all the code is in the success callback of the initial fetch
      // on the organization collection
      //
      fetchSuccess = function (collection, response) {
        _.each(collection.models, function (org) {
          // XXX We ensure that users have ViewOrganizations privileges. It would be better
          // to ensure that they also have MaintainOrganizations priviliges, but there
          // is no way to ensure this from the model layer because model.canUpdate() refers
          // to the node authority in this context, which is omnipotence.

          var psqlArray = [],
            ormArray = [],
            scriptName = "init_script.sql",
            host = org.get("databaseServer").get("hostname"),
            port = org.get("databaseServer").get("port"),
            pgUser = org.get("databaseServer").get("user"),
            pgPassword = org.get("databaseServer").get("password"),
            psqlPath = X.options.datasource.psqlPath || "psql",
            orgName = org.get("name"),
            flags = "-h " + host + " -p " + port + " -d " + orgName + " -f " + scriptName + "\n",
            psqlCommand = psqlPath + " -U " + pgUser + " " + flags,
            coreScriptDir = '../database/client/source';

          X.log("Running scripts for organization: ", orgName);
          if (args.core) {
            // the user wants us to run the core init script and install the core orms as well
            psqlArray.push("(cd %@ && exec %@)".f(coreScriptDir, psqlCommand));


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

            var extLoc = ext.get("extension").get("location"),
              extName = ext.get("extension").get("name"),
              scriptDir = ".." + extLoc + "/source/" + extName + "/database/source",
              ormDir = ".." + extLoc + "/source/" + extName + "/database/orm",
              // XXX use fs.existsSync in node 0.8 instead of path.existsSync
              ormsExist = path.existsSync(ormDir),
              ormCreds = {
                hostname: host,
                organization: orgName,
                username: pgUser,
                port: port,
                password: pgPassword
              };

            X.log("Preparing extension: %@ %@ ".f(orgName, extName));
            // TODO: order the commands by extension loadOrder

            //
            // Within each organization, we have to run each psql command
            // sequentially, and then we need to run all the orm scripts
            // sequentially. We do this by pushing them to arrays here,
            // and then recursing down the arrays once they've been built
            //

            //
            // Build psql command array
            //
            X.log("pushing (cd %@ && exec %@)".f(scriptDir, psqlCommand));
            psqlArray.push("(cd %@ && exec %@)".f(scriptDir, psqlCommand));
            respObject.commandLog.push(psqlCommand);


            //
            // Build orm command array
            //
            X.log("Pushing creds for " + ormDir);
            ormArray.push({ormCreds: ormCreds, ormDir: ormDir});
            respObject.commandLog.push("Installing orms: " + ormDir);

          });


          console.log("psql commands are ", psqlArray);
          console.log("orm commands are ", ormArray);

          var orgCallback = function (respObj) {
            X.log("Maintenance is complete", JSON.stringify(respObj));
            res.send(JSON.stringify(respObj));
          };

          runPsqlCommands(psqlArray, ormArray, respObject, orgCallback);
        }); // end loop of organizations


        //if (psqlArray.length === 0) {
          // Report fully back even if no commands were run.
        //  respObject.status = respObject.status || "SUCCESS";
        //  res.send(respObject);
        //}
      },
      fetchError = function (model, error) {
        respObject.status = "ERROR";
        respObject.errorCount++;
        respObject.message = "Error while fetching organizations";
        res.send(respObject);
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

    // access through the main server uses the logged in user's authority
    install(res, args, req.session.passport.user.id);
  };

  exports.maintenance = maintenance;
}());


/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global _:true */

(function () {
  "use strict";

  var exec = require('child_process').exec,
    fs = require('fs'),
    path = require('path'),
    winston = require('winston');

  var sendToDatabase = function (query, credsClone, options, callback) {
    var filename = path.join(__dirname, "../../output/build_" + credsClone.database + ".sql");
    if (!fs.existsSync(path.join(__dirname, "../../output"))) {
      fs.mkdirSync(path.join(__dirname, "../../output"));
    }
    fs.writeFile(filename, query, function (err) {
      if (err) {
        winston.error("Cannot write query to file");
        callback(err);
        return;
      }
      var psqlCommand = 'psql -d ' + credsClone.database +
        ' -U ' + credsClone.username +
        ' -h ' + credsClone.hostname +
        ' -p ' + credsClone.port +
        ' -f ' + filename +
        ' --single-transaction';

      /**
       * http://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
       * "maxBuffer specifies the largest amount of data allowed on stdout or
       * stderr - if this value is exceeded then the child process is killed."
       */
      exec(psqlCommand, {maxBuffer: 40000 * 1024 /* 200x default */}, function (err, stdout, stderr) {
        if (err) {
          winston.error("Cannot install file ", filename);
          callback(err);
          return;
        }
        if (options.keepSql) {
          // do not delete the temp query file
          winston.info("SQL file kept as ", filename);
          callback();
        } else {
          fs.unlink(filename, function (err) {
            if (err) {
              winston.error("Cannot delete written query file");
              callback(err);
            }
            callback();
          });
        }
      });
    });
  };
  exports.sendToDatabase = sendToDatabase;
}());

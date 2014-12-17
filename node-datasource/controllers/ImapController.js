(function () {
  "use strict";

  var _ = require("underscore"),
    async = require("async"),
    Imap = require('imap'),
    inspect = require('util').inspect,
    MailParser = require("mailparser").MailParser,
    mailparser = new MailParser();

  // choosing to ignore attachments, headers, references, inReplyTo, priority, messageId
  var reportedFields = ["html", "text", "subject", "from", "to", "date"],
    returnResults = [];

  // the helper function that does all the work of searching imap.
  // can be called by the route or through the CLI.
  var searchImap = function (creds, box, query, callback) {
    var imap = new Imap(creds);
    imap.once('ready', function () {
      imap.openBox(box, true, function (err, box) {
        if (err) throw err;
        imap.search(query, function (err, results) {
          if (err) {
            return callback(err);
          }
          if (results.length === 0) {
            return callback(null, []);
          }
          mailparser.on("end", function (mailObject){
            returnResults.push(_.pick(mailObject, reportedFields));
            if (returnResults.length === results.length) {
              callback(null, returnResults);
            }
          });

          var f = imap.fetch(results, { bodies: [''] });

          f.on('message', function (msg, seqno) {
            msg.on('body', function (stream, info) {
              stream.on('data', function (chunk) {
                mailparser.write(chunk.toString('utf8'));
              });
            });
            msg.once('end', function () {
              mailparser.end();
            });
          });
          f.once('error', function (err) {
            callback(err);
          });
          f.once('end', function () {
            imap.end();
          });
        });
      });
    });

    imap.once('error', function (err) {
      callback(err);
    });

    imap.connect();
  };

  var searchAllImap = exports.searchAllImap = function (config, query, callback) {
    async.map(config.users, function (user, done) {
      var creds = _.extend({},
        _.omit(config, "users"),
        _.omit(user, "box")
      );
      searchImap(creds, user.box, query, done);

    }, function (err, results) {
      if (err) {
        callback(err);
      }
      callback(null, _.flatten(results, true));
    });
  };

  // https://localhost/demo_dev/imap/search?address=you@yourcompany.com
  exports.search = function (req, res) {
    var query = [ 'ALL', ['OR', ['FROM', req.query.address], ['TO', req.query.address] ] ];
    // TODO: secure this route with a privilege
    // TODO: allow other kinds of queries other than to/from address?
    // https://github.com/mscdex/node-imap#examples
    // TODO for v2.0: we should really store these creds in the database and have a UI to manage them

    // TODO: if (X.options.datasource.imap.useCache) { search the database instead of the imap server }
    //    see scripts/cache_email.js

    searchAllImap(X.options.datasource.imap, query, function (err, results) {
      if (err) {
        console.log("Error searching imap", err);
        res.send(500);
        return;
      }

      res.send({status: "OK", data: results});
    });
  };
}());

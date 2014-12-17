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

  // https://shackbarth-470-dev.localhost/demo_dev/imap/search?address=to_or_from@mycompany.com

  /*
    Necessary setup: configure your mail server so that it automatically bcc's an "archive"
    email address. Put the creds for that address in the config file.

    Not sure if this is possible with gmail, I think it's unlikely:
    http://thenextweb.com/google/2012/07/03/if-youre-a-google-apps-admin-you-will-now-have-access-to-a-gmail-log-search

    Gmail has lots of nice integration options, and this route could easily be expanded to
    use the gmail API without changing its own API to the xTuple clients.
  */
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

  exports.search = function (req, res) {
    var query = [ 'ALL', ['OR', ['FROM', req.query.address], ['TO', req.query.address] ] ];
    // TODO: secure this route with a privilege
    async.map(X.options.datasource.imap.users, function (user, done) {
      var creds = _.extend({},
        _.omit(X.options.datasource.imap, "users"),
        _.omit(user, "box")
      );
      searchImap(creds, user.box, query, done);

    }, function (err, results) {
      if (err) {
        console.log("Error searching imap", err);
        res.send(500);
        return;
      }

      res.send({status: "OK", data: _.flatten(results, true)});
    });
  };
}());

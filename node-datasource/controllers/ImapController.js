(function () {
  "use strict";

  var _ = require("underscore"),
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
  exports.search = function (req, res) {

    var imap = new Imap(X.options.datasource.imapUser);
    // TODO: secure this route with a privilege
    imap.once('ready', function () {
      imap.openBox('INBOX', true, function (err, box) {
        if (err) throw err;
        imap.search([ 'ALL', ['OR', ['FROM', req.query.address], ['TO', req.query.address] ] ], function (err, results) {
          if (err) {
            res.send(500);
            return;
          }

          mailparser.on("end", function (mail_object){
            returnResults.push(_.pick(mail_object, reportedFields));
            if (returnResults.length === results.length) {
              res.send(returnResults);
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
            console.log('Fetch error: ' + err);
            res.send(500);
          });
          f.once('end', function () {
            imap.end();
          });
        });
      });
    });

    imap.once('error', function (err) {
      res.send(500);
    });

    imap.connect();
  };
}());

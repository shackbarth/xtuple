(function () {
  "use strict";

  var _ = require("underscore"),
    Imap = require('imap'),
    inspect = require('util').inspect,
    MailParser = require("mailparser").MailParser,
    mailparser = new MailParser(),
    imap = new Imap(X.options.datasource.imapUser);

  // choosing to ignore attachments, headers, references, inReplyTo, priority, messageId
  var reportedFields = ["html", "text", "subject", "from", "to", "date"],
    returnResults = [];

  // https://shackbarth-470-dev.localhost/demo_dev/imap/search?address=ned@xtuple.com
  exports.search = function (req, res) {

    function openInbox(cb) {
      imap.openBox('INBOX', true, cb);
    }

    imap.once('ready', function () {
      openInbox(function (err, box) {
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

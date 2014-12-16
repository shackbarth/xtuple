(function () {
  "use strict";

  // https://shackbarth-470-dev.localhost/demo_dev/imap/search?address=ned@xtuple.com
  exports.search = function (req, res) {
    console.log(req.query.address);
    var Imap = require('imap'),
      inspect = require('util').inspect,
      returnResults = [];

    var imap = new Imap(X.options.datasource.imapUser);

    function openInbox(cb) {
      imap.openBox('INBOX', true, cb);
    }

    imap.once('ready', function () {
      openInbox(function (err, box) {
        if (err) throw err;
        imap.search([ 'ALL', ['FROM', req.query.address] ], function (err, results) {
          if (err) throw err;
          var f = imap.fetch(results, { bodies: ['HEADER.FIELDS (FROM TO)','TEXT'] });
          f.on('message', function (msg, seqno) {
            //console.log('Message #%d', seqno);
            var prefix = '(#' + seqno + ') ';
            var returnResult = {};
            msg.on('body', function (stream, info) {
              if (info.which === 'TEXT')
                //console.log(prefix + 'Body [%s] found, %d total bytes', inspect(info.which), info.size);
              var buffer = '', count = 0;
              stream.on('data', function (chunk) {
                count += chunk.length;
                buffer += chunk.toString('utf8');
                if (info.which === 'TEXT') {
                  //console.log(prefix + 'Body [%s] (%d/%d)', inspect(info.which), count, info.size);
                }
              });
              stream.once('end', function () {
                if (info.which !== 'TEXT') {
                  //console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
                  _.extend(returnResult, Imap.parseHeader(buffer));
                } else {
                  returnResult.body = inspect(buffer); // TODO: mime parsing
                  //console.log(prefix + 'Body [%s] Finished', inspect(buffer));
                }
              });
            });
            msg.once('attributes', function (attrs) {
              _.extend(returnResult, attrs);
              //console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
            });
            msg.once('end', function () {
              //console.log(prefix + 'Finished');
              returnResults.push(returnResult);
            });
          });
          f.once('error', function (err) {
            console.log('Fetch error: ' + err);
          });
          f.once('end', function () {
            console.log('Done fetching all messages!');
            imap.end();
            res.send(returnResults);
          });
        });
      });
    });

    imap.once('error', function (err) {
      console.log(err);
    });

    imap.once('end', function () {
      console.log('Connection ended');
    });

    imap.connect();

  };
}());

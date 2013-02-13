/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  var _ = X._;

  // https://localtest.com/file?recordType=XM.File&id=40

  /**
    Used to serve up files to the client. Uses Content-Type to prompt browser to
    save the file

    @extends X.Route
    @class
   */
  X.fileRoute = X.Route.create({

    contentTypes: {
      csv: { contentType: "text/csv", encoding: "utf-8" },
      txt: { contentType: "text/plain", encoding: "utf-8" },
      png: { contentType: "image/png", encoding: "binary" },
      jpg: { contentType: "image/jpeg", encoding: "binary" },
      jpeg: { contentType: "image/jpeg", encoding: "binary" },
      gif: { contentType: "image/gif", encoding: "binary" }
    },

    getContentType: function (extension) {
      if (this.contentTypes.hasOwnProperty(extension.toLowerCase())) {
        return this.contentTypes[extension];
      }
      return { contentType: "application/" + extension, encoding: "binary" };
    },

    error: function (session, xtr) {
      //X.warn("error(): ", session.get("error"));
      session.removeAllListeners();
      xtr.error({isError: true, reason: session.get("error")});
    },

    handle: function (xtr) {
      var that = this,
        url = require("url"),
        querystring = require("querystring"),
        originalUrl = xtr.get("url"),
        args = url.parse(originalUrl).query,
        parsedArgs = querystring.parse(args),
        recordType = parsedArgs.recordType,
        recordId = parsedArgs.id,
        cookie = xtr.request.cookies.xtsessioncookie,
        session,
        sessionParams,
        response = xtr.get("response"),
        queryPayload,
        query;

      if ((recordType !== 'XM.File' && recordType !== 'XM.Image') || !recordId) {
        // XXX this still needs some work
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write("Invalid request");
        response.end();
        return;
      }

      if (!cookie) {
        // XXX this still needs some work
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write("You need a valid cookie!");
        response.end();
        return;
      }

      sessionParams = JSON.parse(cookie);
      if (!sessionParams.sid) {
        // XXX this still needs some work
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write("You need a valid cookie!");
        response.end();
        return;
      }

      queryPayload = '{"requestType":"retrieveRecord","recordType":"%@","id":"%@"}'.f(recordType, recordId);
      query = "select xt.retrieve_record('%@')".f(queryPayload);

      //sessionParams.payload = JSON.parse(queryPayload); // XXX do I really need to pass the payload?

      session = X.Session.create(sessionParams);

      session.once("error", _.bind(this.error, this, session, xtr));

      session.once("isReady", function () {
        session.query(query, function (err, res) {
          var content, data, filename, extension, fileDesc, encoding, buffer;

          if (err) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write("Error querying database");
            response.end();
          } else if (res.rowCount === 0) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write("Record not found");
            response.end();
          } else {
            content = JSON.parse(res.rows[0].retrieve_record);

            if (!content || !content.data) {
              response.writeHead(500, {"Content-Type": "text/plain"});
              response.write("Record content not found");
              response.end();
              return;
            }

            filename = content.description;
            extension = filename ? filename.substring(filename.lastIndexOf('.') + 1) : '';
            fileDesc = that.getContentType(extension);
            encoding = fileDesc.encoding;

            // pg represents bytea data as hex. For text data (like a csv file)
            // we need to read to a buffer and then convert to utf-8. For binary
            // data we can just send the buffer itself as data.
            //
            // The first two characters of the data from pg is \x and must be ignored
            buffer = new Buffer(content.data.substring(2), "hex");
            data = encoding === 'binary' ? buffer : buffer.toString(encoding);

            response.writeHead(200, {"Content-Type": fileDesc.contentType, "Content-Disposition": "attachment; filename = %@".f(filename) });
            response.write(data);
            response.end();
          }
        });
      });
    },

    handles: "file /file".w()
  });
}());

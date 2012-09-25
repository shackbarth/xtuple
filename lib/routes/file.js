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
      png: { contentType: "image/csv", encoding: "binary" } // binary is deprecated in node. Just return the buffer instead.
    },

    getContentType: function (extension) {
      if (this.contentTypes.hasOwnProperty(extension.toLowerCase())) {
        return this.contentTypes[extension];
      }
      return { contentType: "text/plain", encoding: "utf-8" };
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



      if (recordType !== 'XM.File' || !recordId) {
        // XXX this still needs some work
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write("Invalid request");
        response.end();
      }

      if (!cookie) {
        // XXX this still needs some work
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write("You need a valid cookie!");
        response.end();
      }


      queryPayload = '{"requestType":"retrieveRecord","recordType":"%@","id":"%@"}'.f(recordType, recordId);
      query = "select xt.retrieve_record('%@')".f(queryPayload);

      sessionParams = JSON.parse(cookie);
      //sessionParams.payload = JSON.parse(queryPayload); // XXX do I really need to pass the payload?

      session = X.Session.create(sessionParams);

      session.once("isReady", function () {
        session.query(query, function (err, res) {
          var content, data, filename, extension, fileDesc, buffer;

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

            filename = content.description;
            extension = filename.substring(filename.lastIndexOf('.') + 1);
            fileDesc = that.getContentType(extension);

            // Yikes! this is coming through as HEX and we need to convert
            // the encoding. This solution works for text files but corrupts
            // image files
            buffer = new Buffer(content.data.substring(2), "hex");
            data = buffer.toString(fileDesc.encoding);

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

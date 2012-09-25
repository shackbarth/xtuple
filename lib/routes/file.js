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


    getContentType: function (extension) {
      switch (extension.toLowerCase())
      {
      case 'csv':
        return "text/csv";
      case 'png':
        return "image/png";
      default:
        return 'text/plain';
      }
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

      if (!cookie) {
        // XXX this still needs some work
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write("You need a valid cookie!");
        response.end();
      }


      queryPayload = '{"requestType":"retrieveRecord","recordType":"%@","id":"%@"}'.f(recordType, recordId);
      query = "select xt.retrieve_record('%@')".f(queryPayload);


      console.log(query);

      sessionParams = JSON.parse(cookie);
      sessionParams.payload = JSON.parse(queryPayload); // XXX do I really need to pass the payload?

      session = X.Session.create(sessionParams);

      session.once("isReady", function () {
        session.query(query, function (err, res) {
          var content, data, filename, extension, contentType;

          if (err) {
            response.writeHead(500, {"Content-Type": contentType});
            response.write("Error querying database");
            response.end();
          } else if (res.rowCount === 0) {
            response.writeHead(500, {"Content-Type": contentType});
            response.write("Record not found");
            response.end();
          } else {
            content = JSON.parse(res.rows[0].retrieve_record);
            data = content.data;
            //console.log(data.substring(0, 100));
            console.log(that.decodeAscii(data).substring(0, 100));
            filename = content.description;
            //console.log(filename);
            extension = filename.substring(filename.lastIndexOf('.') + 1);
            contentType = that.getContentType(extension);


            response.writeHead(200, {"Content-Type": contentType, "Content-Disposition": "attachment", "filename": filename });
            response.write(that.decodeAscii(data));
            response.end();
          }
        });
      });
    },

    decodeAscii: function (ascii) {
      var output = "";

      ascii = ascii.substring(2);
      while (ascii.length > 0) {
        output += String.fromCharCode(parseInt(ascii.substring(0, 2), 16));
        ascii = ascii.substring(2);
      }
      return output;
    },

    handles: "file /file".w()
  });
}());

/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, _:true */

(function () {
  "use strict";

  var queryDatabase = require('./data').queryDatabase;
  // /file?recordType=XM.File&id=40

  /**
    Used to serve up files to the client. Uses res.attachment to prompt browser to
    save the file.
   */
  var handle = function (req, res) {
    var args = req.query,
      recordType = args.recordType,
      recordId = args.id,
      queryPayload;

    if ((recordType !== 'XM.File' && recordType !== 'XM.Image') || !recordId) {
      res.send({isError: true, message: "Invalid request"});
      return;
    }

    queryPayload = {
      nameSpace: recordType.prefix(),
      type: recordType.suffix(),
      id: recordId
    };

    queryDatabase("get", queryPayload, req.session, function (result) {
      var content, data, filename, extension, isBinaryEncoding, buffer;

      if (result.isError) {
        res.send(result);
      } else {
        content = result.data.data;

        filename = content.description;
        extension = filename ? filename.substring(filename.lastIndexOf('.') + 1) : '';
        isBinaryEncoding = extension !== 'txt' && extension !== 'csv';

        //
        // The data comes back as binary. Put it in a buffer and convert to
        // utf-8 if it is text data
        //
        buffer = new Buffer(content.data);
        data = isBinaryEncoding ? buffer : buffer.toString("utf-8");

        console.log("filename", filename);
        res.attachment(filename);
        res.send(data);
      }
    });
  };

  exports.file = handle;
}());

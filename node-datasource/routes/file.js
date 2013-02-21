/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, _:true */

(function () {
  "use strict";

  var retrieveEngine = require('./data').retrieveEngine;
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
      recordType: recordType,
      id: Number(recordId)
    };

    retrieveEngine(queryPayload, req.session, function (result) {
      var content, data, filename, extension, isBinaryEncoding, buffer;

      if (result.isError) {
        res.send(result);
      } else {
        content = result.data;

        filename = content.description;
        extension = filename ? filename.substring(filename.lastIndexOf('.') + 1) : '';
        isBinaryEncoding = extension !== 'txt' && extension !== 'csv';

        // pg represents bytea data as hex. For text data (like a csv file)
        // we need to read to a buffer and then convert to utf-8. For binary
        // data we can just send the buffer itself as data.
        //
        // The first two characters of the data from pg is \x and must be ignored
        buffer = new Buffer(content.data.substring(2), "hex");
        data = isBinaryEncoding ? buffer : buffer.toString("utf-8");

        res.attachment(filename);
        res.send(data);
      }
    });
  };

  exports.file = handle;
}());

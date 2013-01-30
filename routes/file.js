/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, _:true */

(function () {
  "use strict";

  // /file?recordType=XM.File&id=40

  /**
    Used to serve up files to the client. Uses res.attachment to prompt browser to
    save the file.
   */
  var handle = function (req, res) {
    var args = req.query,
      recordType = args.recordType,
      recordId = args.id,
      organization = req.session.passport.user.organization,
      queryPayload,
      query;

    if ((recordType !== 'XM.File' && recordType !== 'XM.Image') || !recordId) {
      res.send({isError: true, message:"Invalid request"});
      return;
    }

    // TODO: this should be refactored to use routes.retrieveEngine

    queryPayload = '{"requestType":"retrieveRecord","recordType":"%@","id":"%@"}'.f(recordType, recordId);
    query = "select xt.retrieve_record('%@')".f(queryPayload);

    X.database.query(organization, query, function (err, result) {
      var content, data, filename, extension, isBinaryEncoding, buffer;

      if (err) {
        res.send({isError: true, message: "Error querying database"});
      } else if (res.rowCount === 0) {
        res.send({isError: true, message: "Record not found"});
      } else {
        content = JSON.parse(result.rows[0].retrieve_record);

        if (!content || !content.data) {
          res.send({isError: true, message: "Record content not found"});
          return;
        }

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

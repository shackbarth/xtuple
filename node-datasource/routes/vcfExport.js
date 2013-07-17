/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */


(function () {
  "use strict";

  exports.vcfExport = function (req, res) {
    var fs = require('fs');

    res.attachment("exportedContact.vcf");
    res.send(req.query.stringToSave);
  };
}());

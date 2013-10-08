/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, console:true, issue:true, require:true, XM:true, io:true,
Backbone:true, _:true, X:true, __dirname:true, exports:true */

(function () {
  "use strict";

  exports.olapSource = X.olapSource = X.olapCatalog.create({

    /**
     * Initializes olapSource
     */
    init: function () {
    },

    /**
      Perform xmla query appending jwt for single sign on

      @param {String} query
      @param {String} jwt
      @param {Function} callback
     */
    query: function (query, jwt, callback) {
      this.xmlaConnect.executeTabular({
        statement: query,
        url : "http://" + this.hostname + ":" + this.port + "/pentaho/Xmla?assertion=" + jwt.jwt,
        success: function (xmla, options, xmlaResponse) {
            callback(xmlaResponse); // back to callback in olapdata
          },
      });
    }

  });

}());

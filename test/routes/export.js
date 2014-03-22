/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XT:true, _:true, describe:true, it:true, before:true */

if (typeof XT === undefined) {
  XT = {};
}
_ = require("underscore");

var assert = require("chai").assert,
  exportRoute = require("../../node-datasource/routes/export"),
  dataRoute = require("../../node-datasource/routes/data");

require("../../node-datasource/xt/database");
require("../../lib/tools/source/foundation");
require("../../lib/tools/source/ext/string");
require("../../lib/tools/source/ext/proto/string");
require("../../node-datasource/lib/ext/datasource");

X.options = {
  databaseServer: {}
};

(function () {
  "use strict";

  describe('The export route', function () {

    it('should provide the data in CSV format', function (done) {
      // mock the request
      var req = {
          query: {details: '{"nameSpace":"XM","type":"Honorific"}'},
          session: {passport: {user: {}}}
        },
        // mock the response object
        res = {
          send: function (result) {
            assert.isUndefined(result.isError);
            // make sure that we return CSV to the client
            assert.equal(result, '"code",\n"Dr",\n"Miss",\n"Mr",\n');
            done();
          },
          attachment: function (filename) {
            // make sure that we name the file correctly
            assert.equal(filename, "Honorific.csv");
          }
        },
        // mock the call to the database
        sampleData = '[{"code":"Dr"},{"code":"Miss"},{"code":"Mr"}]',
        queryFunction = function (org, query, callback) {
          // "I'm pg and I'm returning some data"
          var result = "{\"data\":" + sampleData + "}";
          callback(null, {rows: [{get: result}]});
        };

      // inject our mock query into the global variable
      _(XT.dataSource).extend({
        query: queryFunction,
        getAdminCredentials: function () {
          return { };
        }
      });

      exportRoute.exxport(req, res);
    });
  });

}());


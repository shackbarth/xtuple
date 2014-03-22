/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true, XT:true, _:true, describe:true, it:true, before:true */

if (typeof XT === undefined) {
  XT = {};
}
_ = require("underscore");

var assert = require("chai").assert,
  fileRoute = require("../../node-datasource/routes/file"),
  dataRoute = require("../../node-datasource/routes/data");

require("../../node-datasource/xt/database");
require("../../lib/tools/source/foundation");
require("../../lib/tools/source/ext/string");
require("../../lib/tools/source/ext/proto/string");
require("../../node-datasource/lib/ext/datasource");

X.options = X.options || {};

(function () {
  "use strict";

  describe('The File route', function () {

    it('should transform binary data', function (done) {
      // mock the request
      var req = {
          query: {recordType: "XM.File", id: "mockymock"},
          session: {passport: {user: {}}}
        },
        // mock the response object
        mockData = "here is my mock data",
        buffer = new Buffer(mockData),
        res = {
          send: function (result) {
            assert.isUndefined(result.isError);
            // this is the real thing that we're testing: that the
            // result comes back clean just as it was put in
            assert.equal(result, mockData);
            done();
          },
          attachment: function (filename) {
            // make sure that we name the file correctly
            assert.equal(filename, "foo.txt");
          }
        },
        // mock the call to the database
        queryFunction = function (query, options, callback) {
          // "I'm pg and I'm returning some data"
          var result = "{\"data\":{\"description\":\"foo.txt\",\"data\":\"" + buffer + "\"}}";
          callback(null, {rows: [{get: result}]});
        };

      // inject our mock query into the global variable
      _(XT.dataSource).extend({
        query: queryFunction,
        getAdminCredentials: function () {
          return { };
        }
      });

      fileRoute.file(req, res);
    });
  });

  /**
    Test the transformation of binary data in the post route
  */
  describe('The POST method', function () {

    it('should be implemented with a queryDatabase function', function () {
      assert.isFunction(dataRoute.queryDatabase);
    });

    it('should transform binary data if asked to', function (done) {
      this.timeout(10000);
      var binaryData = "flerg", // okay, I know this isn't really binary, but it doesn't have to be for this test
        // mock the payload
        payload = {binaryField: "binField", data: {binField: binaryData}},
        // mock the session
        session = {passport: {user: {username: "admin"}}},
        // mocking the call to the database
        queryFunction = function (query, options, callback) {
          var queryObj = JSON.parse(query.substring(query.indexOf('($$') + 3, query.indexOf('$$)')));
          // make sure that the route has transformed this data to binary
          assert.equal(queryObj.data.binField, "\\x666c657267");

          callback(null, {}); // "I'm pg and I'm returning some data"
        },
        adaptorCallback = function (err, res) {
          // return for mocha
          done();
        };

      // inject our mock query into the global variable
      XT.dataSource = {query: queryFunction, getAdminCredentials: function () {
        return {};
      }};

      dataRoute.queryDatabase("post", payload, session, adaptorCallback);
    });

  });
}());


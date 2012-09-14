/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  var vows = require('vows'),
    assert = require('assert'),
    options = require("../lib/options");

  require('../node_modules/xt/xt');
  X.setup(options);
  require('../node_modules/xt/database/ext/mongoose_schema');
  require('../node_modules/xt/database/database');
  require('../node_modules/xt/database/cache');
  require('../node_modules/xt/server/server');
  require("../lib/dataserver");
  require("../lib/ext/session");
  require("../lib/ext/proxy");
  require("../lib/ext/database");
  X.sessionCache = X.Cache.create({
    prefix: "session",
    init: function () {
      this._super.init.call(this);
      X.Session.cache = this;
    }
  });
  X.functors = [];
  X.functorMap = {};
  require('../node_modules/xt/server/ext/functor');
  require('../lib/functors/fetch');


  var workingPayload = "fetch(): select xt.fetch('{\"requestType\":\"fetch\",\"query\":{\"orderBy\":[{\"attribute\":\"number\"}],\"parameters\":[{\"attribute\":\"isActive\",\"operator\":\"=\",\"value\":true},{\"attribute\":\"number\",\"operator\":\"MATCHES\",\"value\":\"2000\"}],\"rowOffset\":0,\"rowLimit\":50,\"recordType\":\"XM.AccountListItem\"}}')";
  var breakingPayload = "fetch(): select xt.fetch('{\"requestType\":\"fetch\",\"query\":{\"orderBy\":[{\"attribute\":\"number\"}],\"parameters\":[{\"attribute\":\"isActive\",\"operator\":\"=\",\"value\":true},{\"attribute\":\"number\",\"operator\":\"MATCHES\",\"value\":\"2000\"},{\"attribute\":\"owner\",\"operator\":\"\",\"value\":\"admin\"}],\"rowOffset\":0,\"rowLimit\":50,\"recordType\":\"XM.AccountListItem\"}}')";

  vows.describe('Fetch functor').addBatch({

    'when a fetch functor is passed a query with a relation': {
      topic: function () {
        var fetchFunctor = X.functorMap['function/fetch'],
          payload = breakingPayload,
          xtr = {
            get: function () {return payload;},
            debug: function (output) {console.log(output);},
            error: function () {},
            write: function () {}
          },
          session = X.Session.create(payload);

        fetchFunctor.handle(xtr, session, this.callback);
      },
      'we get a predictable result': function (error, result) {
        assert.isNull(error);
        assert.isNotNull(result);
        console.log(result);
      }
    }

  }).export(module);

}());

/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true XM:true, XT:true */

(function () {
  "use strict";

  var vows = require('vows'),
    assert = require('assert');

  require('../main.js');

  vows.describe('Check user').addBatch({
    'when we set up a user': {
      topic: function () {
        var that = this,
          schemaLoaded = false,
          privsLoaded = false,
          schemaOpts = {},
          privOpts = {};

        var tryUser = function () {
          if (schemaLoaded && privsLoaded) {
            var m = new XM.User({id: 'admin@xtuple.com'});
            //var opts = {
            //  success: function () {
            //    X.log('found user');
            //  },
            //  error: function () {
            //    X.log('something broke');
            //  }
            //};
            m.fetch({success: that.callback});
          }
        };

        // Set up internal session
        schemaOpts.success = function () {
          X.log('Schema Loaded');
          schemaLoaded = true;
          tryUser();
        };
        privOpts.success = function () {
          X.log('Privileges Loaded');
          privsLoaded = true;
          tryUser();
        };

        XT.session = Object.create(XT.Session);
        XT.session.loadSessionObjects(XT.session.SCHEMA, schemaOpts);
        XT.session.loadSessionObjects(XT.session.PRIVILEGES, privOpts);
      },
      'we get a predictable result': function (error, result) {
        assert.isNull(error);
        assert.isNotNull(result);
        console.log(result);
      }
    }
  }).export(module);

}());

/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, Backbone:true, enyo:true, XT:true */

(function () {
  "use strict";

  enyo.kind({
    name: "XV.ListTest",
    kind: "enyo.TestSuite",
    components: [
      { kind: "XV.List", name: "list" }
    ],
    /**
      Test for incident #18662.
      Makes two fetches to the model. The first call will take so long
      that the second one will have already been made by the time
      that it returns. This test is to make sure that the first
      query is not processen when it returns.
     */
    testQueryOrder: function () {
      var that = this,
        list = this.$.list,
        mockModel = {
          fetch: function (options) {
            setTimeout(enyo.bind(this, options.success), options.waitTime);
          }
        },
        options = {};

      list.setValue(mockModel);

      // First call
      options.waitTime = 200;
      options.success = function () {
        that.finish("The first, late call should be suppressed.");
      };
      list.fetch(options);

      // Second call
      options.waitTime = 100;
      options.success = null;
      list.fetch(options);

      // if the success method of the first call hasn't complained within 300ms,
      // then it has been suppressed, and the test should pass
      setTimeout(enyo.bind(this, this.finish), 300);
    }
  });
}());


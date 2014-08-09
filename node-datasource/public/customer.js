/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XN:true, Backbone:true, _:true, console:true */

var XN = {};
(function () {
  "use strict";


  console.log("Foo");
  XN.CustomerListItem = Backbone.Model.extend({
    urlRoot: "/dev/restapi/customerListItem",
    //toJSON: function () {

    parse: function (resp, options) {
      return resp.data.data;
    }
  });

  XN.CustomerListItemCollection = Backbone.Model.extend({
    model: XN.CustomerListItem,
    url: "/dev/restapi/customerListItem",
    parse: function (resp, options) {
      return resp.data.data;
    }
  });
}());


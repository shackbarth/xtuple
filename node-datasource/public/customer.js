/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XN:true, Backbone:true, _:true, console:true */

var XN = {};
(function () {
  "use strict";


  console.log("Foo");

  XN.Model = Backbone.RelationalModel.extend({
    parse: function (resp, options) {
      return resp.data.data;
    }
  });
  XN.Collection = Backbone.Collection.extend({
    parse: function (resp, options) {
      return resp.data.data;
    }
  });

  XN.ContactRelation = XN.Model.extend({
    urlRoot: "/dev/restapi/contactRelaton"
  });
  XN.CustomerListItem = XN.Model.extend({
    urlRoot: "/dev/restapi/customerListItem",
	relations: [{
		type: Backbone.HasOne,
		key: 'billingContact',
		relatedModel: 'XN.ContactRelation',
		collectionType: 'XN.ContactRelationCollection'
	}]
  });

  XN.CustomerListItemCollection = XN.Collection.extend({
    model: XN.CustomerListItem,
    url: "/dev/restapi/customerListItem",
    parse: function (resp, options) {
      return resp.data.data;
    }
  });
}());


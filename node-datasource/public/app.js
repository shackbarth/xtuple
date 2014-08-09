/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XN:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  var ttoys = new XN.CustomerListItem();
  ttoys.on("sync", function (model, resp, options) {
    console.log(ttoys.attributes);
  });
  ttoys.set({id: "TTOYS"});
  ttoys.fetch();

  var customerColl = new XN.CustomerListItemCollection();
  customerColl.on("sync", function (coll, resp, options) {
    console.log(customerColl.toJSON());
  });
  customerColl.fetch();

}());

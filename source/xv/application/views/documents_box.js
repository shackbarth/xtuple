/*jshint bitwise:false, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, XM:true, _:true, Backbone:true, enyo:true, XT:true */

(function () {

  enyo.kind({
    name: "XV.AccountDocumentsBox",
    kind: "XV.DocumentsBox",
    parentKey: "account"
  });
  
  enyo.kind({
    name: "XV.ContactDocumentsBox",
    kind: "XV.DocumentsBox",
    parentKey: "contact"
  });

}());

/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XT:true, document:true */

(function () {

  XM.MongoUser = XM.Model.extend({
    name: "user",
    recordType: "XM.MongoUser",
    validate: function () {
      // real men don't validate
    }
    //url: "/testerella"
  });

  XM.MongoUserCollection = XM.Collection.extend({
    model: XM.MongoUser
  });

}());

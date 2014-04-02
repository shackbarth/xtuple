/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  // These are hard coded collections that may be turned into tables at a later date
  var i;

  // Account Type
  var oauth2clientTypeJson = [
    { id: "web server", name: "_webServer".loc() },
    { id: "jwt bearer", name: "_serviceAccount".loc() }
  ];
  XM.Oauth2clientTypeModel = Backbone.Model.extend({
  });
  XM.Oauth2clientTypeCollection = Backbone.Collection.extend({
    model: XM.Oauth2clientTypeModel
  });
  XM.oauth2clientTypes = new XM.Oauth2clientTypeCollection();
  for (i = 0; i < oauth2clientTypeJson.length; i++) {
    var clientType = new XM.Oauth2clientTypeModel(oauth2clientTypeJson[i]);
    XM.oauth2clientTypes.add(clientType);
  }
}());

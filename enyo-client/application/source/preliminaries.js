/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, enyo:true, window:true, location: true */

XT = typeof XT !== 'undefined' ? XT : {};

(function () {

  XT.getBaseUrl = function () {
    return location.protocol + "//" + location.hostname + (location.port && ":" + location.port);
  };

  XT.getOrganizationPath = function () {
    return "/" + window.location.pathname.split("/")[1];
  };

  XT.logout = function () {
    if (window.onbeforeunload) {
      // if we've set up a "are you sure you want to leave?" warning, disable that
      // here. Presumably we've already asked if they want to leave.
      // delete window.onbeforeunload; // doesn't work
      window.onbeforeunload = undefined;
    }
    window.location = XT.getOrganizationPath() + "/logout";
  };

  XT.setVersion = function (version, qualifier) {
    XT.log("XT.setVersion is now deprecated. The app now reads extension versions from " +
      "package.json or manifest.js (" + qualifier + ")");
  };

}());

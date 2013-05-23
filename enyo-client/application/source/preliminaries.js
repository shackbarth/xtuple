/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, enyo:true, window:true */

XT = typeof XT !== 'undefined' ? XT : {};

(function () {

  XT.logout = function () {
    if (window.onbeforeunload) {
      // if we've set up a "are you sure you want to leave?" warning, disable that
      // here. Presumably we've already asked if they want to leave.
      // delete window.onbeforeunload; // doesn't work
      window.onbeforeunload = undefined;
    }
    window.location = "/" + window.location.pathname.split("/")[1] + "/logout";
  };

  XT.setVersion = function (version) {
    var aboutVersionLabel = XT.app.$.postbooks.$.navigator.$.aboutVersion,
      versionText = "_version".loc() + " " + version;

    aboutVersionLabel.setContent(versionText);
  };

  XT.getOrganizationPath = function () {
    return "/" + window.location.pathname.split("/")[1];
  };

}());

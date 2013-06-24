/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, enyo:true, window:true */

XT = typeof XT !== 'undefined' ? XT : {};

(function () {

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
    var aboutVersionLabel = XT.app.$.postbooks.$.navigator.$.aboutVersion,
      versionText = "_version".loc() + " " + version;

    if (qualifier) {
      versionText = ("_" + qualifier).loc() + " " + versionText;
    }
    if (aboutVersionLabel.getContent()) {
      versionText = aboutVersionLabel.getContent() + "<br>" + versionText;
    }

    aboutVersionLabel.setContent(versionText);
  };

}());

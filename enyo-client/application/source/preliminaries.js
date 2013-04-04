/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global X:true, enyo:true*/

var X = X || {};
X.getCookie = enyo.getCookie;

(function () {
  var host = document.location.host,
      protocol = document.location.protocol;

  window.relocate = function () {
    if (window.onbeforeunload) {
      // if we've set up a "are you sure you want to leave?" warning, disable that
      // here. Presumably we've already asked if they want to leave.
      // delete window.onbeforeunload; // doesn't work
      window.onbeforeunload = undefined;
    }

    // TODO - old way
    //document.location = "%@//%@/login".f(protocol,hostname),
    document.location = "%@//%@".f(protocol,host);
  };
}());

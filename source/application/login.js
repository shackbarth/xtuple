/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XV:true, enyo:true, console:true, document:true */

(function () {
  // first of 2 types of checks, this being the most obvious test
  var c = enyo.getCookie("xtsessioncookie"),
    h = document.location.hostname,
    p = document.location.protocol,
    l = document.location.pathname,
    noAuthRedirect = "%@//%@/login".f(p,h);

  if (l.match(/login/g)) { return; }
  try {
    c = JSON.parse(c);
  } catch (e) {
    document.location = noAuthRedirect;
  }
}());

/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XV:true, enyo:true, console:true, document:true */

(function () {
  // first of 2 types of checks, this being the most obvious test
  var // TODO - old way, the next line should be removed.
      cookie = enyo.getCookie("xtsessioncookie"),
      hostname = document.location.hostname,
      path = document.location.pathname,
      port = document.location.port,
      protocol = document.location.protocol,
      // TODO - old way.
      //noAuthRedirect = "%@//%@:%@/login".f(protocol,hostname,port);
      // The base domain https://example.com:80
      noAuthRedirect = "%@//%@:%@".f(protocol,hostname,port);

  if (path.match(/login/g)) { return; }
  try {
    cookie = JSON.parse(cookie);
    // TODO - connect.sid cookie is HttpOnly meaning this script cannot access it.
    // Need to make a call to /session or some path and make sure this user has an org set in their session.
   if (!cookie.organization) {
      // the user authenticated but didn't choose a database. They're half-logged-in,
      // and we should force them to login fully

      // TODO - When above org lookup works, then we can redirect.
      //document.location = noAuthRedirect;
    }
  } catch (err) {
    // TODO - When above org lookup works, then we can redirect.
    //document.location = noAuthRedirect;
  }
}());

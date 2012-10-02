/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true, 
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, _:true, console:true */

(function () {
  "use strict";

  /**
  */
  XT.Response = function () {
    _.extend(this, arguments[0]);
    this.handleErrorStatus();
  };
  
  XT.Response.prototype = {
    handleErrorStatus: function () {
      if (!this.isError) return;
      
      // TODO: there is little or NO HANDLING IN PLACE FOR DATABASE
      // ERRORS EVEN THOUGH THEY ARE BEING REPORTED BY THE DATASOURCE...
      // so in an effort to make sure these are known during development
      // we will report them to console in a way they can't be ignored...
      console.error("XT.Response%@: %@".f(this.isDatabaseError? " [database error]": "", this.message));
      
      if (this.code) {
        if (this.code === "SESSION_NOT_FOUND") {
          // so the session couldn't be validated by the datasource...
          // this could happen for a variety of reasons and next
          // iteration of handling can normalize some of this
          // abstract behavior but for now at LEAST do something...
          // so go ahead and reroute them to login since that is
          // what they will need to do at this point regardless
          relocate();
        }
      }
    }
  };
  
  // TODO: find out if there is a way to determine support for ES5 getters as
  // opposed to the fallback ES4 that are deprecated moving forward...
  XT.Response.prototype.__defineGetter__("message", function () {
    if (this.data && this.data.detail) return this.data.detail;
    else if (this.reason) return this.reason;
    return this;
  });
  
  XT.Response.prototype.__defineGetter__("isDatabaseError", function () {
    if (!this.isError) return false;
    if (this.data && this.data.detail) return true;
    return false;
  });

}());

/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";
  
  XT.Functor.create({

    handle: function (xtr, session) {
      var query, payload;
      
      payload = xtr.get("data");
      query = "select xt.fetch('%@')".f(payload);
  
      xtr.debug("fetch(): %@".f(query));
      
      session.query(query, function (err, res) {
        if (err) xtr.error({data: err});
        else xtr.write({data: res}).close();
      });
    },

    handles: "function/fetch"
  
  });
}());
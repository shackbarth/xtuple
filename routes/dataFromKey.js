/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

(function () {
  "use strict";

  /**
    We've stored report data in a temporary table with a key. Return the data to anyone who has the
    appropriate key.
   */
  exports.dataFromKey = function (req, res) {

    // TODO: this route is currently under development. We're waiting until it's written before we
    // port it over.
    res.redirect("http://www.youtube.com/watch?v=s8MDNFaGfT4");
  };

}());

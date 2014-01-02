/*jshint trailing:true, white:true, indent:2, strict:true, curly:true, plusplus:true,
  immed:true, eqeqeq:true, forin:true, latedef:true, newcap:true, noarg:true, undef:true,
  strict:false */
/*global XT:true, _:true */

(function () {

  XT.extensions.purchasing.initErrors = function () {

    var errors = [
      {
        code: "pur1001",
        messageKey: "_itemSourceItemInactive"
      }
    ];

    _.each(errors, XT.Error.addError);
  };

}());

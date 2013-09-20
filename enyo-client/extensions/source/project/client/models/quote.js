/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true */

(function () {
  "use strict";

  XT.extensions.project.quoteModels = function () {
    /**
      @class

      @extends XM.Model
    */
    XM.QuoteProject = XM.Model.extend(
      /** @scope XM.QuoteProject.prototype */ {

      recordType: 'XM.QuoteProject',

      isDocumentAssignment: true

    });
  };

}());

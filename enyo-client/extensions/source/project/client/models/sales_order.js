/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true */

(function () {
  "use strict";

  XT.extensions.project.salesOrderModels = function () {
    /**
      @class

      @extends XM.Model
    */
    XM.SalesOrderProject = XM.Model.extend(
      /** @scope XM.SalesOrderProject.prototype */ {

      recordType: 'XM.SalesOrderProject',

      isDocumentAssignment: true

    });
  };

}());

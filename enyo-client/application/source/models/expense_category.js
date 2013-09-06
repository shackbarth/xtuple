/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.Document
  */
  XM.ExpenseCategory = XM.Document.extend({
    /** @scope XM.Priority.prototype */

    recordType: 'XM.ExpenseCategory',

    documentKey: 'code'

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.ExpenseCategoryCollection = XM.Collection.extend({
    /** @scope XM.ExpenseCategoryCollection.prototype */

    model: XM.ExpenseCategory,

    orderAttribute: {
      orderBy: [{
        attribute: "code"
      }]
    }

  });

}());

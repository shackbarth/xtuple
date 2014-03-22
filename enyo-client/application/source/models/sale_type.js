/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.Document
  */
  XM.SaleType = XM.Document.extend({
    /** @scope XM.SaleType.prototype */

    documentKey: 'code',

    recordType: 'XM.SaleType'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.SalesEmailProfile = XM.Document.extend({
    /** @scope XM.SalesEmailProfile.prototype */

    recordType: 'XM.SalesEmailProfile',

    documentKey: 'name'

  });

  /**
    @class

    @extends XM.CharacteristicAssignment
  */
  XM.SaleTypeCharacteristic = XM.CharacteristicAssignment.extend(/** @lends XM.SaleTypeCharacteristic.prototype */{

    recordType: 'XM.SaleTypeCharacteristic',

    which: "isSalesOrders"

  });

  /**
    @class

    @extends XM.WorkflowSource
  */
  XM.SaleTypeWorkflow = XM.WorkflowSource.extend(
    /** @scope XM.SaleTypeWorkflow.prototype */ {

    recordType: 'XM.SaleTypeWorkflow',

    defaults: function () {
      var ret = XM.WorkflowSource.prototype.defaults.apply(this, arguments);
      ret.workflowType = XM.SalesOrderWorkflow.TYPE_OTHER;
      return ret;
    }

  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.SaleTypeCollection = XM.Collection.extend({
    /** @scope XM.SaleTypeCollection.prototype */

    model: XM.SaleType

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.SalesEmailProfileCollection = XM.Collection.extend({
    /** @scope XM.SalesEmailProfileCollection.prototype */

    model: XM.SalesEmailProfile

  });

}());

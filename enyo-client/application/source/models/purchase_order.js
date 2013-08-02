/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.Document
  */
  XM.PurchaseOrder = XM.Document.extend({
    /** @scope XM.PurchaseOrder.prototype */

    recordType: 'XM.PurchaseOrder',

    documentKey: "number"

  });

  /**
    @class

    @extends XM.Document
  */
  XM.PurchaseOrderLine = XM.Document.extend({
    /** @scope XM.PurchaseOrder.prototype */

    recordType: 'XM.PurchaseOrderLine',

    canReceiveAll: function (callback) {
      var priv = "EnterReceipts";
      return _canDo.call(this, priv, callback);
    },

    doReceiveAll: function (callback) {
      return _doDispatch.call(this, "receiveAll", callback);
    }

  });

  /** @private */
  var _canDo = function (priv, callback) {
    var ret = XT.session.privileges.get(priv);
    if (callback) {
      callback(ret);
    }
    return ret;
  };

  /** @private */
  
  var _doDispatch = function (method, callback, params) {
    var that = this,
      options = {};
    params = params || [];
    params.unshift(this.id);
    options.success = function (resp) {
      var fetchOpts = {};
      fetchOpts.success = function () {
        if (callback) { callback(resp); }
      };
      if (resp) {
        that.fetch(fetchOpts);
      }
    };
    options.error = function (resp) {
      if (callback) { callback(resp); }
    };
    this.dispatch("XM.Inventory", method, params, options);
    return this;
  };

  /**
    @class

    @extends XM.Info
  */
  XM.PurchaseOrderRelation = XM.Info.extend({
    /** @scope XM.PurchaseOrderRelation.prototype */

    recordType: 'XM.PurchaseOrderRelation',

    editableModel: 'XM.PurchaseOrder',

    descriptionKey: "number"

  });

  /**
    @class

    @extends XM.Info
  */
  XM.PurchaseOrderListItem = XM.Info.extend({
    /** @scope XM.ContactListItem.prototype */

    recordType: 'XM.PurchaseOrderListItem',

    editableModel: 'XM.PurchaseOrder'

  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.PurchaseOrderLineCollection = XM.Collection.extend({
    /** @scope XM.PurchaseOrderLineCollection.prototype */

    model: XM.PurchaseOrderLine

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.PurchaseOrderListItemCollection = XM.Collection.extend({
    /** @scope XM.PurchaseOrderListItemCollection.prototype */

    model: XM.PurchaseOrderListItem

  });

}());

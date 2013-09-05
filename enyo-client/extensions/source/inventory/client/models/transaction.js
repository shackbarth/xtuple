/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true */

(function () {
  "use strict";

  /**
    @class
    An abstract model used as a base for transactions.

    @extends XM.Model
  */
  XM.Transaction = XM.Model.extend({

    /**
      The attribute used to supply the transaction quantity.
    */
    quantityAttribute: null,

    /**
      Attempt to distribute any undistributed inventory to default location.

      @returns {Object} Receiver
    */
    distributeToDefault: function () {
      var itemSite = this.get("itemSite"),
        autoIssue = itemSite.get("stockLocationAuto"),
        stockLoc,
        toIssue,
        undistributed,
        detail;

      if (!autoIssue) { return this; }

      stockLoc = itemSite.get("stockLocation");
      toIssue = this.get("toIssue");
      undistributed = this.undistributed();
      detail = _.find(itemSite.get("detail").models, function (model) {
        return  model.get("location").id === stockLoc.id;
      });
      
      if (detail) { // Might not be any inventory there now
        detail.distribute(undistributed);
      }

      return this;
    },

    /**
      Formats distribution detail to an object that can be processed by
      dispatch function called in `save`.

      @returns {Object}
    */
    formatDetail: function () {
      var ret = [],
        details = this.getValue("itemSite.detail").models;
      _.each(details, function (detail) {
        var qty = detail.get("distributed");
        if (qty) {
          ret.push({
            location: detail.get("location").id,
            quantity: qty
          });
        }
      });
      return ret;
    },

    /**
      Returns whether detail distribution is required for the item site
      being transacted.

      @returns {Boolean}
    */
    requiresDetail: function () {
      return this.getValue("itemSite.locationControl");
    },

    /**
      Return the quantity of items that require detail distribution.
    
      @returns {Number}
    */
    undistributed: function () {
      var toIssue = this.get(this.quantityAttribute),
        scale = XT.QTY_SCALE,
        undist = 0,
        dist;
      // We only care about distribution on controlled items
      if (this.requiresDetail() && toIssue) {
        // Get the distributed values
        dist = _.pluck(_.pluck(this.getValue("itemSite.detail").models, "attributes"), "distributed");
        // Filter on only ones that actually have a value
        if (dist.length) {
          undist = XT.math.add(dist, scale);
        }
        undist = XT.math.subtract(toIssue, undist, scale);
      }
      return undist;
    }

  });

}());


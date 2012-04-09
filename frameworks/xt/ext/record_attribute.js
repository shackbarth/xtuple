// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT Money Quantity QuantityPer Cost SalesPrice PurchasePrice Percent
          UnitRatio Weight */

// Contributions from SC.RecordAttribute:
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

sc_require('ext/numeric');

/** @private
  xTuple converter for SC.Record-type records.
  Treat -1 same as null.
 */
SC.RecordAttribute.registerTransform(SC.Record, {

  /** @private - convert a record id to a record instance */
  to: function(id, attr, recordType, parentRecord) {
    var store = parentRecord.get('store');

    if (SC.none(id) || (id==="") || id < 0) return null;
    else return store.find(recordType, id);
  },

  /** @private - convert a record instance to a record id */
  from: function(record) { return record ? record.get('id') : null; }

});

/** @private - xtuple converter for database form of money */
SC.RecordAttribute.registerTransform(Money, {

  /** @private */
  to: function(val) {
    return SC.none(val) ? null : SC.Math.round(val, XT.MONEY_SCALE);
  },

  /** @private */
  from: function(val) {
    return SC.none(val) ? null : SC.Math.round(val, XT.MONEY_SCALE);
  }

});

/** @private - xtuple converter for database form of quantity */
SC.RecordAttribute.registerTransform(Quantity, {

  /** @private  */
  to: function(val) {
    return SC.none(val) ? null : SC.Math.round(val, XT.QTY_SCALE);
  },

  /** @private  */
  from: function(val) {
    return SC.none(val) ? null : SC.Math.round(val, XT.QTY_SCALE);
  }

});

/** @private - xtuple converter for database form of quantity per */
SC.RecordAttribute.registerTransform(QuantityPer, {

  /** @private */
  to: function(val) {
    return SC.none(val) ? null : SC.Math.round(val, XT.QTY_PER_SCALE);
  },

  /** @private  */
  from: function(val) {
    return SC.none(val) ? null : SC.Math.round(val, XT.QTY_PER_SCALE);
  }

});

/** @private - xtuple converter for database form of cost */
SC.RecordAttribute.registerTransform(Cost, {

  /** @private */
  to: function(val) {
    return SC.none(val) ? null : SC.Math.round(val, XT.COST_SCALE);
  },

  /** @private  */
  from: function(val) {
    return SC.none(val) ? null : SC.Math.round(val, XT.COST_SCALE);
  }

});

/** @private - xtuple converter for database form of sales price */
SC.RecordAttribute.registerTransform(SalesPrice, {

  /** @private */
  to: function(val) {
    return SC.none(val) ? null : SC.Math.round(val, XT.SALES_PRICE_SCALE);
  },

  /** @private */
  from: function(val) {
    return SC.none(val) ? null : SC.Math.round(val, XT.SALES_PRICE_SCALE);
  }

});

/** @private - xtuple converter for database form of purchase price */
SC.RecordAttribute.registerTransform(PurchasePrice, {

  /** @private */
  to: function(val) {
    return SC.none(val) ? null : SC.Math.round(val, XT.PURCHASE_PRICE_SCALE);
  },

  /** @private  */
  from: function(val) {
    return SC.none(val) ? null : SC.Math.round(val, XT.PURCHASE_PRICE_SCALE);
  }

});

/** @private - xtuple converter for database form of quantity per */
SC.RecordAttribute.registerTransform(UnitRatio, {

  /** @private */
  to: function(val) {
    return SC.none(val) ? null : SC.Math.round(val, XT.UNIT_RATIO_SCALE);
  },

  /** @private  */
  from: function(val) {
    return SC.none(val) ? null : SC.Math.round(val, XT.UNIT_RATIO_SCALE);
  }

});

/** @private - xtuple converter for database form of percent */
SC.RecordAttribute.registerTransform(Percent, {

  /** @private */
  to: function(val) {
    return SC.none(val) ? null : SC.Math.round(val * 100, XT.PERCENT_SCALE);
  },

  /** @private - convert a percent to a number for persistent storage */
  from: function(val) {
    return SC.none(val) ? null : SC.Math.round(val / 100, XT.PERCENT_SCALE);
  }

});

/** @private - xtuple converter for database form of quantity per */
SC.RecordAttribute.registerTransform(Weight, {

  /** @private */
  to: function(val) {
    return SC.none(val) ? null : SC.Math.round(val, XT.WEIGHT_SCALE);
  },

  /** @private  */
  from: function(val) {
    return SC.none(val) ? null : SC.Math.round(val, XT.WEIGHT_SCALE);
  }

});

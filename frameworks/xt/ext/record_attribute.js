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
sc_require('ext/date_time');

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

SC.RecordAttribute.registerTransform(XT.DateTime, {

  /** @private
    Convert a String to a DateTime
  */
  to: function(str, attr) {
    if (SC.none(str) || SC.instanceOf(str, XT.DateTime)) return str;
    if (SC.none(str) || SC.instanceOf(str, Date)) return XT.DateTime.create(str.getTime());
    var format = attr.get('format');
    return XT.DateTime.parse(str, format ? format : XT.DateTime.recordFormat);
  },

  /** @private
    Convert a DateTime to a String
  */
  from: function(dt, attr) {
    if (SC.none(dt)) return dt;
    var format = attr.get('format');
    return dt.toFormattedString(format ? format : XT.DateTime.recordFormat);
  }
});

/** @private - xtuple converter for database form of money */
SC.RecordAttribute.registerTransform(Money, {

  /** @private */
  to: function(val) {
    return SC.none(val) ? null : val.toMoney();
  },

  /** @private */
  from: function(val) {
    return SC.none(val) ? null : val.valueOf().toMoney().valueOf();
  }

});

/** @private - xtuple converter for database form of quantity */
SC.RecordAttribute.registerTransform(Quantity, {

  /** @private */
  to: function(val) {
    return SC.none(val) ? null : val.toQuantity();
  },

  /** @private */
  from: function(val) {
    return SC.none(val) ? null : val.valueOf().toQuantity().valueOf();
  }

});

/** @private - xtuple converter for database form of quantity per */
SC.RecordAttribute.registerTransform(QuantityPer, {

  /** @private */
  to: function(val) {
    return SC.none(val) ? null : val.toQuantityPer();
  },

  /** @private */
  from: function(val) {
    return SC.none(val) ? null : val.valueOf().toQuantityPer().valueOf();
  }

});

/** @private - xtuple converter for database form of cost */
SC.RecordAttribute.registerTransform(Cost, {

  /** @private */
  to: function(val) {
    return SC.none(val) ? null : val.toCost();
  },

  /** @private */
  from: function(val) {
    return SC.none(val) ? null : val.valueOf().toCost().valueOf();
  }

});

/** @private - xtuple converter for database form of sales price */
SC.RecordAttribute.registerTransform(SalesPrice, {

  /** @private */
  to: function(val) {
    return SC.none(val) ? null : val.toSalesPrice();
  },

  /** @private */
  from: function(val) {
    return SC.none(val) ? null : val.valueOf().toSalesPrice().valueOf();
  }

});

/** @private - xtuple converter for database form of purchase price */
SC.RecordAttribute.registerTransform(PurchasePrice, {

  /** @private */
  to: function(val) {
    return SC.none(val) ? null : val.toPurchasePrice();
  },

  /** @private */
  from: function(val) {
    return SC.none(val) ? null : val.valueOf().toPurchasePrice().valueOf();
  }

});

/** @private - xtuple converter for database form of extended price */
SC.RecordAttribute.registerTransform(ExtendedPrice, {

  /** @private */
  to: function(val) {
    return SC.none(val) ? null : val.toExtendedPrice();
  },

  /** @private */
  from: function(val) {
    return SC.none(val) ? null : val.valueOf().toExtendedPrice().valueOf();
  }

});

/** @private - xtuple converter for database form of quantity per */
SC.RecordAttribute.registerTransform(UnitRatio, {

  /** @private */
  to: function(val) {
    return SC.none(val) ? null : val.toUnitRatio();
  },

  /** @private */
  from: function(val) {
    return SC.none(val) ? null : val.valueOf().toUnitRatio().valueOf();
  }

});

/** @private - xtuple converter for database form of percent */
SC.RecordAttribute.registerTransform(Percent, {

  /** @private */
  to: function(val) {
    return SC.none(val) ? null : val.toPercent();
  },

  /** @private */
  from: function(val) {
    return SC.none(val) ? null : val.valueOf().toPercent().valueOf();
  }

});

/** @private - xtuple converter for database form of quantity per */
SC.RecordAttribute.registerTransform(Weight, {

  /** @private */
  to: function(val) {
    return SC.none(val) ? null : val.toWeight();
  },

  /** @private */
  from: function(val) {
    return SC.none(val) ? null : val.valueOf().toWeight().valueOf();
  }
});

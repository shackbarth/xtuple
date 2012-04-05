// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_payable');

/**
  @class

  @extends XM.SubLedger
*/
XM.Payable = XM.SubLedger.extend(XM._Payable,
  /** @scope XM.Payable.prototype */ {

  // .................................................
  // CALCULATED PROPERTIES
  //

  //..................................................
  // METHODS
  //
  
  init: function() {
    arguments.callee.base.apply(this, arguments);
    this.payableStatus.set('isEditable', false);
  },

  //..................................................
  // OBSERVERS
  //
  
  vendorDidChange: function() {
    if (this.isNotDirty()) return;
    var vendor = this.get('vendor');
    if (vendor) {
      this.setIfChanged('terms', vendor.get('terms'));
      this.setIfChanged('currency', vendor.get('currency'));
    }
  }.observes('vendor'),
  
  statusDidChange: function() {
    arguments.callee.base.apply(this, arguments);
    if (this.get('status') == SC.Record.READY_CLEAN) {
      this.vendor.set('isEditable', false);
    }
  }.observes('status')
  
});


// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals global Postbooks XM XT sc_assert */

sc_require('states/module');

Postbooks.PAYMENTS = Postbooks.MODULE.design({

  route: 'payments',
  title: "_payments",
  submodules: 'Vendor Voucher Payable PaymentApproval Payment'.w(),

  // ACTIONS

  showVendor: function() {
    this.gotoState('VENDOR');
  },

  showVoucher: function() {
    this.gotoState('VOUCHER');
  },

  showPayable: function() {
    this.gotoState('PAYABLE');
  },

  showPaymentApproval: function() {
    this.gotoState('PAYMENT_APPROVAL');
  },

  showPayment: function() {
    this.gotoState('PAYMENT');
  },

  // SUBSTATES

  "VENDOR":           SC.State.plugin('Postbooks.VENDOR'),
  "VOUCHER":          SC.State.plugin('Postbooks.VOUCHER'),
  "PAYABLE":          SC.State.plugin('Postbooks.PAYABLE'),
  "PAYMENT_APPROVAL": SC.State.plugin('Postbooks.PAYMENT_APPROVAL'),
  "PAYMENT":          SC.State.plugin('Postbooks.PAYMENT')

});

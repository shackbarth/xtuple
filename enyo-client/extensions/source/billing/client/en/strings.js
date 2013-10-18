/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";

  var lang = XT.stringsFor("en_US", {

    // ********
    // Labels
    // ********

    "_accountsReceivable": "Accounts Receivable",
    "_autoCloseARIncident": "Auto Close Incidents when Invoid Paid",
    "_autoCreditWarnLateCustomers": "Credit warn Customers when Late",
    "_billing": "Billing",
    "_billingDescription": "Corporate Relationship Management",
    "_creditTaxDiscount": "Credit Taxes for Early Payment Discounts",
    "_defaultAutoCreditWarnGraceDays": "Default Grace Period Days",
    "_enableCustomerDeposits": "Enable Customer Deposits",
    "_hideApplyToBalance": "Hide Apply to Balance",
    "_salesCategory": "Sales Category",
    "_salesCategories": "Sales Categories",
    "_maintainSalesCategory": "Maintain Sales Category",
    "_nextARMemoNumber": "Next Receivables Memo",
    "_nextCashRcptNumber": "Next Cash Receipt",
    "_recurringInvoiceBuffer": "Recurring Invoice Buffer Days",
    "_defaultARIncidentStatus": "Default Incident Category"


  });

  if (typeof exports !== 'undefined') {
    exports.language = lang;
  }
}());
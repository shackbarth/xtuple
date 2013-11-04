select xt.install_js('XM','Invoice','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */
  
  XM.Invoice = {};

  XM.Invoice.isDispatchable = true;

  XM.Invoice.allocatedCredit = function(invoiceNumber) {
    var sql = "select xt.invc_allocated_credit(invchead) AS result FROM invchead " +
      "where invchead_number = $1";

    return plv8.execute(sql, [invoiceNumber])[0].result;
  };

  XM.Invoice.authorizedCredit = function(invoiceNumber) {
    var sql = "select xt.invc_authorized_credit($1) AS result";

    return plv8.execute(sql, [invoiceNumber])[0].result;
  };

  XM.Invoice.outstandingCredit = function(customerNumber, currencyAbbreviation, invoiceDate) {
    var sql = "select xt.invc_outstanding_credit($1, $2, $3) AS result",
      customerId = XT.Data.getId(XT.Orm.fetch('XM', 'Customer'), customerNumber),
      currencyId = XT.Data.getId(XT.Orm.fetch('XM', 'Currency'), currencyAbbreviation);

    return plv8.execute(sql, [customerId, currencyId, invoiceDate])[0].result;
  };

  XM.Invoice.post = function(invoiceNumber) {
    var invoiceId = XT.Data.getId(XT.Orm.fetch('XM', 'Invoice'), invoiceNumber);
    return XT.executeFunction("postinvoice", [invoiceId]);
  };

  XM.Invoice.void = function(invoiceNumber) {
    var invoiceId = XT.Data.getId(XT.Orm.fetch('XM', 'Invoice'), invoiceNumber);
    return XT.executeFunction("voidinvoice", [invoiceId]);
  };
$$ );

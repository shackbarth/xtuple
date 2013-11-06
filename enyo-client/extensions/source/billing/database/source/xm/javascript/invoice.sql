select xt.install_js('XM','Invoice','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */
  
  XM.Invoice = {};

  XM.Invoice.isDispatchable = true;

  XM.Invoice.authorizedCredit = function(invoiceNumber) {
    var err,
      sql = "select xt.invc_authorized_credit($1) AS result";

    return plv8.execute(sql, [invoiceNumber])[0].result;
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

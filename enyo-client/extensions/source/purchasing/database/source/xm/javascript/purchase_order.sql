select xt.install_js('XM','PurchaseOrder','purchasing', $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  if (!XM.PurchaseOrder) { XM.PurchaseOrder = {}; }

  XM.PurchaseOrder.isDispatchable = true;

  /**
    Return whether a Purchase Order is referenced by another table.
    
    @param {String} Purchase Order Number
  */
  XM.PurchaseOrder.used = function(id) {
    var sql = "select pohead_status from pohead where pohead_number=$1";
      status = plv8.execute(sql, [id])[0].pohead_status;

    if (status !== "U") { return true; }

    sql = "select count(*) > 0 as used " +
          "from recv " +
          "where recv_order_type='PO' and recv_order_number = $1;";
    return plv8.execute(sql, [id])[0].used;
  };

}());
  
$$ );

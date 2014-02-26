select xt.install_js('XM','PurchaseOrder','purchasing', $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  if (!XM.PurchaseOrder) { XM.PurchaseOrder = {}; }

  XM.PurchaseOrder.isDispatchable = true;

  /**
    Find an Unreleased Purchase Order number by Item Source.
    
    @param {String} Item Source uuid.
    @returns {String}
  */
  XM.PurchaseOrder.findUnreleased = function(itemSourceId) {
    var sql = "select pohead_number " +
              "from pohead " +
              " join itemsrc on itemsrc_vend_id=pohead_vend_id " +
              "where pohead_status='U'" +
              " and itemsrc.obj_uuid=$1 " +
              "order by pohead_number " +
              "limit 1;";
      rows = plv8.execute(sql, [itemSourceId]);

    return rows.length ? rows[0].pohead_number : false;
  };

  /**
    Release a Purchase Order.
    
    @param {String} Purchase Order Number
  */
  XM.PurchaseOrder.release = function(id) {
    var orm = XT.Orm.fetch("XM", "PurchaseOrder"),
      data = Object.create(XT.Data),
      id = data.getId(orm, id);

    /* Make sure user can do this */
    if (!XT.Data.checkPrivilege("ReleasePurchaseOrders")) {
      throw new handleError("Access Denied", 401);
    }

    XT.executeFunction("releasePurchaseOrder", [id]);
    return true;
  };

  /**
    Unrelease a Purchase Order.
    
    @param {String} Purchase Order Number
  */
  XM.PurchaseOrder.unrelease = function(id) {
    var orm = XT.Orm.fetch("XM", "PurchaseOrder"),
      data = Object.create(XT.Data),
      id = data.getId(orm, id);

    /* Make sure user can do this */
    if (!XT.Data.checkPrivilege("UnreleasePurchaseOrders")) {
      throw new handleError("Access Denied", 401);
    }

    XT.executeFunction("unreleasePurchaseOrder", [id]);
    return true;
  };

  /**
    Return whether a Purchase Order is referenced by another table.
    
    @param {String} Purchase Order Number
  */
  XM.PurchaseOrder.used = function(id, ignoreStatus) {
    var sql = "select pohead_status from pohead where pohead_number=$1";
      status = plv8.execute(sql, [id])[0].pohead_status;

    if (!ignoreStatus && status !== "U") { return true; }

    sql = "select count(*) > 0 as used " +
          "from recv " +
          "where recv_order_type='PO' and recv_order_number = $1;";
    return plv8.execute(sql, [id])[0].used;
  };

}());
  
$$ );

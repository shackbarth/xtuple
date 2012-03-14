select xt.install_js('XM','item','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  XM.Item = {};
  
  XM.Item.isDispatchable = true;

  /** 
   Return the selling units of measure for a given item id.

   @param {Number} item id
   @returns {Array}
  */
  XM.Item.sellingUnits = function(itemId) {
     return XM.Item._units(itemId, 'Selling');
  }

  /** 
   Return the material issue units of measure for a given item id.

   @param {Number} item id
   @returns {Array}
  */
  XM.Item.materialIssueUnits = function(itemId) {
     return XM.Item._units(itemId, '"MaterialIssue"');
  }
  
  /** @private
   Return the units of measure for a given item id and type.

   @param {Number} item id
   @returns {Array}
  */
  XM.Item._units = function(itemId, type) {
    var sql = "select array("
            + "select uom_id "
            + "from item "
            + "  join uom on item_inv_uom_id=uom_id "
            + "where item_id=$1 "
            + "union "
            + "select itemuomconv_from_uom_id "
            + "from itemuomconv "
            + "  join itemuom on itemuom_itemuomconv_id=itemuomconv_id "
            + "  join uomtype on uomtype_id=itemuom_uomtype_id "
            + "where itemuomconv_item_id=$1 "
            + "  and uomtype_name=$2 "
            + "union "
            + "select itemuomconv_to_uom_id "
            + "from itemuomconv "
            + "  join itemuom on itemuom_itemuomconv_id=itemuomconv_id "
            + "  join uomtype on uomtype_id=itemuom_uomtype_id "
            + "where uomtype_name=$2 "
            + " and itemuomconv_item_id=$1) as units ";

     return JSON.stringify(executeSql(sql, [itemId, type]));
  }

$$ );

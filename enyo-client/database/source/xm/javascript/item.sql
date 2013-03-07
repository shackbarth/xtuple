select xt.install_js('XM','item','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  XM.Item = {};
  
  XM.Item.isDispatchable = true;

  XM.Item.availableItems = function (query, customerId, shiptoId) {
    return JSON.stringify({data: []});
  };

  /**
    Returns the standard unit cost for an item.
    
    @param {Number} item id
    @returns {Number}
  */
  XM.Item.standardCost = function(itemId) {
    var sql = 'select stdcost($1) as cost';
    return plv8.execute(sql, [itemId])[0].cost;
  }

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

  /**
    Returns a tax type id for a given item and tax zone.
    
    @param {Number} item id
    @param {Number} tax zone id
    @returns {Number} tax type id
  */
  XM.Item.taxType = function(itemId, taxZoneId) {
    var sql = 'select getItemTaxType($1, $2::integer) as "taxType";'
    return plv8.execute(sql, [itemId, taxZoneId])[0].taxType;
  }

  /**
    Returns a unit of measure conversion ratio for a given item, from unit and to unit.
    
    @param {Number} item id
    @param {Number} from unit id
    @param {Number} to unit id
    @returns {Number} conversion ratio
  */
  XM.Item.unitToUnitRatio = function(itemId, fromUnitId, toUnitId) {
    var sql = 'select itemUomToUomRatio($1, $2, $3) as "ratio"';
    return plv8.execute(sql, [itemId, fromUnitId, toUnitId])[0].ratio;
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

     return JSON.stringify(plv8.execute(sql, [itemId, type])[0].units);
  }

$$ );

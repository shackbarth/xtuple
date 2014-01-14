/* Delete previously misnamed record */
delete from xt.js where js_context='xtuple' and js_type = 'item';

select xt.install_js('XM','Item','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

(function () {

  if (!XM.Item) { XM.Item = {}; }
  
  XM.Item.isDispatchable = true;
  
  /**
    Returns the standard unit cost for an item.
    
    @param {Number} item id
    @returns {Number}
  */
  XM.Item.standardCost = function(itemId) {
    var sql = 'select stdcost(item_id) as cost from item where item_number = $1;';
    return plv8.execute(sql, [itemId])[0].cost;
  }

  /** 
   Return the selling units of measure for a given item id.

   @param {Number} item id
   @returns {Array}
  */
  XM.Item.sellingUnits = function(itemId) {
     return _units(itemId, 'Selling');
  }

  /** 
   Return the material issue units of measure for a given item id.

   @param {Number} item id
   @returns {Array}
  */
  XM.Item.materialIssueUnits = function(itemId) {
     return _units(itemId, 'MaterialIssue');
  }

  /**
    Returns a tax type id for a given item and tax zone.
    
    @param {Number} item id
    @param {Number} tax zone id
    @returns {Number} tax type id
  */
  XM.Item.taxType = function(itemId, taxZoneId) {
    var sql = 'select getitemtaxtype(item_id, $2::integer) as "taxType" from item where item_number = $1;',
      id;
    if (taxZoneId) {
      taxZoneId = XT.Data.getId(XT.Orm.fetch('XM','TaxZone'), taxZoneId);
    }
    id = plv8.execute(sql, [itemId, taxZoneId])[0].taxType || 0;
    sql = "select taxtype_name from taxtype where taxtype_id = $1";
    return id ? plv8.execute(sql, [id])[0].taxtype_name : "";
  }

  /**
    Returns whether a unit of measure is fractional for a particular item.
    
    @param {Number} item id
    @param {Number} unit id
    @returns {Boolean}
  */
  XM.Item.unitFractional = function(itemId, unitId) {
    var sql = 'select itemuomfractionalbyuom(item_id, uom_id) as "fractional"' +
              'from item, uom where item_number = $1 and uom_name = $2;';
    return plv8.execute(sql, [itemId, unitId])[0].fractional;
  }

  /**
    Returns a unit of measure conversion ratio for a given item, from unit and to unit.
    
    @param {Number} item id
    @param {Number} from unit id
    @param {Number} to unit id
    @returns {Number}
  */
  XM.Item.unitToUnitRatio = function(itemId, fromUnitId, toUnitId) {
    var sql = 'select itemuomtouomratio($1, $2, $3) as "ratio"' +
              'from item, uom fu, uom tu ' +
              'where item_number = $4 and fu.uom_name = $5 and tu.uom_name = $6;';
    /* resolve natural keys to primary keys */
    var itemPrimaryId = itemId ? XT.Data.getId(XT.Orm.fetch('XM', 'Item'), itemId) : null;
    var fromUnitPrimaryId = fromUnitId ? XT.Data.getId(XT.Orm.fetch('XM', 'Unit'), fromUnitId) : null;
    var toUnitPrimaryId = toUnitId ? XT.Data.getId(XT.Orm.fetch('XM', 'Unit'), toUnitId) : null;
    
    return plv8.execute(sql, [itemPrimaryId, fromUnitPrimaryId, toUnitPrimaryId,
      itemId, fromUnitId, toUnitId])[0].ratio;
  }
  
  /** @private
   Return the units of measure for a given item id and type.

   @param {Number} item id
   @returns {Array}
  */
  var _units = function(itemId, type) {
    var sql = "select array(" +
	    "select uom_name " +
            "from item " +
            "  join uom on item_inv_uom_id=uom_id " +
            "where item_number=$1 " +
            "union " +
            "select uom_name " +
            "from uom " +
            "  join itemuomconv on uom_id = itemuomconv_from_uom_id " +
            "  join itemuom on itemuom_itemuomconv_id=itemuomconv_id " +
            "  join uomtype on uomtype_id=itemuom_uomtype_id " +
            "  join item on itemuomconv_item_id=item_id " +
            "where item_number=$1 " +
            "  and uomtype_name=$2 " +
            "union " +
            "select uom_name " +
            "from uom " +
            "  join itemuomconv on uom_id = itemuomconv_to_uom_id " +
            "  join itemuom on itemuom_itemuomconv_id=itemuomconv_id " +
            "  join uomtype on uomtype_id=itemuom_uomtype_id " +
            "  join item on itemuomconv_item_id=item_id " +
            "where uomtype_name=$2 " +
            " and item_number=$1) as units ";
plv8.elog(NOTICE, "sql->", sql)
     return plv8.execute(sql, [itemId, type])[0].units;
  }

}());

$$ );

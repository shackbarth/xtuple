select xt.install_js('XM','item','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  XM.Item = {};
  
  XM.Item.isDispatchable = true;

  /**
    Runs what amounts to a fetch based on the query, with the extra
    restriction that the results are limited by the custitem function,
    which makes sure that the customer (and/or shipto) is allowed to
    ship this function
   */
  XM.Item.availableItems = function (query, customerId, shiptoId) {
    var nameSpace = "XM",
      type = "ItemSite",
      table = (nameSpace + '."' + type + '"').decamelize(),
      orm = XT.Orm.fetch(nameSpace, type),
      key = XT.Orm.primaryKey(orm),
      limit = query.rowLimit ? 'limit ' + query.rowLimit : '',
      offset = query.rowOffset ? 'offset ' + query.rowOffset : '',
      parts,
      custItemFilter = "",
      clause = XT.Data.buildClause("XM", "ItemSite", query.parameters, query.orderBy),
      sql = 'select * from {table} where {key} in ' +
            '(select {key} from {table} where {conditions} {custItemFilter} {orderBy} {limit} {offset}) ' +
            '{orderBy}';


    /* validate - don't bother running the query if the user has no privileges */
    if(!XT.Data.checkPrivileges(nameSpace, type)) { return []; };

    /* Restrict results to items that are associated with the customer and/or shipto */ 
    var custItemSql = 'select * from custitem($1, $2, $3);';
    var allowedArray = plv8.execute(custItemSql, [customerId, shiptoId, new Date()]); /* TODO: which date? */
    var allowedIds = [];
    for(var i = 0; i < allowedArray.length; i++) {
      allowedIds.push(allowedArray[i].custitem);
    }
    var sqlFriendlyAllowedIds = JSON.stringify(allowedIds).replace("[", "").replace("]", "");
    custItemFilter = ' and ((("item")."id" in (' + sqlFriendlyAllowedIds + '))) ';

    /* query the model */
    sql = sql.replace(/{table}/g, table)
             .replace(/{key}/g, key)
             .replace('{conditions}', clause.conditions)
             .replace('{custItemFilter}', custItemFilter)
             .replace(/{orderBy}/g, clause.orderBy)
             .replace('{limit}', limit)
             .replace('{offset}', offset);
    plv8.elog(NOTICE, 'sql = ', sql);
    return JSON.stringify(plv8.execute(sql, clause.parameters));
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

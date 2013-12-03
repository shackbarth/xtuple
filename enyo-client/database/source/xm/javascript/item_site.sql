select xt.install_js('XM','item_site','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

(function () {

  if (!XM.ItemSite) { XM.ItemSite = {}; }
  
  XM.ItemSite.isDispatchable = true;

  /**
    Return the current cost for a particular item site.
  */
  XM.ItemSite.cost = function (itemsiteId) {
    if (!XT.Data.checkPrivilege('ViewCosts')) { return null };
    return plv8.execute('select itemcost(itemsite_id) as cost from itemsite where obj_uuid = $1;', [itemsiteId])[0].cost;
  },

  /**
    Runs what amounts to a fetch based on the query, with the extra
    restriction that the results are limited by the custitem function,
    which makes sure that the customer (and/or shipto) is allowed to
    ship this function

    @param {Number} Customer Id
    @param {Number} Shipto Id
    @param {Number} As Of Date
    @param {Object} Additional query filter (Optional)
    @returns {Array}
   */
  XM.ItemSite.itemsForCustomer = function (customerId, shiptoId, effectiveDate, query) {
    customerId = customerId ? XT.Data.getId(XT.Orm.fetch('XM', 'CustomerProspectRelation'), customerId) : null;
    shiptoId = shiptoId ? XT.Data.getId(XT.Orm.fetch('XM', 'CustomerShipto'), shiptoId) : -1;
    effectiveDate = effectiveDate || new Date();
    query = query || {};
    var limit = query.rowLimit ? 'limit ' + Number(query.rowLimit) : '',
      offset = query.rowOffset ? 'offset ' + Number(query.rowOffset) : '',
      clause = XT.Data.buildClause("XM", "ItemSite", query.parameters, query.orderBy),
      spliceIndex,
      oneIfSplice = 0,
      aliasInjection,
      itemNumber,
      sql = 'select * from xm.item_site_list_item where id in ' +
            '(select id ' +
            ' from xm.item_site_list_item ' +
            ' where {conditions} ';

    if (customerId) {
      sql = sql + ' and (item).id in (select * from custitem(${p2}, ${p3}::integer, ${p4}::date)) ';
    }
    sql = sql + '{orderBy} {limit} {offset}) ' +
      '{orderBy}';

    /* crazily splice in the option of querying by alias in the middle of the item number part of the WHERE */
    spliceIndex = clause.conditions.indexOf('or (item).barcode');
    if (spliceIndex >= 0) {
      oneIfSplice = 1;
      aliasInjection = " or (item).number in (select item_number from item inner join itemalias " + 
        "on item_id = itemalias_item_id where itemalias_number ~^ ${p1}) "
      clause.conditions = clause.conditions.substring(0, spliceIndex) + aliasInjection + clause.conditions.substring(spliceIndex);
      itemNumber = query.parameters.filter(function (param) {
        return param.attribute && param.attribute.length && param.attribute.indexOf("item.number") >= 0;
      })[0].value;
    }

    /* query the model */
    sql = sql.replace('{conditions}', clause.conditions)
             .replace(/{orderBy}/g, clause.orderBy)
             .replace('{limit}', limit)
             .replace('{offset}', offset)
             .replace('{p1}', clause.parameters.length + 1)
             .replace('{p2}', clause.parameters.length + 1 + oneIfSplice)
             .replace('{p3}', clause.parameters.length + 2 + oneIfSplice)
             .replace('{p4}', clause.parameters.length + 3 + oneIfSplice);

    if (spliceIndex >= 0) {
      clause.parameters = clause.parameters.concat([itemNumber]);
    }
    if (customerId) {
      clause.parameters = clause.parameters.concat([customerId, shiptoId, effectiveDate]);
    }
    if (DEBUG) { plv8.elog(NOTICE, 'sql = ', sql); }
    return plv8.execute(sql, clause.parameters);
  };

}());

$$ );


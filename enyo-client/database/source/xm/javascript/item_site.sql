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
    customerId = XT.Data.getId(XT.Orm.fetch('XM', 'CustomerProspectRelation'), customerId);
    shiptoId = shiptoId ? XT.Data.getId(XT.Orm.fetch('XM', 'CustomerShipto'), shiptoId) : -1;
    effectiveDate = effectiveDate || new Date();
    query = query || {};
    var limit = query.rowLimit ? 'limit ' + query.rowLimit : '',
      offset = query.rowOffset ? 'offset ' + query.rowOffset : '',
      clause = XT.Data.buildClause("XM", "ItemSite", query.parameters, query.orderBy),
      sql = 'select * from xm.item_site_list_item where id in ' +
            '(select id ' +
            ' from xm.item_site_list_item ' +
            ' where {conditions} ' +
            '  and (item).id in (select * from custitem(${p1}, ${p2}::integer, ${p3}::date)) ' +
            '{orderBy} {limit} {offset}) ' +
            '{orderBy}';

    /* query the model */
    sql = sql.replace('{conditions}', clause.conditions)
             .replace(/{orderBy}/g, clause.orderBy)
             .replace('{limit}', limit)
             .replace('{offset}', offset)
             .replace('{p1}', clause.parameters.length + 1)
             .replace('{p2}', clause.parameters.length + 2)
             .replace('{p3}', clause.parameters.length + 3);
    clause.parameters = clause.parameters.concat([customerId, shiptoId, effectiveDate]);
    if (DEBUG) { plv8.elog(NOTICE, 'sql = ', sql); }
    return JSON.stringify(plv8.execute(sql, clause.parameters));
  };

}());

$$ );


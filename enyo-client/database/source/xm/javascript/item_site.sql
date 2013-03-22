select xt.install_js('XM','item_site','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  XM.ItemSite = {};
  
  XM.ItemSite.isDispatchable = true;

  /**
    Runs what amounts to a fetch based on the query, with the extra
    restriction that the results are limited by the custitem function,
    which makes sure that the customer (and/or shipto) is allowed to
    ship this function
   */
  XM.ItemSite.itemsForCustomer = function (query, customerId, shiptoId, effectiveDate, defaultSiteId) {
    var nameSpace = "XM",
      type = "ItemSite",
      table = (nameSpace + '."' + type + '"').decamelize(),
      orm = XT.Orm.fetch(nameSpace, type),
      key = XT.Orm.primaryKey(orm),
      limit = query.rowLimit ? 'limit ' + query.rowLimit : '',
      offset = query.rowOffset ? 'offset ' + query.rowOffset : '',
      parts,
      custItemFilter = "",
      defaultSiteOrderBy = "",
      defaultSiteOrderByAgain = "",
      defaultSiteId = defaultSiteId || -1,
      clause = XT.Data.buildClause("XM", "ItemSite", query.parameters, query.orderBy),
      sql = 'select * from {table} where {key} in ' +
            '(select {key} from {table} where {conditions} {custItemFilter} {orderBy} {defaultSiteOrderBy} {limit} {offset}) ' +
            '{orderBy} {defaultSiteOrderByAgain}';


    /* validate - don't bother running the query if the user has no privileges */
    if(!XT.Data.checkPrivileges(nameSpace, type)) { return []; };

    /* Restrict results to items that are associated with the customer and/or shipto */ 
    var custItemSql = 'select * from custitem($1, $2::integer, $3::date);';
    var allowedArray = plv8.execute(custItemSql, [customerId, shiptoId, effectiveDate]);
    var allowedIds = [];
    for(var i = 0; i < allowedArray.length; i++) {
      allowedIds.push(allowedArray[i].custitem);
    }
    var sqlFriendlyAllowedIds = JSON.stringify(allowedIds).replace("[", "").replace("]", "");
    custItemFilter = ' and ((("item")."id" in (' + sqlFriendlyAllowedIds + '))) ';

    /* 
    We want the default site to be listed above the others if there is one. 
    To prevent SQL injection we have to set it as a parameter, which defaults to harmless -1.
    Clever: sneakily push this param onto the end of the array we already have 
    */
    clause.parameters.push(defaultSiteId);
    defaultSiteOrderBy = ", (\"site\").\"id\" = $" + clause.parameters.length + " DESC";
    clause.parameters.push(defaultSiteId);
    defaultSiteOrderByAgain = ", (\"site\").\"id\" = $" + clause.parameters.length + " DESC";

    /* query the model */
    sql = sql.replace(/{table}/g, table)
             .replace(/{key}/g, key)
             .replace('{conditions}', clause.conditions)
             .replace('{custItemFilter}', custItemFilter)
             .replace(/{orderBy}/g, clause.orderBy)
             .replace('{defaultSiteOrderBy}', defaultSiteOrderBy)
             .replace('{defaultSiteOrderByAgain}', defaultSiteOrderByAgain)
             .replace('{limit}', limit)
             .replace('{offset}', offset);
    if (DEBUG) { plv8.elog(NOTICE, 'sql = ', sql); }
    return JSON.stringify(plv8.execute(sql, clause.parameters));
  };
$$ );


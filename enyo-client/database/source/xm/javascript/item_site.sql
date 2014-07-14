/* Delete previously misnamed record */
delete from xt.js where js_context='xtuple' and js_type = 'item_site';

select xt.install_js('XM','ItemSite','xtuple', $$
  /* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
     See www.xm.ple.com/CPAL for the full text of the software license. */

(function () {

  if (!XM.ItemSite) { XM.ItemSite = {}; }

  XM.ItemSite.isDispatchable = true;

  /**
    Return the current cost for a particular item site.
  */
  XM.ItemSite.cost = function (itemsiteId) {
    if (!XT.Data.checkPrivilege('ViewCosts')) { return null; }
    return plv8.execute('select itemcost(itemsite_id) as cost from itemsite where obj_uuid = $1;', [itemsiteId])[0].cost;
  };

  if (!XM.ItemSitePrivate) { XM.ItemSitePrivate = {}; }

  /*
    This should NEVER be set to true. XM.ItemSitePrivate.fetch can be passed
    table and column names to drasitcally change it behaviour which could be
    abused. It should NOT be isDispatchable.
  **/
  XM.ItemSitePrivate.isDispatchable = false;

  /**
    @private

    This function supports the XM.ItemSiteListItem.fetch() and XM.ItemSiteRelation.fetch(),
    but also xDruple extension XM.XdProduct.xdProductFetch() call like this:
    XM.ItemSitePrivate.fetch("XM.XdProduct", "xdruple.xd_commerce_product", query, 'product_id', 'id');
  */
  XM.ItemSitePrivate.fetch = function (recordType, backingType, query, backingTypeJoinColumn, idColumn) {
    query = query || {};
    backingTypeJoinColumn = backingTypeJoinColumn || 'itemsite_item_id';
    idColumn = idColumn || 'itemsite_id';

    var data = Object.create(XT.Data),
      nameSpace = recordType.beforeDot(),
      type = recordType.afterDot(),
      tableNamespace = backingType.beforeDot(),
      table = backingType.afterDot(),
      orderBy = query.orderBy,
      orm = data.fetchOrm(nameSpace, type),
      pkey = XT.Orm.primaryKey(orm),
      nkey = XT.Orm.naturalKey(orm),
      keyColumn = XT.Orm.primaryKey(orm, true),
      customerId = null,
      accountId = -1,
      shiptoId,
      effectiveDate = new Date(),
      vendorId = null,
      limit = query.rowLimit ? 'limit ' + Number(query.rowLimit) : '',
      offset = query.rowOffset ? 'offset ' + Number(query.rowOffset) : '',
      clause,
      ret = {
        nameSpace: nameSpace,
        type: type
      },
      itemJoinMatches,
      itemJoinTable,
      joinTables = [],
      keySearch = false,
      extra = "",
      qry,
      counter = 1,
      ids = [],
      idParams = [],
      etags,
      sqlCount,
      sql1 = 'select pt1.id ' +
             'from ( ' +
             'select t1.%3$I as id{groupColumns} ' +
             'from %1$I.%2$I t1 {joins} ' +
             'where {conditions} {extra}',
      sql2 = 'select * from %1$I.%2$I where id in ({ids}) {orderBy}';

    /* Handle special parameters */
    if (query.parameters) {
      query.parameters = query.parameters.filter(function (param) {
        var result = false;

        /* Over-ride usual search behavior */
        if (param.keySearch) {
          keySearch = param.value;
          sql1 += ' and t1.%4$I in (select item_id from item where item_number ~^ ${p1} or item_upccode ~^ ${p1}) ' +
            'union ' +
            'select t1.%3$I as id{groupColumns} ' +
            'from %1$I.%2$I t1 {joins} ' +
            ' join itemalias on t1.%4$I=itemalias_item_id ' +
            '   and itemalias_crmacct_id is null ' +
            'where {conditions} {extra} ' +
            ' and (itemalias_number ~^ ${p1}) ' +
            'union ' +
            'select t1.%3$I as id{groupColumns}  ' +
            'from %1$I.%2$I t1 {joins} ' +
            ' join itemalias on t1.%4$I=itemalias_item_id ' +
            '   and itemalias_crmacct_id={accountId} ' +
            'where {conditions} {extra} ' +
            ' and (itemalias_number ~^ ${p1}) ';
          return false;
        }

        switch (param.attribute)
        {
        case "customer":
          customerNumber = param.value;
          customerId = data.getId(data.fetchOrm('XM', 'CustomerProspectRelation'), param.value);
          accountId = data.getId(data.fetchOrm('XM', 'AccountRelation'), param.value);
          break;
        case "shipto":
          shiptoId = data.getId(data.fetchOrm('XM', 'CustomerShipto'), param.value);
          break;
        case "effectiveDate":
          effectiveDate = param.value;
          break;
        case "vendor":
          vendorId = data.getId(data.fetchOrm('XM', 'VendorRelation'), param.value);
          break;
        default:
          result = true;
        }
        return result;
      });
    }

    clause = data.buildClause(nameSpace, type, query.parameters, orderBy);

    /* Check if public.item is already joined through clause.joins. */
    if (clause.joins && clause.joins.length) {
      itemJoinMatches = clause.joins.match(/(.item )(jt\d+)/g);

      if (itemJoinMatches && itemJoinMatches.length) {
        itemJoinTable = itemJoinMatches[0].match(/(jt\d+)/g);
      }

      /* Get all join table names. */
      joinTables = clause.joins.match(/(jt\d+)/g).unique();
    }

    if (!itemJoinTable) {
      /* public.item is not already joined. Set the default name. */
      itemJoinTable = 'sidejoin';
    }

    /* If customer passed, restrict results to item sites allowed to be sold to that customer */
    if (customerId) {
      extra += XT.format(' and %1$I.item_id in (' +
             'select item_id from item where item_sold and not item_exclusive ' +
             'union ' +
             'select item_id from xt.custitem where cust_id=${p2} ' +
             '  and ${p4}::date between effective and (expires - 1) ', [itemJoinTable]);

      if (shiptoId) {
        extra += 'union ' +
               'select item_id from xt.shiptoitem where shipto_id=${p3}::integer ' +
               '  and ${p4}::date between effective and (expires - 1) ';
      }

      extra += ") ";

      if (!clause.joins) {
        clause.joins = '';
      }

      /* public.item is not already joined. Add it here. */
      if (itemJoinTable === 'sidejoin') {
        clause.joins = clause.joins + XT.format(' left join item %1$I on t1.%2$I = %1$I.item_id ', [itemJoinTable, backingTypeJoinColumn]);
      }
    }

    /* If vendor passed, and vendor can only supply against defined item sources, then restrict results */
    if (vendorId) {
      extra +=  XT.format(' and %1$I.item_id in (' +
              '  select itemsrc_item_id ' +
              '  from itemsrc ' +
              '  where itemsrc_active ' +
              '    and itemsrc_vend_id=%2$I)', [itemJoinTable, vendorId]);

      if (!clause.joins) {
        clause.joins = '';
      }

      /* public.item is not already joined. Add it here. */
      if (itemJoinTable === 'sidejoin') {
        clause.joins = clause.joins + XT.format(' left join item %1$I on t1.%2$I = %1$I.item_id ', [itemJoinTable, backingTypeJoinColumn]);
      }
    }

    if (query.count) {
      /* Just get the count of rows that match the conditions */
      sqlCount = 'select count(distinct t1.%3$I) as count from %1$I.%2$I t1 {joins} where {conditions} {extra};';
      sqlCount = XT.format(sqlCount, [tableNamespace.decamelize(), table.decamelize(), idColumn, backingTypeJoinColumn]);
      sqlCount = sqlCount.replace(/{conditions}/g, clause.conditions)
                         .replace(/{extra}/g, extra)
                         .replace('{joins}', clause.joins)
                         .replace(/{p2}/g, clause.parameters.length + 1)
                         .replace(/{p3}/g, clause.parameters.length + 2)
                         .replace(/{p4}/g, clause.parameters.length + 3);

      if (customerId) {
        clause.parameters = clause.parameters.concat([customerId, shiptoId, effectiveDate]);
      }

      if (DEBUG) {
        XT.debug('ItemSiteListItem sqlCount = ', sqlCount);
        XT.debug('ItemSiteListItem values = ', clause.parameters);
      }

      ret.data = plv8.execute(sqlCount, clause.parameters);

      return ret;
    }

    sql1 = XT.format(
      sql1 += ') pt1 group by pt1.id{groupBy} {orderBy} %5$s %6$s;',
      [tableNamespace, table, idColumn, backingTypeJoinColumn, limit, offset]
    );

    /* Because we query views of views, you can get inconsistent results */
    /* when doing limit and offest queries without an order by. Add a default. */
    if (limit && offset && (!orderBy || !orderBy.length) && !clause.orderByColumns) {
      /* We only want this on sql1, not sql2's clause.orderBy. */
      clause.orderByColumns = XT.format('order by t1.%1$I', [idColumn]);
    }

    /* Set columns to include in sub query unions before replacing table alias. */
    clause.joinGroupColumns = clause.groupByColumns || '';

    /* Change table reference in group by and order by to pt1. */
    if (clause.groupByColumns && clause.groupByColumns.length) {
      clause.groupByColumns = clause.groupByColumns.replace(/ t1./g, ' pt1.');
      clause.groupByColumns = clause.groupByColumns.replace(/,t1./g, ',pt1.');
      clause.groupByColumns = clause.groupByColumns.replace(/ jt\d+./g, ' pt1.');
      clause.groupByColumns = clause.groupByColumns.replace(/,jt\d+./g, ',pt1.');
    }
    if (clause.orderByColumns && clause.orderByColumns.length) {
      clause.orderByColumns = clause.orderByColumns.replace(/ t1./g, ' pt1.');
      clause.orderByColumns = clause.orderByColumns.replace(/,t1./g, ',pt1.');
      clause.orderByColumns = clause.orderByColumns.replace(/ jt\d+./g, ' pt1.');
      clause.orderByColumns = clause.orderByColumns.replace(/,jt\d+./g, ',pt1.');
    }
    if (joinTables.length) {
      for (var j=0; j < joinTables.length; j++) {
        var regex = new RegExp(joinTables + '.', 'g');
        clause.groupByColumns = clause.groupByColumns.replace(regex, 'pt1.');
        clause.orderByColumns = clause.orderByColumns.replace(regex, 'pt1.');
      }
    }

    /* Query the model */
    sql1 = sql1.replace(/{conditions}/g, clause.conditions)
             .replace(/{extra}/g, extra)
             .replace(/{joins}/g, clause.joins)
             .replace(/{groupBy}/g, clause.groupByColumns)
             .replace(/{groupColumns}/g, clause.joinGroupColumns)
             .replace('{orderBy}', clause.orderByColumns)
             .replace('{accountId}', accountId)
             .replace(/{p1}/g, clause.parameters.length + 1)
             .replace(/{p2}/g, clause.parameters.length + (keySearch ? 2 : 1))
             .replace(/{p3}/g, clause.parameters.length + (keySearch ? 3 : 2))
             .replace(/{p4}/g, clause.parameters.length + (keySearch ? 4 : 3));

    if (keySearch) {
      clause.parameters.push(keySearch);
    }
    if (customerId) {
      clause.parameters = clause.parameters.concat([customerId, shiptoId, effectiveDate]);
    }
    if (DEBUG) {
      XT.debug('ItemSiteListItem sql1 = ', sql1.slice(0,500));
      XT.debug(sql1.slice(500, 1000));
      XT.debug(sql1.slice(1000, 1500));
      XT.debug(sql1.slice(1500, 2000));
      XT.debug(sql1.slice(2000, 2500));
      XT.debug(sql1.slice(2500, 3000));
      XT.debug(sql1.slice(3000, 3500));
      XT.debug(sql1.slice(3500, 4000));
      XT.debug(sql1.slice(4000, 4500));
      XT.debug('ItemSiteListItem parameters = ', clause.parameters);
    }
    qry = plv8.execute(sql1, clause.parameters);

    if (!qry.length) {
      ret.data = [];
      return ret;
    }

    qry.forEach(function (row) {
      ids.push(row.id);
      idParams.push("$" + counter);
      counter++;
    });

    if (orm.lockable) {
      sql_etags = "select ver_etag as etag, ver_record_id as id " +
                  "from xt.ver " +
                  "where ver_table_oid = ( " +
                    "select pg_class.oid::integer as oid " +
                    "from pg_class join pg_namespace on relnamespace = pg_namespace.oid " +
                    /* Note: using $L for quoted literal e.g. 'contact', not an identifier. */
                    "where nspname = %1$L and relname = %2$L " +
                  ") " +
                  "and ver_record_id in ({ids})";
      sql_etags = XT.format(sql_etags, [tableNamespace, table]);
      sql_etags = sql_etags.replace('{ids}', idParams.join());

      if (DEBUG) {
        XT.debug('fetch sql_etags = ', sql_etags);
        XT.debug('fetch etags_values = ', JSON.stringify(ids));
      }
      etags = plv8.execute(sql_etags, ids) || {};
      ret.etags = {};
    }

    sql2 = XT.format(sql2, [nameSpace.decamelize(), type.decamelize()]);
    sql2 = sql2.replace(/{orderBy}/g, clause.orderBy)
               .replace('{ids}', idParams.join());

    if (DEBUG) {
      XT.debug('fetch sql2 = ', sql2);
      XT.debug('fetch values = ', JSON.stringify(ids));
    }

    ret.data = plv8.execute(sql2, ids) || [];

    for (var i = 0; i < ret.data.length; i++) {
      if (etags) {
        /* Add etags to result in pkey->etag format. */
        for (var j = 0; j < etags.length; j++) {
          if (etags[j].id === ret.data[i][pkey]) {
            ret.etags[ret.data[i][nkey]] = etags[j].etag;
          }
        }
      }
    }

    data.sanitize(nameSpace, type, ret.data);

    return ret;
  };

  if (!XM.ItemSiteListItem) { XM.ItemSiteListItem = {}; }

  XM.ItemSiteListItem.isDispatchable = true;

  /**
    Returns item site list items using usual query means with additional special support for:
      * Attributes `customer`,`shipto`, and `effectiveDate` for exclusive item rules.
      * Attribute `vendor` to filter on only items with associated item sources.
      * Cross check on `alias` and `barcode` attributes for item numbers.

    @param {String} Record type. Must have `itemsite` or related view as its orm source table.
    @param {Object} Additional query filter (Optional)
    @returns {Array}
  */
  XM.ItemSiteListItem.fetch = function (query) {
    var result = XM.ItemSitePrivate.fetch("XM.ItemSiteListItem", "public.itemsite", query);
    return result.data;
  };

  /**
   Wrapper for XM.ItemSitePrivate.fetch with support for REST query formatting.
   Sample usage:
    select xt.post('{
      "nameSpace":"XM",
      "type":"ItemSiteListItem",
      "dispatch":{
        "functionName":"restFetch",
        "parameters":[
          {
            "query":[
              {"customer":{"EQUALS":"TTOYS"}},
              {"shipto":{"EQUALS":"1d103cb0-dac6-11e3-9c1a-0800200c9a66"}},
              {"effectiveDate":{"EQUALS":"2014-05-01"}}
            ]
          }
        ]
      },
      "username":"admin",
      "encryptionKey":"hm6gnf3xsov9rudi"
    }');

   @param {Object} options: query
   @returns Object
  */
  XM.ItemSiteListItem.restFetch = function (options) {
    options = options || {};

    var items = {},
      query = {},
      result = {};

    if (options) {
      /* Convert from rest_query to XM.Model.query structure. */
      query = XM.Model.restQueryFormat("XM.ItemSiteListItem", options);

      /* Perform the query. */
      return XM.ItemSitePrivate.fetch("XM.ItemSiteListItem", "public.itemsite", query);
    } else {
      throw new handleError("Bad Request", 400);
    }
  };
  XM.ItemSiteListItem.restFetch.description = "Returns ItemSiteListItems with additional special support for exclusive item rules, to filter on only items with associated item sources and Cross check on `alias` and `barcode` attributes for item numbers.";
  XM.ItemSiteListItem.restFetch.request = {
    "$ref": "ItemSiteListItemQuery"
  };
  XM.ItemSiteListItem.restFetch.parameterOrder = ["options"];
  // For JSON-Schema deff, see:
  // https://github.com/fge/json-schema-validator/issues/46#issuecomment-14681103
  XM.ItemSiteListItem.restFetch.schema = {
    ItemSiteListItemQuery: {
      properties: {
        attributes: {
          title: "ItemSiteListItem Service request attributes",
          description: "An array of attributes needed to perform a ItemSiteListItem query.",
          type: "array",
          items: [
            {
              title: "Options",
              type: "object",
              "$ref": "ItemSiteListItemOptions"
            }
          ],
          "minItems": 1,
          "maxItems": 1,
          required: true
        }
      }
    },
    ItemSiteListItemOptions: {
      properties: {
        query: {
          title: "query",
          description: "The query to perform.",
          type: "array",
          items: [
            {
              title: "column",
              type: "object"
            }
          ],
          "minItems": 1
        },
        orderby: {
          title: "Order By",
          description: "The query order by.",
          type: "array",
          items: [
            {
              title: "column",
              type: "object"
            }
          ]
        },
        rowlimit: {
          title: "Row Limit",
          description: "The query for paged results.",
          type: "integer"
        },
        maxresults: {
          title: "Max Results",
          description: "The query limit for total results.",
          type: "integer"
        },
        pagetoken: {
          title: "Page Token",
          description: "The query offset page token.",
          type: "integer"
        },
        count: {
          title: "Count",
          description: "Set to true to return only the count of results for this query.",
          type: "boolean"
        }
      }
    }
  };

  if (!XM.ItemSiteRelation) { XM.ItemSiteRelation = {}; }

  XM.ItemSiteRelation.isDispatchable = true;

  /**
    Returns item site relatinos using usual query means with additional special support for:
      * Attributes `customer`,`shipto`, and `effectiveDate` for exclusive item rules.
      * Attribute `vendor` to filter on only items with associated item sources.
      * Cross check on `alias` and `barcode` attributes for item numbers.

    @param {String} Record type. Must have `itemsite` or related view as its orm source table.
    @param {Object} Additional query filter (Optional)
    @returns {Array}
  */
  XM.ItemSiteRelation.fetch = function (query) {
    var result = XM.ItemSitePrivate.fetch("XM.ItemSiteRelation", "xt.itemsiteinfo", query);
    return result.data;
  };

}());

$$ );

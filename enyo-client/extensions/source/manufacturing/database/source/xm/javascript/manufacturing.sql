select xt.install_js('XM','Manufacturing','xtuple', $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  if (!XM.PrivateInventory) { XM.PrivateInventory = {}; }

  if (!XM.Manufacturing) { XM.Manufacturing = {options: []}; }

  XM.Manufacturing.isDispatchable = true;

  XM.Manufacturing.options = [
    "WorkOrderChangeLog",
    "AutoExplodeWO",
    "ExplodeWOEffective",  
    "PostMaterialVariances",
    "WOExplosionLevel",
    "DefaultWomatlIssueMethod",
    "NextWorkOrderNumber",
    "WONumberGeneration",
    "JobItemCosDefault"
  ];

  /* 
  Return Manufacturing configuration settings.

  @returns {Object}
  */
  XM.Manufacturing.settings = function() {
    var keys = XM.Manufacturing.options.slice(0),
        data = Object.create(XT.Data),
        sql = "select fetchwonumber();",
        ret = {},
        qry;

    ret.NextWorkOrderNumber = plv8.execute(sql)[0].value;  
      
    ret = XT.extend(ret, data.retrieveMetrics(keys));

    return ret;
  };
  
  /* 
  Update Manufacturing configuration settings. Only valid options as defined in the array
  XM.Manufacturing.options will be processed.

   @param {Object} settings
   @returns {Boolean}
  */
  XM.Manufacturing.commitSettings = function(patches) {
    var sql, settings,
      options = XM.Manufacturing.options.slice(0),
      data = Object.create(XT.Data), 
      metrics = {};
        
    /* check privileges */
    if(!data.checkPrivilege('ConfigureWO')) throw new Error('Access Denied');

    /* Compose our commit settings by applying the patch to what we already have */
    settings = JSON.parse(XM.Manufacturing.settings());
    if (!XT.jsonpatch.apply(settings, patches)) {
      plv8.elog(NOTICE, 'Malformed patch document');
    }
    
    /* update numbers */
    if(settings['NextWorkOrderNumber']) {
      plv8.execute("select setnextwonumber($1)", [settings['NextWorkOrderNumber'] - 0]);
    }
    options.remove('NextWorkOrderNumber'); 

    /* update remaining options as metrics
      first make sure we pass an object that only has valid metric options for this type */
    for(var i = 0; i < options.length; i++) {
      var prop = options[i];
      if(settings[prop] !== undefined) metrics[prop] = settings[prop];
    }
 
    return data.commitMetrics(metrics);
  };

  /**
    Issue Material.
    
      select xt.post('{
        "username": "admin",
        "nameSpace":"XM",
        "type":"Inventory",
        "dispatch":{
          "functionName":"issueMaterial",
          "parameters":[
            "95c30aba-883a-41da-e780-1d844a1dc112",
            1,
            {
              "asOf": "2013-07-03T13:52:55.964Z",
              "detail": [
                {
                  "location": "84cf43d5-8a44-4a2b-f709-4f415ca51a52",
                  "quantity": 8
                },
                {
                  "location": "d756682c-eda3-445d-eaef-4dce793b0dcf",
                  "quantity": 2
                }
              ]
            }
          ]
        }
      }');
  
    @param {String|Array} Order line uuid or array of objects
    @param {Number|Object} Quantity or options
    @param {Date}   [options.asOf=now()] Transaction Timestamp
    @param {Array} [options.detail] Distribution detail
  */
  XM.Manufacturing.issueMaterial = function (orderLine, quantity, options) {
    var asOf,
      series,
      sql,
      sql2,
      ary,
      item,
      i;

    /* Make into an array if an array not passed */
    if (typeof arguments[0] !== "object") {
      ary = [{orderLine: orderLine, quantity: quantity, options: options || {}}];
    } else {
      ary = arguments;
    }

    /* Make sure user can do this */
    if (!XT.Data.checkPrivilege("IssueWoMaterials")) { throw new handleError("Access Denied", 401); }

    sql = "select issuewomaterial(womatl_id, $2::numeric, $3::integer, $4::timestamptz) as series " +
           "from womatl where obj_uuid = $1;";  

    sql2 = "select current_date != $1 as invalid";         

    /* Post the transaction */
    for (i = 0; i < ary.length; i++) {
      item = ary[i];
      asOf = item.options ? item.options.asOf : null;
      series = plv8.execute(sql, [item.orderLine, item.quantity, 0, asOf])[0].series;

      if (asOf && plv8.execute(sql2, [asOf])[0].invalid &&
          !XT.Data.checkPrivilege("AlterTransactionDates")) {
        throw new handleError("Insufficient privileges to alter transaction date", 401);
      }

      /* Distribute detail */
      XM.PrivateInventory.distribute(series, item.options.detail);
    }

    return;
  };
  XM.Manufacturing.issueMaterial.description = "Issue Materials.";
  XM.Manufacturing.issueMaterial.params = {
    orderLine: { type: "String", description: "Order line UUID" },
    quantity: {type: "Number", description: "Quantity" },
    options: {type: "Object", description: "Other attributes", attributes: {
      asOf: {type: "Date", description: "Transaction Timestamp. Default to now()."},
      detail: { type: "Array",
        description: "Distribution Detail",
        attributes: [
        {type: "Object", description: "Location and/or Trace detail", attributes: {
           quantity: {type: "Number", description: "Quantity"},
           location: {type: "String", description: "UUID of location"},
           trace: {type: "String", description: "Trace (Lot or Serial) Number"}}}
      ]},
    }}
  };

  XM.Manufacturing.postProduction = function (workOrder, quantity, options) {
    var asOf,
      series,
      sql,
      sql2,
      ary,
      item,
      i;

    /* Make into an array if an array not passed */
    if (typeof arguments[0] !== "object") {
      ary = [{workOrder: workOrder, quantity: quantity, options: options || {}}];
    } else {
      ary = arguments;
    }

    /* Make sure user can do this */
    if (!XT.Data.checkPrivilege("PostProduction")) { throw new handleError("Access Denied", 401); }

    sql = "select postproduction(wo_id, $2::numeric, $3::boolean, $4::integer, $5::timestamptz) as series " +
      "from wo where wo_number = $1;";

    sql2 = "select current_date != $1 as invalid";  

    /* Post the transaction */
    for (i = 0; i < ary.length; i++) {
      item = ary[i];
      asOf = item.options ? item.options.asOf : null;
      series = plv8.execute(sql, [item.workOrder, item.quantity, item.options.backflush, 0, item.options.asOf])[0].series;

      if (asOf && plv8.execute(sql2, [asOf])[0].invalid &&
          !XT.Data.checkPrivilege("AlterTransactionDates")) {
        throw new handleError("Insufficient privileges to alter transaction date", 401);
      }

      /* Distribute detail */
      XM.PrivateInventory.distribute(series, item.options.detail);
    }

    return;
  };
  XM.Manufacturing.postProduction.description = "Post production";
  XM.Manufacturing.postProduction.params = {
     workOrder: { type: "String", description: "Order line UUID" },
     quantity: {type: "Number", description: "Quantity" },
     options: {type: "Object", description: "Other attributes", attributes: {
      asOf: {type: "Date", description: "Transaction Timestamp. Default to now()."},
      detail: {type: "Array", description: "Distribution detail" },
      backflush: {type: "Boolean", description: "Backflush Materials" }
    }}
  };

  /**
    Return material transactions.
    
      select xt.post('{
        "username": "admin",
        "nameSpace":"XM",
        "type":"Inventory",
        "dispatch":{
          "functionName":"returnFromShipping",
          "parameters":["95c30aba-883a-41da-e780-1d844a1dc112"]
        }
      }');
  
    @param {String|Array} Order line uuid, or array of uuids
  */
  XM.Manufacturing.returnMaterial = function (orderLine) {
    var sql = "select returnwomaterial(womatl_id, womatl_qtyiss, current_timestamp) " +
           "from womatl where obj_uuid = $1;",
      ret,
      i;

    /* Make sure user can do this */
    if (!XT.Data.checkPrivilege("ReturnWoMaterials")) { throw new handleError("Access Denied", 401); }

    /* Post the transaction */
    for (i = 0; i < arguments.length; i++) {
      ret = plv8.execute(sql, [arguments[i]])[0];
    }

    return ret;
  };

  XM.Manufacturing.returnMaterial.description = "Return shipment transactions.";
  XM.Manufacturing.returnMaterial.params = {
    orderLine: { type: "String", description: "Order line UUID" }
  };

}());
  
$$ );

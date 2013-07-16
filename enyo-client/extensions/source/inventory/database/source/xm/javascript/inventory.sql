select xt.install_js('XM','Inventory','xtuple', $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  if (!XM.PrivateInventory) { XM.PrivateInventory = {}; }
  
  XM.PrivateInventory.isDispatchable = false; /* No direct access from client */

  /**
    Distribute location and/or trace detail for one or many inventory transactions.
    For good or for ill, this function attempts to exactly replicate the behavior of
    distributeInventory.cpp in the C++ client.
    
    Example:

        XM.Inventory.distribute (12345,[
            {
              location: '6dac30d3-aac3-4fc7-953d-465e190ff9cf',
              trace: 'A7891',
              quantity: 6,
              expiration: '2013-07-31T00:00:00.000Z',
              warranty: '2013-08-05T00:00:00.000Z'
            },
            {
              location: 'ea571dab-88fa-46c2-c92f-4a18e0ce7c1d',
              trace: 'A7891',
              quantity: 2,
              expiration: '2013-07-31T00:00:00.000Z',
              warranty: '2013-08-05T00:00:00.000Z'
            },
            {
              location: '6dac30d3-aac3-4fc7-953d-465e190ff9cf',
              quantity: 2,
              trace: 'A7892',
              expiration: '2013-08-05T00:00:00.000Z',
              warranty: '2013-08-05T00:00:00.000Z'
            }
          ]    
        })
        
    @private
    @param {Number} Series number
    @param {Array} Detail
    
  */
  XM.PrivateInventory.distribute = function (series, detail) {
    detail = detail || [];
    var sql,
      sql2,
      sql3,
      distIds = [],
      distId,
      rec,
      traceSeries,
      locId = -1,
      qty = 0,
      info,
      d,
      i,

      /* Helper funciton to resolve location id */
      getLocId = function (uuid) {
        var locSql = "select location_id " +
          "from location where obj_uuid = $1" +
          " and not location_restrict " +
          " or location_id in (" +
          " select locitemsite_location_id " +
          " from xt.locitemsite " +
          " where locitemsite_itemsite_id = $2);",
          qry = plv8.execute(locSql, [uuid, info.itemsite_id]);
        if (!qry.length) {
          throw new handleError("Location " + uuid + " is not valid.")
        }
        return qry[0].location_id;
      };

    if (detail && detail.length) {
      sql = "select itemlocdist_id, " + 
        " invhist_id, " +
        " invhist_invqty, " +
        " invhistsense(invhist_id) as sense, " +
        " itemsite_id, " +
        " itemsite_controlmethod, " +
        " itemsite_loccntrl " +
        "from itemlocdist, invhist" +
        " join itemsite on itemsite_id = invhist_itemsite_id " +
        "where itemlocdist_series = $1 " +
        " and invhist_series = $1";
      info = plv8.execute(sql,[series]);

      /* We shouldn't have detail if there are no detail control settings turned on */
      if (!info.length) {
        throw new handleError("Item Site is not controlled.");
      } else if (info.length > 1) { 
        throw new handleError("Only distribution for one transaction at a time is supported.")
      }
      info = info[0];

      /* Validate quantity */
      for (i = 0; i < detail.length; i++) {
        qty += detail[i].quantity;
        detail[i].quantity = detail[i].quantity * info.sense; /* Fix the nonsense */
      }
      
      if (qty != info.invhist_invqty) {
        throw new handleError("Distribution quantity does not match transaction quantity.")
      }
      
      /* Loop through and handle each trace detail */
      if (info.itemsite_controlmethod === 'L' || info.itemsite_controlmethod === 'S') {
        sql = "select nextval('itemloc_series_seq') AS itemloc_series;";
        traceSeries = plv8.execute(sql)[0].itemloc_series;

        sql = "select createlotserial(itemlocdist_itemsite_id, " +
          "$1, $2,'I', NULL, itemlocdist_id,$3, coalesce($4, endoftime()), $5) as id " +
          "from itemlocdist " +
          "where (itemlocdist_id=$6);";

        sql2 = "update itemlocdist set" +
          "  itemlocdist_source_type = 'L', " +
          "  itemlocdist_source_id = $1" +
          "where itemlocdist_id = $2";

        sql3 = "select ls_id " +
          "from itemloc join ls on itemloc_ls_id=ls_id " +
          "where ls_number=$1 " +
          " and itemloc_itemsite_id=$2 " +
          "union all " +
          "select ls_id " +
          "from itemlocdist join ls on itemlocdist_ls_id=ls_id " +
          "where ls_number = $1 " +
          " and itemlocdist_itemsite_id=$2; ";
        
        for (i = 0; i < detail.length; i++) {
          d = detail[i];
          
          if (!d.trace) { throw new handleError("Itemsite requires lot or serial trace detail."); }

          /* Serial numbers can only be one */
          if (info.itemsite_controlmethod === 'S') {
            rec = plv8.execute(sql3, [d.trace, info.itemsite_id]);
            if (d.quantity === 1) {
              if (rec.length) {
                throw new handleError("Serial number " + d.trace + " already exists in inventory.");
              }
            } else if (d.quantity === -1) {
              if (!rec.length) {
                throw new handleError("Serial number " + d.trace + " does not exist in inventory.");
              }
            } else { 
              throw new handleError("Serial number quantity must be one.");
            }
          }
          
          distId = plv8.execute(sql, [
            d.trace, traceSeries, d.quantity, d.expiration, d.warranty, info.itemlocdist_id
          ])[0].id;
          distIds.push(distId);

          /* Determine location id if applicable */
          if (info.itemsite_loccntrl) {
            if (!d.location) { throw new handleError("Itemsite requires location detail."); }

            locId = getLocId(d.location);
          } else { 
            if (d.location) { throw new handleError("Itemsite does not support location detail."); }
          }
          plv8.execute(sql2, [locId, distId]);
        }

        sql = "delete from itemlocdist where itemlocdist_id=$1;";
        plv8.execute(sql, [info.itemlocdist_id]);

        sql = "select distributeitemlocseries($1);";
        plv8.execute(sql, [traceSeries]);


      /* Location control w/o trace */
      } else {
        sql =  "insert into itemlocdist " +
          "(itemlocdist_itemlocdist_id, itemlocdist_source_type, itemlocdist_source_id, " +
          " itemlocdist_itemsite_id, itemlocdist_expiration, " +
          " itemlocdist_qty, itemlocdist_series, itemlocdist_invhist_id ) " +
          " values ($1, 'L', $2, $3, endoftime(), $4, $5, $6); ";
            
        for (i = 0; i < detail.length; i++) {
          d = detail[i];
          if (!d.location) { throw new handleError("Item Site requires location detail."); }
          if (d.trace) { throw new handleError("Item Site does not support lot or serial trace detail."); }
          locId = getLocId(d.location);

          plv8.execute(sql, [
            info.itemlocdist_id, locId, info.itemsite_id, d.quantity, series, info.invhist_id
          ]);
        }

        sql = "select distributeitemlocseries($1);";
        plv8.execute(sql, [series]);
      }

    /* No half done transactions are permitted. */
    } else {
      sql = "select invhist_id " +
        "from invhist join itemsite on itemsite_id = invhist_itemsite_id " +
        "where invhist_series = $1" +
        " and (itemsite_loccntrl or itemsite_controlmethod in ('L','S')); ",
      invHist = plv8.execute(sql,[series]);
      
      if (invHist.length) { throw new handleError("Transaction requires distribution detail") }
    }

    /* Wrap up */
    sql = "select postitemlocseries($1);";
    plv8.execute(sql, [series]);
    return;
  }


  if (!XM.Inventory) { XM.Inventory = {}; }
  
  XM.Inventory.isDispatchable = true;

  /**
    Perform Inventory Adjustments.
    
      select xt.post('{
        "username": "admin",
        "nameSpace":"XM",
        "type":"Inventory",
        "dispatch":{
          "functionName":"adjustment",
          "parameters":[
            "95c30aba-883a-41da-e780-1d844a1dc112",
            1,
            {
              "asOf": "2013-07-03T13:52:55.964Z",
              "value": 10,
              "notes": "This is a test.",
              "docNumber": "12345"
            }
          ]
        }
      }');
  
    @param {String} Itemsite uuid
    @param {Number} Quantity
    @param {Array} [options.detail] Distribution detail
    @param {Date}   [options.asOf=now()] Transaction Timestamp
    @param {String} [options.docNumber] Document Number
    @param {String} [options.notes] Notes
    @param {String} [options.value] Value
  */
  XM.Inventory.adjustment = function (itemSite, quantity, options) {
    options = options || {};
    var sql = "select invadjustment(itemsite_id, $2, $3, $4, $5::timestamptz, $6) as series " +
      "from itemsite where obj_uuid = $1;",
      asOf = options.asOf || null,
      docNumber = options.docNumber || "",
      notes =  options.notes || "",
      value = options.value || null,
      series;

    /* Make sure user can do this */
    if (!XT.Data.checkPrivilege("CreateAdjustmentTrans")) { throw new handleError("Access Denied", 401) };

    /* Post the transaction */
    series = plv8.execute(sql, [itemSite, quantity, docNumber, notes, asOf, value])[0].series;

    /* Distribute detail */
    XM.PrivateInventory.distribute(series, options.detail);

    return;
  };

  /**
    Issue to shipping.
    
      select xt.post('{
        "username": "admin",
        "nameSpace":"XM",
        "type":"Inventory",
        "dispatch":{
          "functionName":"issueToShipping",
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
  
    @param {String} Order line uuid
    @param {Number} Quantity
    @param {Date}   [options.asOf=now()] Transaction Timestamp
    @param {Array} [options.detail] Distribution detail
  */
  XM.Inventory.issueToShipping = function (orderLine, quantity, options) {
    options = options || {};
    var  asOf = options.asOf || null,
      series,
      sql;

    /* Make sure user can do this */
    if (!XT.Data.checkPrivilege("IssueStockToShipping")) { throw new handleError("Access Denied", 401) };

    /* Post the transaction */
    sql = "select issuetoshipping('SO', coitem_id, $2, 0, $3::timestamptz) as series " +
      "from coitem where obj_uuid = $1;",
    series = plv8.execute(sql, [orderLine, quantity, asOf])[0].series;

    /* Distribute detail */
    XM.PrivateInventory.distribute(series, options.detail);

    return;
  };

  /**
    Return shipment transactions.
    
      select xt.post('{
        "username": "admin",
        "nameSpace":"XM",
        "type":"Inventory",
        "dispatch":{
          "functionName":"returnFromShipping",
          "parameters":["95c30aba-883a-41da-e780-1d844a1dc112"]
        }
      }');
  
    @param {String} Order line uuid
  */
  XM.Inventory.returnFromShipping = function (orderLine) {
    var sql = "select returnitemshipments(coitem_id) from coitem where obj_uuid = $1;";

    /* Make sure user can do this */
    if (!XT.Data.checkPrivilege("IssueStockToShipping")) { throw new handleError("Access Denied", 401) };

    /* Post the transaction */
    plv8.execute(sql, [orderLine])[0].series;

    return;
  };

  XM.Inventory.options = [
		"DefaultEventFence",    
		"ItemSiteChangeLog",
                "WarehouseChangeLog",
		"AllowAvgCostMethod",  
		"AllowStdCostMethod",
		"AllowJobCostMethod",
		"CountAvgCostMethod",
		"PostCountTagDefault",
		"CountSlipAuditing",
		"ShipmentNumberGeneration",
		"NextShipmentNumber", 
		"KitComponentInheritCOS",
		"DisallowReceiptExcessQty",
		"WarnIfReceiptQtyDiffers",
		"ReceiptQtyTolerancePct",
		"RecordPPVonReceipt" 
  ]
  
  /* 
  Return Inventory configuration settings.

  @returns {Object}
  */
  XM.Inventory.settings = function() {
    var keys = XM.Inventory.options.slice(0),
        data = Object.create(XT.Data),
        sql = "select orderseq_number as value "
            + "from orderseq"
            + " where (orderseq_name=$1)",
        ret = {},
        qry;

    ret.NextShipmentNumber = plv8.execute("select fetchshipmentnumber();")[0].value;  
      
    ret = XT.extend(ret, data.retrieveMetrics(keys));

    return JSON.stringify(ret);
  }
  
  /* 
  Update Inventory configuration settings. Only valid options as defined in the array
  XM.Inventory.options will be processed.

   @param {Object} settings
   @returns {Boolean}
  */
  XM.Inventory.commitSettings = function(patches) {
    var sql, settings, 
      options = XM.Inventory.options.slice(0),
      data = Object.create(XT.Data), 
      metrics = {};
        
    /* check privileges */
    if(!data.checkPrivilege('ConfigureIM')) throw new Error('Access Denied');

    /* Compose our commit settings by applying the patch to what we already have */
    settings = JSON.parse(XM.Inventory.settings());
    if (!XT.jsonpatch.apply(settings, patches)) {
      plv8.elog(NOTICE, 'Malformed patch document');
    }
    
		/* update numbers */
    if(settings['NextShipmentNumber']) {
      plv8.execute('select setNextShipmentNumber($1)', [settings['NextShipmentNumber'] - 0]);
    }
    options.remove('NextShipmentNumber'); 

  /* update remaining options as metrics
       first make sure we pass an object that only has valid metric options for this type */
    for(var i = 0; i < options.length; i++) {
      var prop = options[i];
      if(settings[prop] !== undefined) metrics[prop] = settings[prop];
    }
 
    return data.commitMetrics(metrics);
  }

}());
  
$$ );

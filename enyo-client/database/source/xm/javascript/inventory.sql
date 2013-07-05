select xt.install_js('XM','Inventory','xtuple', $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  if (!XM.PrivateInventory) { XM.PrivateInventory = {}; }
  
  XM.PrivateInventory.isDispatchable = false; /* No direct access from client */

  /**
    Distribute generic inventory transaction.
    Example:

        XM.Inventory.transact ('BTRUCK1', 'IM', 'AD', 10, {
          asOf: '2013-07-01T21:02:57.266Z',
          orderNumber: '55920',
          docNumber: '8712',
          debitAccount: '01-01-7891-565',
          creditAccount: '01-01-8790-222',
          notes: 'Making an adjustment',
          value: '421.01',
          detail: [
            {
              lot: 'A7891',
              expiration: '2013-07-31T00:00:00.000Z',
              locations: [
                {
                  uuid: '6dac30d3-aac3-4fc7-953d-465e190ff9cf',
                  quantity: 6
                },
                {
                  uuid: 'ea571dab-88fa-46c2-c92f-4a18e0ce7c1d',
                  quantity: 2
                }
              ]
            },
            {
              lot: 'A7892',
              expiration: '2013-08-05T00:00:00.000Z'
              locations: [
                {
                  uuid: '6dac30d3-aac3-4fc7-953d-465e190ff9cf',
                  quantity: 2
                }
              ]
            }
          ]
          
        })
    @private
    @param {Number} Inventory History Id
    @param {Object} Location, Lot/Serial Detail
    
  */
  XM.PrivateInventory.distribute = function (series, detail) {
    detail = detail || {};
    var sql = "select postitemlocseries($1);";
      
    plv8.execute(sql, [series]);
    return;
  }


  if (!XM.Inventory) { XM.Inventory = {}; }
  
  XM.Inventory.isDispatchable = true;

  /**
    Perform Inventory Adjustments.
    
      select xt.post({
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
      });
  
    @param {String} Itemsite uuid
    @param {Number} Quantity
    @param {Object} [options.detail] Distribution detail
    @param {Date}   [options.asOf=now()] Transaction Timestamp
    @param {String} [options.docNumber] Document Number
    @param {String} [options.notes] Notes
    @param {String} [options.value] Value
    @returns {String} Transaction uuid
  */
  XM.Inventory.adjustment = function (itemSite, quantity, options) {
    options = options || {};
    var  sql = "select invadjustment(itemsite_id, $2, $3, $4, $5::timestamptz, $6) as series from itemsite where obj_uuid = $1;",
      asOf = options.asOf || null,
      docNumber = options.docNumber || "",
      notes =  options.notes || "",
      value = options.value || null,
      series;

    /* Make sure user can do this */
    if (!XT.Data.checkPrivilege("CreateAdjustmentTrans")) { throw new handleError("Access Denied", 401) };

    /* Post the transaction */
    plv8.elog(NOTICE, "sql-> ", sql);
    series = plv8.execute(sql, [itemSite, quantity, docNumber, notes, asOf, value])[0].series;

    /* Distribute detail */
    XM.PrivateInventory.distribute(series, options.detail);

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

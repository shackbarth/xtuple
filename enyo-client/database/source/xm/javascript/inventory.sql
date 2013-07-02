select xt.install_js('XM','Inventory','xtuple', $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  if (!XM.PrivateInventory) { XM.PrivateInventory = {}; }
  
  XM.PrivateInventory.isDispatchable = false; /* No access from client */

  /**
    Generic inventory transaction.
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
  XM.PrivateInventory.distribute = function (histId, detail) {
    options = options || {};
    var sql = "select postitemlocseries(invhist_series) from invhist where invhist_id = $1;",
      series;
      
    plv8.execute(sql, [histId]);
    return result;
  }


  if (!XM.Inventory) { XM.Inventory = {}; }
  
  XM.Inventory.isDispatchable = true;

  /*
    @param {String} Itemsite uuid
    @param {Number} Quantity
    @param {Object} Location, Lot/Serial detail
    @param {Date}   [options.asOf=now()] Transaction Timestamp
    @param {String} [options.docNumber] Document Number
    @param {String} [options.notes] Notes
    @param {String} [options.value] Value
    @returns {String} Transaction uuid
  */
  XM.Inventory.adjustment = function (itemSite, quantity, options) {
    options = options || {};
    var postSql = "select invAdjustment(itemsite_id, $2, $3, $4, %I, $5) from itemsite where obj_uuid = $1;",
      transSql = "select obj_uuid from invhist where invhist_id = $1);";

    if (!XT.Data.checkPrivilege("CreateAdjustmentTrans")) { throw new handleError("Access Denied", 401) };
    sql = XT.format(postSql, options.asOf ? ["cast('" + options.asOf + "' as timestamp with time zone)"] : ["null"]);
    histId = plv8.execute(sql, [itemSite, quantity, options.docNumber, options.notes, options.value]);
    XM.PrivateInventory.distribute(histId, options.detail);
    return plv8.execute(transSql, [histId])[0].obj_uuid;
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

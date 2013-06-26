select xt.install_js('XM','Inventory','xtuple', $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  if (!XM.Inventory) { XM.Inventory = {}; }

  XM.Inventory.isDispatchable = true;

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
    /*if(settings['NextShipmentNumber']) {
      plv8.execute('select setNextShipmentNumber($1)', [settings['NextShipmentNumber'] - 0]);
    }
		options.remove('NextShipmentNumber'); */

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

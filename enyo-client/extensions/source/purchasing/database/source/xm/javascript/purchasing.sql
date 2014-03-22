select xt.install_js('XM','Purchasing','purchasing', $$
  /* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
     See www.xtuple.com/CPAL for the full text of the software license. */

  if (!XM.Purchasing) { XM.Purchasing = {}; }

  XM.Purchasing.isDispatchable = true;

  XM.Purchasing.options = [
    "BillDropShip",
    "EnableDropShipments",
    "PONumberGeneration",
    "PrNumberGeneration",
    "NextPurchaseOrderNumber",
    "NextVoucherNumber",
    "NextPurchaseRequestNumber",
    "POChangeLog",
    "VendorChangeLog",
    "UseEarliestAvailDateOnPOItem",
    "DefaultPrintPOOnSave",
    "RequireStdCostForPOItem",
    "RequirePOTax",
    "CopyPRtoPOItem",
    "DefaultPOShipVia"
  ];

  /*
  Return Purchasing configuration settings.

  @returns {Object}
  */
  XM.Purchasing.settings = function() {
    var keys = XM.Purchasing.options.slice(0),
        data = Object.create(XT.Data),
        sql = "select orderseq_number as value "
            + "from orderseq"
            + " where (orderseq_name=$1)",
        ret = {};

    ret.NextPurchaseOrderNumber = plv8.execute(sql, ['PoNumber'])[0].value;
    ret.NextVoucherNumber = plv8.execute(sql, ['VcNumber'])[0].value;
    ret.NextPurchaseRequestNumber = plv8.execute(sql, ['PrNumber'])[0].value;

    ret = XT.extend(data.retrieveMetrics(keys), ret);

    return ret;
  };

   /*
  Update Purchasing configuration settings. Only valid options as defined in the array
  XM.Purchasing.options will be processed.

   @param {Object} settings
   @returns {Boolean}
  */
  XM.Purchasing.commitSettings = function(patches) {
    var sql,
      K = XM.Purchasing,
      data = Object.create(XT.Data),
      settings = K.settings(),
      options = K.options.slice(0),
      metrics = {},
      i;

    /* Compose our commit settings by applying the patch to what we already have */
    if (!XT.jsonpatch.apply(settings, patches)) {
      plv8.elog(NOTICE, 'Malformed patch document');
    }

    /* update numbers */
    if(settings['NextPurchaseOrderNumber']) {
      plv8.execute('select setNextPoNumber($1)', [settings['NextPurchaseOrderNumber'] - 0]);
    }
    options.remove('NextPurchaseOrderNumber');

    if(settings['NextVoucherNumber']) {
      plv8.execute('select setNextVcNumber($1)', [settings['NextVoucherNumber'] - 0]);
    }
    options.remove('NextVoucherNumber');

    if(settings['NextPurchaseRequestNumber']) {
      plv8.execute('select setNextPrNumber($1)', [settings['NextPurchaseRequsetNumber'] - 0]);
    }
    options.remove('NextPurchaseRequestNumber');

    /* update remaining options as metrics
       first make sure we pass an object that only has valid metric options for this type */
    for (i = 0; i < options.length; i++) {
      var prop = options[i];
      if (settings[prop] !== undefined) { metrics[prop] = settings[prop]; }
    }

    return data.commitMetrics(metrics);
  }

$$ );

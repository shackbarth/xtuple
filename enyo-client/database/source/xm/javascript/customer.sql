select xt.install_js('XM','Customer','xtuple', $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

  XM.Customer = {};

  XM.Customer.isDispatchable = true;
  
  XM.Customer.options = [
    "CustomerChangeLog",
    "DefaultShipFormId",
    "DefaultShipViaId",
    "DefaultBalanceMethod",
    "DefaultCustType",
    "DefaultSalesRep",
    "DefaultTerms",
    "DefaultPartialShipments",
    "DefaultBackOrders",
    "DefaultFreeFormShiptos",
    "SOCreditLimit",
    "SOCreditRate"
  ]
  
  /* 
  Return Customer configuration settings.

  @returns {Object}
  */
  XM.Customer.settings = function() {
    var keys = XM.Customer.options.slice(0),
        data = Object.create(XT.Data),
        inum = {},
        ret = {},
        qry;

    ret = XT.extend(ret, data.retrieveMetrics(keys));
    
    return JSON.stringify(ret);
  }
  
  /* 
  Update Customer configuration settings. Only valid options as defined in the array
  XM.Customer.options will be processed.

   @param {Object} settings
   @returns {Boolean}
  */
  XM.Customer.commitSettings = function(settings) {
    var sql, options = XM.Customer.options.slice(0),
        data = Object.create(XT.Data), metrics = {};
    
    /* check privileges */
    if(!data.checkPrivilege('ConfigureSales')) throw new Error('Access Denied');
    
  /* update remaining options as metrics
       first make sure we pass an object that only has valid metric options for this type */
    for(var i = 0; i < options.length; i++) {
      var prop = options[i];
      if(settings[prop] !== undefined) metrics[prop] = settings[prop];
    }
 
    return data.commitMetrics(metrics);
  }
  
  
  /**
   Returns an object with a price and type for a given customer, item and quantity.
    
   @param {Number} item id
   @param {Number} customer id
   @param {Number} quantity
   @param {Object} options:  quantityUom, priceUom, currency, effective, asOf
   @returns Object 
  */
 
  XM.Customer.price = function(customer, item, quantity, options) {
    options = options || {};
    var today = new Date(),
      shipto = options.shipto || -1,
      quantityUom,
      priceUom,
      currency,
      effective,
      asOf,
      result,
      err;

    if (!item) {
      err = "Item";
    } else if (!customer) {
      err = "Customer";
    } else if (!quantity) {
      err = "Quantity" 
    };
    if(err) { plv8.elog(ERROR, err + " is required.") }

    quantityUom = options.quantityUom || plv8.execute("select item_inv_uom_id as result from item where item_id = $1;", [item])[0].result,
    priceUom = options.priceUom || plv8.execute("select item_price_uom_id as result from item where item_id = $1;", [item])[0].result,
    currency = options.currency || plv8.execute("select basecurrid() as result")[0].result,
    effective = options.effective ? new Date(options.effective) : today,
    asOf = options.asOf ? new Date(options.asOf) : today,
    result = plv8.execute("select itemipsprice($1, $2, $3, $4, $5, $6, $7, $8::date, $9::date, null) as result;", [item, customer, shipto, quantity, quantityUom, priceUom, currency, effective, asOf])[0].result;

    result = { price: result.itemprice_price, type: result.itemprice_type };
    return JSON.stringify(result); 
  }
  

$$ );

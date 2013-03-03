select xt.install_js('XM','Customer','xtuple', $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

  XM.Customer = {};

  XM.Customer.isDispatchable = true;
  
  /**
   Returns an object with a price and type for a given customer, item and quantity.
    
   @param {Number} item id
   @param {Number} customer id
   @param {Number} quantity
   @param {Object} options:  asOf, quantityUnitId, priceUnitId, currencyId, effective
   @returns Object 
  */
 
  XM.Customer.price = function(customer, item, quantity, options) {
    options = options || {};
    var today = new Date(),
      shipto = options.shipto || -1,
      quantityUnitId,
      priceUnitId,
      currencyId,
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

    quantityUnitId = options.quantityUomId || plv8.execute("select item_inv_uom_id as result from item where item_id = $1;", [item])[0].result,
    priceUnitId = options.priceUomId || plv8.execute("select item_price_uom_id as result from item where item_id = $1;", [item])[0].result,
    currency = options.currencyId || plv8.execute("select basecurrid() as result")[0].result,
    effective = options.effective ? new Date(options.effective) : today,
    asOf = options.asOf ? new Date(options.asOf) : today,
    result = plv8.execute("select itemipsprice($1, $2, $3, $4, $5, $6, $7, $8::date, $9::date, null) as result;", [item, customer, shipto, quantity, quantityUnitId, priceUnitId, currencyId, effective, asOf])[0].result;

    result = { price: result.itemprice_price, type: result.itemprice_type };
    return JSON.stringify(result); 
  }
  

$$ );

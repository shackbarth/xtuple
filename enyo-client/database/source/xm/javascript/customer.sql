select xt.install_js('XM','Customer','xtuple', $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

  XM.Customer = {};

  XM.Customer.isDispatchable = true;

  XM.Customer.options = [
    "ShiptoId",
    "Quantity",
    "QuantityUomId",
    "PriceUomId",
    "CurrencyId",
    "EffectiveDate",
    "AsOfDate"
  ]
  
  /**
   Return a price for an item on a sales order/quote based on input. 
   @param {Number} item id
   @param {Number} customer id
   @param {Number} shipto id
   @param {Number} qty uom id
   @param {Number} price uom id
   @param {Number} currency id
   @returns Number 
  */
 
  XM.Customer.price = function() {
  
    var shipto = options.ShiptoId || -1;
    var qty = options.Quantity || 1;
/* I need this    var qtyuom = options.QuantityUomId || -1; */
/* I need this    var priceuom = options.PriceUomId || -1;  */
/* I need this    var currency = options.CurrencyId || -1;  */
    var effectivedate = options.EffectiveDate || current_date;
    var asofdate = options.AsOfDate || current_date;
    
    var ret,
        sql = 'select itemprice($1, $2, shipto, qty, $3, $4, $5, effectivedate, asofdate) as result;',
        err;
    ret = plv8.execute(sql);
    return ret;
  }

$$ );

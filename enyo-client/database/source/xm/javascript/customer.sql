select xt.install_js('XM','Customer','xtuple', $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

  XM.Customer = {};

  XM.Customer.isDispatchable = true;

  XM.Customer.options = [
    "ShiptoId",
    "Quantity",
    "EffectiveDate"
  ]
  
  /*itemprice(pitemid integer, pcustid integer, pshiptoid integer, pqty numeric, pqtyuom integer, ppriceuom integer, pcurrid integer, peffective date */
  /**
   Return a price for an item on a sales order/quote based on input. 
   @param {Number} item id
   @param {Number} customer id
   @param {Number} shipto id
   @param {Number} qty 
   @param {Number} qty uom id
   @param {Number} price uom id
   @param {Number} currency id
   @param {Date} effective date
   @returns Number 
  */
 
  XM.Customer.price = function(itemId, customerId, shipto, qty, qtyUomId, priceUomId, currencyId, effective) {
    var shipto = options.ShiptoId || -1;
    var qty = options.Quantity || -1;
    var effective = options.effectiveDate || -1;
    var ret,
        sql = 'select itemprice($1::integer, $2::integer, $3::integer, $4::integer, $5::integer, $6::integer, $7::integer, $8::date) as result;',
        err;
    ret = plv8.execute(sql, [itemId, customerId, shipto, qty, qtyUomId, priceUomId, currencyId, effective]).[0].result; 
    return ret;
  }

$$ );

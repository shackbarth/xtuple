select xt.install_js('XM','Customer','xtuple', $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

  XM.Customer = {};

  XM.Customer.isDispatchable = true;
  
  
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
 
  XM.Customer.price = function(item, customer, quantity, options) {
    options = options || {};
    var err;
    if(item === undefined) err = "item id can not be blank";
    if(customer === undefined) err = "customer id can not be blank";
    if(quatity === undefined) err = "quantity can not be blank";
    if(!err) {
    var 
      today=new Date(),
      effective = options.effective || today,
      shipto = options.shipto || -1,
      quantityUom = options.quantityUom || plv8.execute("select item_inv_uom_id as result from item where item_id = $1;", [item])[0].result,
      priceUom = options.priceUom || plv8.execute("select item_price_uom_id as result from item where item_id = $1;", [item])[0].result,
      currency = options.currency || plv8.execute("select basecurrid() as result")[0].result,
      effective = options.effective || today;
    
      return plv8.execute("select itemprice($1, $2, $3, $4, $5, $6, $7, $8) as result;", [item, customer, shipto, quantity, quantityUom, priceUom, currency, effective])[0].result; 
    }
    
    throw new Error(err);
  }
  

$$ );

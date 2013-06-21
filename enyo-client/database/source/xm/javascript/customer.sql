select xt.install_js('XM','Customer','xtuple', $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  if (!XM.Customer) { XM.Customer = {}; }

  XM.Customer.isDispatchable = true;

  /**
    Determine whether a customer can purchase a given item

    @param {Number} Customer id
    @param {Number} Item id
    @param {Date} Schedule date
    @param {Number} Shipto id
    @returns {Boolean}
  */
  XM.Customer.canPurchase = function (customerId, itemId, scheduleDate, shiptoId) {
    var sql = 'select customerCanPurchase(item_id, cust_id, $3, $4::date) as canpurchase ' +
              'from custinfo, item where item_number = $1 and cust_number = $2;';
    shiptoId = XT.Data.getId(XT.Orm.fetch('XM','CustomerShipto'), shiptoId);
    return plv8.execute(sql, [itemId, customerId, shiptoId, scheduleDate])[0].canpurchase;
  };
  
  /**
   Returns an object with a price and type for a given customer, item and quantity.

   @param {Number} customer id
   @param {Number} item id
   @param {Number} quantity
   @param {Object} options:  asOf, shiptoId, quantityUnitId, priceUnitId, currencyId, effective
   @returns Object 
  */
  XM.Customer.itemPrice = function(customerId, itemId, quantity, options) {
    options = options || {};
    var sql = "select itemipsprice(item_id, cust_id, $3, $4, $5, $6, $7, $8::date, $9::date, null) as result " +
              "from custinfo, item where item_number = $1 and cust_number = $2",
      today = new Date(),
      shiptoId,
      quantityUnitId,
      currencyId,
      priceUnitId,
      currencyId,
      effective,
      asOf,
      result,
      err;

    if (!itemId) {
      err = "Item";
    } else if (!customerId) {
      err = "Customer";
    } else if (!quantity) {
      err = "Quantity" 
    };
    if(err) { plv8.elog(ERROR, err + " is required.") }

    shiptoId = options.shiptoId ?
       XT.Data.getId(XT.Orm.fetch('XM', 'CustomerShipto'), options.shiptoId) : -1; 
    quantityUnitId = options.quantityUnitId ?
       XT.Data.getId(XT.Orm.fetch('XM', 'Unit'), options.quantityUnitId) :
       plv8.execute("select item_inv_uom_id as result from item where item_id = $1;", [itemId])[0].result; 
    priceUnitId = options.priceUnitId ?
      XT.Data.getId(XT.Orm.fetch('XM', 'Unit'), options.priceUnitId) :
      plv8.execute("select item_price_uom_id as result from item where item_id = $1;", [itemId])[0].result;
    currencyId = options.currencyId ?
      XT.Data.getId(XT.Orm.fetch('XM', 'Currency'), options.currencyId) :
      lplv8.execute("select basecurrid() as result")[0].result;
    effective = options.effective ? new Date(options.effective) : today;
    asOf = options.asOf ? new Date(options.asOf) : today;
    result = plv8.execute(sql, [itemId, customerId, shiptoId, quantity, quantityUnitId, priceUnitId, currencyId, effective, asOf])[0].result;

    result = { price: result.itemprice_price, type: result.itemprice_type };
    return JSON.stringify(result); 
  }

  /**
   Returns a price for a given customer, item, characteristic and quantity.

   @param {Number} customer id
   @param {Number} item id
   @param {Number} characteristic id
   @param {Number} characteristic value
   @param {Number} quantity
   @param {Object} options:  asOf, shiptoId, currencyId, effective
   @returns Object 
  */
  XM.Customer.characteristicPrice = function(customerId, itemId, characteristicId, value, quantity, options) {
    options = options || {};
    var sql = "select itemcharprice(item_id, char_id, $3, cust_id, $5, $6, $7, $8::date, $9::date) as result " +
              "from item, custinfo, char " +
              "where item_number = $1 and char_name = $2 and cust_number = $4;",
      today = new Date(),
      shiptoId = options.shiptoId || -1,
      currencyId,
      effective,
      asOf,
      result,
      err;

    if (!itemId) {
      err = "Item";
    } else if (!customerId) {
      err = "Characteristic";
    } else if (!customerId) {
      err = "Customer";
    } else if (!quantity) {
      err = "Quantity" 
    };
    if(err) { plv8.elog(ERROR, err + " is required.") }

    currencyId = options.currencyId ?
      XT.Data.getId(XT.Orm.fetch('XM', 'Currency'), options.currencyId) :
      plv8.execute("select basecurrid() as result")[0].result;
    effective = options.effective ? new Date(options.effective) : today;
    asOf = options.asOf ? new Date(options.asOf) : today;
    result = plv8.execute(sql, [itemId, characteristicId, value, customerId, shiptoId, quantity, currencyId, effective, asOf])[0].result;

    return result; 
  }

}());
  
$$ );

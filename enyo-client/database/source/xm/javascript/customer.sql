select xt.install_js('XM','Customer','xtuple', $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
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
              'from custinfo, item where item_number = $1 and cust_number = $2;',
      ret;
    shiptoId = shiptoId && XT.Data.getId(XT.Orm.fetch('XM','CustomerShipto'), shiptoId);
    ret = plv8.execute(sql, [itemId, customerId, shiptoId, scheduleDate]);
    return ret.length ? ret[0].canpurchase : true;
  };

  /**
   Returns an object with a price and type for a given customer, item and quantity.

   @param {Number} customer id
   @param {Number} item id
   @param {Number} quantity
   @param {Object} options:  asOf, shiptoId, quantityUnitId, priceUnitId, currencyId, effective
   @returns Object
  */
  XM.Customer.itemPrice = function (customerId, itemId, quantity, options) {
    options = options || {};
    var sql = "select itemipsprice(item_id, cust_id, $3, $4, $5, $6, $7, $8::date, $9::date, $10) as result " +
              "from custinfo, item where item_number = $1 and cust_number = $2",
      today = new Date(),
      shiptoId,
      quantityUnitId,
      priceUnitId,
      currencyId,
      effective,
      asOf,
      siteId,
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
       plv8.execute("select item_inv_uom_id as result from item where item_number = $1;", [itemId])[0].result;
    priceUnitId = options.priceUnitId ?
      XT.Data.getId(XT.Orm.fetch('XM', 'Unit'), options.priceUnitId) :
      plv8.execute("select item_price_uom_id as result from item where item_number = $1;", [itemId])[0].result;
    currencyId = options.currencyId ?
      XT.Data.getId(XT.Orm.fetch('XM', 'Currency'), options.currencyId) :
      plv8.execute("select basecurrid() as result")[0].result;
    siteId = options.siteId ?
      XT.Data.getId(XT.Orm.fetch('XM', 'Site'), options.siteId) : null;
    effective = options.effective ? new Date(options.effective) : today;
    asOf = options.asOf ? new Date(options.asOf) : today;

    if (DEBUG) {
      XT.debug('XM.Customer.itemPrice sql = ', sql);
      XT.debug('XM.Customer.itemPrice values = ', [itemId, customerId, shiptoId, parseInt(quantity), quantityUnitId, priceUnitId, currencyId, effective, asOf, siteId]);
    }
    result = plv8.execute(sql, [itemId, customerId, shiptoId, parseFloat(quantity), quantityUnitId, priceUnitId, currencyId, effective, asOf, siteId])[0].result;

    result = { price: result.itemprice_price, type: result.itemprice_type };

    return result;
  };
  XM.Customer.itemPrice.description = "Perform an item price quote for a given Customer, Item, Qty, Ship To, Date and Warehouse.";
  XM.Customer.itemPrice.request = {
    "$ref": "ItemPrice"
  };
  XM.Customer.itemPrice.parameterOrder = ["customerId", "itemId", "quantity", "options"];
  // For JSON-Schema deff, see:
  // https://github.com/fge/json-schema-validator/issues/46#issuecomment-14681103
  XM.Customer.itemPrice.schema = {
    ItemPrice: {
      properties: {
        attributes: {
          title: "Service request attributes",
          description: "An array of attributes needed to get a price quote.",
          type: "array",
          items: [
            {
              title: "Customer Id Key",
              description: "The Customer Number natural key",
              type: "string",
              "$ref": "Customer/number",
              required: true
            },
            {
              title: "Item Id Key",
              description: "The Item Number natural key",
              type: "string",
              "$ref": "Item/number",
              required: true
            },
            {
              title: "Quantity",
              description: "Quantity",
              type: "number",
              required: true
            },
            {
              title: "Options",
              type: "object",
              "$ref": "ItemPriceOptions"
            }
          ],
          "minItems": 3,
          "maxItems": 4,
          required: true
        }
      }
    },
    ItemPriceOptions: {
      properties: {
        asOf: {
          title: "As Of",
          description: "Transaction Timestamp, default to now()",
          type: "string",
          format: "date-time"
        },
        shiptoId: {
          title: "Ship To Id Key",
          description: "The Ship To Number natural key",
          type: "string",
          "$ref": "CustomerShipto/number",
          required: true
        },
        quantityUnitId: {
          title: "Quantity Unit Id",
          description: "The UOM Id for the quantity value.",
          type: "number",
          required: true
        },
        priceUnitId: {
          title: "Price Unit Id",
          description: "The UOM Id for the price value.",
          type: "number",
          required: true
        },
        currencyId: {
          title: "Currency Id",
          description: "The Currency Id for the price quote.",
          type: "number",
          required: true
        },
        effective: {
          title: "Effective Date",
          description: "Transaction Timestamp, default to now()",
          type: "string",
          format: "date-time"
        }
      }
    }
  };

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

  /**
    Return whether a Customer is referenced by another table.

    @param {String} Customer Number
  */
  XM.Customer.used = function(id) {
    var exceptions = ["public.crmacct"];
    return XM.PrivateModel.used("XM.Customer", id, exceptions);
  };

  /**
   * Return a pseudo customer object with all default parameters set.
   */
  XM.Customer.defaults = function () {
    var settings = XT.Session.settings(),
      salesRep = plv8.execute("select * from salesrep where salesrep_number = $1;", [settings.DefaultSalesRep])[0],
      /* TODO: This is a hack until #22800 is finished. */
      shipCharge = plv8.execute("select shipchrg_name from shipchrg where shipchrg_custfreight limit 1;")[0].shipchrg_name,
      preferredSite = plv8.execute("select warehous_code from whsinfo where warehous_code LIKE 'WH1' OR warehous_active and warehous_shipping order by warehous_id limit 1;")[0].warehous_code,
      cust = {
        "customerType": settings.DefaultCustType,
        "isActive": true,
        "salesRep": salesRep.salesrep_number,
        "commission": salesRep.salesrep_commission,
        "shipCharge": shipCharge,
        "shipVia": XM.Customer.defaultShipViaValue(),
        "isFreeFormShipto": settings.DefaultFreeFormShiptos,
        "isFreeFormBillto": false,
        "terms": settings.DefaultTerms,
        "discount": 0,
        "creditStatus": "G",
        "balanceMethod": settings.DefaultBalanceMethod,
        "backorder": settings.DefaultBackOrders,
        "partialShip": settings.DefaultPartialShipments,
        "blanketPurchaseOrders": false,
        "usesPurchaseOrders": false,
        "autoUpdateStatus": false,
        "autoHoldOrders": false,
        "preferredSite": preferredSite
      };

    return cust;
  };

  /**
   * Return default ShipVia value.
   */
  XM.Customer.defaultShipViaValue = function () {
    var ret,
      settings = XT.Session.settings(),
      shipVia = plv8.execute("select * from shipvia where shipvia_code = $1;", [settings.DefaultShipViaId])[0];

    if (shipVia) {
      ret = shipVia.shipvia_code + "-" + shipVia.shipvia_descrip;
    }
    else {
      ret = "";
    }

    return ret;
  };

}());

$$ );

select xt.install_js('XM','SalesOrder','xtuple', $$
/* Copyright (c) 1999-2013 by OpenMFG LLC, d/b/a xTuple. 
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  if (!XM.SalesOrder) { XM.SalesOrder = {}; }

  XM.SalesOrder.isDispatchable = true;

  /**
    Return whether a Sales Order is referenced by another table.
    
    @param {String} SalesOrder Number
  */
  XM.SalesOrder.used = function(id) {
    var exceptions = ["public.coitem"];
    return XM.PrivateModel.used("XM.SalesOrder", id, exceptions);
  };

  /**
    TODO: Could this be useful elsewhere?
    @private
  */
  var _updateUuid = function (obj) {
    // If array loop through each and process
    if (_.isArray(obj)) {
      _.each(obj, function (item) {
        updateUuid(item);
      });
    // If object remove uuid, then process all properties
    } else if (_.isObject(obj)) {
      if (obj.uuid) {
        obj.uuid = XT.generateUUID();
      }
      _.each(obj, function (value) {
        // If array, dive down
        if (_.isArray(value)) {
          updateUuid(value);
        }
      });
    }
  };

  /**
    Return a sales order object from a quote.
    
    @param {String} Quote Number
    @returns {Object}
  */
  XM.SalesOrder.convertFromQuote = function(id) {
    var data = Object.create(XT.Data),
      orm = data.fetchOrm("XM", "Quote"),
      salesOrder,
      customer,
      quote;

    if (!data.checkPrivilege("ConvertQuotes")) {
     plv8.elog(ERROR, "Access Denied.");
    }

    if (quote.expireDate < XT.today()) {
      ret = XT.Error.clone('xt2022');
    }
      // TODO make sure customer is not prospect
      // TODO if cust on hold, check hold priv, CreateSOForHoldCustomer
      // TODO if cust on warn, check warn priv, CreateSOForWarnCustomer
      // TODO if uses po and not blanket po, check for dups
      // TODO if quote and so exist with this number, get another

    if (err) {
      errorString = XT.errorToString(functionName, result);
      throw new handleError(errorString, 424); 
    }
    
    /* Start by getting the quote */
    quote = data.retrieveRecord({
      nameSpace: "XM",
      type: "Quote",
      id: id,
      superUser: true
    });

    /* Need to convert from customer/prospect to customer */
    customer = data.retrieveRecord({
      nameSpace: "XM",
      type: "CustomerRelation",
      id: quote.data.customer.number,
      superUser: true
    });

    /* Effetively copy the quote, but manipulate a few 
       data points along the way */
    salesOrder = XT.extend(quote.data, {
      orderDate: XT.today(),
      customer: customer.data,
      wasQuote: true,
      quoteNumber: quote.get("number"),
      quoteDate: undefined,
      expireDate: undefined
    });

    /* Recursively reploce original UUIDs */
    _updateUuid(salesOrder);

    return salesOrder;
  };

}());
  
$$ );


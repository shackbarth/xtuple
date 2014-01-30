select xt.install_js('XM','SalesOrder','xtuple', $$
/* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
   See www.xtuple.com/CPAL for the full text of the software license. */

(function () {

  if (!XM.SalesOrder) { XM.SalesOrder = {}; }

  XM.SalesOrder.idAttribute = 'cohead_id';
  XM.SalesOrder.isDispatchable = true;

  XM.SalesOrder.findByNumber = function (number) {
    return plv8.execute('select * from cohead where cohead_number = $1', [number])[0];
  };


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
    var prop;
    /* If array loop through each and process */
    if (XT.typeOf(obj) === "array") {
      obj.forEach(function (item) {
        _updateUuid(item);
      });
    /* If object remove uuid, then process all properties */
    } else if (XT.typeOf(obj) === "object") {
      if (obj.uuid) {
        obj.uuid = XT.generateUUID();
      }
      for (prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          // If array, dive down
          if (XT.typeOf(obj[prop]) === "array") {
            _updateUuid(obj[prop]);
          }
        }
      };
    }
  };

  /**
   * Post a Payment to this Sales Order
   *
   * @see https://github.com/xtuple/qt-client/blob/master/guiclient/salesOrder.cpp#L4512
   */
  XM.SalesOrder.addPayment = function (cashReceiptNumber, salesOrderNumber) {
    var cashReceipt = XM.CashReceipt.findByNumber(cashReceiptNumber),
      isPosted = cashReceipt.cashrcpt_posted;

    if (!cashReceipt) {
      /**
       * XXX maybe standardize 404-type error messages? or maybe it already is?
       */
      throw new handleError('Could not find CashReceipt [number=' + cashReceiptNumber + ']', 404);
    }

    var salesOrder = XM.SalesOrder.findByNumber(salesOrderNumber);

    if (!salesOrder) {
      throw new handleError('Could not find SalesOrder [number=' + salesOrderNumber + ']', 404);
    }

    var journalNumber = XM.CashReceipt.fetchJournalNumber();
      post = !isPosted && XT.executeFunction('postCashReceipt', [cashReceipt.cashrcpt_id, journalNumber ]),
      cashReceiptLine = plv8.execute(
        "select cashrcptitem_aropen_id FROM cashrcptitem "+
        "WHERE cashrcptitem_cashrcpt_id=$1",
        [cashReceipt.cashrcpt_id]
      )[0],
      receivableId = cashReceiptLine && cashReceiptLine.cashrcptitem_aropen_id,
      payment = plv8.execute([
        'insert into aropenalloc (',
          'aropenalloc_aropen_id,',
          'aropenalloc_doctype,',
          'aropenalloc_doc_id,',
          'aropenalloc_amount,',
          'aropenalloc_curr_id',
        ') values ($1, $2, $3, $4, $5)'
        ].join(' '), [
          receivableId,
          'S',
          salesOrder[XM.SalesOrder.idAttribute],
          cashReceipt.cashrcpt_amount,
          cashReceipt.cashrcpt_curr_id
        ]);

    return {
      paid: !!payment
    };
  };

  /**
    Return a sales order object from a quote. Does not
    take any action on the original quote

    @param {String} Quote Number
    @returns {Object}
  */
  XM.SalesOrder.convertFromQuote = function(id) {
    var data = Object.create(XT.Data),
      orm = data.fetchOrm("XM", "Quote"),
      sql1 = "select case " +
             "  when quitem_id is not null then -1" +
             "  when prospect_id is null and cust_id is null then -2 " +
             "  when prospect_id is not null then -3 " +
             "  when cust_creditstatus = 'H' and not checkPrivilege('CreateSOForHoldCustomer') then -4" +
             "  when cust_creditstatus = 'W' and not checkPrivilege('CreateSOForWarnCustomer')then -5" +
             "  when coalesce(quhead_expire, endOfTime()) < current_date then -6 " +
             "  else 1 " +
             "  end as result " +
             "from quhead " +
             " left join custinfo on quhead_cust_id=cust_id " +
              " left join prospect on quhead_cust_id=prospect_id " +
             " left join quitem on quitem_quhead_id=quhead_id and quitem_order_warehous_id is null " +
             "where quhead_number=$1;",
      sql2 = "select cohead_id " +
             "from quhead " +
             " join cohead on cohead_cust_id=quhead_cust_id " +
             "             and upper(cohead_custponumber)=upper(quhead_custponumber) " +
             "where quhead_number=$1",
      sql3 = "select cohead_id from cohead where cohead_number=$1;",
      salesOrder,
      customer,
      quote,
      result;

    if (!data.checkPrivilege("ConvertQuotes")) {
      plv8.elog(ERROR, "Access Denied.");
    }

    result = plv8.execute(sql1, [id])[0].result;

    if (result > 0) {

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
        type: "SalesCustomer",
        id: quote.data.customer.number,
        superUser: true
      });

      /* Check for blanket PO conflict */
      if (customer.data.usesPurchaseOrders &&
         !customer.data.blanketPurchaseOrders) {
        if (plv8.execute(sql2, [id]).length > 0) {
          result = -7;
        }
      }
    }

    /* Check for errors */
    if (result < 0) {
      errorString = XT.errorToString("convertQuote", result, [id]);
      throw new handleError(errorString, 424);
    }

    /* If number is already used, get another */
    if (plv8.execute(sql3, [id]).length) {
      id = plv8.execute("select fetchsonumber() as num;")[0].num;
    }

    /* Effetively copy the quote, but manipulate a few
       data points along the way */
    salesOrder = XT.extend(quote.data, {
      number: id,
      orderDate: XT.today(),
      customer: customer.data,
      wasQuote: true,
      quoteNumber: quote.data.number,
      quoteDate: undefined,
      expireDate: undefined
    });

    /* Recursively replace original UUIDs */
    _updateUuid(salesOrder);

    return salesOrder;
  };

}());

$$ );


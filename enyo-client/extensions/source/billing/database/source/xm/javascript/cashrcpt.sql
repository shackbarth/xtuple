select xt.install_js('XM', 'CashAllocation', 'billing', $$

  XM.CashAllocation = {
    isDispatchable: true,

    findByNumber: function (number) {
      return plv8.execute("select * from cashrcpt where cashrcpt_number = $1", [number])[0];
    }
  };

$$);
select xt.install_js('XM', 'CashAllocation', 'billing', $$

  XM.CashAllocation = {
    isDispatchable: true,

    prefixMap: {
      SalesOrder: 'cohead'
    },
    fetchJournalNumber: function () {
      return plv8.execute("selecct fetchJournalNumber('C/R') AS value").value;
    },

    /**
     * @see https://github.com/xtuple/qt-client/blob/master/guiclient/salesOrder.cpp#L4512
     * TODO more thoroughly document
     */
    post: function (number, documentKind) {
      var cashReceipt = XM.CashReceipt.findByNumber(number);

      if (!cashReceipt) {
        /* TODO log error */
        return;
      }

      var targetDocument = XM[documentKind].findByDocumentNumber(cashReceipt.cashrcpt_docnumber),
        journalNumber = XM.CashAllocation.fetchJournalNumber();
        post = plv8.execute("select postCashReceipt($1, $2) AS result", [
          cashReceipt.cashrcpt_id,
          journalNumber
        ]).result,
        cashReceiptLine = plv8.execute(
          "select cashrcptitem_aropen_id FROM cashrcptitem "+
          "WHERE cashrcptitem_cashrcpt_id=$1",
          [cashReceipt.cashrcpt_id]
        )[0],
        receivableId = cashReceiptLine && cashReceiptLine.cashrcptitem_aropen_id,
        allocation = plv8.execute([
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
            targetDocument[prefixMap[documentKind] + 'id'],
            cashReceipt.cashrcpt_amount,
            cashReceipt.cashrcpt_curr_id
          ]);

      return !!allocation;
    }
  };
$$);

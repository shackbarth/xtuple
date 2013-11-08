select xt.install_js('XM', 'Receivable', 'billing', $$

(function () {

  if (!XM.Receivable) { XM.Receivable = {}; }

  XM.Receivable.isDispatchable = true;

  /**
    - Insert an aropen record
    - Insert tax records
    - Run the createarcreditmemo function
   @param {Object} JSON credit memo attributes object
  */
  XM.Receivable.createCreditMemo = function (params) {

    //return plv8.execute('select createarcreditmemo() as value', params)[0].value;

  };

  /**
    - Insert an aropen record
    - Insert tax records
    - Run the createardebitmemo function
   @param {Object} JSON debit memo attributes object
  */
  XM.Receivable.createDebitMemo = function (params) {

    //return plv8.execute('select createardebitmemo() as value', params)[0].value;

  };

})();

$$ );
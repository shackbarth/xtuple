select xt.install_js('XM', 'CashReceipt', 'billing', $$

  XM.CashReceipt = {
    isDispatchable: true,

    fetchJournalNumber: function () {
      return XT.executeFunction('fetchJournalNumber', ['C/R']);
    },

    /**
     * Find a CashReceipt by number (cashrcpt_number)
     */
    findByNumber: function (number) {
      return plv8.execute("select * from cashrcpt where cashrcpt_number = $1", [number])[0];
    }
  };
$$ );

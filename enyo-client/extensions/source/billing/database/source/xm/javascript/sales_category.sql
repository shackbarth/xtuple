select xt.install_js('XM', 'SalesCategory', 'billing', $$

(function () {

  XM.SalesCategory || (XM.SalesCategory = { });

  /**
   * @augments XM.SalesCategory
   */
  XT.extend(XM.SalesCategory, {

    isDispatchable: true,

    /**
     * Query for unposted invoices; returns true if any exist, and false
     * otherwise.
     *
     * @see XM.SalesCategory#findUnpostedInvoices
     */
    queryUnpostedInvoiceRPC: function (salesCategoryId) {
      return this.plan.execute([salesCategoryId])[0];
    }.bind({
      plan: plv8.prepare([

        'select',
          'invchead_id',
        'from',
          'salescat',
          'inner join invcitem on (invcitem_salescat_id = $1)',
          'inner join invchead on (invcitem_invchead_id = invchead_id)',
        'where',
          'invchead_posted = false'

      ].join(' '), ['int']),
      params: {
        salesCategoryId: {
          type: "Number",
          description: "Sales Category Id"
        }
      },
      description: "Is SalesCategory referenced by an unposted invoice?",
    })
  });

})();

$$ );

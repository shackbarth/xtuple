select xt.install_js('XM', 'SalesCategory', 'billing', $$

(function () {

  /**
   * @augments XM.SalesCategory
   */
  XM.SalesCategory = XT.extend(XM.SalesCategory || { }, {

    isDispatchable: true,

    /**
     * Query for unposted invoices; returns true if any exist, and false
     * otherwise.
     *
     * @see XM.SalesCategory#queryUnpostedInvoice
     */
    queryUnpostedInvoiceRPC: function (salesCategoryName) {
      return this.plan.execute([salesCategoryName])[0];
    }
    .bind({
      plan: plv8.prepare([

        'select',
          'invchead_id',
        'from',
          'salescat',
        'inner join',
          'invcitem on (invcitem_salescat_id = salescat_salescat_id)',
        'inner join',
          'invchead on (invcitem_invchead_id = invchead_id)',
        'where',
          'salescat_name = $1',
          'and invchead_posted = false'

      ].join(' '), ['int']),
      params: {
        salesCategoryId: {
          type: "Name",
          description: "Sales Category Name"
        }
      },
      description: "Is SalesCategory referenced by an unposted invoice?",
    })
  });

})();

$$ );

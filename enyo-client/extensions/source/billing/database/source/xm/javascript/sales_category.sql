select xt.install_js('XM', 'SalesCategory', 'billing', $$

(function () {

  /**
   * @augments XM.SalesCategory
   */
  XM.SalesCategory = XT.extend(XM.SalesCategory || { }, {
    isDispatchable: true,

    /**
     * Returns whether this SalesCategory is referenced by unposted invoices.
     * @see XM.SalesCategory#queryUnpostedInvoices
     * @returns {Boolean}
     */
    hasUnpostedInvoices: function (salesCategoryName) {
      return !!this.queryUnpostedInvoices(salesCategoryName);
    },

    /**
     * Query for unposted invoices; returns true if any exist, and false
     * otherwise.
     *
     * @see XM.SalesCategory#getUnpostedInvoices
     * @returns {Array} ids of any unposted invoices
     */
    queryUnpostedInvoices: function (salesCategoryName) {
      return this.plan.execute([salesCategoryName])[0];
    }
    .bind({
      plan: plv8.prepare([

        'select',
          'invchead_id',
        'from',
          'salescat',
          'inner join invcitem on (invcitem_salescat_id = salescat_id)',
          'inner join invchead on (invcitem_invchead_id = invchead_id)',
        'where',
          'salescat_name = $1',
          'and invchead_posted = false'

      ].join(' '), ['text']),
      params: {
        salesCategoryName: {
          type: "String",
          description: "Sales Category Name"
        }
      },
      description: "Is SalesCategory referenced by an unposted invoice?",
    })
  });

})();

$$ );

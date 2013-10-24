/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false */
/*global XT:true, enyo:true, Globalize:true*/

(function () {

  XT.extensions.sales.initListRelations = function () {

    // ..........................................................
    // CUSTOMER/PROSPECT SALESORDER
    //

    enyo.kind({
      name: "XV.CustomerSalesOrderListRelations",
      kind: "XV.ListRelations",
      orderBy: [
        {attribute: 'number', descending: true}
      ],
      parentKey: "customer",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableRows", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "number", classes: "bold"},
                {kind: "XV.ListAttr", attr: "orderDate", classes: "right"}
              ]}
            ]},
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "shipVia"},
                {kind: "XV.ListAttr", attr: "total", classes: "right",
                  formatter: "formatMoney"}
              ]}
            ]}
          ]}
        ]}
      ],
      formatMoney: function (value) {
        return Globalize.format(value, "c" + XT.locale.currencyScale);
      }
    });

    // ..........................................................
    // CUSTOMER/PROSPECT QUOTE/SALESORDER
    //

    enyo.kind({
      name: "XV.CustomerQuoteListRelations",
      kind: "XV.CustomerSalesOrderListRelations",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableRows", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "number", classes: "bold"},
                {kind: "XV.ListAttr", attr: "quoteDate", classes: "right"}
              ]}
            ]},
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "shipVia"},
                {kind: "XV.ListAttr", attr: "total", classes: "right",
                  formatter: "formatMoney"}
              ]}
            ]}
          ]}
        ]}
      ],
    });

    // ..........................................................
    // OPPORTUNITY QUOTE
    //

    enyo.kind({
      name: "XV.OpportunityQuoteListRelations",
      kind: "XV.CustomerQuoteListRelations",
      parentKey: "opportunity"
    });

    // ..........................................................
    // OPPORTUNITY SALES ORDER
    //

    enyo.kind({
      name: "XV.OpportunitySalesListRelations",
      kind: "XV.CustomerSalesOrderListRelations",
      parentKey: "opportunity"
    });

  };

}());

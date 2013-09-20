/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, enyo:true*/

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
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "number", classes: "bold"},
                {kind: "XV.ListAttr", attr: "shipVia", classes: "right"}
              ]}
            ]}
          ]}
        ]}
      ]
    });

    // ..........................................................
    // CUSTOMER/PROSPECT QUOTE/SALESORDER
    //

    enyo.kind({
      name: "XV.CustomerQuoteListRelations",
      kind: "XV.ListRelations",
      orderBy: [
        {attribute: 'number', descending: true}
      ],
      parentKey: "customer",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "number", classes: "bold"},
                {kind: "XV.ListAttr", attr: "shipVia", classes: "right"}
              ]}
            ]}
          ]}
        ]}
      ]
    });

    // ..........................................................
    // OPPORTUNITY QUOTE
    //

    enyo.kind({
      name: "XV.OpportunitySalesListRelations",
      kind: "XV.ListRelations",
      orderBy: [
        {attribute: 'number', descending: true}
      ],
      parentKey: "opportunity",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "number", classes: "bold"},
                {kind: "XV.ListAttr", attr: "shipVia", classes: "right"}
              ]}
            ]}
          ]}
        ]}
      ]
    });

  };

}());

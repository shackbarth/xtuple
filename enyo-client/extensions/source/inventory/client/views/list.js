/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, Globalize:true*/

(function () {

  XT.extensions.inventory.initLists = function () {

    // ..........................................................
    // BACKLOG REPORT
    //

    enyo.kind({
      name: "XV.SalesOrderLineListItem",
      kind: "XV.List",
      label: "_backlog".loc(),
      collection: "XM.SalesOrderLineListItemCollection",
      query: {orderBy: [
        {attribute: 'salesOrder.number'},
        {attribute: 'lineNumber'},
        {attribute: 'subNumber'}
      ]},
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableRows", components: [
            {kind: "FittableColumns", name: "header", classes: "header", headerAttr: "salesOrder.number", components: [
              {kind: "XV.ListColumn", classes: "short", components: [
                {kind: "XV.ListAttr", attr: "salesOrder.number", isKey: true, classes: "header"}
              ]},
              {kind: "XV.ListColumn", classes: "first", components: [
                {kind: "XV.ListAttr", attr: "salesOrder.customer.name", classes: "header"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "salesOrder.shiptoName", classes: "header"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "salesOrder.scheduleDate", classes: "header"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "salesOrder.salesRep.name", classes: "header"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "salesOrder.total", formatter: "formatPrice", classes: "header"}
              ]},
              {kind: "XV.ListColumn", classes: "last", components: [
                {classes: "header"}
              ]}
            ]},
            {kind: "FittableColumns", components: [
              {kind: "XV.ListColumn", classes: "short", components: [
                {kind: "XV.ListAttr", attr: "lineNumber", formatter: "formatLineNumber"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "itemSite.item.number", classes: "bold"},
                {kind: "XV.ListAttr", attr: "itemSite.item.description1"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "salesOrder.orderDate"},
                {kind: "XV.ListAttr", attr: "scheduleDate"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "quantity"},
                {kind: "XV.ListAttr", attr: "quantityUnit.name"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "quantityShipped"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "shipBalance", classes: "bold"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "price", formatter: "formatPrice"},
                {kind: "XV.ListAttr", attr: "priceUnit.name"}
              ]},
              {kind: "XV.ListColumn", components: [
                {kind: "XV.ListAttr", attr: "extendedPrice", formatter: "formatPrice", classes: "right"}
              ]}
            ]}
          ]}
        ]}
      ],
      formatPrice: function (value, view, model) {
        var currency = model ? model.getValue("salesOrder.currency") : false,
          scale = XT.session.locale.attributes.salesPriceScale;
        return currency ? currency.format(value, scale) : "";
      },
      formatLineNumber: function (value, view, model) {
        var lineNumber = model.get("lineNumber"),
          subnumber = model.get("subnumber");
        if (subnumber === 0) {
          value = lineNumber;
        } else {
          value = lineNumber + "." + subnumber;
        }
        return value;
      }
    });

    // ..........................................................
    // ISSUE TO SHIPPING
    //

    enyo.kind({
      name: "XV.IssueToShippingList",
      kind: "XV.List",
      label: "_issueToShipping".loc(),
      collection: "XM.ShippableSalesOrderLine",
      parameterWidget: "XV.IssueToShippingParameters",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "lineNumber", classes: "bold"},
                {kind: "XV.ListAttr", attr: "site.code",
                  classes: "right"},
                {kind: "XV.ListAttr", attr: "item.number", fit: true}
              ]},
              {kind: "XV.ListAttr", attr: "item.description1",
                fit: true,  style: "text-indent: 18px;"}
            ]},
            {kind: "XV.ListColumn", classes: "money", components: [
              {kind: "XV.ListAttr", attr: "quantity",
                formatter: "formatQuantity", style: "text-align: right"},
              {kind: "XV.ListAttr", attr: "price",
                formatter: "formatPrice", style: "text-align: right"}
            ]},
            {kind: "XV.ListColumn", classes: "money", components: [
              {kind: "XV.ListAttr", attr: "unit.name"},
              {kind: "XV.ListAttr", attr: "priceUnit.name"}
            ]},
            {kind: "XV.ListColumn", classes: "money", components: [
              {kind: "XV.ListAttr", attr: "scheduleDate",
                style: "text-align: right"},
              {kind: "XV.ListAttr", attr: "extendedPrice",
                style: "text-align: right", formatter: "formatExtendedPrice"}
            ]}
          ]}
        ]}
      ]
    });

    XV.registerModelList("XM.SalesOrderRelation", "XV.SalesOrderLineListItem");

    // ..........................................................
    // ORDER LIST (WO, SO)
    //

    enyo.kind({
      name: "XV.OrderList",
      kind: "XV.List",
      label: "_order".loc(),
      collection: "XM.OrderListItemCollection",
      query: {orderBy: [
        {attribute: 'scheduledDate'}
      ]},
      parameterWidget: "XV.OrderListItemParameters",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "number", isKey: true, fit: true},
                {kind: "XV.ListAttr", attr: "forName1", fit: true, classes: "right"}
              ]},
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "type"},
                {kind: "XV.ListAttr", attr: "forName2", classes: "right"}
              ]}
            ]},
            {kind: "XV.ListColumn", classes: "second", components: [
              {kind: "XV.ListAttr", attr: "scheduledDate"}
            ]},
            {kind: "XV.ListColumn", classes: "last", components: [
              {kind: "XV.ListAttr", attr: "assignedToUserName"}
            ]}
          ]}
        ]}
      ]
    });

    XV.registerModelList("XM.OrderRelation", "XV.OrderList");

    // ..........................................................
    // SALES ORDER
    //

    enyo.kind({
      name: "XV.SalesOrderLineListItem",
      kind: "XV.List",
      label: "_backlog".loc(),
      collection: "XM.SalesOrderLineListItemCollection",
      query: {orderBy: [
        {attribute: 'salesOrder.number'},
        {attribute: 'lineNumber'},
        {attribute: 'subNumber'}
      ]},
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableRows", components: [
            {kind: "FittableColumns", name: "header", classes: "header", headerAttr: "salesOrder.number", components: [
              {kind: "XV.ListColumn", classes: "short", components: [
                {kind: "XV.ListAttr", attr: "salesOrder.number", isKey: true, classes: "header"}
              ]},
              {kind: "XV.ListColumn", classes: "first", components: [
                {kind: "XV.ListAttr", attr: "salesOrder.customer.name", classes: "header"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "salesOrder.shiptoName", classes: "header"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "salesOrder.scheduleDate", classes: "header"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "salesOrder.salesRep.name", classes: "header"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "salesOrder.total", formatter: "formatPrice", classes: "header"}
              ]},
              {kind: "XV.ListColumn", classes: "last", components: [
                {classes: "header"}
              ]}
            ]},
            {kind: "FittableColumns", components: [
              {kind: "XV.ListColumn", classes: "short", components: [
                {kind: "XV.ListAttr", attr: "lineNumber", formatter: "formatLineNumber"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "itemSite.item.number", classes: "bold"},
                {kind: "XV.ListAttr", attr: "itemSite.item.description1"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "salesOrder.orderDate"},
                {kind: "XV.ListAttr", attr: "scheduleDate"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "quantity"},
                {kind: "XV.ListAttr", attr: "quantityUnit.name"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "quantityShipped"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "shipBalance", classes: "bold"}
              ]},
              {kind: "XV.ListColumn", classes: "second", components: [
                {kind: "XV.ListAttr", attr: "price", formatter: "formatPrice"},
                {kind: "XV.ListAttr", attr: "priceUnit.name"}
              ]},
              {kind: "XV.ListColumn", components: [
                {kind: "XV.ListAttr", attr: "extendedPrice", formatter: "formatPrice", classes: "right"}
              ]}
            ]}
          ]}
        ]}
      ],
      formatPrice: function (value, view, model) {
        var currency = model ? model.getValue("salesOrder.currency") : false,
          scale = XT.session.locale.attributes.salesPriceScale;
        return currency ? currency.format(value, scale) : "";
      },
      formatLineNumber: function (value, view, model) {
        var lineNumber = model.get("lineNumber"),
          subnumber = model.get("subnumber");
        if (subnumber === 0) {
          value = lineNumber;
        } else {
          value = lineNumber + "." + subnumber;
        }
        return value;
      }
    });

    XV.registerModelList("XM.SalesOrderRelation", "XV.SalesOrderLineListItem");

    // ..........................................................
    // SHIPMENT
    //

    enyo.kind({
      name: "XV.ShipmentList",
      kind: "XV.List",
      label: "_shipments".loc(),
      collection: "XM.ShipmentListItemCollection",
      query: {orderBy: [
  			{attribute: 'shipDate'}
      ]},
      parameterWidget: "XV.ShipmentListItemParameters",
      components: [
        {kind: "XV.ListItem", components: [
  	  		{kind: "FittableColumns", components: [
  	    		{kind: "XV.ListColumn", classes: "first", components: [
  						{kind: "FittableColumns", components: [
  							{kind: "XV.ListAttr", attr: "number", isKey: true, fit: true},
  	      			{kind: "XV.ListAttr", attr: "order.customer.name", fit: true, classes: "right"}
  	    			]},
  	    			{kind: "FittableColumns", components: [
  							{kind: "XV.ListAttr", attr: "order.number", classes: "right"}
  	    			]}
  					]},
  	    		{kind: "XV.ListColumn", classes: "second", components: [
  	      		{kind: "XV.ListAttr", attr: "shipDate"}
  	    		]},
  	    		{kind: "XV.ListColumn", classes: "second", components: [
  	      		{kind: "XV.ListAttr", attr: "freight", formatter: "formatExtendedPrice"},
  	      		{kind: "XV.ListAttr", attr: "currency"}
  	    		]}
  	  		]}
  			]}
      ],

      formatExtendedPrice: function (value, view, model) {
        var currency = model ? model.getValue("currency") : false,
          scale = XT.session.locale.attributes.extendedPriceScale;
        return currency ? currency.format(value, scale) : "";
      }

    });

    XV.registerModelList("XM.Shipment", "XV.ShipmentList");

  }
}());

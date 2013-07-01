/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, Globalize:true*/

(function () {

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
			{attribute: 'lineNumber', formatter: "lineNumber"}
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
      if (subnumber == 0) {
        value = lineNumber;
      } else {
        value = lineNumber + "." + subnumber;
      }
      return value; 
    }
  });

  XV.registerModelList("XM.SalesOrderRelation", "XV.SalesOrderLineListItem");

}());

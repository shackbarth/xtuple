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
    label: "_salesOrderLineListItem".loc(),
    collection: "XM.SalesOrderLineListItemCollection",
    query: {orderBy: [
	{attribute: 'salesOrder.number'}
      ]},
    components: [
      {kind: "XV.ListItem", components: [
	{kind: "FittableRows", components: [
	  {kind: "FittableColumns", name: "header", classes: "header, bold", headerAttr: "salesOrder.number", components: [
	    {kind: "XV.ListColumn", classes: "header, short", components: [		  
	      {kind: "XV.ListAttr", attr: "salesOrder.number", isKey: true}
	    ]}, 
	    {kind: "XV.ListColumn", classes: "header, second, bold", components: [	
	      {kind: "XV.ListAttr", attr: "salesOrder.customer.name"}  
	    ]},
	    {kind: "XV.ListColumn", classes: "header, second, bold", components: [	
	      {kind: "XV.ListAttr", attr: "salesOrder.orderDate"}  
	    ]},		
	    {kind: "XV.ListColumn", classes: "header, second, bold", components: [	
	      {kind: "XV.ListAttr", attr: "salesOrder.scheduleDate"}
	    ]},  
	    {kind: "XV.ListColumn", classes: "header, second, bold", components: [	
	      {kind: "XV.ListAttr", attr: "salesOrder.total"}
	    ]}
	  ]},
	  {kind: "FittableColumns", components: [
	    {kind: "XV.ListColumn", classes: "short", components: [
	      {kind: "XV.ListAttr", attr: "lineNumber"}
	    ]},
	    {kind: "XV.ListColumn", classes: "second", components: [
	      {kind: "XV.ListAttr", attr: "itemSite.item.number"},
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
	      {kind: "XV.ListAttr", attr: "shipBalance"}
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
    }
  });

  XV.registerModelList("XM.SalesOrderRelation", "XV.SalesOrderLineListItem");

}());

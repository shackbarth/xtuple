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
	      {kind: "XV.ListAttr", attr: "salesOrder.number"}
	    ]}, 
	    {kind: "XV.ListColumn", classes: "header, second, bold", components: [	
	      {kind: "XV.ListAttr", attr: "salesOrder.customer.name"}  
	    ]},	
	    {kind: "XV.ListColumn", classes: "header, second, bold", components: [	
	      {kind: "XV.ListAttr", attr: "scheduleDate"}
	    ]},  
	    {kind: "XV.ListColumn", classes: "header, second, bold", components: [	
	      {kind: "XV.ListAttr", attr: "salesOrder.total"}
	    ]}
	  ]},
	  {kind: "FittableColumns", components: [
	    {kind: "XV.ListColumn", classes: "short", components: [
	      {kind: "XV.ListAttr", attr: "salesOrder.number", isKey: true},
	      {kind: "XV.ListAttr", attr: "lineNumber"}
	    ]},
	    {kind: "XV.ListColumn", classes: "second", components: [
	      {kind: "XV.ListAttr", attr: "itemSite.item.description1"},
	      {kind: "XV.ListAttr", attr: "quantity"}
	    ]},
	    {kind: "XV.ListColumn", classes: "second", components:[
	      {kind: "XV.ListAttr", attr: "price"},
	      {kind: "XV.ListAttr", attr: "priceUnit.name"}
	    ]}
	  ]} /**,
	  {kind: "FittableColumns", name: "footer", headerAttr: "salesOrder.number", components: [
	    {kind: "XV.ListColumn", classes: "short", components: [		  
	      {kind: "XV.ListAttr", attr: "salesOrder.number"}
	    ]}
	  ]} */ //we can wait on a footer for now - plus, in my opinion, everything can go in a header. 
	]}
      ]}
    ]
  });

  XV.registerModelList("XM.SalesOrderRelation", "XV.SalesOrderLineListItem");

}());

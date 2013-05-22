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
	{attribute: 'lineNumber'}
      ]},
    components: [
      {name: "divider", content: "hello"}, //now I need to go to XV.List and find setupItem and figure out how to get to the data I want to populate into the header and put it in a var (below in the temp area). Then rename the temp below to setupItem. 
      {kind: "XV.ListItem", components: [
	{kind: "FittableColumns", components: [
	  {kind: "XV.ListColumn", classes: "short", components: [
	    {kind: "XV.ListAttr", attr: "salesOrder", isKey: true},
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
	]}
      ]}
    ],
/*    rendered: function() {
      this.inherited(arguments);
      this.populateList();
    },
*/// this is from the enyo sample not sure if I need it
    temp: function(inSender, inEvent) {
      var i = inEvent.index;
	var data = this.filter ? this.filtered : this.db;
	var item = data[i];
	// content
	this.$.item.setContact(item);
	// selection
	this.$.item.setSelected(inSender.isSelected(i));
	// divider
	if (!this.hideDivider) {
	  var d = item.name[0];
	  var prev = data[i-1];
	  var showd = d != (prev && prev.name[0]);
	  this.$.divider.setContent(d);
	  this.$.divider.canGenerate = showd;
	  this.$.item.applyStyle("border-top", showd ? "none" : null);
	}
    }
  });
}());

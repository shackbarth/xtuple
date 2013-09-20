/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, enyo:true*/

(function () {

  XT.extensions.sales.initListRelationsBoxes = function () {

    // ..........................................................
    // OPPORTUNITY QUOTE
    //

    enyo.kind({
      name: "XV.OpportunityQuoteListRelationsBox",
      kind: "XV.ListRelationsBox",
      title: "_quotes".loc(),
      parentKey: "opportunity",
      listRelations: "XV.OpportunitySalesListRelations", // not a bug
      searchList: "XV.QuoteList",
      handlers: {
        onWorkspace: "appendWorkspace"
      },
      /**
        Intercept new workspace and add customer/prospect.
      */
      appendWorkspace: function (inSender, inEvent) {
        var that = this,
          parent,
          model,
          options,
          id;
        if (inEvent.attributes && !inEvent.attributes.customer) {
          parent = this.$.list.getParent();
          id = parent.getValue("account.number");
          options = {
            id: id,
            success: function () {
              inEvent.attributes.customer = model;
              that.doWorkspace(inEvent);
            }
          };
          model = new XM.CustomerProspectRelation();
          model.fetch(options);
          return true;
        }
      }
    });

    // ..........................................................
    // OPPORTUNITY SALES ORDER
    //

    enyo.kind({
      name: "XV.OpportunitySalesOrderListRelationsBox",
      kind: "XV.ListRelationsBox",
      title: "_salesOrders".loc(),
      parentKey: "opportunity",
      listRelations: "XV.OpportunitySalesListRelations",
      searchList: "XV.SalesOrderList"
    });

    // ..........................................................
    // PROSPECT QUOTE
    //

    enyo.kind({
      name: "XV.ProspectQuoteListRelationsBox",
      kind: "XV.ListRelationsBox",
      title: "_quotes".loc(),
      parentKey: "customer", // not a bug
      listRelations: "XV.CustomerQuoteListRelations" // not a bug
    });

  };

}());

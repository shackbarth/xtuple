/*jshint bitwise:false, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, XM:true, _:true, Backbone:true, enyo:true, XT:true, Globalize:true */

(function () {

  // ..........................................................
  // ACCOUNT
  //

  enyo.kind({
    name: "XV.AccountContactsBox",
    kind: "XV.ListRelationsBox",
    title: "_contacts".loc(),
    parentKey: "account",
    listRelations: "XV.ContactListRelations",
    searchList: "XV.ContactList"
  });
  
  // ..........................................................
  // CUSTOMER GROUP CUSTOMER
  //

  enyo.kind({
    name: "XV.CustomerGroupCustomerBox",
    kind: "XV.ListRelationsBox",
    title: "_customers".loc(),
    parentKey: "customerGroup",
    canOpen: false,
    searchList: "XV.CustomerList",
    listRelations: "XV.CustomerGroupCustomerListRelations",
    updateButtons: function () {
      this.$.attachButton.setDisabled(false);
    },
    attachItem: function () {
      var list = this.$.list,
        parent = list.getParent(),
        searchList = this.getSearchList(),
        ids = [],
        inEvent,

        // Callback to handle selection...
        callback = function (selectedModel) {
          var model = new XM.CustomerGroupCustomer(null, {isNew: true});
          model.set("customer", selectedModel);
          parent.get("customers").add(model);
        };
        
      _.each(parent.get("customers").models, function (customer) {
        ids.push(customer.getValue("customer.id"));
      });

      // Open a customer search screen excluding customers already selected
      inEvent = {
        list: searchList,
        callback: callback
      };
      if (ids.length) {
        inEvent.conditions = [{
          attribute: "number",
          operator: "NOT ANY",
          value: ids
        }];
      }
      this.doSearch(inEvent);
    },
    detachItem: function () {
      var list = this.$.list,
        index = list.getFirstSelected(),
        model = list.getModel(index);

      model.destroy();
      list.lengthChanged();
    },
    selectionChanged: function (inSender, inEvent) {
      var index = this.$.list.getFirstSelected();
      this.$.detachButton.setDisabled(!index);
    }
  });

  // ..........................................................
  // INCIDENT HISTORY
  //

  enyo.kind({
    name: "XV.IncidentHistoryRelationsBox",
    kind: "XV.ListRelationsBox",
    title: "_history".loc(),
    parentKey: "history",
    listRelations: "XV.IncidentHistoryListRelations",
    canOpen: false
  });

  // ..........................................................
  // OPPORTUNITY QUOTE
  //

  enyo.kind({
    name: "XV.OpportunityQuoteListRelationsBox",
    kind: "XV.ListRelationsBox",
    title: "_quotes".loc(),
    parentKey: "opportunity",
    listRelations: "XV.OpportunityQuoteListRelations",
    searchList: "XV.QuoteList"
  });

  // ..........................................................
  // CUSTOMER QUOTE
  //

  enyo.kind({
    name: "XV.CustomerQuoteListRelationsBox",
    kind: "XV.ListRelationsBox",
    title: "_quotes".loc(),
    parentKey: "customer",
    listRelations: "XV.CustomerQuoteListRelations",
    searchList: "XV.QuoteList"
  });

  // ..........................................................
  // PROSPECT QUOTE
  //

  enyo.kind({
    name: "XV.ProspectQuoteListRelationsBox",
    kind: "XV.ListRelationsBox",
    title: "_quotes".loc(),
    parentKey: "customer",
    listRelations: "XV.ProspectQuoteListRelations",
    searchList: "XV.QuoteList"
  });

}());

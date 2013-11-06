/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XV:true, XT:true, XM:true, enyo:true*/

(function () {

  XT.extensions.sales.initListRelationsBoxes = function () {

    // ..........................................................
    // OPPORTUNITY QUOTE
    //

    /** @private */
    var _appendWorkspace = function (Klass, inEvent) {
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
        model = new Klass();
        model.fetch(options);
        return true;
      }
    };

    /** @private
      Check to see if account is customer or prospect to determine whether `new` works.
    */
    var _updateButtons = function (isCustomerOnly) {
      var newButton = this.$.newButton,
        attachButton = this.$.attachButton,
        parent,
        model;
      if (!newButton.disabled) {
        parent = this.$.list.getParent();
        model = parent.get("account");
        if (!model.get("customer") &&
           (isCustomerOnly || !model.get("prospect"))) {
          newButton.setDisabled(true);
          attachButton.setDisabled(true);
        }
      }
    };

    var _attachItem = function (inSender, inEvent) {
      var attachItem = XV.ListRelationsBox.prototype.attachItem,
        parent = this.$.list.getParent(),
        id = parent.getValue("account.number");

      inEvent.conditions = [{
        attribute: "customer",
        value: id
      }];
      attachItem.call(this, inSender, inEvent);
    };

    enyo.kind({
      name: "XV.OpportunityQuoteListRelationsBox",
      kind: "XV.ListRelationsBox",
      title: "_quotes".loc(),
      parentKey: "opportunity",
      listRelations: "XV.OpportunityQuoteListRelations", // not a bug
      searchList: "XV.QuoteList",
      handlers: {
        onWorkspace: "appendWorkspace"
      },
      /**
        Intercept new workspace and add customer/prospect.
      */
      appendWorkspace: function (inSender, inEvent) {
        return _appendWorkspace.call(this, XM.CustomerProspectRelation, inEvent);
      },
      attachItem: function (inSender, inEvent) {
        _attachItem.call(this, inSender, inEvent);
      },
      updateButtons: function () {
        this.inherited(arguments);
        _updateButtons.call(this);
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
      searchList: "XV.SalesOrderList",
      handlers: {
        onWorkspace: "appendWorkspace"
      },
      /**
        Intercept new workspace and add customer.
      */
      appendWorkspace: function (inSender, inEvent) {
        return _appendWorkspace.call(this, XM.SalesCustomer, inEvent);
      },
      attachItem: function (inSender, inEvent) {
        _attachItem.call(this, inSender, inEvent);
      },
      updateButtons: function () {
        this.inherited(arguments);
        _updateButtons.call(this, true);
      }
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

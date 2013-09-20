/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, enyo:true*/

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
        that = this,
        parent,
        model,
        options,
        id,
        i;
      this._counter = (this.counter || 0) + 1;
      i = this._counter;
      if (!newButton.disabled) {
        parent = this.$.list.getParent();
        id = parent.getValue("account.number");
        newButton.setDisabled(true); // Disable until we know more
        attachButton.setDisabled(true);
        options = {
          id: id,
          success: function () {
            if (i < that._counter) { return; } // Ignore stale requests
            if (model.get("customer") ||
               (!isCustomerOnly && model.get("prospect"))) {
              newButton.setDisabled(false);
              attachButton.setDisabled(false);
            }
          }
        };
        model = new XM.Account();
        model.fetch(options);
      }
    };

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
        return _appendWorkspace.call(this, XM.CustomerProspectRelation, inEvent);
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

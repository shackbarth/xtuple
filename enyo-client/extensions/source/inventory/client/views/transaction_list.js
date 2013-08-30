/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XT:true, XV:true, XM:true, _:true, enyo:true */

(function () {

  XT.extensions.inventory.initTransactionList = function () {

    /**
      @name XV.TransactionList
      @extends XV.SearchContainer
     */
    var transactionList =  /** @lends XV.TransactionList# */ {
      name: "XV.TransactionList",
      kind: "XV.SearchContainer",
      published: {
        prerequisite: "",
        notifyMessage: "",
        list: null
      },
      events: {
        onNotify: ""
      },
      handlers: {
        onListItemMenuTap: "showListItemMenu"
      },
      components: [
        {name: "parameterPanel", kind: "FittableRows", classes: "left",
          components: [
          {kind: "onyx.Toolbar", classes: "onyx-menu-toolbar", components: [
            {kind: "onyx.Button", name: "backButton", content: "_back".loc(), ontap: "close"},
            {kind: "onyx.MenuDecorator", components: [
              {kind: "XV.IconButton", src: "/assets/menu-icon-gear.png",
                content: "_actions".loc() },
              {kind: "onyx.Menu", name: "headerMenu", ontap: "headerActionSelected" }
            ]}
          ]},
          {name: "leftTitle", content: "_advancedSearch".loc(), classes: "xv-parameter-title"},
          {kind: "Scroller", name: "parameterScroller", fit: true},
        ]},
        {name: "listPanel", kind: "FittableRows", components: [
          // the onyx-menu-toolbar class keeps the popups from being hidden
          {kind: "onyx.MoreToolbar", name: "contentToolbar",
            classes: "onyx-menu-toolbar", movedClass: "xv-toolbar-moved", components: [
            {kind: "onyx.Grabber", classes: "left-float"},
            {name: "rightLabel", content: "_search".loc(), classes: "left-float"},
            {name: "search", kind: "onyx.InputDecorator", classes: "right-float",
              components: [
              {name: "searchInput", kind: "onyx.Input", style: "width: 200px;",
                placeholder: "_search".loc(), onchange: "requery"},
              {kind: "Image", src: "/assets/search-input-search.png"}
            ]},
            {name: "listItemMenu", kind: "onyx.Menu", floating: true,
              onSelect: "listActionSelected", maxHeight: 500}
          ]},
          {name: "contentPanels", kind: "Panels", margin: 0, fit: true, draggable: false, panelCount: 0}
        ]}
      ],
      create: function () {
        this.inherited(arguments);
        this.setList({list: this.getList()});
      },
      // must be implemented by the subkind
      executeDispatch: function () {},
      headerActionSelected: function () {
        var that = this,
          execute,
          notify;

        // step 2: ask the user if they really want to do the method
        notify = function () {
          var notifyEvent = {
            originator: this,
            message: that.getNotifyMessage(),
            type: XM.Model.QUESTION,
            // step 3: execute the dispatch function
            callback: _.bind(that.executeDispatch, that)
          };
          that.doNotify(notifyEvent);
        };

        // step 1: make sure we can do the method
        XM.Inventory[this.getPrerequisite()](function (isAllowed) {
          var notifyEvent;

          if (isAllowed) {
            notify();
          } else {
            notifyEvent = {
              originator: this,
              type: XM.Model.CRITICAL,
              message: "_canNotUpdate".loc()
            };
            that.doNotify(notifyEvent);
          }
        });
      }
    };

    enyo.mixin(transactionList, XV.ListMenuManagerMixin);
    enyo.kind(transactionList);

    enyo.kind({
      name: "XV.EnterReceipt",
      kind: "XV.TransactionList",
      prerequisite: "canEnterReceipt",
      notifyMessage: "_receiveAll?".loc(),
      list: "XV.EnterReceiptList",
      create: function () {
        this.inherited(arguments);
        this.$.headerMenu.createComponent({kind: "XV.MenuItem", content: "_receiveAll".loc() });
      },
      executeDispatch: function () {
        var that = this,
          listItems = _.map(that.$.list.getValue().models, function (model) {
            return {
              uuid: model.id,
              quantity: model.get("ordered") - (model.get("received") + model.get("returned"))
              // TODO: get this off a calculated field
            };
          }),
          // TODO: verify this actually worked
          callback = function () {};

        XM.Inventory.enterReceipt(listItems, callback);
      }
    });

    enyo.kind({
      name: "XV.IssueToShipping",
      kind: "XV.TransactionList",
      prerequisite: "canIssueStock",
      notifyMessage: "_issueAll?".loc(),
      list: "XV.IssueToShippingList",
      create: function () {
        this.inherited(arguments);
        this.$.headerMenu.createComponent({kind: "XV.MenuItem", content: "_issueAll".loc() });
      },
      executeDispatch: function () {
        var that = this,
          listItems = [],/* TODO_.map(that.$.list.getValue().models, function (model) {
            return {
              uuid: model.id,
              quantity: model.get("ordered") - (model.get("received") + model.get("returned"))
              // TODO: get this off a calculated field
            };
          })*/
          // TODO: verify this actually worked
          callback = function () {};

        XM.Inventory.issueStock(listItems, callback);
      }
    });
  };

}());

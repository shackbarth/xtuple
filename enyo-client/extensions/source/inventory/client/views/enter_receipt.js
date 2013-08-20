/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XV:true, XM:true, _:true, enyo:true, console:true */
// TODO: remove console:true

(function () {

  XT.extensions.inventory.initEnterReceipt = function () {

    /**
      @name XV.EnterReceipt
      @extends XV.SearchContainer
     */
    var enterReceipt =  /** @lends XV.EnterReceipt# */ {
      name: "XV.EnterReceipt",
      kind: "XV.SearchContainer",
      published: {keyAttribute: null},
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
            {
              kind: "onyx.MenuDecorator",
              components: [
                {kind: "XV.IconButton", src: "/assets/menu-icon-gear.png",
                  content: "_actions".loc() },
                {kind: "onyx.Menu", ontap: "headerActionSelected", components: [
                  {kind: "XV.MenuItem", content: "_receiveAll".loc(), name: "receiveAll" }
                ]}
              ]
            }
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
              {name: 'searchInput', kind: "onyx.Input", style: "width: 200px;",
                placeholder: "_search".loc(), onchange: "requery"},
              {kind: "Image", src: "/assets/search-input-search.png"}
            ]}
          ]},
          {name: "contentPanels", kind: "Panels", margin: 0, fit: true, draggable: false, panelCount: 0}
        ]}
      ],
      requery: function (inSender, inEvent) {
        this.inherited(arguments);
        var key = inEvent.originator.getParameter().value.id;
      },
      create: function () {
        this.inherited(arguments);
        this.setList({list: "XV.EnterReceiptList"});
        /*
        this.$.listPanel.createComponent({
          name: "listItemMenu",
          kind: "onyx.Menu",
          floating: true,
          onSelect: "listActionSelected",
          maxHeight: 500,
          components: [],
          owner: this
        });
        */
      },
      /**
      @todo Document the itemTap method.
      */
      itemTap: function (inSender, inEvent) {
        /*
        var list = inEvent.list,
          value = list ? list.getModel(inEvent.index) : null;
        if (value) {
          this.close();
          if (this.callback) { this.callback(value); }
        }
        */
      },
      /*
      // lists are allowed to define headerActions that will
      this.$.actionButton.setShowing(component.headerActions);
      if (component.headerActions) {
        _.each(component.headerActions, function (headerAction) {
          that.$.actionMenu.createComponent({
            name: headerAction.name,
            kind: "XV.MenuItem",
            content: headerAction.label || ("_" + headerAction.name).loc(),
            action: headerAction
          });
        });
      },*/
      listActionSelected: function (inSender, inEvent) {
        console.log("list action selected");
      },
      headerActionSelected: function (inSender, inEvent) {
        var that = this,
          execute, notify,
          model, prerequisite, method, notifyMessage;

        switch (inEvent.originator.name) {
        case 'receiveAll':
          model = new XM.PurchaseOrderLine();
          prerequisite = "canReceiveAll";
          method = "doReceiveAll";
          notifyMessage = "_receiveAll?";
          break;
        }

        // step 3: execute the method
        execute = function () {
          model[method]();
        };

        // step 2: ask the user if they really want to do the method
        notify = function () {
          var notifyEvent = {
            originator: this,
            message: notifyMessage,
            type: XM.Model.QUESTION,
            callback: execute
          };
          that.doNotify(notifyEvent);
        };

        // step 1: make sure we can do the method
        model[prerequisite](function (isAllowed) {
          if (isAllowed) {
            notify();
          } else {
            console.log("You don't have privs");
          }
        });
      }
    };

    enyo.mixin(enterReceipt, XV.ListMenuManagerMixin);
    enyo.kind(enterReceipt);

  };

}());

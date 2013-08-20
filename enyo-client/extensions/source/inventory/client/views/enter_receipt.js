/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XV:true, XM:true, _:true, enyo:true */

(function () {

  XT.extensions.inventory.initEnterReceipt = function () {

    /**
      @name XV.EnterReceipt
      @extends XV.SearchContainer
     */
    var enterReceipt =  /** @lends XV.EnterReceipt# */ {
      name: "XV.EnterReceipt",
      kind: "XV.SearchContainer",
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
            ]},
            {
              name: "listItemMenu",
              kind: "onyx.Menu",
              floating: true,
              onSelect: "listActionSelected",
              maxHeight: 500
            }
          ]},
          {name: "contentPanels", kind: "Panels", margin: 0, fit: true, draggable: false, panelCount: 0}
        ]}
      ],
      create: function () {
        this.inherited(arguments);
        this.setList({list: "XV.EnterReceiptList"});
      },
      headerActionSelected: function (inSender, inEvent) {
        var that = this,
          execute, notify,
          model, prerequisite, method, notifyMessage;

        switch (inEvent.originator.name) {
        case 'receiveAll':
          prerequisite = "canEnterReceipt";
          method = "enterReceipt";
          notifyMessage = "_receiveAll?";
          break;
        }

        // step 3: execute the method
        execute = function () {
          var listItems = _.map(that.$.list.getValue().models, function (model) {
            return {
              uuid: model.id,
              quantity: model.get("ordered") - (model.get("received") + model.get("returned"))
              // TODO: get this off a calculate field
            };
          });
          XM.Inventory[method](listItems);
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
        XM.Inventory[prerequisite](function (isAllowed) {
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

    enyo.mixin(enterReceipt, XV.ListMenuManagerMixin);
    enyo.kind(enterReceipt);

  };

}());

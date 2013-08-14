/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XV:true, XM:true, _:true, enyo:true*/

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
      handlers: {
        onListItemMenuTap: "showListItemMenu"
      },
      requery: function (inSender, inEvent) {
        this.inherited(arguments);
        var key = inEvent.originator.getParameter().value.id;
      },
      create: function () {
        this.inherited(arguments);
        this.setList({list: "XV.EnterReceiptList"});
        this.$.listPanel.createComponent({
          name: "listItemMenu",
          kind: "onyx.Menu",
          floating: true,
          onSelect: "listActionSelected",
          maxHeight: 500,
          components: [],
          owner: this
        });
        this.$.toolbar.createComponent({
          name: "headerAction",
          kind: "onyx.MenuDecorator",
          style: "margin: 0;", 
          onSelect: "headerActionSelected", 
          components: [
            {kind: "XV.IconButton", src: "/assets/menu-icon-gear.png", content: "_actions".loc(), name: "headerActionButton"},
            {kind: "onyx.Menu", name: "headerActionMenu", components: [
              {kind: "XV.MenuItem", 
                content: "receiveAll".loc(),
                name: "receiveAll",
                prerequisite: "canReceiveAll",
                method: "doReceiveAll",
                notifyMessage: "_receiveAll?",
                modelName: "XM.PurchaseOrderLine"
              } 
            ]} 
          ]
        });
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
        alert("List Action Selected!");
        console.log("header action selected");
      },
      headerActionSelected: function (inSender, inEvent) {
        alert("Header Action Selected!");
      }
    };

    enyo.mixin(enterReceipt, XV.ListMenuManagerMixin);
    enyo.kind(enterReceipt);

    };

}());

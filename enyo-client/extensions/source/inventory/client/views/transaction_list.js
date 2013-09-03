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
        list: null,
        actions: null,
        model: null
      },
      events: {
        onWorkspace: ""
      },
      handlers: {
        onListItemMenuTap: "showListItemMenu",
        onSelectionChanged: "buildMenu"
      },
      components: [
        {name: "parameterPanel", kind: "FittableRows", classes: "left",
          components: [
          {kind: "onyx.Toolbar", classes: "onyx-menu-toolbar", components: [
            {kind: "onyx.Button", name: "backButton", content: "_back".loc(), ontap: "close"},
            {kind: "onyx.MenuDecorator", style: "margin: 0;", onSelect: "actionSelected", components: [
              {kind: "XV.IconButton", src: "/assets/menu-icon-gear.png",
                content: "_actions".loc(), name: "actionButton"},
              {kind: "onyx.Menu", name: "actionMenu"}
            ]}
          ]},
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
          {name: "contentPanels", kind: "Panels", margin: 0, fit: true, draggable: false, panelCount: 0},
          {kind: "onyx.Popup", name: "spinnerPopup", centered: true,
              modal: true, floating: true, scrim: true,
              onHide: "popupHidden", components: [
            {kind: "onyx.Spinner"},
            {name: "spinnerMessage", content: "_processing".loc() + "..."}
          ]}
        ]}
      ],
      actionSelected: function (inSender, inEvent) {
        var action = inEvent.originator.action,
          method = action.method || action.name;

        this[method](inSender, inEvent);
      },
      buildMenu: function () {
        var actionMenu = this.$.actionMenu,
          actions = this.getActions().slice(0),
          that = this;

        // reset the menu
        actionMenu.destroyClientControls();

        // then add whatever actions are applicable
        _.each(actions, function (action) {
          var name = action.name,
            prerequisite = action.prerequisite,
            isDisabled = prerequisite ? !that[prerequisite]() : false;
          actionMenu.createComponent({
            name: name,
            kind: XV.MenuItem,
            content: action.label || ("_" + name).loc(),
            action: action,
            disabled: isDisabled
          });

        });
        actionMenu.render();
        this.$.actionButton.setShowing(actions.length);
      },
      create: function () {
        this.inherited(arguments);
        this.setList({list: this.getList()});
        if (!this.getActions()) {
          this.setActions([]);
        }
        this.buildMenu();
      },
      popupHidden: function (inSender, inEvent) {
        if (!this._popupDone) {
          inEvent.originator.show();
        }
      },
      spinnerHide: function () {
        this._popupDone = true;
        this.$.spinnerPopup.hide();
      },
      spinnerShow: function () {
        this._popupDone = false;
        this.$.spinnerPopup.show();
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

    /** @private */
    var _canDo = function () {
      var hasPrivilege = XT.session.privileges.get("IssueStockToShipping"),
        hasModel = !_.isEmpty(this.getModel());
      return hasPrivilege && hasModel;
    };

    enyo.kind({
      name: "XV.IssueToShipping",
      kind: "XV.TransactionList",
      prerequisite: "canIssueStock",
      notifyMessage: "_issueAll?".loc(),
      list: "XV.IssueToShippingList",
      actions: [
        {name: "issueAll", label: "_issueAll".loc(),
          prerequisite: "canIssueStock" },
        {name: "issueSelectedStock", label: "_issueSelectedStock".loc(),
          prerequisite: "canIssueSelected" },
        {name: "issueSelectedLines", label: "_issueSelectedLines".loc(),
          prerequisite: "canIssueSelected" },
        {name: "returnSelectedLines", label: "_returnSelectedLines".loc(),
          prerequisite: "canReturnSelected" },
      ],
      canReturnSelected: function () {
        var canDo = _canDo.call(this),
          models = this.selectedModels(),
          check;
        if (canDo) {
          check = _.find(models, function (model) {
            return model.get("atShipping") > 0;
          });
        }

        return !_.isEmpty(check);
      },
      canIssueSelected: function () {
        var canDo = _canDo.call(this),
          models = this.selectedModels(),
          check;
        if (canDo) {
          check = _.find(models, function (model) {
            return model.get("toIssue") > 0;
          });
        }

        return !_.isEmpty(check);
      },
      canIssueStock: function () {
        var canDo = _canDo.call(this),
          hasOpenLines = this.$.list.value.length;
        return canDo && hasOpenLines;
      },
      issueAll: function () {
        var that = this,
          collection = this.$.list.value,
          i = -1,
          callback,
          data = [];

        // Recursively issue everything we can
        callback = function (workspace) {
          var model,
            options = {},
            toIssue,
            params,
            dispOptions = {},
            wsOptions = {},
            wsParams;

          // If argument is false, this whole process was cancelled
          if (workspace === false) {
            return;

          // If a workspace brought us here, process the information it obtained
          } else if (workspace) {
            model = workspace.getValue();
            toIssue = model.get("toIssue");
            if (toIssue) {
              wsOptions.detail = model.formatDetail();
              wsParams = {
                orderLine: model.id,
                quantity: toIssue,
                options: wsOptions
              };
              data.push(wsParams);
            }
            workspace.doPrevious();
          }

          i++;
          // If we've worked through all the models then forward to the server
          if (i === collection.length) {
            that.spinnerShow();
            dispOptions.success = function () {
              that.requery();
              that.spinnerHide();
            };
            XM.Inventory.issueToShipping(data, dispOptions);

          // Else if there's something here we can issue, handle it
          } else {
            model = collection.at(i);
            toIssue = model.get("toIssue");

            // See if there's anything to issue here
            if (toIssue) {

              // If distribution detail required, open a workspace to handle it
              if (model.undistributed()) {
                that.doWorkspace({
                  workspace: "XV.IssueStockWorkspace",
                  id: model.id,
                  callback: callback,
                  allowNew: false
                });

              // Otherwise just use the data we have
              } else {
                options.detail = model.formatDetail();
                params = {
                  orderLine: model.id,
                  quantity: toIssue,
                  options: options
                };
                data.push(params);
                callback();
              }

            // Nothing to issue, move on
            } else {
              callback();
            }
          }
        };
        callback();
      },
      parameterChanged: function (inSender, inEvent) {
        if (inEvent && inEvent.originator.name === "order") {
          this.setModel(inEvent.originator.getParameter().value);
          this.buildMenu();
        }
      },
      /**
        Overload: Piggy back on existing handler for `onParameterChanged event`
        by forwarding this requery to `parameterChanged`.
      */
      requery: function (inSender, inEvent) {
        var that = this,
          options = {
            success: function () {
              that.buildMenu();
            }
          };
        this.fetch(options);
        this.parameterChanged(inSender, inEvent);
        return true;
      },
      selectedModels: function () {
        var list = this.$.list,
          collection = list.getValue(),
          models = [],
          selected,
          prop;
        if (collection.length) {
          selected = list.getSelection().selected;
          for (prop in selected) {
            if (selected.hasOwnProperty(prop)) {
              models.push(list.getModel(prop - 0));
            }
          }
        }
        return models;
      }
    });
  };

}());

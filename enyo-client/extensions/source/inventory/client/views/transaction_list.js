/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XT:true, XM:true, XV:true, _:true, enyo:true */

(function () {

  XT.extensions.inventory.initTransactionList = function () {

    /**
      Expected to a have a parameter widget that contains an order and
      a transaction date.

      @name XV.TransactionList
      @extends XV.SearchContainer
     */
    var transactionList =  /** @lends XV.TransactionList# */ {
      name: "XV.TransactionList",
      kind: "Panels",
      classes: "app enyo-unselectable",
      arrangerKind: "CollapsingArranger",
      published: {
        prerequisite: "",
        notifyMessage: "",
        list: null,
        actions: null,
        transactionDate: null,
        model: null
      },
      events: {
        onPrevious: "",
        onWorkspace: ""
      },
      handlers: {
        onListItemMenuTap: "showListItemMenu",
        onParameterChange: "requery",
        onSelectionChanged: "selectionChanged"
      },
      init: false,
      components: [
        {name: "parameterPanel", kind: "FittableRows", classes: "left",
          components: [
          {kind: "onyx.Toolbar", classes: "onyx-menu-toolbar", components: [
            {kind: "onyx.Button", name: "backButton", content: "_back".loc(), ontap: "close"},
            {kind: "onyx.MenuDecorator", style: "margin: 0;",
              onSelect: "actionSelected", components: [
              {kind: "XV.IconButton", src: "/assets/menu-icon-gear.png",
                content: "_actions".loc(), name: "actionButton"},
              {kind: "onyx.Menu", name: "actionMenu"}
            ]}
          ]},
          {kind: "Scroller", name: "parameterScroller"}
        ]},
        {name: "listPanel", kind: "FittableRows", components: [
          // the onyx-menu-toolbar class keeps the popups from being hidden
          {kind: "onyx.MoreToolbar", name: "contentToolbar",
            classes: "onyx-menu-toolbar", movedClass: "xv-toolbar-moved", components: [
            {kind: "onyx.Grabber", classes: "left-float"},
            {name: "rightLabel", content: "_search".loc(), classes: "left-float"},
            {name: "space", fit: true},
            {kind: "onyx.Button", name: "printButton", showing: false,
              content: "_print".loc(), onclick: "print"},
            {kind: "onyx.Button", name: "refreshButton", disabled: false,
              content: "_refresh".loc(), onclick: "requery"},
            {kind: "onyx.Button", name: "postButton",
              disabled: true, classes: "save", showing: false,
              content: "_post".loc(), onclick: "post"},
            {name: "listItemMenu", kind: "onyx.Menu", floating: true,
              onSelect: "listActionSelected", maxHeight: 500}
          ]},
          {name: "contentPanels", kind: "Panels", margin: 0, fit: true, draggable: false,
            panelCount: 0},
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
      close: function (options) {
        this.doPrevious();
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
      fetch: function (options) {
        if (!this.init) { return; }
        options = options ? _.clone(options) : {};
        var list = this.$.list,
          query,
          parameterWidget,
          parameters;
        if (!list) { return; }
        query = list.getQuery() || {};
        parameterWidget = this.$.parameterWidget;
        parameters = parameterWidget && parameterWidget.getParameters ?
          parameterWidget.getParameters() : [];
        options.showMore = _.isBoolean(options.showMore) ?
          options.showMore : false;

        // Build conditions
        if (parameters.length) {
          query.parameters = parameters;
        } else {
          delete query.parameters;
        }
        list.setQuery(query);
        list.fetch(options);
      },
      /**
        Capture order changed and transaction date changed events.
        Depends on a very specific implementation of parameter widget
        that includes `order` and `transactionDate` parameters.
      */
      parameterChanged: function (inSender, inEvent) {
        var originator = inEvent ? inEvent.originator : false,
          name = originator ? originator.name : false,
          that = this,
          options,
          value;

        if (name === "transactionDate") {
          value = originator.$.input.getValue();
          value = XT.date.applyTimezoneOffset(value, true);
          this.setTransactionDate(value);
          this.buildMenu();
          return;
        } else if (name === "order") {
          value = originator.getParameter().value;
          this.setModel(value);
          this.buildMenu();
        } else if (name === "shipment") {
          return;
        }

        options = {
          success: function () {
            that.selectionChanged();
          }
        };
        this.fetch(options);
      },
      popupHidden: function (inSender, inEvent) {
        if (!this._popupDone) {
          inEvent.originator.show();
        }
      },
      /**
        Overload: Piggy back on existing handler for `onParameterChanged event`
        by forwarding this requery to `parameterChanged`.
      */
      requery: function (inSender, inEvent) {
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
      },
      /**
        Whenever a user makes a selection, rebuild the menu
        and set the transaction date on the selected models
        to match what has been selected here.
      */
      selectionChanged: function () {
        this.transactionDateChanged();
        this.buildMenu();
      },
      /**
        @param {Object} Options
        @param {String} [options.list] Class name
      */
      setList: function (options) {
        var component,
        list = options.list;

        component = this.createComponent({
          name: "list",
          container: this.$.contentPanels,
          kind: list,
          fit: true
        });
        this.$.rightLabel.setContent(component.label);
        if (component) {
          this.createComponent({
            name: "parameterWidget",
            classes: "xv-groupbox xv-parameter",
            showSaveFilter: false,
            defaultParameters: null,
            container: this.$.parameterScroller,
            kind: component.getParameterWidget(),
            memoizeEnabled: false,
            fit: true
          });
        }

        this.init = true;
        this.render();
      },
      spinnerHide: function () {
        this._popupDone = true;
        this.$.spinnerPopup.hide();
      },
      spinnerShow: function () {
        this._popupDone = false;
        this.$.spinnerPopup.show();
      },
      transactionDateChanged: function () {
        var transDate = this.getTransactionDate(),
          collection = this.$.list.getValue(),
          i;

        // Update the transaction dates on all models to match 
        // What has been selected
        for (i = 0; i < collection.length; i++) {
          collection.at(i).transactionDate = transDate;
        }
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
        model = this.getModel(),
        validModel = _.isObject(model) ? !model.get("isShipped") : false;
      return hasPrivilege && validModel;
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
        {name: "issueSelected", label: "_issueSelected".loc(),
          prerequisite: "canIssueSelected" },
        {name: "returnSelected", label: "_returnSelected".loc(),
          prerequisite: "canReturnSelected" },
      ],
      handlers: {
        onShipmentChanged: "shipmentChanged"
      },
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
      create: function () {
        this.inherited(arguments);
        this.$.postButton.setContent("_ship".loc());
        this.$.postButton.setShowing(true);
      },
      /**
        Helper function for transacting `issue` on an array of models

        @param {Array} Models
        @param {Boolean} Prompt user for confirmation on every model
      */
      issue: function (models, prompt) {
        var that = this,
          i = -1,
          callback,
          data = [];

        // Recursively issue everything we can
        callback = function (workspace) {
          var model,
            options = {},
            toIssue,
            transDate,
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
            transDate = that.getTransactionDate();

            if (toIssue) {
              wsOptions.detail = model.formatDetail();
              wsOptions.asOf = transDate;
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
          if (i === models.length) {
            that.spinnerShow();
            dispOptions.success = function () {
              that.requery();
              that.spinnerHide();
            };
            XM.Inventory.issueToShipping(data, dispOptions);

          // Else if there's something here we can issue, handle it
          } else {
            model = models[i];
            toIssue = model.get("toIssue");
            transDate = that.getTransactionDate();

            // See if there's anything to issue here
            if (toIssue) {

              // If prompt or distribution detail required,
              // open a workspace to handle it
              if (prompt || model.undistributed()) {
                that.doWorkspace({
                  workspace: "XV.IssueStockWorkspace",
                  id: model.id,
                  callback: callback,
                  allowNew: false,
                  success: function (model) {
                    model.transactionDate = transDate;
                  }
                });

              // Otherwise just use the data we have
              } else {
                options.asOf = transDate;
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
      issueAll: function () {
        var models = this.$.list.getValue().models;
        this.issue(models);
      },
      issueSelected: function () {
        var models = this.selectedModels();
        this.issue(models);
      },
      issueSelectedStock: function () {
        var models = this.selectedModels();
        this.issue(models, true);
      },
      returnSelected: function () {
        var models = this.selectedModels(),
          that = this,
          data =  [],
          options = {},
          atShipping,
          model,
          i;

        for (i = 0; i < models.length; i++) {
          model = models[i];
          atShipping = model.get("atShipping");

          // See if there's anything to issue here
          if (atShipping) {
            data.push(model.id);
          }
        }
                
        if (data.length) {
          this.spinnerShow();
          options.success = function () {
            that.requery();
            that.spinnerHide();
          };
          XM.Inventory.returnFromShipping(data, options);
        }
      },
      shipmentChanged: function (inSender, inEvent) {
        this.$.parameterWidget.$.shipment.setValue(inEvent.shipment);
      }
    });
  };

}());

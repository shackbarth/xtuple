/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XT:true, XM:true, XV:true, _:true, enyo:true */

(function () {

  XT.extensions.manufacturing.initTransactionList = function () {

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
        var canDo = _canDo.call(this, "ReturnStockFromShipping"),
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
        var canDo = _canDo.call(this, "IssueStockToShipping"),
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
        var canDo = _canDo.call(this, "IssueStockToShipping"),
          hasOpenLines = this.$.list.value.length;
        return canDo && hasOpenLines;
      },
      create: function () {
        this.inherited(arguments);
        var button = this.$.postButton;
        button.setContent("_ship".loc());
        button.setShowing(true);
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
      post: function () {
        var that = this,
          shipment = this.$.parameterWidget.$.shipment.getValue(),
          callback = function (resp) {
            if (resp) { that.$.parameterWidget.$.order.setValue(null); }
          };
        this.doWorkspace({
          workspace: "XV.ShipShipmentWorkspace",
          id: shipment.id,
          callback: callback
        });
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
        this.$.postButton.setDisabled(_.isEmpty(inEvent.shipment));
      }
    });
  };

}());

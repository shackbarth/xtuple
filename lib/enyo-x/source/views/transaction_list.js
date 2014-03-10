/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XT:true, XM:true, XV:true, _:true, enyo:true */

(function () {

  /**
    Expected to a have a parameter widget that contains an order and
    a transaction date.

    @name XV.TransactionList
    @extends XV.List
   */
  enyo.kind(
    /** @lends XV.TransactionList */{
    name: "XV.TransactionList",
    kind: "XV.List",
    published: {
      transModule: null,
      transWorkspace: null,
      transFunction: null
    },
    events: {
      onProcessingChanged: "",
      onOrderChanged: "",
      onShipmentChanged: ""
    },
    handlers: {
      onBarcodeCapture: "captureBarcode"
    },
    multiSelect: true,
    showDeleteAction: false,
    toggleSelected: true,
    actions: [
      {name: "transactItem", prerequisite: "canTransactItem",
        method: "transactItem", notify: false, isViewMethod: true},
      {name: "transactLine", prerequisite: "canTransactItem",
        method: "transactLine", notify: false, isViewMethod: true},
      {name: "returnLine", prerequisite: "canReturnItem",
        method: "returnItem", notify: false, isViewMethod: true}
    ],
    captureBarcode: function (inSender, inEvent) {
      var models = _.filter(this.value.models, function (model) {
        // match on upc code or item number
        return model.getValue("itemSite.item.barcode") === inEvent.data ||
          model.getValue("itemSite.item.number") === inEvent.data;
      });
      if (models.length > 0) {
        this.transact(models, true, true);
      }
    },
    /**
        Helper function for transacting `transact` on an array of models

        @param {Array} Models
        @param {Boolean} Prompt user for confirmation on every model
    */
    transact: function (models, prompt, transactStock) {
      var that = this,
        i = -1,
        callback,
        data = [];

      // Recursively transact everything we can
      // #refactor see a simpler implementation of this sort of thing
      // using async in inventory's ReturnListItem stomp
      callback = function (workspace) {
        var model,
          options = {},
          toTransact,
          transDate,
          params,
          dispOptions = {},
          wsOptions = {},
          wsParams,
          transModule = that.getTransModule(),
          transFunction = that.getTransFunction(),
          transWorkspace = that.getTransWorkspace();

        that._printModels = [];

        // If argument is false, this whole process was cancelled
        if (workspace === false) {
          return;

        // If a workspace brought us here, process the information it obtained
        } else if (workspace) {
          model = workspace.getValue();
          toTransact = model.get(model.quantityAttribute);
          transDate = model.transactionDate;


          if (workspace._printAfterPersist) {
            that._printModels.push(model);
          }

          if (toTransact) {
            if (transFunction === "receipt") {
              wsOptions.freight = model.get("freight");
            }
            wsOptions.detail = model.formatDetail();
            wsOptions.asOf = transDate;
            wsParams = {
              orderLine: model.id,
              quantity: toTransact,
              options: wsOptions
            };
            data.push(wsParams);
          }
          workspace.doPrevious();
        }

        i++;
        // If we've worked through all the models then forward to the server
        if (i === models.length) {
          if (data[0]) {
            that.doProcessingChanged({isProcessing: true});
            dispOptions.success = function () {
              _.each(that._printModels, function (printModel) {
                // XXX eventually replace _auxilliaryInfo with meta, probably
                printModel.doPrint(printModel._auxilliaryInfo);
              });
              that.doProcessingChanged({isProcessing: false});
            };
            dispOptions.error = function () {
              that.doProcessingChanged({isProcessing: false});
            };
            transModule.transactItem(data, dispOptions, transFunction);
          } else {
            return;
          }

        // Else if there's something here we can transact, handle it
        } else {
          model = models[i];
          toTransact = model.get(model.quantityAttribute);
          if (toTransact === null) {
            toTransact = model.get("balance");
          }
          transDate = model.transactionDate;

          // See if there's anything to transact here
          if (toTransact || transactStock) {

            // If prompt or distribution detail required,
            // open a workspace to handle it
            if (prompt || model.undistributed()) {
              that.doWorkspace({
                workspace: transWorkspace,
                id: model.id,
                callback: callback,
                allowNew: false,
                success: function (model) {
                  model.transactionDate = transDate;
                }
              });

            // Otherwise just use the data we have
            } else {
              if (transFunction === "receipt") {
                options.freight = model.get("freight");
              }
              options.asOf = transDate;
              options.detail = model.formatDetail();
              params = {
                orderLine: model.id,
                quantity: toTransact,
                options: options
              };
              data.push(params);
              callback();
            }

          // Nothing to transact, move on
          } else {
            callback();
          }
        }
      };
      callback();
    },
    transactAll: function () {
      var models = this.getValue().models;
      this.transact(models);
    },
    transactLine: function () {
      var models = this.selectedModels();
      this.transact(models);
    },
    transactItem: function () {
      var models = this.selectedModels();
      this.transact(models, true, true);
    },
    returnItem: function () {
      var models = this.selectedModels(),
        that = this,
        data =  [],
        options = {},
        qtyTransacted,
        model,
        i,
        transModule = that.getTransModule();

      for (i = 0; i < models.length; i++) {
        model = models[i];
        qtyTransacted = model.get(model.quantityTransactedAttribute);

        // See if there's anything to transact here
        if (qtyTransacted) {
          data.push(model.id);
        }
      }

      if (data.length) {
        that.doProcessingChanged({isProcessing: true});
        options.success = function () {
          that.doProcessingChanged({isProcessing: false});
        };
        transModule.returnItem(data, options);
      }
    },
    selectedModels: function () {
      var collection = this.getValue(),
        models = [],
        selected,
        prop;
      if (collection.length) {
        selected = this.getSelection().selected;
        for (prop in selected) {
          if (selected.hasOwnProperty(prop)) {
            models.push(this.getModel(prop - 0));
          }
        }
      }
      return models;
    }
  });

}());


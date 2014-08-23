/*jshint bitwise:false, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict: false*/
/*global XV:true, XM:true, _:true, onyx:true, enyo:true, document:true, XT:true, Globalize:true */

(function () {

  /**
    XV is the global namespace for all the "xTuple Views" defined in
    enyo-x and elsewhere

    @namespace XV
   */
  XV = {};
  XV._modelCaches = {};
  XV._modelLists = {};
  XV._modelWorkspaces = {};

  // Class methods
  enyo.mixin(XV, /** @lends XV */{

    KEY_UP: 38,
    KEY_DOWN: 40,
    KEY_TAB: 9,
    KEY_ENTER: 13,

    /**
      Key/value mapping of widget class names that correspond with object definitions
      to implement a corresponding editor widget.
    */
    widgetTypeMap: {
      Cost: "XV.Cost",
      Date: "XV.DateWidget",
      DueDate: "XV.DateWidget",
      ExtendedPrice: {
        kind: "XV.MoneyWidget",
        scale: XT.EXTENDED_PRICE_SCALE
      },
      Money: {
        kind: "XV.MoneyWidget",
        scale: XT.MONEY_SCALE
      },
      Number: "XV.NumberWidget",
      PurchasePrice: {
        kind: "XV.MoneyWidget",
        scale: XT.PURCHASE_PRICE_SCALE
      },
      Quantity: "XV.QuantityWidget",
      QuantityPer: "XV.QuantityPerWidget",
      SalesPrice: {
        kind: "XV.MoneyWidget",
        scale: XT.SALES_PRICE_SCALE
      },
      String: "XV.InputWidget",
      Unit: "XV.UnitPicker",
      UnitRatio: "XV.UnitRatioWidget",
      UserAccountRelation: "XV.UserAccountWidget",
      Weight: "XV.WeightWidget"
    },

    /**
      Accepts a model and an attribute and returns a standard widget definition
      mapped to the attribute.

      *Warning* This implementation is incomplete. Widgets that reference object
      based attributes are not handled well and need to be refactored.

      @param {String} Model class name
      @param {String} Attribute name
    */
    getEditor: function (model, attr) {
      var Klass = XT.getObjectByName(model),
        type = Klass.getType(attr),
        widget = this.widgetTypeMap[type];

      // Handle normal widgets
      if (_.isString(widget)) {
        widget = {
          kind: widget,
          attr: attr
        };

      // Handle widgets with complex attributes
      } else if (widget.kind === "XV.MoneyWidget") {
        widget.localValue = attr;
      }

      return widget;
    },

    /**
      Add component or array of component view(s) to a view class that
      has implemented the `ExtensionsMixin`.

      Examples of classes that support extensions are:
        * `Workspace`
        * `List`
        * `ParameterWidget`

      @param {String} Class name
      @param {Object|Array} Component(s)
    */
    appendExtension: function (workspace, extension) {
      var Klass = XT.getObjectByName(workspace),
        extensions = Klass.prototype.extensions || [];
      if (!_.isArray(extension)) {
        extension = [extension];
      }
      Klass.prototype.extensions = extensions.concat(extension);
    },

    /**
      Helper function for enyo unit testing

      @param expected
      @param actual
      @param {String} message
         Only displayed in the case of a failed test
      @return {String} Per enyo's conventions, the empty string means the test is passed.
     */
    applyTest: function (expected, actual, message) {
      if (expected === actual) {
        return "";
      } else {
        if (message) {
          message = ". " + message;
        } else {
          message = ".";
        }
        return "Expected " + expected + ", saw " + actual + message;
      }
    },

    /**
      The javascript download method avoids target = "_blank" and the need to
      reload the app to see the new client. Pop up blockers should not be an issue.
      @See: http://stackoverflow.com/questions/3749231/download-file-using-javascript-jquery/3749395#3749395

      @param {String} The URL for the download route.
    */
    downloadURL: function (url) {
      var hiddenIFrameID = 'hiddenDownloader',
        iframe = document.getElementById(hiddenIFrameID);

      if (iframe === null) {
        iframe = document.createElement('iframe');
        iframe.id = hiddenIFrameID;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
      }

      iframe.src = url;
    },

    getCache: function (recordType) {
      return XV._modelCaches[recordType];
    },

    getList: function (recordType) {
      return XV._modelLists[recordType];
    },

    getWorkspace: function (recordType) {
      return XV._modelWorkspaces[recordType];
    },

    /*
      Is the ancestor a superkind (or supersuperkind, etc.) of the object?

      @param {Object} intantiated enyo kind
        You can use Kind.prototype if that's what you have to work with.
      @param {String} ancestor kind name
    */
    inheritsFrom: function (object, ancestor) {
      if (!object || !object.ctor) {
        return false;
      }
      while (object.kindName !== 'enyo.Object') {
        if (object.ctor.prototype.base.prototype.kindName === ancestor) {
          return true;
        }
        object = object.ctor.prototype.base.prototype;
      }
    },

    registerModelCache: function (recordType, cache) {
      XV._modelCaches[recordType] = cache;
    },

    registerModelList: function (recordType, list) {
      XV._modelLists[recordType] = list;
    },

    registerModelWorkspace: function (recordType, workspace) {
      XV._modelWorkspaces[recordType] = workspace;
    }

  });

  /**
    @class

    A mixin that allows the components of a class to be extended.
  */
  XV.ExtensionsMixin = {
    extensions: null,

    /**
      This function should be run in the create function of a class
      using this mixin. It will add any extensions to the class at run time.
      @parameter {Boolean} forceDeferred allows us to set a defer attribute
        on the extension so that it will not get processed during the usual
        processExtensions calls in the create. If you need to put an extension
        in a subkind of workspace requires the subkind's create() function
        to have already run, put a processExtensions(true) at the end
        of that subkind create() function.
    */
    processExtensions: function (forceDeferred) {
      var extensions = this.extensions || [],
        ext,
        containerString,
        container,
        i;

      if (this._extLength === undefined) {
        this._extLength = 0;
      }
      if (this._extLength === extensions.length) { return; }
      for (i = 0; i < extensions.length; i++) {
        ext = _.clone(this.extensions[i]);

        if (ext.defer !== forceDeferred) {
          // the workspace is not ready to add this extension yet,
          // or, it's probably been added already
          continue;
        }
        // Resolve name of container to the instance
        if (_.isString(ext.container)) {
          containerString = ext.container;
          container = this;
          while (containerString.indexOf(".") >= 0) {
            container = container.$[containerString.substring(0, containerString.indexOf("."))];
            containerString = containerString.substring(containerString.indexOf(".") + 1);
          }
          if (container) {
            // avoid a crash if the asked-for container doesn't exist
            ext.container = container.$[containerString];
          } else {
            XT.log("Requested container", ext.container, "not found");
            return;
          }
        }
        // Resolve `addBefore`
        if (_.isString(ext.addBefore)) {
          ext.addBefore = this.$[ext.addBefore];
        }
        this.createComponent(ext);
        this._extLength++;
      }
    }
  };

  /**
    @class

    A mixin with functions used for formatting display data.
  */
  XV.FormattingMixin = /** @lends XV.FormattingMixin# */{

    /**
      An array of data types that require special formatting in displays
    */
    formatted: ["Date", "DueDate", "Cost", "ExtendedPrice", "Hours",
      "Money", "Percent", "PurchasePrice", "Quantity", "SalesPrice",
      "UnitRatio", "Weight", "Boolean", "EffectiveDate", "ExpireDate",
      "AddressInfo"
    ],

    formatAddressInfo: function (value, view, model) {
      return XM.Address.formatShort(value);
    },

    /**
      Localize a boolean to yes/no text.

      @param {Number} Value
      @returns {String}
    */
    formatBoolean: function (value) {
      return value ? "_yes".loc() : "_no".loc();
    },

    /**
      Localize a number to cost string in the base currency.

      @param {Number} Value
      @returns {String}
    */
    formatCost: function (value) {
      return Globalize.format(value, "c" + XT.locale.costScale);
    },

    /**
      Localize a date.

      @param {Date} Date
      @returns {String}
    */
    formatDate: function (value) {
      var date = _.isDate(value) ? XT.date.applyTimezoneOffset(value, true) : false;
      return date ? Globalize.format(date, "d") : "";
    },

    /**
      Localize a date and add the class for `error` to the view if the date is before today.

      @param {Date} Date
      @param {Object} View
      @param {Object} Model
      @returns {String}
    */
    formatDueDate: function (value, view, model) {
      var today = XT.date.today(),
        date = _.isDate(value) ? XT.date.applyTimezoneOffset(value, true) : false,
        isLate = date ? (model.getValue('isActive') && XT.date.compareDate(value, today) < 1) : false;
      view.addRemoveClass("error", isLate);
      return date ? Globalize.format(date, "d") : "";
    },

    /*
      Dates greater than today are highlight as errors. Start of time dates return "Always,"

      @param {Date} Date
      @param {Object} View
      @returns {String}
    */
    formatEffectiveDate: function (value, view) {
      var date = XT.date.applyTimezoneOffset(value, true),
        isFuture = (XT.date.compareDate(date, XT.date.today()) === 1);
      view.addRemoveClass("error", isFuture);
      if (value.valueOf() === XT.date.startOfTime().valueOf()) {
        return "_always".loc();
      }
      return Globalize.format(date, "d");
    },

    /*
      Dates greater than today are highlight as errors. End of time dates return "Never,"

      @param {Date} Date
      @param {Object} View
      @returns {String}
    */
    formatExpireDate: function (value, view) {
      var date = XT.date.applyTimezoneOffset(value, true),
        isExpired = (XT.date.compareDate(date, XT.date.today()) < 1);
      view.addRemoveClass("error", isExpired);
      if (value.valueOf() === XT.date.endOfTime().valueOf()) {
        return "_never".loc();
      }
      return Globalize.format(date, "d");
    },

    /**
      Localize a number to an extended price string in the base currency.

      @param {Number} Value
      @returns {String}
    */
    formatExtendedPrice: function (value) {
      return Globalize.format(value, "c" + XT.locale.extendedPriceScale);
    },

    /**
      Localize a number to an hours string in the base currency.

      @param {Number} Value
      @returns {String}
    */
    formatHours: function (value, view) {
      view.addRemoveClass("error", value < 0);
      return Globalize.format(value, "n" + XT.locale.hoursScale);
    },

    /**
      Localize a number to a currency string using the base currency.

      @param {Number} Value
      @returns {String}
    */
    formatMoney: function (value, view) {
      view.addRemoveClass("error", value < 0);
      return Globalize.format(value, "c" + XT.locale.currencyScale);
    },

    /**
      Localize a number to a percent string.

      @param {Number} Value
      @returns {String}
    */
    formatPercent: function (value) {
      return Globalize.format(value, "p" + XT.locale.percentScale);
    },

    /**
    Localize a number to a purchase price string in the base currency.

      @param {Number} Value
      @returns {String}
    */
    formatPurchasePrice: function (value) {
      return Globalize.format(value, "c" + XT.locale.purchasePriceScale);
    },

    /**
      Localize a number to a quantity string.

      @param {Number} Value
      @returns {String}
    */
    formatQuantity: function (value, view) {
      view.addRemoveClass("error", value < 0);
      return Globalize.format(value, "n" + XT.locale.quantityScale);
    },

    /**
      Localize a number to a quantity string.

      @param {Number} Value
      @returns {String}
    */
    formatQuantityPer: function (value) {
      return Globalize.format(value, "n" + XT.locale.quantityPerScale);
    },

    /**
      Localize a number to an sales price string in the base currency.

      @param {Number} Value
      @returns {String}
    */
    formatSalesPrice: function (value) {
      return Globalize.format(value, "c" + XT.locale.salesPriceScale);
    },

    /**
      Localize a number to a unit ratio string.

      @param {Number} Value
      @returns {String}
    */
    formatUnitRatio: function (value) {
      return Globalize.format(value, "n" + XT.locale.unitRatioScale);
    },

    /**
      Localize a number to a weight string.

      @param {Number} Value
      @returns {String}
    */
    formatWeight: function (value) {
      return Globalize.format(value, "n" + XT.locale.weightScale);
    }

  };

}());

/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true */

(function () {
  "use strict";

  XT.extensions.manufacturing.initManufacturingModels = function () {

    /**
      @class

      @extends XM.Model
    */
    XM.CreateTrace = XM.Model.extend({

      recordType: "XM.CreateTrace",

      parentKey: "itemSite",

      readOnlyAttributes: [
        "location",
        "trace",
        "expireDate",
        "warrantyDate",
        "characteristic"
      ],

      requiredAttributes: [
        "quantity"
      ],

      //Try using bind events function? as in l388 on sales_order_base
      displayAttributes: function () {
        var parentModel = this.getParent(),
          location = parentModel.getValue("itemSite.locationControl"),
          warranty = parentModel.getValue("itemSite.warranty"),
          perishable = parentModel.getValue("itemSite.perishable"),
          controlMethod = parentModel.getValue("itemSite.controlMethod"),
          K = XM.ItemSite,
          trace = controlMethod === K.LOT_CONTROL || controlMethod === K.SERIAL_CONTROL;

        if (trace) {
          this.requiredAttributes.push("trace");
          this.setReadOnly("trace", false);
        }
        if (location) {
          this.requiredAttributes.push("location");
          this.setReadOnly("location", false);
        }
        if (perishable) {
          this.requiredAttributes.push("expireDate");
          this.setReadOnly("expireDate", false);
        }
        if (warranty) {
          this.requiredAttributes.push("warrantyDate");
          this.setReadOnly("warrantyDate", false);
        }
        
      }

    });

    /**
      @class

      @extends XM.Model
    */
    XM.PostProduction = XM.Transaction.extend({

      recordType: "XM.PostProduction",

      readOnlyAttributes: [
        "number",
        "dueDate",
        "itemSite",
        "status",
        "getWorkOrderStatusString",
        "ordered",
        "quantityReceived",
        "qtyRequired",
        "balance",
        "undistributed"
      ],

      quantityAttribute: "qtyToPost",

      transactionDate: null,

      bindEvents: function () {
        XM.Model.prototype.bindEvents.apply(this, arguments);
        this.on('statusChange', this.statusDidChange);
      },

      /**
      Returns Work Order status as a localized string.

      @returns {String}
      */
      getWorkOrderStatusString: function () {
        var K = XM.WorkOrder,
          status = this.get('status');
        if (status === K.RELEASED) {
          return '_released'.loc();
        }
        if (status === K.EXPLODED) {
          return '_exploded'.loc();
        }
        if (status === K.INPROCESS) {
          return '_in-process'.loc();
        }
        if (status === K.OPEN) {
          return '_open'.loc();
        }
        if (status === K.CLOSED) {
          return '_closed'.loc();
        }
      },

      validate: function (callback) {
        return true;
      },

      save: function () {
      },

      /**
        Return the quantity of items that require detail distribution.
      
        @returns {Number}
      */
      undistributed: function () {
        var toIssue = this.get(this.quantityAttribute),
          scale = XT.QTY_SCALE,
          undist = 0,
          dist;
        // We only care about distribution on controlled items
        if (this.requiresDetail() && toIssue) {
          // Get the distributed values
          dist = _.pluck(_.pluck(this.getValue("detail").models, "attributes"), "quantity");
          // Filter on only ones that actually have a value
          if (dist.length) {
            undist = XT.math.add(dist, scale);
          }
          undist = XT.math.subtract(toIssue, undist, scale);
        }
        this.set("undistributed", undist > 0 ? undist : 0);
        return undist;
      }

    });

    /**
      @class

      @extends XM.Transaction
    */
    XM.IssueMaterial = XM.Transaction.extend({

      recordType: "XM.IssueMaterial",

      quantityAttribute: "toIssue",

      issueMethod: "issueItem",

      readOnlyAttributes: [
        "qohBefore",
        "qtyPer",
        "qtyRequired",
        "qtyIssued",
        "unit.name"
      ],

      transactionDate: null,

      /**
      Returns issue method as a localized string.

      @returns {String}
      */
      getIssueMethodString: function () {
        var K = XM.IssueMaterial,
          method = this.get('method');
        if (method === K.PULL) {
          return '_pull'.loc();
        }
        if (method === K.PUSH) {
          return '_push'.loc();
        }
        if (method === K.MIXED) {
          return '_mixed'.loc();
        }
      },

      qohAfter: function () {
        var qohBefore = this.get("qohBefore"),
          toIssue = this.get("toIssue"),
          qohAfter = XT.math.subtract(qohBefore, toIssue, XT.QUANTITY_SCALE);
        return  qohAfter;
      },

      bindEvents: function () {
        XM.Model.prototype.bindEvents.apply(this, arguments);

        // Bind events
        this.on("statusChange", this.statusDidChange);
        this.on("change:toIssue", this.toIssueDidChange);
      },

      canIssueItem: function (callback) {
        var hasPrivilege = XT.session.privileges.get("IssueWoMaterials");
        if (callback) {
          callback(hasPrivilege);
        }
        return this;
      },

      canReturnItem: function (callback) {
        var hasPrivilege = XT.session.privileges.get("ReturnWoMaterials");
        if (callback) {
          callback(hasPrivilege);
        }
        return this;
      },

      /**
        Calculate the balance remaining to issue.

        @returns {Number}
      */
      issueBalance: function () {
        var qtyRequired = this.get("qtyRequired"),
          qtyIssued = this.get("qtyIssued"),
          toIssue = XT.math.subtract(qtyRequired, qtyIssued, XT.QUANTITY_SCALE);
        return toIssue >= 0 ? toIssue : 0;
      },

      /**
        Unlike most validations on models, this one accepts a callback
        into which will be forwarded a boolean response. Errors will
        trigger `invalid`.

        @param {Function} Callback
        @returns {Object} Receiver
        */
      validate: function (callback) {
        var toIssue = this.get("toIssue"),
          err;

        // Validate
        if (this.undistributed()) {
          err = XT.Error.clone("xt2017");
        } else if (toIssue <= 0) {
          err = XT.Error.clone("xt2013");
        } else if (toIssue > this.issueBalance()) {
          this.notify("_issueExcess".loc(), {
            type: XM.Model.QUESTION,
            callback: function (resp) {
              callback(resp.answer);
            }
          });
          return this;
        }

        if (err) {
          this.trigger("invalid", this, err, {});
          callback(false);
        } else {
          callback(true);
        }

        return this;
      },

      statusDidChange: function () {
        if (this.getStatus() === XM.Model.READY_CLEAN) {
          this.set("toIssue", this.issueBalance());
        }
      },

      toIssueDidChange: function () {
        this.distributeToDefault();
        this.qohAfter();
      }

    });

    _.extend(XM.IssueMaterial, {
        /** @scope XM.IssueMaterial */

        /**
          Mixed Issue Method.

          @static
          @constant
          @type String
          @default M
        */
        MIXED: 'M',

        /**
          Pull Issue Method.

          @static
          @constant
          @type String
          @default L
        */
        PULL: 'L',

        /**
          Push Issue Method.

          @static
          @constant
          @type String
          @default S
        */
        PUSH: 'S'
      });

    /**
      Static function to call issue material on a set of multiple items.

      @params {Array} Data
      @params {Object} Options
    */
    XM.Manufacturing.issueItem = function (params, options) {
      var obj = XM.Model.prototype;
      obj.dispatch("XM.Manufacturing", "issueMaterial", params, options);
    };

    /**
      Static function to call return material on a set of multiple items.

      @params {Array} Array of model ids
      @params {Object} Options
    */
    XM.Manufacturing.returnItem = function (params, options) {
      var obj = XM.Model.prototype;
      obj.dispatch("XM.Manufacturing", "returnMaterial", params, options);
    };

    /**
      Static function to call return material on a set of multiple items.

      @params {Array} Array of model ids
      @params {Object} Options
    */
    XM.Manufacturing.postProduction = function (params, options) {
      var obj = XM.Model.prototype;
      obj.dispatch("XM.Manufacturing", "postProduction", params, options);
    };

    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.IssueMaterialCollection = XM.Collection.extend({

      model: XM.IssueMaterial

    });

  };

}());


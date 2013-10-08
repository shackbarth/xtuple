/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true */

(function () {
  "use strict";

  XT.extensions.manufacturing.initManufacturingModels = function () {

    /**
      @class

      @extends XM.Document
    */
    XM.PostProduction = XM.Model.extend({

      recordType: "XM.PostProduction",

      readOnlyAttributes: [
        "number",
        "dueDate",
        "itemSite",
        "status",
        "cosMethod",
        "qtyOrdered",
        "qtyRequired",
        "balance"
      ],

      transactionDate: null,

      bindEvents: function () {
        XM.Model.prototype.bindEvents.apply(this, arguments);
        this.on('statusChange', this.statusDidChange);
      },

      /**
        This overload will first save any changes via usual means, then
        call `postProduction`.
      */
      save: function (key, value, options) {
        var that = this,
          success;

        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (_.isObject(key) || _.isEmpty(key)) {
          options = value ? _.clone(value) : {};
        }

        success = options.success;

        // Post production after successful save
        options.success = function (model, resp, options) {
          var postOptions = {},
            postDate = XT.date.applyTimezoneOffset(that.get("dueDate"), true),
            params = [
              that.id,
              that.get("qtyToPost")
            ];
          postOptions.success = function (postResp) {
            var map,
              err;
            // Check for silent errors
            if (postResp < 0) {
              map = {
                "-1": "xtinv1001",
                "-5": "xtinv1002",
                "-8": "xtinv1008",
                "-12": "xtinv1003",
                "-13": "xtinv1004",
                "-15": "xtinv1005",
                "-50": "xtinv1006",
                "-99": "xtinv1007"
              };
              resp = resp + "";
              err = XT.Error.clone(map[resp] ? map[resp] : "xt1001");
              that.trigger("invalid", that, err, options || {});
            } else {
              if (success) { success(model, resp, options); }
            }
          };
          that.dispatch("XM.Inventory", "postProduction", params, postOptions);
          return this;
        };

        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (_.isObject(key) || _.isEmpty(key)) {
          value = options;
        }

        XM.Model.prototype.save.call(this, key, value, options);
      },

      statusDidChange: function () {
        var K = XM.Model;
        // We want to be able to save and post immeditately.
        if (this.getStatus() === K.READY_CLEAN) {
          this.setStatus(K.READY_DIRTY);
        }
      }

    });

    /**
      @class

      @extends XM.Transaction
    */
    XM.IssueMaterial = XM.Transaction.extend({

      recordType: "XM.IssueMaterial",

      quantityAttribute: "toIssue",

      issueMethod: "issueMaterial",

      readOnlyAttributes: [
        "qohBefore",
        "qtyPer",
        "qtyRequired",
        "qtyIssued",
        "unit.name"
      ],

      transactionDate: null,

      qohAfter: function () {
        var qohBefore = this.get("qohBefore"),
          toIssue = this.get("toIssue"),
          qohAfter = XT.math.subtract(qohBefore, toIssue, XT.QUANTITY_SCALE);
        return  qohAfter;
      },

      formatWoNumber: function () {
        return this.get("order.number") + "-" + this.get("order.subnumber");
      },

      bindEvents: function () {
        XM.Model.prototype.bindEvents.apply(this, arguments);

        // Bind events
        this.on("statusChange", this.statusDidChange);
        this.on("change:toIssue", this.toIssueDidChange);
      },

      canIssueMaterial: function (callback) {
        var hasPrivilege = XT.session.privileges.get("IssueWoMaterials");
        if (callback) {
          callback(hasPrivilege);
        }
        return this;
      },

      canReturnMaterial: function (callback) {
        var hasPrivilege = XT.session.privileges.get("ReturnWoMaterials");
        if (callback) {
          callback(hasPrivilege);
        }
        return this;
      },

      doReturnMaterial: function (callback) {
        var that = this,
          options = {};

        // Refresh once we've completed the work
        options.success = function () {
          that.fetch({
            success: function () {
              if (callback) {
                callback();
              }
            }
          });
        };

        this.setStatus(XM.Model.BUSY_COMMITTING);
        this.dispatch("XM.Inventory", "returnMaterial", [this.id], options);

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
        Overload: Calls `issueMaterial` dispatch function.

        @returns {Object} Receiver
        */
      save: function (key, value, options) {
        options = options ? _.clone(options) : {};

        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (_.isEmpty(key)) {
          options = value ? _.clone(value) : {};
        }

        var toIssue = this.get("toIssue"),
          that = this,
          callback,
          err;
        
        // Callback for after we determine quantity validity
        callback = function (resp) {
          if (!resp.answer) { return; }
            
          var dispOptions = {},
            issOptions = {
              asOf: that.transactionDate
            },
            detail = that.formatDetail(),
            params = [
              that.id,
              that.get("toIssue"),
              issOptions
            ];

          // Refresh once we've completed the work
          dispOptions.success = function () {
            that.fetch(options);
          };

          // Add distribution detail if applicable
          if (detail.length) {
            issOptions.detail = detail;
          }
          that.setStatus(XM.Model.BUSY_COMMITTING);
          that.dispatch("XM.Inventory", that.issueMethod, params, dispOptions);
        };

        // Validate
        if (this.undistributed()) {
          err = XT.Error.clone("xt2017");
        } else if (toIssue <= 0) {
          err = XT.Error.clone("xt2013");
        } else if (!this.issueBalance() && toIssue > 0) {
          this.notify("_issueExcess".loc(), {
            type: XM.Model.QUESTION,
            callback: callback()
          });
        }

        if (err) {
          this.trigger("invalid", this, err, options || {});
        } else {
          callback({answer: true});
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

    /**
      Static function to call issue material on a set of multiple items.

      @params {Array} Data
      @params {Object} Options
    */
    XM.Manufacturing.issueMaterial = function (params, options) {
      var obj = XM.Model.prototype;
      obj.dispatch("XM.Inventory", "issueMaterial", params, options);
    };

    /**
      Static function to call return material on a set of multiple items.

      @params {Array} Array of model ids
      @params {Object} Options
    */
    XM.Manufacturing.returnMaterial = function (params, options) {
      var obj = XM.Model.prototype;
      obj.dispatch("XM.Inventory", "returnMaterial", params, options);
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


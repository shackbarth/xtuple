/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true */

(function () {
  "use strict";

  XT.extensions.manufacturing.initManufacturingModels = function () {

    /**
      @class

      @extends XM.Transaction
    */
    XM.IssueMaterial = XM.Transaction.extend({

      recordType: "XM.IssueMaterial",

      quantityAttribute: "toIssue",

      issueMethod: "issueMaterial",

      readOnlyAttributes: [
        "qtyPer"
      ],

      transactionDate: null,

      formatWoNumber: function () {
        return this.get("order") + "-" + this.get("subnumber");
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
        this.dispatch("XM.Manufacturing", "returnMaterial", [this.id], options);

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
        Overload: Calls `issueToShipping` dispatch function.

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
          that.dispatch("XM.Manufacturing", that.issueMethod, params, dispOptions);
        };

        // Validate
        if (this.undistributed()) {
          err = XT.Error.clone("xt2017");
        } else if (toIssue <= 0) {
          err = XT.Error.clone("xt2013");
        } else if (!this.issueBalance() && toIssue > 0) {
          this.notify("_issueExcess".loc(), {
            type: XM.Model.QUESTION,
            callback: callback
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
      }

    });

    /**
      Static function to call issue to shipping on a set of multiple items.

      @params {Array} Data
      @params {Object} Options
    */
    XM.Manufacturing.issueMaterial = function (params, options) {
      var obj = XM.Model.prototype;
      obj.dispatch("XM.Manufacturing", "issueMaterial", params, options);
    };

    /**
      Static function to call return from shipping on a set of multiple items.

      @params {Array} Array of model ids
      @params {Object} Options
    */
    XM.Manufacturing.returnMaterial = function (params, options) {
      var obj = XM.Model.prototype;
      obj.dispatch("XM.Manufacturing", "returnMaterial", params, options);
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


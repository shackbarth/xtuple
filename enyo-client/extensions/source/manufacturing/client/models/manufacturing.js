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
        "ordered",
        "qtyRequired",
        "balance"
      ],

      transactionDate: null,

      bindEvents: function () {
        XM.Model.prototype.bindEvents.apply(this, arguments);
        this.on('statusChange', this.statusDidChange);
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

      issueMethod: "issueItem",

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

    /**
      Static function to call issue material on a set of multiple items.

      @params {Array} Data
      @params {Object} Options
    */
    XM.Manufacturing.issueItem = function (params, options) {
      var obj = XM.Model.prototype;
      obj.dispatch("XM.Inventory", "issueMaterial", params, options);
    };

    /**
      Static function to call return material on a set of multiple items.

      @params {Array} Array of model ids
      @params {Object} Options
    */
    XM.Manufacturing.returnItem = function (params, options) {
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


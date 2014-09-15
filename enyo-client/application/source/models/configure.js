/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.Settings
  */
  XM.UserPreference = XM.Settings.extend(/** @lends XM.UserPreference.prototype */{

    recordType: 'XM.UserPreference',

    privileges: "MaintainPreferencesSelf",

    dispatchRecordType: 'XT.Session',

    dispatchFetchFunction: 'preferences',

    dispatchCommitFunction: 'commitPreferences',

    // Components added in enyo using XM.forms. The same attributes are here in meta. 
    // At READY_CLEAN, setValue to set meta and enyo components according to user preference form
    // print settings if they exist (have been set previously), otherwise, set them according to 
    // the values in XM.forms.

    initialize: function (attributes, options) {
      var that = this;
      XM.Document.prototype.initialize.apply(this, arguments);
      this.meta = new Backbone.Model({
        "SalesOrder": "",
        "Invoice": "",
        "PurchaseOrder": "",
        "Location": "",
        "EnterReceipt": "",
        "Shipment": ""
      });

      this.meta.on("change", this.metaChanged(this));
      this.meta.on("all", function () {
        console.log(arguments);
      });
    },

    handlers: {
      "status:READY_CLEAN": "statusReadyClean"
    },

    /*bindEvents: function () {
      XM.Model.prototype.bindEvents.apply(this, arguments);
      this.on('status:READY_CLEAN', this.statusReadyClean);
      this.on("change:" + this.idAttribute, "statusReadyClean");
    },*/

    metaChanged: function (model, changed, options) {
      // XXX - Inefficient here. Only update the meta attribute changed.
      //this.set("FormPrintSettings", model.changedAttributes());
      this.set("FormPrintSettings", JSON.stringify(this.meta.attributes));
    },

    statusReadyClean: function () {
      if (this.getStatus() === XM.Model.READY_CLEAN) {
        console.log("statusReadyClean!!!!");
        var that = this,
          userPrefFormPrintSettings = XT.session.preferences.getValue("FormPrintSettings") ? JSON.parse(XT.session.preferences.getValue("FormPrintSettings")) : null,
          formsCache = XM.forms.models;

        if (userPrefFormPrintSettings) {
          _.each(userPrefFormPrintSettings, function (val, key) {
            that.setValue(key, val);
          });
        } else if (formsCache) {
          _.each(formsCache, function (val, key) {
            var attr = val.getValue("name"),
              value = val.getValue("defaultPrinter.code");

            that.setValue(attr, value);
          });
        }

        /*_.each(formPrintSettingsPrefs, function (val, key) {
          return model.setValue(key, val);
        });*/
        // First time settings
        /*if (!this.get("FormPrintSettings")) {
          var that = this;
          _.each(XM.forms.models, function (form) {
            return that.setValue(form.get("name"), form.getValue("defaultPrinter.code"));
          });
        }*/
      }
    }

  });

  /**
    @class

    @extends XM.Settings
  */
  XM.DatabaseInformation = XM.Settings.extend({
    /** @scope XM.DatabaseInformation.prototype */

    recordType: 'XM.DatabaseInformation',

    privileges: 'ConfigDatabaseInfo',

    readOnlyAttributes: [
      "DatabaseName",
      "ServerVersion"
    ]
  });
  XM.databaseInformation = new XM.DatabaseInformation();

  /**
    @class

    @extends XM.Settings
  */
  XM.System = XM.Settings.extend({
    /** @scope XM.SystemConfiguration.prototype */

    recordType: 'XM.System',

    privileges: 'ConfigureCC' // TODO: expand once we can do more than just credit card processing here
  });
  XM.system = new XM.System();

}());

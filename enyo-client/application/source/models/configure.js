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

    initialize: function (attributes, options) {
      var that = this;
      XM.Document.prototype.initialize.apply(this, arguments);
      this.meta = new Backbone.Model({
        "Invoice": "",
        "PurchaseOrder": "",
        "Location": "",
        "EnterReceipt": "",
        "Shipment": ""
      });

      this.meta.on("change", this.metaChanged, this);
    },

    handlers: {
      "statusChange": "statusReadyClean"
    },

    /*fetch: function (option) {
      //XM.Model.prototype.fetch.apply(this, arguments);
      this.statusReadyClean(this);
    },*/

    /*bindEvents: function () {
      XM.Model.prototype.bindEvents.apply(this, arguments);
      this.on('statusChange', this.statusReadyClean);
      this.on("change:" + this.idAttribute, "statusReadyClean");
    },*/

    metaChanged: function (model, changed, options) {
      // XXX - Inefficient here. Only update the meta attribute changed.
      //this.set("FormPrintSettings", model.changedAttributes());
      this.set("FormPrintSettings", JSON.stringify(model.attributes));
    },

    statusReadyClean: function (model) {
      console.log("statusReadyClean!!!!");

      var that = model || this;

      var formPrintSettingsUserPrefs = XT.session.preferences.getValue("FormPrintSettings"),
        formPrintSettingsCache = JSON.parse(XT.session.preferences.getValue("FormPrintSettings"));

      that.setValue(formPrintSettingsCache);

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

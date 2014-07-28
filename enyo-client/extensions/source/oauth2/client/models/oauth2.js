/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, XV:true, Backbone:true, _:true, window:true */

(function () {
  "use strict";

  XT.extensions.oauth2.initModels = function () {

    //
    // MODELS
    //

    XM.Oauth2client = XM.Model.extend({

      recordType: "XM.Oauth2client",

      autoFetchId: true,

      defaults: function () {
        return {
          isActive: true
        };
      },

      readOnlyAttributes: [
        "clientID",
        "clientSecret",
        "issued",
        "organization"
      ],

      bindEvents: function () {
        XM.Model.prototype.bindEvents.apply(this, arguments);
        this.on('statusChange', this.statusDidChange);
        this.on('change:clientType', this.clientTypeDidChange);
      },

      // clientType must not be editable once first saved.
      statusDidChange: function () {
        this.setReadOnly('clientType', this.getStatus() !== XM.Model.READY_NEW);

        if (this.getStatus() === XM.Model.READY_NEW) {
          this.set('clientID', XT.getOrganizationPath().substring(1) + "_" + XT.generateUUID());
          // XXX the secret is only relevant for websites, but we generate it here
          // for both because it's required to be unique on the DB level
          // secret keys only seem to be applicable for website clients, so we might
          // not want to make it unique
          this.set('clientSecret', XT.generateUUID());
          this.set('issued', new Date());
        }
      },

      clientTypeDidChange: function () {
        this.set("delegatedAccess", this.get("clientType") === 'jwt bearer');
      },

      save: function (key, value, options) {
        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (_.isObject(key) || _.isEmpty(key)) {
          options = value;
        }
        options = options ? _.clone(options) : {};

        var success = options.success,
          status = this.getStatus(),
          that = this;

        options.success = function (model, resp, options) {
          if (status === XM.Model.READY_NEW && that.get("clientType") === 'jwt bearer') {
            // Download the private key.
            XV.downloadURL(XT.getOrganizationPath() + '/oauth/generate-key?id=' + that.id);
          }

          if (success) { success(model, resp, options); }
        };

        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (_.isObject(key) || _.isEmpty(key)) {
          value = options;
        }

        if (status === XM.Model.READY_NEW && that.get("clientType") === 'jwt bearer') {
          // The order of operations for a new jwt bearer is
          // 1. Notify the user that the download is coming
          // 2. Save normally
          // 3. Open the download tab.
          //
          // It's a little curious that 2 happens after 1, but the notify listener
          // on the workspace gets destroyed by the time we would need it otherwise.
          that.notify("_generatingPrivateKey".loc(), {callback: function () {
            XM.Model.prototype.save.call(that, key, value, options);
          }});
        } else {
          XM.Model.prototype.save.call(this, key, value, options);
        }
      }

    });

    XM.Oauth2clientRedirs = XM.Model.extend({

      recordType: "XM.Oauth2clientRedirs",

      autoFetchId: true

    });

    //
    // COLLECTIONS
    //

    XM.Oauth2clientCollection = XM.Collection.extend({
      model: XM.Oauth2client
    });

    XM.Oauth2clientRedirsCollection = XM.Collection.extend({
      model: XM.Oauth2clientRedirs
    });
  };
}());

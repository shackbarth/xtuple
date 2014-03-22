/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true */

(function () {
  "use strict";

  /** @class

    Provides special number handling capabilities for documents that are Accounts.

    @extends XM.Document
  */

  XM.AccountDocument = XM.Document.extend({
    /** @scope XM.AccountDocument.prototype */

    conversionMap: {
      name: "name"
    },

    numberPolicySetting: 'CRMAccountNumberGeneration',

    /**
      Creates a new account model and fetches based on the given ID.
      Takes attributes from the account model and gives them to the new model.
    */
    convertFromAccount: function (id) {
      var account = new XM.Account(),
          fetchOptions = {},
          that = this;

      // this id is the natural key, which in this case
      // is the number
      fetchOptions.id = id;
      fetchOptions.obtainLock = false;

      fetchOptions.success = function (resp) {
        var prop,
          map = that.conversionMap;
        for (prop in map) {
          if (map.hasOwnProperty(prop)) {
            that.set(map[prop], account.get(prop));
          }
        }
        that.revertStatus();
        that.checkConflicts = false;
      };
      fetchOptions.error = function (resp) {
        XT.log("Fetch failed in convertFromAccount");
      };
      this.setStatus(XM.Model.BUSY_FETCHING);
      account.fetch(fetchOptions);
    },

    /**
      Return a matching record id for a passed `value`. Overload
      of `XM.Model.findExisting` such that it only searches on
      the AccountDocument number field against Account records.

      @param {String} Key - Ignored
      @param {String} Value to search for
      @param {Object} Options
      @returns {Object} Receiver
    */
    findExisting: function (key, value, options) {
      if (this._converted) { return this; }
      var params = [ "number", value ];
      XM.ModelMixin.dispatch('XM.Account', 'findExisting', params, options);
      return this;
    }

  });

  /**
    @class

    @extends XT.AccountDocument
  */
  XM.Account = XM.AccountDocument.extend({
    /** @scope XM.Account.prototype */

    recordType: 'XM.Account',

    defaults: function () {
      return {
        owner: XM.currentUser,
        isActive: true,
        accountType: 'O'
      };
    },

    /**
      An informational array of attributes that are considered "roles" in the application.
    */
    roleAttributes: [
      "employee",
      "salesRep",
      "taxAuthority",
      "userAccount",
      "competitor",
      "partner"
    ],

    // ..........................................................
    // METHODS
    //

    validate: function (attributes) {
      if (attributes.parent && attributes.parent.id === this.id) {
        return XT.Error.clone('xt2006');
      }
      return XM.Document.prototype.validate.apply(this, arguments);
    }

  });

  XM.Account.used = function (id, options) {
    return XM.ModelMixin.dispatch('XM.Account', 'used', id, options);
  };

  /**
    @class

    @extends XM.Comment
  */
  XM.AccountComment = XM.Comment.extend({
    /** @scope XM.AccountComment.prototype */

    recordType: 'XM.AccountComment',

    sourceName: 'CRMA'

  });

  /**
    @class

    @extends XM.CharacteristicAssignment
  */
  XM.AccountCharacteristic = XM.CharacteristicAssignment.extend({
    /** @scope XM.AccountCharacteristic.prototype */

    recordType: 'XM.AccountCharacteristic',

    which: 'isAccounts'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.AccountAccount = XM.Model.extend({
    /** @scope XM.AccountAccount.prototype */

    recordType: 'XM.AccountAccount',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.AccountContact = XM.Model.extend({
    /** @scope XM.AccountContact.prototype */

    recordType: 'XM.AccountContact',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.AccountIncident = XM.Model.extend({
    /** @scope XM.AccountIncident.prototype */

    recordType: 'XM.AccountIncident',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.AccountItem = XM.Model.extend({
    /** @scope XM.AccountItem.prototype */

    recordType: 'XM.AccountItem',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.AccountFile = XM.Model.extend({
    /** @scope XM.AccountFile.prototype */

    recordType: 'XM.AccountFile',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.AccountUrl = XM.Model.extend({
    /** @scope XM.AccountUrl.prototype */

    recordType: 'XM.AccountUrl',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.AccountProject = XM.Model.extend({
    /** @scope XM.AccountProject.prototype */

    recordType: 'XM.AccountProject',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Info
  */
  XM.AccountRelation = XM.Info.extend({
    /** @scope XM.AccountRelation.prototype */

    recordType: 'XM.AccountRelation',

    editableModel: 'XM.Account',

    descriptionKey: "name"

  });

  /**
    @class

    @extends XM.Info
  */
  XM.AccountListItem = XM.Info.extend({
    /** @scope XM.AccountListItem.prototype */

    recordType: 'XM.AccountListItem',

    editableModel: 'XM.Account'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.AccountListItemCharacteristic = XM.Model.extend({
    /** @scope XM.AccountListItemCharacteristic.prototype */

    recordType: 'XM.AccountListItemCharacteristic'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.AccountAddressListItem = XM.Model.extend({
    /** @scope XM.AccountAddressListItem.prototype */

    recordType: 'XM.AccountAddressListItem'

  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.AccountAddressListItemCollection = XM.Collection.extend({
    /** @scope XM.AccountAddressListItemCollection.prototype */

    model: XM.AccountAddressListItem

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.AccountListItemCollection = XM.Collection.extend({
    /** @scope XM.AccountListItemCollection.prototype */

    model: XM.AccountListItem

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.AccountRelationCollection = XM.Collection.extend({
    /** @scope XM.AccountRelationCollection.prototype */

    model: XM.AccountRelation

  });

}());

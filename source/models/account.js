/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
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

    numberPolicySetting: 'CRMAccountNumberGeneration',

    requiredAttributes: [
      "number"
    ],

    // ..........................................................
    // METHODS
    //

    /**
      To always check `XM.Account` for duplicates since it is the parent of all.
    */
    documentKeyDidChange: function () {
      var oldType = this.recordType;
      var oldKey = this.documentKey;
      var oldId = this.id;
      this.recordType = 'XM.Account';
      this.documentKey = 'number';
      this.id = -1;
      XM.Document.prototype.documentKeyDidChange.apply(this, arguments);
      this.recordType = oldType;
      this.documentKey = oldKey;
      this.id = oldId;
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

    requiredAttributes: [
      "accountType",
      "isActive",
      "number",
      "name"
    ],

    // ..........................................................
    // METHODS
    //
    
    validateEdit: function (attributes) {
      if (attributes.parent && attributes.parent.id === this.id) {
        return XT.Error.clone('xt2006');
      }
    }

  });
  
  XM.Account.used = function (id, options) {
    return XT.dataSource.dispatch('XM.Account', 'used', id, options);
  };
  
  // ..........................................................
  // CLASS METHODS
  //

  _.extend(XM.Account, /** @lends XM.Model# */{
    /**
      Return a matching record id for a passed user `key` and `value`. If none
      found, returns zero.

      @param {String} Property to search on, typically a user key
      @param {String} Value to search for
      @param {Object} Options
      @returns {Object} Receiver
    */
    findExisting: function (key, value, options) {
      var params = [ key, value, this.id || -1 ],
        dataSource = options.dataSource || XT.dataSource;
      dataSource.dispatch('XM.Account', 'findExisting', params, options);
      XT.log("XM.Account.findExisting");
      return this;
    }

  });
  

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

    recordType: 'XM.AccountCharacteristic'

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

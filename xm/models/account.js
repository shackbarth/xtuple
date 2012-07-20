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
      this.recordType = 'XM.Account';
      XM.Document.prototype.documentKeyDidChange.apply(this, arguments);
      this.recordType = oldType;
    }

  });

  /**
    @class

    @extends XT.AccountDocument
  */
  XM.Account = XM.AccountDocument.extend({
    /** @scope XM.Account.prototype */

    recordType: 'XM.Account',

    privileges: {
      "all": {
        "create": "MaintainAllCRMAccounts",
        "read": "ViewAllCRMAccounts",
        "update": "MaintainAllCRMAccounts",
        "delete": "MaintainAllCRMAccounts"
      },
      "personal": {
        "create": "MaintainPersonalCRMAccounts",
        "read": "ViewPersonalCRMAccounts",
        "update": "MaintainPersonalCRMAccounts",
        "delete": "MaintainPersonalCRMAccounts",
        "properties": [
          "owner"
        ]
      }
    },

    defaults: {
      owner: XM.currentUser,
      isActive: true,
      accountType: 'O'
    },

    requiredAttributes: [
      "accountType",
      "isActive",
      "number",
      "name"
    ],

    relations: [{
      type: Backbone.HasOne,
      key: 'parent',
      relatedModel: 'XM.AccountInfo'
    }, {
      type: Backbone.HasOne,
      key: 'primaryContact',
      relatedModel: 'XM.ContactInfo'
    }, {
      type: Backbone.HasOne,
      key: 'secondaryContact',
      relatedModel: 'XM.ContactInfo'
    }, {
      type: Backbone.HasOne,
      key: 'owner',
      relatedModel: 'XM.UserAccountInfo'
    }, {
      type: Backbone.HasMany,
      key: 'comments',
      relatedModel: 'XM.AccountComment',
      reverseRelation: {
        key: 'account'
      }
    }, {
      type: Backbone.HasMany,
      key: 'characteristics',
      relatedModel: 'XM.AccountCharacteristic',
      reverseRelation: {
        key: 'account'
      }
    }, {
      type: Backbone.HasMany,
      key: 'accounts',
      relatedModel: 'XM.AccountAccount',
      reverseRelation: {
        key: 'account'
      }
    }, {
      type: Backbone.HasMany,
      key: 'contacts',
      relatedModel: 'XM.AccountContact',
      reverseRelation: {
        key: 'account'
      }
    }, {
      type: Backbone.HasMany,
      key: 'items',
      relatedModel: 'XM.AccountItem',
      reverseRelation: {
        key: 'account'
      }
    }, {
      type: Backbone.HasMany,
      key: 'files',
      relatedModel: 'XM.AccountFile',
      reverseRelation: {
        key: 'account'
      }
    }, {
      type: Backbone.HasMany,
      key: 'images',
      relatedModel: 'XM.AccountImage',
      reverseRelation: {
        key: 'account'
      }
    }, {
      type: Backbone.HasMany,
      key: 'urls',
      relatedModel: 'XM.AccountUrl',
      reverseRelation: {
        key: 'account'
      }
    }/* These were causing a problem in validation. SH 7/19/2012
      , {
      type: Backbone.HasOne,
      key: 'userAccount',
      relatedModel: 'XM.UserAccountInfo',
      includeInJSON: 'username'
    }, {
      type: Backbone.HasOne,
      key: 'salesRep',
      relatedModel: 'XM.SalesRep',
      includeInJSON: 'id'
    }, {
      type: Backbone.HasOne,
      key: 'taxAuthority',
      relatedModel: 'XM.TaxAuthority',
      includeInJSON: 'id'
    }*/],

    // ..........................................................
    // METHODS
    //

    validateEdit: function (attributes) {
      if (attributes.parent && attributes.parent.id === this.id) {
        return XT.Error.clone('xt2006');
      }
    }

  });

  /**
    @class

    @extends XM.Comment
  */
  XM.AccountComment = XM.Comment.extend({
    /** @scope XM.AccountComment.prototype */

    recordType: 'XM.AccountComment'

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

    @extends XT.Model
  */
  XM.AccountAccount = XT.Model.extend({
    /** @scope XM.AccountAccount.prototype */

    recordType: 'XM.AccountAccount',

    isDocumentAssignment: true,

    relations: [{
      type: Backbone.HasOne,
      key: 'accounts',
      relatedModel: 'XM.AccountInfo'
    }]

  });

  /**
    @class

    @extends XT.Model
  */
  XM.AccountContact = XT.Model.extend({
    /** @scope XM.AccountContact.prototype */

    recordType: 'XM.AccountContact',

    isDocumentAssignment: true,

    relations: [{
      type: Backbone.HasOne,
      key: 'contacts',
      relatedModel: 'XM.ContactInfo'
    }]

  });

  /**
    @class

    @extends XT.Model
  */
  XM.AccountItem = XT.Model.extend({
    /** @scope XM.AccountItem.prototype */

    recordType: 'XM.AccountItem',

    isDocumentAssignment: true,

    relations: [{
      type: Backbone.HasOne,
      key: 'items',
      relatedModel: 'XM.ItemInfo'
    }]

  });

  /**
    @class

    @extends XT.Model
  */
  XM.AccountFile = XT.Model.extend({
    /** @scope XM.AccountFile.prototype */

    recordType: 'XM.AccountFile',

    isDocumentAssignment: true,

    relations: [{
      type: Backbone.HasOne,
      key: 'files',
      relatedModel: 'XM.FileInfo'
    }]

  });

  /**
    @class

    @extends XT.Model
  */
  XM.AccountImage = XT.Model.extend({
    /** @scope XM.AccountImage.prototype */

    recordType: 'XM.AccountImage',

    isDocumentAssignment: true,

    relations: [{
      type: Backbone.HasOne,
      key: 'images',
      relatedModel: 'XM.ImageInfo'
    }]

  });

  /**
    @class

    @extends XT.Model
  */
  XM.AccountUrl = XT.Model.extend({
    /** @scope XM.AccountUrl.prototype */

    recordType: 'XM.AccountUrl',

    isDocumentAssignment: true,

    relations: [{
      type: Backbone.HasOne,
      key: 'url',
      relatedModel: 'XM.Url'
    }]

  });

  /**
    @class

    @extends XT.Model
  */
  XM.AccountProject = XT.Model.extend({
    /** @scope XM.AccountProject.prototype */

    recordType: 'XM.AccountProject',

    isDocumentAssignment: true,

    relations: [{
      type: Backbone.HasOne,
      key: 'project',
      relatedModel: 'XM.ProjectInfo'
    }]

  });

  /**
    @class

    @extends XT.Model
  */
  XM.AccountContactInfo = XT.Model.extend({
    /** @scope XM.AccountContactInfo.prototype */

    recordType: 'XM.AccountContactInfo',

    relations: [{
      type: Backbone.HasOne,
      key: 'address',
      relatedModel: 'XM.AddressInfo'
    }, {
      type: Backbone.HasOne,
      key: 'owner',
      relatedModel: 'XM.UserAccountInfo'
    }]

  });

  /**
    @class

    @extends XT.Model
  */
  XM.AccountInfo = XT.Model.extend({
    /** @scope XM.AccountInfo.prototype */

    recordType: 'XM.AccountInfo',

    readOnly: true,

    privileges: {
      "all": {
        "create": false,
        "read": "ViewAllCRMAccounts",
        "update": false,
        "delete": false
      },
      "personal": {
        "create": false,
        "read": true,
        "update": false,
        "delete": true,
        "properties": [
          "owner"
        ]
      }
    },

    relations: [{
      type: Backbone.HasOne,
      key: 'primaryContact',
      relatedModel: 'XM.AccountContactInfo'
    }, {
      type: Backbone.HasOne,
      key: 'owner',
      relatedModel: 'XM.UserAccountInfo'
    }]

  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XT.Collection
  */
  XM.AccountInfoCollection = XT.Collection.extend({
    /** @scope XM.AccountInfoCollection.prototype */

    model: XM.AccountInfo

  });

}());

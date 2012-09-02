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
  XM.AccountImage = XM.Model.extend({
    /** @scope XM.AccountImage.prototype */

    recordType: 'XM.AccountImage',

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
  XM.AccountContactInfo = XM.Info.extend({
    /** @scope XM.AccountContactInfo.prototype */

    recordType: 'XM.AccountContactInfo',
    
    editableModel: 'XM.Contact'

  });
  
  /**
    @class
    
    Like `XM.AccountInfo`, but without contact which otherwise
    runs into recursion problems.

    @extends XM.Info
  */
  XM.AccountBasicInfo = XM.Info.extend({
    /** @scope XM.ContactAccountInfo.prototype */

    recordType: 'XM.AccountBasicInfo',
    
    editableModel: 'XM.Account'

  });

  /**
    @class

    @extends XM.Info
  */
  XM.AccountInfo = XM.Info.extend({
    /** @scope XM.AccountInfo.prototype */

    recordType: 'XM.AccountInfo',

    editableModel: 'XM.Account'

  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.AccountContactInfoCollection = XM.Collection.extend({
    /** @scope XM.AccountContactInfoCollection.prototype */

    model: XM.AccountContactInfo

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.AccountInfoCollection = XM.Collection.extend({
    /** @scope XM.AccountInfoCollection.prototype */

    model: XM.AccountInfo

  });

}());

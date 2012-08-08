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

    @extends XM.Model
  */
  XM.AccountContactInfo = XM.Model.extend({
    /** @scope XM.AccountContactInfo.prototype */

    recordType: 'XM.AccountContactInfo'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.AccountInfo = XM.Model.extend({
    /** @scope XM.AccountInfo.prototype */

    recordType: 'XM.AccountInfo',

    readOnly: true,

  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.AccountInfoCollection = XM.Collection.extend({
    /** @scope XM.AccountInfoCollection.prototype */

    model: XM.AccountInfo

  });

}());

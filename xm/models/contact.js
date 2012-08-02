/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.Document
  */
  XM.Honorific = XM.Document.extend({
    /** @scope XM.Honorific.prototype */

    recordType: 'XM.Honorific',

    documentKey: 'code',

    enforceUpperKey: false,

    privileges: {
      "all": {
        "create": "MaintainTitles",
        "read": true,
        "update": "MaintainTitles",
        "delete": "MaintainTitles"
      }
    }

  });

  /**
    @namespace

  */
  XM.ContactMixin = {
    /* @scope XM.ContactMixin */

    /**
    Full contact name.

    @returns String
    */
    getName: function () {
      var name = [],
        first = this.get('firstName'),
        middle = this.get('middleName'),
        last = this.get('lastName'),
        suffix = this.get('suffix');
      if (first) { name.push(first); }
      if (middle) { name.push(middle); }
      if (last) { name.push(last); }
      if (suffix) { name.push(suffix); }
      return name.join(' ');
    }
  };

  /**
    @class

    @extends XM.Document
  */
  XM.Contact = XM.Document.extend({
    /** @scope XM.Contact.prototype */

    recordType: 'XM.Contact',

    nameAttribute: 'getName',

    numberPolicy: XM.Document.AUTO_NUMBER,

    defaults: {
      owner: XM.currentUser,
      isActive: true
    },

    privileges: {
      "all": {
        "create": "MaintainAllContacts",
        "read": "ViewAllContacts",
        "update": "MaintainAllContacts",
        "delete": "MaintainAllContacts"
      },
      "personal": {
        "create": "MaintainPersonalContacts",
        "read": "ViewPersonalContacts",
        "update": "MaintainPersonalContacts",
        "delete": "MaintainPersonalContacts",
        "properties": [
          "owner"
        ]
      }
    },

    // ..........................................................
    // METHODS
    //

    validateSave: function (attributes, options) {
      if (!attributes.firstName && !attributes.lastName) {
        return XT.Error.clone('xt2004');
      }
    }

  });

  // Add mixin
  XM.Contact = XM.Contact.extend(XM.ContactMixin);

  /**
    @class

    @extends XT.Model
  */
  XM.ContactEmail = XM.Model.extend({
    /** @scope XM.ContactEmail.prototype */

    recordType: 'XM.ContactEmail',

    requiredAttributes: [
      "email"
    ]

  });

  /**
    @class

    @extends XM.Comment
  */
  XM.ContactComment = XM.Comment.extend({
    /** @scope XM.ContactComment.prototype */

    recordType: 'XM.ContactComment'

  });

  /**
    @class

    @extends XM.Characteristic
  */
  XM.ContactCharacteristic = XM.Characteristic.extend({
    /** @scope XM.ContactCharacteristic.prototype */

    recordType: 'XM.ContactCharacteristic'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ContactAccount = XM.Model.extend({
    /** @scope XM.ContactAccount.prototype */

    recordType: 'XM.ContactAccount',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ContactContact = XM.Model.extend({
    /** @scope XM.ContactContact.prototype */

    recordType: 'XM.ContactContact',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ContactItem = XM.Model.extend({
    /** @scope XM.ContactItem.prototype */

    recordType: 'XM.ContactItem',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ContactFile = XM.Model.extend({
    /** @scope XM.ContactFile.prototype */

    recordType: 'XM.ContactFile',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ContactImage = XM.Model.extend({
    /** @scope XM.ContactImage.prototype */

    recordType: 'XM.ContactImage',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ContactUrl = XM.Model.extend({
    /** @scope XM.ContactUrl.prototype */

    recordType: 'XM.ContactUrl',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ContactInfo = XM.Model.extend({
    /** @scope XM.ContactInfo.prototype */

    recordType: 'XM.ContactInfo',

    readOnly: true

  });

  // Add mixin
  XM.ContactInfo = XM.ContactInfo.extend(XM.ContactMixin);

  // ..........................................................
  // METHODS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.HonorificCollection = XM.Collection.extend({
    /** @scope XM.HonorificCollection.prototype */

    model: XM.Honorific

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.ContactInfoCollection = XM.Collection.extend({
    /** @scope XM.ContactInfoCollection.prototype */

    model: XM.ContactInfo

  });

}());

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
    @class

    @extends XM.Document
  */
  XM.Contact = XM.Document.extend({
    /** @scope XM.Contact.prototype */

    recordType: 'XM.Contact',

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

    relations:   [{
      type: Backbone.HasOne,
      key: 'address',
      relatedModel: 'XM.AddressInfo'
    }, {
      type: Backbone.HasOne,
      key: 'account',
      relatedModel: 'XM.AccountInfo'
    }, {
      type: Backbone.HasOne,
      key: 'owner',
      relatedModel: 'XM.UserAccountInfo'
    }, {
      type: Backbone.HasMany,
      key: 'comments',
      relatedModel: 'XM.ContactComment',
      reverseRelation: {
        key: 'contact'
      }
    }, {
      type: Backbone.HasMany,
      key: 'email',
      relatedModel: 'XM.ContactEmail',
      reverseRelation: {
        key: 'contact'
      }
    }, {
      type: Backbone.HasMany,
      key: 'characteristics',
      relatedModel: 'XM.ContactCharacteristic',
      reverseRelation: {
        key: 'contact'
      }
    }, {
      type: Backbone.HasMany,
      key: 'accounts',
      relatedModel: 'XM.ContactAccount',
      reverseRelation: {
        key: 'contact'
      }
    }, {
      type: Backbone.HasMany,
      key: 'contacts',
      relatedModel: 'XM.ContactContact',
      reverseRelation: {
        key: 'contact'
      }
    }, {
      type: Backbone.HasMany,
      key: 'items',
      relatedModel: 'XM.ContactItem',
      reverseRelation: {
        key: 'contact'
      }
    }, {
      type: Backbone.HasMany,
      key: 'files',
      relatedModel: 'XM.ContactFile',
      reverseRelation: {
        key: 'contact'
      }
    }, {
      type: Backbone.HasMany,
      key: 'images',
      relatedModel: 'XM.ContactImage',
      reverseRelation: {
        key: 'contact'
      }
    }, {
      type: Backbone.HasMany,
      key: 'urls',
      relatedModel: 'XM.ContactUrl',
      reverseRelation: {
        key: 'contact'
      }
    }],

    // ..........................................................
    // METHODS
    //

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
    },

    validateSave: function () {
      if (!this.get('firstName') && !this.get('lastName')) {
        return XT.Error.clone('xt2004');
      }
    }

  });

  /**
    @class
  
    @extends XT.Model
  */
  XM.ContactEmail = XT.Model.extend({
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
  
    @extends XT.Model
  */
  XM.ContactAccount = XT.Model.extend({
    /** @scope XM.ContactAccount.prototype */

    recordType: 'XM.ContactAccount',

    isDocumentAssignment: true,

    relations: [{
      type: Backbone.HasOne,
      key: 'account',
      relatedModel: 'XM.AccountInfo'
    }]

  });

  /**
    @class
  
    @extends XT.Model
  */
  XM.ContactContact = XT.Model.extend({
    /** @scope XM.ContactContact.prototype */

    recordType: 'XM.ContactContact',

    isDocumentAssignment: true,

    relations: [{
      type: Backbone.HasOne,
      key: 'contact',
      relatedModel: 'XM.ContactInfo'
    }]

  });

  /**
    @class
  
    @extends XT.Model
  */
  XM.ContactItem = XT.Model.extend({
    /** @scope XM.ContactItem.prototype */

    recordType: 'XM.ContactItem',

    isDocumentAssignment: true,

    relations: [{
      type: Backbone.HasOne,
      key: 'item',
      relatedModel: 'XM.ItemInfo'
    }]

  });

  /**
    @class
  
    @extends XT.Model
  */
  XM.ContactFile = XT.Model.extend({
    /** @scope XM.ContactFile.prototype */

    recordType: 'XM.ContactFile',

    isDocumentAssignment: true,

    relations: [{
      type: Backbone.HasOne,
      key: 'file',
      relatedModel: 'XM.FileInfo'
    }]

  });

  /**
    @class
  
    @extends XT.Model
  */
  XM.ContactImage = XT.Model.extend({
    /** @scope XM.ContactImage.prototype */

    recordType: 'XM.ContactImage',

    isDocumentAssignment: true,

    relations: [{
      type: Backbone.HasOne,
      key: 'image',
      relatedModel: 'XM.ImageInfo'
    }]

  });

  /**
    @class
  
    @extends XT.Model
  */
  XM.ContactUrl = XT.Model.extend({
    /** @scope XM.ContactUrl.prototype */

    recordType: 'XM.ContactUrl',

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
  XM.ContactInfo = XT.Model.extend({
    /** @scope XM.ContactInfo.prototype */

    recordType: 'XM.ContactInfo',

    readOnly: true,

    relations: [{
      type: Backbone.HasOne,
      key: 'address',
      relatedModel: 'XM.AddressInfo'
    }, {
      type: Backbone.HasOne,
      key: 'account',
      relatedModel: 'XM.AccountInfo'
    }, {
      type: Backbone.HasOne,
      key: 'owner',
      relatedModel: 'XM.UserAccountInfo'
    }]

  });

  // ..........................................................
  // METHODS
  //

  /**
    @class

    @extends XT.Collection
  */
  XM.HonorificCollection = XT.Collection.extend({
    /** @scope XM.HonorificCollection.prototype */

    model: XM.Honorific

  });

  /**
    @class
  
    @extends XT.Collection
  */
  XM.ContactInfoCollection = XT.Collection.extend({
    /** @scope XM.ContactInfoCollection.prototype */

    model: XM.ContactInfo

  });

}());
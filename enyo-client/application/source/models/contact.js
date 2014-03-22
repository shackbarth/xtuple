/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
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

    nameAttribute: 'code',

    enforceUpperKey: false

  });

  /**
    @class

    @extends XM.Document
  */
  XM.Contact = XM.Document.extend({
    /** @scope XM.Contact.prototype */

    recordType: 'XM.Contact',

    nameAttribute: 'getName',

    numberPolicy: XM.Document.AUTO_NUMBER,

    defaults: function () {
      return {
        isActive: true,
        owner: XM.currentUser
      };
    },

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

    validate: function (attributes, options) {
      if (!attributes.firstName && !attributes.lastName) {
        return XT.Error.clone('xt2004');
      }
      return XM.Document.prototype.validate.apply(this, arguments);
    }

  });

  XM.Contact.used = function (id, options) {
    return XM.ModelMixin.dispatch('XM.Contact', 'used', id, options);
  };

  /**
    @class

    @extends XM.Model
  */
  XM.ContactEmail = XM.Model.extend({
    /** @scope XM.ContactEmail.prototype */

    recordType: 'XM.ContactEmail'

  });

  /**
    @class

    @extends XM.Comment
  */
  XM.ContactComment = XM.Comment.extend({
    /** @scope XM.ContactComment.prototype */

    recordType: 'XM.ContactComment',

    sourceName: 'T'

  });

  /**
    @class

    @extends XM.Characteristic
  */
  XM.ContactCharacteristic = XM.CharacteristicAssignment.extend({
    /** @scope XM.ContactCharacteristic.prototype */

    recordType: 'XM.ContactCharacteristic',

    which: 'isContacts'

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
  XM.ContactUrl = XM.Model.extend({
    /** @scope XM.ContactUrl.prototype */

    recordType: 'XM.ContactUrl',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Info
  */
  XM.ContactRelation = XM.Info.extend({
    /** @scope XM.ContactRelation.prototype */

    recordType: 'XM.ContactRelation',

    editableModel: 'XM.Contact',

    descriptionKey: "jobTitle",

    numberKey: "name"

  });

  /**
    @class

    @extends XM.Info
  */
  XM.ContactListItem = XM.Info.extend({
    /** @scope XM.ContactListItem.prototype */

    recordType: 'XM.ContactListItem',

    editableModel: 'XM.Contact'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ContactListItemCharacteristic = XM.Model.extend({
    /** @scope XM.ContactistItemCharacteristic.prototype */

    recordType: 'XM.ContactListItemCharacteristic'

  });

  // ..........................................................
  // METHODS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.HonorificCollection = XM.Collection.extend(/** @lends XM.HonorificCollection.prototype */{

    model: XM.Honorific

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.ContactListItemCollection = XM.Collection.extend({
    /** @scope XM.ContactListItemCollection.prototype */

    model: XM.ContactListItem

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.ContactRelationCollection = XM.Collection.extend({
    /** @scope XM.ContactRelationCollection.prototype */

    model: XM.ContactRelation

  });

}());

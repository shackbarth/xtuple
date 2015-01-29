/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XM.Honorific = XM.RestModel.extend({

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

    @extends XM.Info
  */
  XM.ContactRelation = XM.Info.extend({
    /** @scope XM.ContactRelation.prototype */

    recordType: 'XM.ContactRelation',

    editableModel: 'XM.Contact',

    descriptionKey: "jobTitle",

    numberKey: "name"

  });

  XT.documentAssociations.T = {
    model: "XM.ContactRelation",
    label: "_contact".loc()
  };

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

  XM.HonorificCollection = XM.RestCollection.extend({

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

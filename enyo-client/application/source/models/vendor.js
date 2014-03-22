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
  XM.VendorType = XM.Document.extend(/** @scope XM.VendorType.prototype */{

    recordType: 'XM.VendorType',

    documentKey: "code"

  });

  /**
    @class

    @extends XM.AccountDocument
  */
  XM.Vendor = XM.AccountDocument.extend(/** @scope XM.Vendor.prototype */{

    recordType: 'XM.Vendor',

    conversionMap: {
      name: "name",
      primaryContact: "contact1",
      secondaryContact: "contact2"
    }

  });

  // ..........................................................
  // CLASS METHODS
  //

  _.extend(XM.Vendor, /** @lends XM.Vendor# */{

    used: function (id, options) {
      return XM.ModelMixin.dispatch('XM.Vendor', 'used', [id], options);
    },

    // ..........................................................
    // CONSTANTS
    //

    INCOTERMS_SITE: "W",

    INCOTERMS_VENDOR: "V"

  });

  /**
    @class

    @extends XM.Comment
  */
  XM.VendorComment = XM.Comment.extend({
    /** @scope XM.VendorComment.prototype */

    recordType: 'XM.VendorComment',

    sourceName: 'V'

  });

  /**
    @class

    @extends XM.CharacteristicAssignment
  */
  XM.VendorCharacteristic = XM.CharacteristicAssignment.extend({
    /** @scope XM.VendorCharacteristic.prototype */

    recordType: 'XM.VendorCharacteristic',

    which: 'isVendors'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.VendorAddress = XM.Model.extend(/** @scope XM.VendorAddress.prototype */{

    recordType: 'XM.VendorAddress'

  });

  /**
    @class

    @extends XM.Info
  */
  XM.VendorAddressRelation = XM.Info.extend(/** @scope XM.VendorAddressRelation.prototype */{

    recordType: 'XM.VendorAddressRelation',

    editableModel: 'XM.VendorAddress'

  });


  /**
    @class

    @extends XM.Info
  */
  XM.VendorRelation = XM.Info.extend(/** @scope XM.VendorRelation.prototype */{

    recordType: 'XM.VendorRelation',

    editableModel: 'XM.Vendor'

  });

  /**
    @class

    @extends XM.Info
  */
  XM.VendorListItem = XM.Info.extend(/** @scope XM.VendorListItem.prototype */{

    recordType: 'XM.VendorListItem',

    editableModel: 'XM.Vendor'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.VendorListItemCharacteristic = XM.Model.extend({
    /** @scope XM.VendorListItemCharacteristic.prototype */

    recordType: 'XM.VendorListItemCharacteristic'

  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.VendorAddressRelationCollection = XM.Collection.extend(/** @lends XM.VendorAddressRelationCollection.prototype */{

    model: XM.VendorAddressRelation

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.VendorRelationCollection = XM.Collection.extend(/** @lends XM.VendorRelationCollection.prototype */{

    model: XM.VendorRelation

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.VendorListItemCollection = XM.Collection.extend(/** @lends XM.VendorListItemCollection.prototype */{

    model: XM.VendorListItem

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.VendorTypeCollection = XM.Collection.extend(/** @lends XM.VendorTypeCollection.prototype */{

    model: XM.VendorType

  });

}());

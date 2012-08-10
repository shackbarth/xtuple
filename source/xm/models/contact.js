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

    defaults: {
      owner: XM.currentUser,
      isActive: true
    },

    // ..........................................................
    // METHODS
    //

    destroy: function () {
      var address = this.get('address');
      if (address.isNew()) { address.releaseNumber(); }
      XM.Document.prototype.destroy.apply(this, arguments);
    },

    initialize: function (attributes, options) {
      XM.Document.prototype.initialize.apply(this, arguments);
      if (options && options.isNew && this.get('address') === null) {
        this.set('address', new XM.AddressInfo(null, {isNew: true}));
      }
    },

    save: function (key, value, options) {
      options = options ? _.clone(options) : {};
      var model = this,
        address = this.get("address"),
        maxUse = this.isNew() ? 1 : 2,
        useCountOptions = {},
        success = options.success,
        isValid = this.isValid();

      // Don't bother with address checks unless valid
      if (isValid) {
        // If the address is empty set it to null
        if (address && address.isEmpty()) {
          if (address.isNew()) { address.releaseNumber(); }
          this.set('address', null);

        // If the address has changed, check to see if used elsewhere
        } else if (address && address.isDirty()) {
          // Define what to do after address check
          useCountOptions.success = function (resp) {
            var error,
              K = XM.Address,
              callback,
              newAddress;
            // If address used then we need to handle that
            if (resp > maxUse) {
              // If no address option passed, then error
              if (!_.isNumber(options.address)) {
                error = XT.Error.clone('xt2007');
                model.trigger('error', model, resp, options);
                return;

              // `CHANGE_ONE` is always the fallback as it's the safest
              } else if (options.address !== K.CHANGE_ALL) {
                // Callback after successfull copy
                // Only proceed when we have both an id and number from the server
                callback = function () {
                  var id = address.id,
                    number = address.get('number');
                  if (id && number) {
                    newAddress.off('change:id change:number', callback);
                    model.set('address', newAddress);
                    XM.Document.prototype.save.call(model, key, value, options);
                    if (success) { success(model, resp, options); }
                  }
                };
                newAddress = address.copy();
                newAddress.on('change:id change:number', callback);
                callback(); // In case the data was here before event handlers could respond
                return;
              }
            }

            // No problem so save the address and original model after that
            options.success = function (resp) {
              XM.Document.prototype.save.call(model, key, value, options);
              if (success) { success(model, resp, options); }
            };
            address.save(options);
          };

          // Perform the check: find out how many places this address is used
          address.useCount(useCountOptions);
        }
      }

      // No problem with address, just save the record
      // If record was invalid, this will bubble up the error
      XM.Document.prototype.save.call(model, key, value, options);
    },

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

    @extends XM.Model
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

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
  XM.TaxClass = XM.Document.extend({
    /** @scope XM.TaxClass.prototype */

    recordType: 'XM.TaxClass',

    documentKey: "code"

  });

  /**
    @class

    @extends XM.Model
  */
  XM.TaxAssignment = XM.Model.extend({
    /** @scope XM.TaxAssignment */

    recordType: 'XM.TaxAssignment',

    name: function () {
      return this.get("tax") &&
        this.get("tax").id + " " + this.get("taxType").id;
    }

  });

  /**
    @class

    @extends XM.AccountDocument
  */
  XM.TaxAuthority = XM.AccountDocument.extend({
    /** @scope XM.TaxAuthority.prototype */

    recordType: 'XM.TaxAuthority',

    documentKey: 'code',

    defaults: function () {
      return {
        currency: XT.baseCurrency()
      };
    }

  });

  XM.TaxAuthority.used = function (id, options) {
    return XM.ModelMixin.dispatch('XM.TaxAuthority', 'used',
      [id], options);
  };

  /**
    @class

    @extends XM.AccountDocument
  */
  XM.TaxAuthorityRelation = XM.Info.extend({
    /** @scope XM.TaxAuthorityRelation.prototype */

    recordType: 'XM.TaxAuthorityRelation',

    editableModel: 'XM.TaxAuthority'

  });

  /**
    @class

    @extends XM.Document
  */
  XM.TaxZone = XM.Document.extend({
    /** @scope XM.TaxZone.prototype */

    recordType: 'XM.TaxZone',

    documentKey: 'code'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.TaxRate = XM.Model.extend({
    /** @scope XM.TaxRate */

    recordType: 'XM.TaxRate',

    defaults: function () {
      return {
        currency: XT.baseCurrency()
      };
    },

    name: function () {
      return this.get("tax") && this.get("tax").id;
    }

  });

  /**
    @class

    @extends XM.Model
  */
  XM.TaxRegistration = XM.Model.extend({
    /** @scope XM.TaxRegistration */

    recordType: 'XM.TaxRegistration'

  });

  /**
    @class

    @extends XM.Document
  */
  XM.TaxCode = XM.Document.extend({
    /** @scope XM.TaxCode.prototype */

    recordType: 'XM.TaxCode',

    documentKey: 'code',

    enforceUpperKey: false

  });

  /**
    @class

    @extends XM.Document
  */
  XM.TaxType = XM.Document.extend({
    /** @scope XM.TaxType.prototype */

    recordType: 'XM.TaxType',

    documentKey: 'name',

    readOnlyAttributes: [
      "isSystem"
    ]

  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.TaxAssignmentCollection = XM.Collection.extend({
    /** @scope XM.TaxAssignmentCollection.prototype */

    model: XM.TaxAssignment

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.TaxAuthorityCollection = XM.Collection.extend({
    /** @scope XM.TaxAuthorityCollection.prototype */

    model: XM.TaxAuthority

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.TaxClassCollection = XM.Collection.extend({
    /** @scope XM.TaxCodeCollection.prototype */

    model: XM.TaxClass

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.TaxCodeCollection = XM.Collection.extend({
    /** @scope XM.TaxCodeCollection.prototype */

    model: XM.TaxCode

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.TaxTypeCollection = XM.Collection.extend({
    /** @scope XM.TaxTypeCollection.prototype */

    model: XM.TaxType

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.TaxRateCollection = XM.Collection.extend({
    /** @scope XM.TaxRateCollection.prototype */

    model: XM.TaxRate

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.TaxZoneCollection = XM.Collection.extend({
    /** @scope XM.TaxZoneCollection.prototype */

    model: XM.TaxZone

  });

}());

/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    Mixin for item classes
  */
  XM.ItemMixin = {

    /**
      Deprecated. Use `formatItemType`.
    */
    getItemTypeString: function () {
      return this.formatItemType();
    },

    /**
    Returns item type as a localized string.

    @returns {String}
    */
    formatItemType: function () {
      var K = XM.Item,
        itemType = this.get('itemType');
      switch (itemType)
      {
      case K.PURCHASED:
        return '_purchased'.loc();
      case K.MANUFACTURED:
        return '_manufactured'.loc();
      case K.PHANTOM:
        return '_phantom'.loc();
      case K.COSTING:
        return '_costing'.loc();
      case K.REFERENCE:
        return '_reference'.loc();
      case K.PLANNING:
        return '_planning'.loc();
      case K.OUTSIDE_PROCESS:
        return '_outsideProcess'.loc();
      case K.TOOLING:
        return '_tooling'.loc();
      case K.KIT:
        return '_kit'.loc();
      case K.BREEDER:
        return '_breeder'.loc();
      case K.CO_PRODUCT:
        return '_coProduct'.loc();
      case K.BY_PRODUCT:
        return '_byProduct'.loc();
      }
      return '_error'.loc();
    },

    /**
      Requests on array of material issue units from the server.

      @param {Object} Options
      @param {Function} [options.success] Callback if request succeeds
      @param {Function} [options.error] Callback if request fails
      @returns {Object} Receiver
    */
    materialIssueUnits: function (options) {
      this.dispatch("XM.Item", "materialIssueUnits", this.id, options);
      return this;
    },

    /**
      Requests an array of selling units from the server.

      @param {Object} Options
      @param {Function} [options.success] Callback if request succeeds
      @param {Function} [options.error] Callback if request fails
      @returns {Object} Receiver
    */
    sellingUnits: function (options) {
      this.dispatch("XM.Item", "sellingUnits", this.id, options);
      return this;
    },

    /**
      Requests a tax type based on a  specified tax zone from the server.

      @param {XM.TaxZone} Tax Zone
      @param {Object} Options
      @param {Function} [options.success] Callback if request succeeds
      @param {Function} [options.error] Callback if request fails
      @returns {Object} Receiver
    */
    taxType: function (taxZone, options) {
      options = options ? options : {};
      var params = [this.id, taxZone ? taxZone.id : null];
      this.dispatch("XM.Item", "taxType", params, options);
      return this;
    },

    /**
      Requests from the server whether a unit of measure is fractional for this item.

      @param {XM.Unit} Unit
      @param {Object} Options
      @param {Function} [options.success] Callback if request succeeds
      @param {Function} [options.error] Callback if request fails
      @returns {Object} Receiver
    */
    unitFractional: function (unit, options) {
      var params =  [this.id, unit.id];
      this.dispatch("XM.Item", "unitFractional", params, options);
      return this;
    },

    /**
      Requests a unit of measure conversion ratio from the server for this item.

      @param {XM.Unit} From Unit
      @param {XM.Unit} To Unit
      @param {Object} Options
      @param {Function} [options.success] Callback if request succeeds
      @param {Function} [options.error] Callback if request fails
      @returns {Object} Receiver
    */
    unitToUnitRatio: function (fromUnit, toUnit, options) {
      var params =  [this.id, fromUnit.id, toUnit.id];
      this.dispatch("XM.Item", "unitToUnitRatio", params, options);
      return this;
    }
  };

  /**
    @class

    @extends XM.Document
  */
  XM.ClassCode = XM.Document.extend({
    /** @scope XM.ClassCode.prototype */

    recordType: 'XM.ClassCode',

    documentKey: 'code',

    enforceUpperKey: false

  });

  /**
    @class

    @extends XM.Document
  */
  XM.FreightClass = XM.Document.extend({
    /** @scope XM.FreightClass.prototype */

    recordType: 'XM.FreightClass',

    documentKey: 'code',

    enforceUpperKey: false

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ItemGroup = XM.Model.extend({
    /** @scope XM.ItemGroup.prototype */

    recordType: 'XM.ItemGroup'

  });

  /**
    @class

    @extends XM.Info
  */
  XM.ItemGroupRelation = XM.Info.extend({
    /** @scope XM.ItemGroupRelation.prototype */

    recordType: 'XM.ItemGroupRelation',

    editableModel: "XM.ItemGroup"

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ItemGroupItem = XM.Model.extend({
    /** @scope XM.ItemGroupItem.prototype */

    recordType: 'XM.ItemGroupItem',

    parentKey: "itemGroup"

  });

  /**
    @class

    @extends XM.Document
  */
  XM.ProductCategory = XM.Document.extend({
    /** @scope XM.ProductCategory.prototype */

    recordType: 'XM.ProductCategory',

    nameAttribute: 'code',

    documentKey: 'code'

  });

  /**
    @class

    @extends XM.Document
  */
  XM.Unit = XM.Document.extend({
    /** @scope XM.Unit.prototype */

    recordType: 'XM.Unit',

    documentKey: 'name',

    defaults: {
      isItemWeight: false
    }

  });

  /** @private */
  var _isSoldDidChange = function () {
    var isNotSold = !(this.get('isSold') || false);
    this.setReadOnly('productCategory', isNotSold);
    this.setReadOnly('priceUnit', isNotSold);
    this.setReadOnly('listPrice', isNotSold);
  };

  /**
    @class

    @extends XM.Document
  */
  XM.Item = XM.Document.extend({
    /** @scope XM.Item.prototype */

    recordType: 'XM.Item',

    nameAttribute: 'number',

    defaults: function () {
      return {
        description1: '',
        description2: '',
        isActive: true,
        isFractional: false,
        isSold: true,
        itemType: XM.Item.PURCHASED,
        listPrice: 0,
        isExclusive: false
      };
    },

    // ..........................................................
    // METHODS
    //

    bindEvents: function () {
      XM.Document.prototype.bindEvents.apply(this, arguments);
      this.on('change:inventoryUnit', this.inventoryUnitDidChange);
      this.on('change:isSold', this.isSoldDidChange);
      this.on('change:itemType', this.itemTypeDidChange);
    },

    inventoryUnitDidChange: function (model, value, options) {
      if (value) { this.set('priceUnit', value); }
    },

    isSoldDidChange: function () {
      if (!(this.get('isSold') || false)) {
        this.unset('productCategory');
        this.set('listPrice', 0);
      }
      _isSoldDidChange.apply(this);
    },

    itemTypeDidChange: function () {
      var K = XM.Item,
        itemType = this.get("itemType"),
        pickList = false,
        sold = false,
        weight = false,
        config = false,
        purchased = false,
        freight   = false;
      this.setReadOnly("configured");
      switch (itemType)
      {
      case K.PURCHASED:
        pickList = true;
        sold = true;
        weight = true;
        purchased = true;
        freight = true;
        break;
      case K.MANUFACTURED:
        pickList = true;
        sold = true;
        weight = true;
        config = true;
        purchased = true;
        freight  = true;
        break;
      case K.BREEDER:
        purchased = true;
        freight  = true;
        break;
      case K.CO_PRODUCT:
        pickList = true;
        sold = true;
        weight = true;
        freight = true;
        break;
      case K.BY_PRODUCT:
        pickList = true;
        sold = true;
        weight = true;
        freight  = true;
        break;
      case K.REFERENCE:
        sold = true;
        weight = true;
        freight  = true;
        config   = true;
        break;
      case K.TOOLING:
        pickList = true;
        weight = true;
        freight = true;
        purchased = true;
        sold = true;
        break;
      case K.OUTSIDE_PROCESS:
        purchased = true;
        freight  = true;
        break;
      case K.KIT:
        sold = true;
        weight   = true;
        this.set("isFractional", false);
      }
      this.setReadOnly("isFractional", itemType === K.KIT);
      //TODO: Set unit conversions read only if kit

      this.setReadOnly("isConfigured", !config);
      if (!config) { this.set("isConfigured", false); }

      this.set("isPicklist", pickList);
      this.setReadOnly("isPicklist", !pickList);

      this.set("isSold", sold);

      this.setReadOnly("productWeight", !weight);
      this.setReadOnly("packageWeight", !weight);

      this.setReadOnly("freightClass", !freight);

      // TODO: if not purchased or privs, set sources to read only
      // privs = ViewItemSources or MaintainItemSources

      // TODO: Check inventory situation if changing to non-inventory type
    },

    statusDidChange: function () {
      var K = XM.Model;
      if (this.getStatus() === K.READY_CLEAN) {
        this.setReadOnly('number');
        this.setReadOnly('inventoryUnit');
        _isSoldDidChange.apply(this);
      }
    },

    validate: function () {
      var isSold = this.get('isSold'),
        productCategory = this.get('productCategory');
      if (isSold && !productCategory) {
        return XT.Error.clone('xt2005');
      }
      return XM.Document.prototype.validate.apply(this, arguments);
    }

  });

  // Add in item mixin
  XM.Item = XM.Item.extend(XM.ItemMixin);


  _.extend(XM.Item, {
    /** @scope XM.Item */

    /**
      Reference item.

      @static
      @constant
      @type String
      @default R
    */
    REFERENCE: 'R',

    /**
      Manufactured item.

      @static
      @constant
      @type String
      @default M
    */
    MANUFACTURED: 'M',

    /**
      Purchased item

      @static
      @constant
      @type String
      @default P
    */
    PURCHASED: 'P',

    /**
      Tooling item.

      @static
      @constant
      @type String
      @default T
    */
    TOOLING: 'T',

    /**
      Phantom item.

      @static
      @constant
      @type String
      @default F
    */
    PHANTOM: 'F',

    /**
      Costing item.

      @static
      @constant
      @type String
      @default S
    */
    COSTING: 'S',

    /**
      Outside process item.

      @static
      @constant
      @type String
      @default O
    */
    OUTSIDE_PROCESS: 'O',

    /**
      Planning item.

      @static
      @constant
      @type String
      @default L
    */
    PLANNING: 'L',

    /**
      Kit item.

      @static
      @constant
      @type String
      @default K
    */
    KIT: 'K',

    /**
      Outside process item.

      @static
      @constant
      @type String
      @default O
    */
    BREEDER: 'B',

    /**
      Co-product.

      @static
      @constant
      @type String
      @default C
    */
    CO_PRODUCT: 'C',

    /**
      By-product.

      @static
      @constant
      @type String
      @default Y
    */
    BY_PRODUCT: 'Y'

  });

  /**
    @class

    @extends XM.Info
  */
  XM.ItemListItem = XM.Info.extend({
    /** @scope XM.ItemListItem.prototype */

    recordType: 'XM.ItemListItem',

    editableModel: 'XM.Item'

  });

  XM.ItemListItem = XM.ItemListItem.extend(XM.ItemMixin);

  /**
    @class

    @extends XM.Characteristic
  */
  XM.ItemListItemCharacteristic = XM.CharacteristicAssignment.extend({
    /** @scope XM.ItemListItmeCharacteristic.prototype */

    recordType: 'XM.ItemListItemCharacteristic',

    which: "isItems"

  });

  /**
    @class

    @extends XM.Comment
  */
  XM.ItemComment = XM.Comment.extend({
    /** @scope XM.ItemComment.prototype */

    recordType: 'XM.ItemComment',

    sourceName: 'I'

  });

  /**
    @class

    @extends XM.Characteristic
  */
  XM.ItemCharacteristic = XM.CharacteristicAssignment.extend({
    /** @scope XM.ItemCharacteristic.prototype */

    recordType: 'XM.ItemCharacteristic',

    which: 'isItems'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ItemItemSiteRelation = XM.Model.extend({
    /** @scope XM.ItemItemSiteRelation.prototype */

    recordType: 'XM.ItemItemSiteRelation',

    editableModel: 'XM.ItemSite'

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ItemAlias = XM.Model.extend({
    /** @scope XM.ItemAlias.prototype */

    recordType: 'XM.ItemAlias',

    defaults: {
      useDescription: false
    },

    bindEvents: function () {
      XM.Model.prototype.bindEvents.apply(this, arguments);
      this.on('change:useDescription', this.useDescriptionDidChange);

      this.useDescriptionDidChange();
    },

    useDescriptionDidChange: function () {
      var noDescription = !this.get("useDescription");

      // clear out the description if we don't use it
      if (noDescription) {
        this.set({
          description1: "",
          description2: ""
        });
      }
      this.setReadOnly(
        ["description1", "description2"],
        noDescription
      );
    }

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ItemRelationAlias = XM.Model.extend({
    /** @scope XM.ItemRelationAlias.prototype */

    recordType: 'XM.ItemRelationAlias',

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ItemAccount = XM.Model.extend({
    /** @scope XM.ItemAccount.prototype */

    recordType: 'XM.ItemAccount',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ItemContact = XM.Model.extend({
    /** @scope XM.ItemContact.prototype */

    recordType: 'XM.ItemContact',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ItemItem = XM.Model.extend({
    /** @scope XM.ItemItem.prototype */

    recordType: 'XM.ItemItem',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ItemFile = XM.Model.extend({
    /** @scope XM.ItemFile.prototype */

    recordType: 'XM.ItemFile',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ItemUrl = XM.Model.extend({
    /** @scope XM.ItemUrl.prototype */

    recordType: 'XM.ItemUrl',

    isDocumentAssignment: true

  });

  /**
    @class

    @extends XM.Model
  */
  XM.ItemRelation = XM.Info.extend({
    /** @scope XM.ItemRelatino.prototype */

    recordType: 'XM.ItemRelation',

    editableModel: 'XM.Item',

    descriptionKey: 'description1'

  });

  // Add in item mixin
  XM.ItemRelation = XM.ItemRelation.extend(XM.ItemMixin);

  /**
    @class

    @extends XM.Characteristic
  */
  XM.ItemRelationCharacteristic = XM.CharacteristicAssignment.extend({
    /** @scope XM.ItemRelationCharacteristic.prototype */

    recordType: 'XM.ItemRelationCharacteristic',

    which: 'isItems'

  });

  // ..........................................................
  // COLLECTIONS
  //

  /**
   @class

   @extends XM.Collection
  */
  XM.ClassCodeCollection = XM.Collection.extend({
   /** @scope XM.ClassCodeCollection.prototype */

    model: XM.ClassCode

  });

  /**
   @class

   @extends XM.Collection
  */
  XM.FreightClassCollection = XM.Collection.extend({
   /** @scope XM.FreightClassCollection.prototype */

    model: XM.FreightClass

  });

  /**
   @class

   @extends XM.Collection
  */
  XM.ItemGroupRelationCollection = XM.Collection.extend({
   /** @scope XM.ItemGroupRelationCollection.prototype */

    model: XM.ItemGroupRelation

  });

  /**
   @class

   @extends XM.Collection
  */
  XM.ProductCategoryCollection = XM.Collection.extend({
   /** @scope XM.ProductCategoryCollection.prototype */

    model: XM.ProductCategory

  });

  /**
   @class

   @extends XM.Collection
  */
  XM.UnitCollection = XM.Collection.extend({
   /** @scope XM.UnitCollection.prototype */

    model: XM.Unit

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.ItemListItemCollection = XM.Collection.extend({
    /** @scope XM.ItemListItemCollection.prototype */

    model: XM.ItemListItem

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.ItemRelationCollection = XM.Collection.extend({
    /** @scope XM.ItemRelationCollection.prototype */

    model: XM.ItemRelation

  });

  /**
    @class

    @extends XM.Collection
  */
  XM.ItemItemSiteRelationCollection = XM.Collection.extend({
    /** @scope XM.ItemItemSiteRelationCollection.prototype */

    model: XM.ItemItemSiteRelation

  });

}());

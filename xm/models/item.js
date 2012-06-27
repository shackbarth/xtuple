/*jshint trailing:true, white:true, indent:2, strict:true, curly:true, plusplus:true
  immed:true, eqeqeq:true, forin:true, latedef:true, newcap:true, noarg:true, undef:true */
/*jslint bitwise: true, nomen: true, indent:2 */
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class

    @extends XM.Document
  */
  XM.ClassCode = XM.Document.extend({
    /** @scope XM.ClassCode.prototype */

    recordType: 'XM.ClassCode',
    
    documentKey: 'code',
    
    enforceUpperKey: false,
    
    privileges: {
      "all": {
        "create": "MaintainClassCodes",
        "read": true,
        "update": "MaintainClassCodes",
        "delete": "MaintainClassCodes"
      }
    }

  });
  
  /**
    @class

    @extends XM.Document
  */
  XM.ProductCategory = XM.Document.extend({
    /** @scope XM.ProductCategory.prototype */

    recordType: 'XM.ProductCategory',
    
    documentKey: 'code',
    
    privileges: {
      "all": {
        "create": "MaintainProductCategories",
        "read": true,
        "update": "MaintainProductCategories",
        "delete": "MaintainProductCategories"
      }
    }

  });
  
  /**
    @instance
    
    Dummy product category for setting -1 values.
  */
  XM.emptyProductCategory = new XM.ProductCategory({
    /** @scope XM.emptyProductCategory */
    guid: -1,
    code: 'EMPTY',
    description: 'Use for indicating no product category'
  });
  
  /**
    @class

    @extends XM.Document
  */
  XM.Unit = XM.Document.extend({
    /** @scope XM.Unit.prototype */

    recordType: 'XM.Unit',
    
    documentKey: 'name',
    
    privileges: {
      "all": {
        "create": "MaintainUOMs",
        "read": true,
        "update": "MaintainUOMs",
        "delete": "MaintainUOMs"
      }
    },
    
    defaults: {
      isWeight: false
    },
    
    requiredAttributes: [
      "isWeight"
    ]

  });

  /**
    @class

    @extends XM.Document
  */
  XM.Item = XM.Document.extend({
    /** @scope XM.Item.prototype */

    recordType: 'XM.Item',
    
    privileges: {
      "all": {
        "create": "MaintainItemMasters",
        "read": "ViewItemMasters",
        "update": "MaintainItemMasters",
        "delete": "MaintainItemMasters"
      }
    },
    
    defaults: function () {
      return {
        description1: '',
        description2: '',
        isActive: true,
        isFractional: false,
        isSold: true,
        listPrice: 0,
        productCategory: XM.emptyProductCategory
      };
    },
    
    requiredAttributes: [
      "classCode",
      "description1",
      "description2",
      "inventoryUnit",
      "isActive",
      "isFractional",
      "isSold",
      "listPrice",
      "priceUnit",
      "productCategory"
    ],
    
    relations: [{
      type: Backbone.HasOne,
      key: 'classCode',
      relatedModel: 'XM.ClassCode',
      includeInJSON: 'guid'
    }, {
      type: Backbone.HasOne,
      key: 'inventoryUnit',
      relatedModel: 'XM.Unit',
      includeInJSON: 'guid'
    }, {
      type: Backbone.HasOne,
      key: 'productCategory',
      relatedModel: 'XM.ProductCategory',
      includeInJSON: 'guid'
    }, {
      type: Backbone.HasOne,
      key: 'priceUnit',
      relatedModel: 'XM.Unit',
      includeInJSON: 'guid'
    }, {
      type: Backbone.HasMany,
      key: 'comments',
      relatedModel: 'XM.ItemComment',
      reverseRelation: {
        key: 'item'
      }
    }, {
      type: Backbone.HasMany,
      key: 'characteristics',
      relatedModel: 'XM.ItemCharacteristic',
      reverseRelation: {
        key: 'item'
      }
    }, {
      type: Backbone.HasMany,
      key: 'accounts',
      relatedModel: 'XM.ItemAccount',
      reverseRelation: {
        key: 'item'
      }
    }, {
      type: Backbone.HasMany,
      key: 'contacts',
      relatedModel: 'XM.ItemContact',
      reverseRelation: {
        key: 'item'
      }
    }, {
      type: Backbone.HasMany,
      key: 'items',
      relatedModel: 'XM.ItemItem',
      reverseRelation: {
        key: 'item'
      }
    }, {
      type: Backbone.HasMany,
      key: 'files',
      relatedModel: 'XM.ItemFile',
      reverseRelation: {
        key: 'item'
      }
    }, {
      type: Backbone.HasMany,
      key: 'images',
      relatedModel: 'XM.ItemImage',
      reverseRelation: {
        key: 'item'
      }
    }, {
      type: Backbone.HasMany,
      key: 'urls',
      relatedModel: 'XM.ItemUrl',
      reverseRelation: {
        key: 'item'
      }
    }],
 
    // ..........................................................
    // METHODS
    //
     
    initialize: function () {
      XM.Document.prototype.initialize.apply(this, arguments);
      this.on('change:inventoryUnit', this.inventoryUnitDidChange);
      this.on('change:isSold', this.isSoldDidChange);
      this.on('statusChange', this.isSoldDidChange);
    },
    
    inventoryUnitDidChange: function (model, value, options) {
      var status = this.getStatus(),
        K = XT.Model;
      if (options && options.force || !(status & K.READY)) { return; }
      if (value) { this.set('priceUnit', value); }
    },
 
    isSoldDidChange: function (model, value, options) {
      var K = XT.Model,
        isNotSold = !(this.get('isSold') || false);
      if (this.getStatus() & K.READY) {
        this.setReadOnly('productCategory', isNotSold);
        this.setReadOnly('priceUnit', isNotSold);
        this.setReadOnly('listPrice', isNotSold);
      }
    },
    
    statusDidChange: function () {
      var K = XT.Model;
      if (this.getStatus() === K.READY_CLEAN) {
        this.setReadOnly('number');
        this.setReadOnly('inventoryUnit');
      }
    },
    
    validateSave: function () {
      var isSold = this.get('isSold'),
        productCategory = this.get('productCategory');
      if (isSold && (productCategory.id || -1) === -1) {
        return "_productCategoryRequiredOnSold".loc();
      }
    }

  });
  
  /**
    @class
  
    @extends XM.Comment
  */
  XM.ItemComment = XM.Comment.extend({
    /** @scope XM.ItemComment.prototype */

    recordType: 'XM.ItemComment'

  });
  
  /**
    @class
  
    @extends XM.Characteristic
  */
  XM.ItemCharacteristic = XM.Characteristic.extend({
    /** @scope XM.ItemCharacteristic.prototype */

    recordType: 'XM.ItemCharacteristic'

  });

  /**
    @class
  
    @extends XT.Model
  */
  XM.ItemAccount = XT.Model.extend({
    /** @scope XM.ItemAccount.prototype */

    recordType: 'XM.ItemAccount',

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
  XM.ItemContact = XT.Model.extend({
    /** @scope XM.ItemContact.prototype */

    recordType: 'XM.ItemContact',

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
  XM.ItemItem = XT.Model.extend({
    /** @scope XM.ItemItem.prototype */

    recordType: 'XM.ItemItem',

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
  XM.ItemFile = XT.Model.extend({
    /** @scope XM.ItemFile.prototype */

    recordType: 'XM.ItemFile',

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
  XM.ItemImage = XT.Model.extend({
    /** @scope XM.ItemImage.prototype */

    recordType: 'XM.ItemImage',

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
  XM.ItemUrl = XT.Model.extend({
    /** @scope XM.ItemUrl.prototype */

    recordType: 'XM.ItemUrl',

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
  XM.ItemInfo = XT.Model.extend({
    /** @scope XM.ItemInfo.prototype */

    recordType: 'XM.ItemInfo',
    
    readOnly: true

  });
  
  // ..........................................................
  // COLLECTIONS
  //
 
  /**
   @class

   @extends XT.Collection
  */
  XM.ClassCodeCollection = XT.Collection.extend({
   /** @scope XM.ClassCodeCollection.prototype */

    model: XM.ClassCode

  });

  /**
   @class

   @extends XT.Collection
  */
  XM.ProductCategoryCollection = XT.Collection.extend({
   /** @scope XM.ProductCategoryCollection.prototype */

    model: XM.ProductCategory

  });
  
  /**
   @class

   @extends XT.Collection
  */
  XM.UnitCollection = XT.Collection.extend({
   /** @scope XM.UnitCollection.prototype */

    model: XM.Unit

  });
  
  /**
    @class
  
    @extends XT.Collection
  */
  XM.ItemInfoCollection = XT.Collection.extend({
    /** @scope XM.ItemInfoCollection.prototype */

    model: XM.ItemInfo

  });

}());

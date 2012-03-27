// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('packages/xtuple/__core__/item/mixins/_item');
sc_require('mixins/crm_documents');

/**
  @class

  @extends XM._Item
  @extends XM.CrmDocuments
  @extends XM.CoreDocuments
  @extends XM.Document
*/
XM.Item = XM.Document.extend(XM._Item, XM.CoreDocuments, XM.CrmDocuments,
  /** @scope XM.Item.prototype */ {

  // .................................................
  // CALCULATED PROPERTIES
  //

  number: SC.Record.attr(Number, {
   toType: function(record, key, value) {
    if(value) return value.toUpperCase();
   }
  }),
  unitAvailableTypes: function(){
    var unitType = this.get('unitType'),
        fromUnit = this.get('fromUnit'), //LB
        toUnit = this.get('toUnit'), //EA
        multiple = this.get('multiple'); //Bool flag true for selling than false for cap, alt cap and material issue
    if(multiple === true) { //Look at itemuomtouom function in public on postgresql
      //check to see if multiple if they have the type push in
      //selling(guid 1), capacity(2), altcapacity(3), materialissue(4) 
      //selling can be used multiple time but 2,3,4 can only be used once per item of given unit type
       this.set('value'),
       return;
    }else if(multiple === false){
      this.set('value'),
      return;
    }
  },
  itemTaxTypes: function() {
    var itemTaxType = this.get('itemTaxType'),
        itemTaxZone = this.get('itemTaxZone'),
    if(itemTaxZone) {
      // item_tax 
      // item_tax_recoverable sets a true flag when a new item is created in the parent | make sure to update the orm to pull this in 
      return;
    }
  },

  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //
  _xm_unitSelectedTypeDidChange: function(){
    var status = this.get('status'),
        toUnit = this.get('toUnit');
    if(status & SC.Record.READY) {
      //if selected type is removed reevaluate the selected values and send to Available types
    }
  }.observes('toUnit'),
  _xm_itemUnitDidChange: function() {
    if(this.get('status') === SC.Record.READY_CLEAN) {
      this.item.set('isEditable', false);
    }
  },//.observes('status')
  _xm_itemInventoryConversionDidChange: function() {
    var status = this.get('status'),
        inventoryUnit = this.get('inventoryUnit');
    if(status & SC.Record.READY) {
         this.set('priceUnit', this.get('inventoryUnit'));       
    }
  }.observes('inventoryUnit'),
  _xm_itemTypeDidChange: function() {
   var status = this.get('status'),
       itemType = this.get('itemType'),
       isPickList = false,
       isSold = false,
       weight = false,
       config = false,
       shipUOM = false,
       capUOM = false,
       planType = false,
       purchased = false,
       freight = false;
   if(status & SC.Record.READY) {
    switch(itemType) {
    case "P" :
    case "M" :
     this.set('isPicklist', true),
     this.set('isSold', true),
     this.set('weight', true),
     this.set('config', true),
     this.set('shipUOM', true),
     this.set('capUOM', true),
     this.set('planType', true),
     this.set('purchased', true),
     this.set('freight', true);
    break;
    case "F" : 
     this.set('planType', true);
    break;
    case "B" :
     this.set('capUOM', true),
     this.set('planType', true),
     this.set('purchased', true),
     this.set('freight', true);
    break;
    case "C" :
    case "Y" :
     this.set('isPicklist', true),
     this.set('isSold', true),
     this.set('weight', true),
     this.set('capUOM', true),
     this.set('shipUOM', true),
     this.set('planType', true),
     this.set('freight', true);
    break;
    case "R" :
     this.set('isSold', true),
     this.set('weight', true),
     this.set('capUOM', true),
     this.set('shipUOM', true),
     this.set('freight', true),
     this.set('config', true);
    break;
    case "T" :
     this.set('isPicklist', true),
     this.set('weight', true),
     this.set('capUOM', true),
     this.set('shipUOM', true),
     this.set('freight', true),
     this.set('purchased', true),
     this.set('isSold', true);
    break;
    case "O" :
     this.set('capUOM', true),
     this.set('planType', true),
     this.set('purchased', true), 
     this.set('freight', true);
    break;
    case "A" :
     this.set('isSold', true),
     this.set('planType', true),
     this.set('freight', true);
    break;
    case "K" :
     this.set('isSold', true),
     this.set('weight', true);
    break;
    }
  }
  }.observes('itemType'),
});

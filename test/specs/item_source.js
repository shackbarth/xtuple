/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XV:true, XT:true, _:true, console:true, XM:true, Backbone:true, require:true, assert:true,
setTimeout:true, before:true, clearTimeout:true, exports:true, it:true, describe:true,
 beforeEach:true */

(function () {
  "use strict";
 /**
    Item Sources identify the relationship between Items and the Vendors who supply them
    @class
    @alias ItemSource
    @property {String} id
    @property {String} uuid [is the idAttribute]
    @property {Item} item [required] (Enter the Item Number of the Purchase Item you want to create a Purchase Order for.)
    @property {Vendor} vendor [required] (Enter the Vendor Number of the Vendor who is the source for the specified Item.)
    @property {String} isActive [required] (Identifies whether the Item is currently active.)
    @property {Boolean} isDefault [required] (Select this option to distinguish an Item Source from other Item Sources for the same Item Number. If selected, the default Item Source will be selected automatically when releasing Purchase Requests or creating drop shipments. If no default Item Source is specified, users will be asked to select Item Sources from a list of available Item Sources when releasing Purchase Requests or creating drop shipments. When this option is selected and saved, any other Item Sources for the Item flagged as the default will be unchecked.)
    @property {String} vendorItemNumber [required] (Enter the Item Number the Vendor uses to identify the Item.)
    @property {String} vendorItemDescription (Enter the item number description the vendor uses to identify the basic type of item)
    @property {Unit} vendorUnit [required] (Enter the Unit of Measure the Vendor uses for the specified Item.)
    @property {String} vendorUnitRatio [required] (Specify the ratio between Inventory and Vendor Units of Measure UOM. For example, if you store an Item in single units, but a Vendor sells you the Item in cases of 12, then you would enter '12' here to represent the 12:1 Inv./Vend. ratio. If the ratio is 1:1, then enter '1' here. When an Inv./Vend. ratio is specified, the system allows you to purchase Items using the Vendor's UOM; however, when the Items are received, the system will automatically convert the Inventory to your Inventory UOM. This same conversion logic flows throughout the system—whether you are viewing Inventory availability or running Material Requirements Planning 'MRP'. Your Inventory will always be represented in your Inventory UOM, regardless of the Vendor UOMs specified on any open Purchase Orders.)
    @property {String} notes (This is a scrolling text field with word-wrapping for entering Notes related to the Item Source.)
    @property {String} minimumOrderQuantity (Indicate the minimum Order allowed for the specified Item. A warning message will be shown if a Purchase Order Line Item falls below the minimum Order value entered here.)
    @property {String} multipleOrderQuantity (Value entered indicates the quantity multiple that Orders for this Item must use. A warning message will be shown if a Purchase Order Line Item does not conform to the Order multiple entered here.)
    @property {String} leadTime [required] default to '0' (Specify the lead time for the Vendor Item using the arrow buttons, or manually enter a value up to a maximum of 99. Specifies the Lead Time the Vendor requires to supply the specified Item, measured in days.)
    @property {Date} earliestDate (Possible date of delivery for the ordered item)
    @property {String} ranking [required] (Specify the Vendor's rank using the arrow buttons, or manually enter a value up to a maximum of 9. The ranking of a Vendor is used to identify the relative merits of Item Sources when releasing Purchase Requests. If a purchased Item has multiple Item Sources, you may select from a list of available Item Sources when releasing a Purchase Request. The Item Sources will be listed in descending order by Vendor ranking.)
    @property {String} manufacturerName (Name of the Manufacturer who creates the Item.)
    @property {String} manufacturerItemNumber (Item Number used by Manufacturer who creates the Item.)
    @property {String} manufacturerItemDescription (Description used by the Manufacturer who creates the Item.)
    @property {String} barcode (Enter the Bar Code for the Item. Note: Standard bar code formats supported by the system include the following: Code 3of9, Code 3of9 Extended,Code 128, UPC-A, UPC-E, EAN-8, EAN-13.)
    @property {Date} effective [required](ItemSource prices will be effective from the given date.)
    @property {Date} expires [required] (ItemSource prices will be expired after the given date.)
    @property {Money} prices [required, read only] (Display lists Item Source Prices for the specified Item Source.)
    
    */
  var spec = {
      recordType: "XM.ItemSource",
      skipSmoke: true,
      skipCrud: true,
      enforceUpperKey: false,
    /**
      @member Other
      @memberof ItemSource
      @description The Item Source Collection is not cached.
    */
      collectionType: "XM.ItemSourceCollection",
      listKind: "XV.ItemSourceList",
      instanceOf: "XM.Model",
      cacheName: null,
    /**
      @member Settings
      @memberof ItemSource
      @description ItemSource is lockable.
    */
      isLockable: true,
    /**
      @member Settings
      @memberof ItemSource
      @description The ID attribute is "uuid"
    */
      attributes: ["id", "uuid", "item", "vendor", "isActive", "isDefault", "vendorItemNumber",
                   "vendorItemDescription", "vendorUnit", "vendorUnitRatio", "notes",
                   "minimumOrderQuantity", "multipleOrderQuantity", "leadTime", "earliestDate",
                   "ranking", "manufacturerName", "manufacturerItemNumber",
                   "manufacturerItemDescription", "barcode", "effective", "expires", "prices"
                   ],
      requiredAttributes: ["isActive", "isDefault", "vendorItemNumber", "vendorUnit",
                           "vendorUnitRatio", "leadTime", "ranking", "effective",
                           "expires", "item", "vendor", "uuid"],
      idAttribute: "uuid",
    /**
      @member Setup
      @memberof ItemSource
      @description Used in purchasing module
    */
      extensions: ["purchasing"],
       /**
      @member Privileges
      @memberof ItemSource
      @description Users can create, update, and delete ItemSource if they have the
      'MaintainItemSources' privilege.
    */
      privileges: {
        createUpdateDelete: ["ViewItemSources", "MaintainItemSources", "ViewPurchaseOrders"],
        read: true
      }
      
    };
  var additionalTests =  function () {
    /**
      @member Buttons
      @memberof ItemSource
      @description Vendor panel should exist to display the item information linked to the vendor
     */
      it.skip("Vendor panel should exist to display the item information linked to the vendor", function () {
      });
    /**
      @member Buttons
      @memberof ItemSource
      @description Prices panel should exist to display pricing information of the item for selected vendor
     */
      it.skip("Prices panel should exist to display the pricing information of the item for the selected vendor", function () {
      });
      /**
      @member Navigation
      @memberof ItemSource
      @description An Action gear exists in the 'ItemSources' work space  with following options:
      'Delete' option where the user has MaintainItemSources privilege
     */
      it.skip("Action gear should exist in the ItemSources work space with 'Delete' option if" +
      "there is no Purchase Order linked to it and if the user has" +
      "'MaintainItemSources privilege'", function () {
      });
      /**
      @member Navigation
      @memberof ItemSource
      @description An Action gear exists in the 'ItemSources' work space with no 'Delete' option
      if the selected item source has purchase order linked to it
     */
      it.skip("Action gear should exist in the ItemSources work space without 'Delete' option if" +
      "there is a purchase order linked to the selected ItemSource", function () {
      });
     /**
      @member Settings
      @memberof ItemSource
      @description Marking 'Default' in the item source should use the item source in creating purchase order for the selected item-vendor combination
      
     */
      it.skip("Marking 'Default' in the item source should use the item source in creating a purchase order for the selected item-vendor combination", function () {
      });
     /**
      @member Settings
      @memberof ItemSource
      @description Unchecking 'Active' checkbox in the 'ItemSource' screen should de-activate the selected item source
      
     */
      it.skip("Unchecking the 'Active' checkbox in the 'ItemSource' should de-activate the item source ", function () {
      });
    /**
      @member Buttons
      @memberof ItemSource
      @description 'New' button in the 'Prices' panel should be in de-activated state if no vendor is selected in the ItemSource screen
     */
      it.skip("'New' button in the 'Prices' panel should be inactive if vendor is not selected in the itemsource", function () {
      });
        /**
      @member Buttons
      @memberof ItemSource
      @description 'Delete','<','>' and 'Done' buttons should be in disabled mode if no price is selected in the 'Prices' panel of the selected item source
     */
      it.skip("'Delete','<','>' and 'Done' buttons should be in disabled mode if no price is selected in the 'Prices' panel of the selected item source", function () {
      });
      /**
      @member Other
      @memberof ItemSource
      @description Negative values should not be allowed in 'Quantity Break' field
     */
      it.skip("User should not allow to enter negative values in 'Quantity Break' field of the 'Prices' panel ", function () {
      });
   
      /**
      @member Other
      @memberof ItemSource
      @description User should not allow to enter negative values in the 'Price' field of 'Prices' panel
     */
      it.skip("User should not allow to enter negative values in 'Price' field of 'Prices' panel", function () {
      });
     /**
      @member Other
      @memberof ItemSource
      @description Currency should be displayed in the 'Prices' panel according to the 'Vendor' selected in 'OverView' panel of the ItemSource
     */
      it.skip("Currency should be displayed in 'Prices' panel according to the 'Vendor' selected in 'OverView' panel of the ItemSource", function () {
      });
      /**
      @member Other
      @memberof ItemSource
      @description 'Site' drop down in the Prices panel should display the available sites in the database
     */
      it.skip("'Site' drop down in the 'Prices' panel should display the available sites in the database", function () {
      });
      /**
      @member Other
      @memberof ItemSource
      @description 'Price Type' drop down of the 'Prices' panel should display the available Price Types
     */
      it.skip("'Price Type' drop down of the 'Prices' panel should display the available Price Types(Nominal,Discount)", function () {
      });
      /**
      @member Other
      @memberof ItemSource
      @description 'Price' drop down of the 'Prices' panel should display the available Currencies in the database and selecting non-base currency should convert the price to bases currency according to the Exchange specified
     */
      it.skip("'Price' drop down of the 'Prices' panel should display the available Currencies in the database and selecting non-base currency should convert the price to bases currency according to the Exchange specified", function () {
      });
    };
  exports.spec = spec;
  exports.additionalTests = additionalTests;

}());
    

/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true,
white:true, strict:false*/
/*global enyo:true, XT:true, XV:true, Globalize:true, XM:true */

(function () {

  XT.extensions.purchasing.initPickers = function () {

    // ..........................................................
    // ITEM SOURCE PRICE TYPE
    //

    enyo.kind({
      name: "XV.ItemSourcePriceTypePicker",
      kind: "XV.PickerWidget",
      collection: "XM.itemSourcePriceTypes",
      valueAttribute: "id",
      showNone: false
    });

    // ..........................................................
    // PURCHASE EMAIL PROFILE
    //

    enyo.kind({
      name: "XV.PurchaseEmailProfilePicker",
      kind: "XV.PickerWidget",
      label: "_emailProfile".loc(),
      collection: "XM.purchaseEmailProfiles"
    });

    // ..........................................................
    // PURCHASE ORDER STATUS
    //

    enyo.kind({
      name: "XV.PurchaseOrderStatusPicker",
      kind: "XV.PickerWidget",
      collection: "XM.purchaseOrderStatuses",
      showNone: false
    });

    // ..........................................................
    // PURCHASE ORDER WORKFLOW TYPE
    //

    enyo.kind({
      name: "XV.PurchaseOrderWorkflowTypePicker",
      kind: "XV.PickerWidget",
      collection: "XM.purchaseOrderWorkflowTypes",
      valueAttribute: "id",
      showNone: false
    });

    // ..........................................................
    // PURCHASE TYPE
    //

    enyo.kind({
      name: "XV.PurchaseTypePicker",
      kind: "XV.PickerWidget",
      collection: "XM.purchaseTypes",
      nameAttribute: "code"
    });

  };

}());

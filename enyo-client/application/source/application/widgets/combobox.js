/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XV:true, Globalize:true, enyo:true, _:true */

(function () {
  
// ..........................................................
// HONORIFIC
//

  /**
    @class A combobox backed by the XM.honorifics collection.
    @name XV.HonorificCombobox
    @extends XV.Combobox
   */
  enyo.kind(/** @lends XV.HonorificCombobox# */{
    name: "XV.HonorificCombobox",
    kind: "XV.ComboboxWidget",
    keyAttribute: "code",
    label: "_honorific".loc(),
    collection: "XM.honorifics"
  });

  
  // ..........................................................
  // SHIP VIA
  //

  enyo.kind({
    name: "XV.ShipViaCombobox",
    kind: "XV.ComboboxWidget",
    collection: "XM.shipVias",
    label: "_shipVia".loc(),
    keyAttribute: "code"
  });
  
}());
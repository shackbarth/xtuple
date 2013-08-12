/*jshint node:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XM:true, enyo:true, _:true */

(function () {

  // ..........................................................
  // CONTROL METHOD
  //

  enyo.kind({
    name: "XV.ControlMethodPicker",
    kind: "XV.PickerWidget",
    collection: "XM.controlMethod",
    nameAttribute: "controlMethod",
    showNone: false,
    orderBy: [
      {attribute: 'controlMethod'}
    ]
  });

}());

/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XM:true, enyo:true, _:true */

(function () {

  // ..........................................................
  // DATABASE SERVER
  //

  enyo.kind({
    name: "XV.DatabaseServerWidget",
    kind: "XV.PickerWidget",
    collection: "XM.databaseServers",
    idAttribute: "name",
    orderBy: [
      {attribute: 'name'}
    ]
  });

}());

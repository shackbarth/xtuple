/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, enyo:true*/

(function () {

  enyo.kind({
    name: "XV.Setup",
    kind: "XV.Module",
    label: "_setup".loc(),
    lists: [
      {name: "honorificList", kind: "XV.HonorificList"},
      {name: "stateList", kind: "XV.StateList"},
      {name: "countryList", kind: "XV.CountryList"},
    ]
  });

}());

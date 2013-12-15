/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, _:true, window: true, enyo:true, nv:true, d3:true, console:true */

(function () {

  XT.extensions.crm.initParameterWidgets = function () {

    // ..........................................................
    // ACTIVITY
    //

    XV.ActivityListParameters.prototype.activityTypes.crm = [
      {type: "Incident"},
      {type: "Opportunity", label: "_opportunities".loc()},
      {type: "ToDo", label: "_toDo".loc()}
    ];

  };

}());

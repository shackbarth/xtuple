/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true,
white:true*/
/*global enyo:true, XM:true, XV:true, XT:true */

/** @module XV */

(function () {

  XT.extensions.inventory.initAssignmentBox = function () {

    //
    // ITEMSITE RESTRICTED LOCATIONS
    //

    enyo.kind(
      /* @lends XV.ItemSiteRestrictedLocationAssignmentBox */{
      name: "XV.ItemSiteRestrictedLocationAssignmentBox",
      kind: "XV.AssignmentBox",
      segments: ["locations".loc()],
      translateLabels: false,
      nameAttribute: "format",
      totalCollectionName: "XM.LocationCollection",
      type: "itemSite",
      getAssignmentModel: function (itemSite) {
        return new XM.ItemSiteLocation({
          itemSite: itemSite
        }, {isNew: true});
      }
    });

  }

}());

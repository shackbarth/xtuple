/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true,
white:true*/
/*global enyo:true, XT:true */

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
      modelName: "XM.ItemSiteLocation",
      totalCollectionName: "XM.LocationRelationCollection",
      type: "location",
      published: {
        site: null
      },
      fetch: function () {
        // Only run this if we have site information
        var site = this.getSite();
        if (site) {
          this.inherited(arguments);
        }
      },
      queryChanged: function () {
        this.fetch();
      },
      siteChanged: function () {
        var site = this.getSite();
        if (site) {
          this.setQuery({
            parameters: [
              {attribute: "isRestricted", value: true},
              {attribute: "site", value: site}
            ]
          });
        }
      }
    });

  };

}());

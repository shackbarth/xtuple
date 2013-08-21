/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.inventory.initLocationModels = function () {

    /**
      @class

      Mixin for formatting location data.
    */
    XM.LocationMixin = {
      format: function () {
        var ary = [
          this.get("aisle"),
          this.get("rack"),
          this.get("bin"),
          this.get("location")
        ];
        return _.filter(ary, function (item) {
          return !_.isEmpty(item);
        }).join("-");
      }
    };

    /**
      @class

      @extends XM.Model
      @extends XM.LocationMixin
    */
    XM.Location = XM.Model.extend({
      
      recordType: "XM.Location"

    });

    // Add in location mixin
    XM.Location = XM.Location.extend(XM.LocationMixin);

    /**
      @class

      @extends XM.Info
      @extends XM.LocationMixin
    */
    XM.LocationRelation = XM.Model.extend({
      
      recordType: "XM.LocationRelation",

      editableModel: "XM.Location"

    });

    // Add in location mixin
    XM.LocationRelation = XM.LocationRelation.extend(XM.LocationMixin);

    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.LocationRelationCollection = XM.Collection.extend({

      model: XM.LocationRelation
      
    });

  };

}());


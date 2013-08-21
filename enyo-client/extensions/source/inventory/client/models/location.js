/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.inventory.initLocationModels = function () {

    /**
      @class

      @extends XM.Model
    */
    XM.Location = XM.Model.extend({
      
      recordType: "XM.Location",

      name: function () {
      return this.get("aisle") + " " + this.get("rack") + " " + this.get("bin") + " " + this.get("location");
    }

    });

    /**
      @class

      @extends XM.Model
    */
    XM.LocationItem = XM.Model.extend({
      
      recordType: "XM.LocationItem",

      parentKey: "location"

    });

    /**
      @class

      @extends XM.Info
    */
    XM.LocationRelation = XM.Model.extend({
      
      recordType: "XM.LocationRelation",

      editableModel: "XM.Location"

    });

    // ..........................................................
    // COLLECTIONS
    //
    /**
      @class

      @extends XM.Collection
    */
    XM.LocationCollection = XM.Collection.extend({

      model: XM.Location
      
    });

    /**
      @class

      @extends XM.Collection
    */
    XM.LocationRelationCollection = XM.Collection.extend({

      model: XM.LocationRelation
      
    });

  };

}());


/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.connect.initIncidentModels = function () {
    /**
      @class

      @extends XM.Model
    */
    XM.IncidentEmailProfile = XM.Document.extend(
      /** @scope XM.IncidentEmailProfile.prototype */ {

      recordType: 'XM.IncidentEmailProfile',
    
      documentKey: 'name'

    });
  
    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.IncidentEmailProfileCollection = XM.Collection.extend({
      /** @scope XM.IncidentEmailProfileCollection.prototype */

      model: XM.IncidentEmailProfile

    });
  };

}());

/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  XT.extensions.incidentPlus.initProjectModels = function () {
  
    var init = XM.Project.prototype.bindEvents;
    XM.Project = XM.Project.extend({

      bindEvents: function () {
        init.apply(this, arguments);
        this.on('add:versions remove:versions', this.versionsDidChange);
      },
      
      versionsDidChange: function () {
        this.trigger("change", this);
      }

    });
  
    /**
      @class

      @extends XM.Model
    */
    XM.ProjectVersion = XM.Model.extend(
      /** @scope XM.ProjectVersion.prototype */ {

      recordType: 'XM.ProjectVersion',
      
      requiredAttributes: [
        "version"
      ]

    });
    
    // ..........................................................
    // COLLECTIONS
    //

    /**
      @class

      @extends XM.Collection
    */
    XM.ProjectVersionCollection = XM.Collection.extend({
      /** @scope XM.ProjectVersionCollection.prototype */

      model: XM.ProjectVersion

    });
  };

}());

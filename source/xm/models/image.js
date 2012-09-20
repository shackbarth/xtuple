/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true, 
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true
white:true*/
/*global XT:true, XM:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class
  
    @extends XM.Model
  */
  XM.Image = XM.Model.extend({
    /** @scope XM.Image.prototype */

    recordType: 'XM.ImageRelation'

  });

  /**
    @class
  
    @extends XM.Model
  */
  XM.ImageRelation = XM.Info.extend({
    /** @scope XM.ImageRelation.prototype */

    recordType: 'XM.ImageRelation',
    
    editableModel: 'XM.Image',
    
    numberKey: 'name'

  });

}());

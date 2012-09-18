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
  XM.Url = XM.Info.extend({
    /** @scope XM.Url.prototype */

    recordType: 'XM.Url',
    
    editableModel: 'XM.Url',
    
    numberKey: 'name',
    
    descriptionKey: 'path',
    
    readOnly: false

  });
  
  // ..........................................................
  // COLLECTIONS
  //

  /**
    @class

    @extends XM.Collection
  */
  XM.UrlCollection = XM.Collection.extend({
    /** @scope XM.UrlCollection.prototype */

    model: XM.Url

  });

}());

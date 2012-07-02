
/*jshint trailing:true, white:true, indent:2, strict:true, curly:true, plusplus:true
  immed:true, eqeqeq:true, forin:true, latedef:true, newcap:true, noarg:true, undef:true */
/*jslint bitwise: true, nomen: true, indent:2 */
/*global XT:true, Backbone:true, _:true, console:true */

(function () {
  "use strict";

  /**
    @class
  
    @extends Backbone.Collection
  */
  XT.Collection = Backbone.Collection.extend({
    /** @scope XT.Collection.prototype */

    /**
      Handle status change.
    */
    add: function (models, options) {
      var result = Backbone.Collection.prototype.add.call(this, models, options),
        i,
        K = XT.Model;
      for (i = 0; i < result.models.length; i += 1) {
        result.models[i].setStatus(K.READY_CLEAN);
      }
      return result;
    },

    /**
      Sync to xTuple datasource.
    */
    sync: function (method, model, options) {
      options = options ? _.clone(options) : {};
      options.query = options.query || {};
      options.query.recordType = model.model.prototype.recordType;

      if (method === 'read' && options.query.recordType && options.success) {
        return XT.dataSource.fetch(options);
      }

      return false;
    }

  });
  
  // ..........................................................
  // CLASS METHODS
  //

  _.extend(XT.Collection, {
    /** @scope XT.Collection */
  
    /**
    Create a new instance of this collection.

    @param {Object} Models
    @param {Object} Options
    @returns {XT.Model}
    */
    create: function (models, options) {
      var Klass = this,
        child =  new Klass(models, options);
      return child;
    }
      
  });

}());
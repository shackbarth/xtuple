
/**
*/
XT.Model = Backbone.Model.extend(
  /** @scope XT.Model.prototype */ {

  get: function() {
    var orig = Backbone.Model.prototype.get.apply(this, arguments);
    if (orig && orig.isProperty) {
      return orig.call(this);
    } else { return orig; }
  }
    
});
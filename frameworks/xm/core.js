/*globals XM */

/** @namespace
  @extends SC.Object
*/
XM = global.XM = SC.Object.create(
  /** @scope XM.prototype */ {

  NAMESPACE: "XM",
  VERSION: "4.0.0ALPHA",

  getViewForModel: function(modelName, viewType) {
    var views = this._xm_views;

    if (!views[modelName]) {
      return undefined;
    }

    return views[modelName][viewType] || undefined;
  },

  getCustomViewsForModel: function(modelName) {
    var views = this._xm_views;

    if (!views[modelName]) {
      return [];
    }

    return views[modelName].customViews || [];
  },

  registerViewForModel: function(viewKlass) {

    var type = viewKlass.prototype.className;
    var target = viewKlass.prototype.targetModel; 
    var custom = viewKlass.prototype.isCustomView;

    console.log("type => %@".fmt(type));
    console.log("target => %@".fmt(target));

    var views = this._xm_views;
    var model = views[target];
    if (!model) model = views[target] = {};

    if (custom) {
      if (!model.customViews) model.customViews = [];
      model.customViews.push(viewKlass);
    } else {
      model[type] = viewKlass;
    }
  },

  _xm_views: {},

});

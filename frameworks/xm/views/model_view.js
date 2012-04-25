

/**
*/

XM.ModelView = SC.View.extend(
  /** @lends XM.ModelView.prototype */ { 

  modelViewType: null,

  targetModel: null,

  layoutSchema: null,

  isCustomView: false

});

XM.ModelView.originalExtend = XM.ModelView.extend;

SC.mixin(XM.ModelView, 
  /** @lends XM.ModelView */ {

  extend: function() {
    var props = arguments[0];
    var viewKlass = props.modelViewType;
    var viewType = viewKlass.prototype.className;
    var view = viewKlass.extend(props);

    XM.registerViewForModel(view);
    return view;
  }

});

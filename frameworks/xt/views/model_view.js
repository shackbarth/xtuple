

/**
*/

XT.ModelView = SC.View.extend(
  /** @lends XT.ModelView.prototype */ { 

  modelViewType: null,

  targetModel: null,

  layoutSchema: null,

  isCustomView: false

});

XT.ModelView.originalExtend = XT.ModelView.extend;

SC.mixin(XT.ModelView, 
  /** @lends XT.ModelView */ {

  extend: function() {
    var props = arguments[0];
    var viewKlass = props.modelViewType;
    var viewType = viewKlass.prototype.className;
    var view = viewKlass.extend(props);

    XT.registerViewForModel(view);
    return view;
  }

});


/*globals XT */

/** @class



*/
XT.NavOption = XT.View.extend(
  /** @scope XT.Widget.prototype */ {

  classNames: "inset-border xt-nav-option".w(),
  useStaticLayout: YES,

  value: null,
  icon: null,

  createChildViews: function() {
    var v = this.get("value"), view, views = [],
        i = this.get("icon");
    this._label = view = this.createChildView(SC.LabelView, {
      value: v,
      tagName: "h3",
      classNames: "nav-label".w(),
      useStaticLayout: YES
    });
    views.push(view);
    this._icon = view = this.createChildView(XT.StatusImageView, {
      classNames: "nav-icon".w(),
      imageClass: i,
      useStaticLayout: YES,
      isVisible: YES
    });
    views.push(view);
    this.set("childViews", views);
    return this;
  }

}) ;



/*globals XT */

/** @class

  @todo NEEDS TO BE EXTENDED TO ALLOW FOR VARYING TARGETS
    AND METHODS

*/
XT.NavOption = XT.View.extend(
  /** @scope XT.Widget.prototype */ {

  classNames: "inset-border xt-nav-option".w(),

  value: null,
  icon: null,

  createChildViews: function() {
    var v = this.get("value"), view, views = [],
        i = this.get("icon");
    this._label = view = this.createChildView(SC.LabelView, {
      layout: { left: 0, right: 0, bottom: 3, height: 20 },
      value: v,
      tagName: "h3",
      classNames: "nav-label".w(),
    });
    views.push(view);
    this._icon = view = this.createChildView(XT.StatusImageView, {
      layout: { top: 3, height: 24, width: 24, centerX: 0 },
      classNames: "nav-icon".w(),
      imageClass: i,
      // isVisible: YES
    });
    views.push(view);
    this.set("childViews", views);
    return this;
  },

  click: function() {
    var v = XT.capitalize(this.get("value"));
    Plugin.Controller.append(v);
  }

}) ;


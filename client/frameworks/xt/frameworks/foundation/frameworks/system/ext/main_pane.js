
/*globals XT */

sc_require("ext/base_content_view");
sc_require("mixins/logging");

/** @class


*/

XT.REMOVE_PANE = XT.hex();
XT.APPEND_PANE = XT.hex();

XT.MainPane = SC.MainPane.extend(XT.Logging,
  /** @scope XT.MainPane.prototype */ {

  /** @property */
  animateAppend: YES,

  remove: function() {
    if(arguments.length > 0)
      if(arguments[0] === XT.REMOVE_PANE) {
        if(this._next) this._next.append();
        return sc_super();
      }
    else { this._next = arguments[0]; }
    this._animateRemove();  
  },

  append: function() {
    var ap = this.get("animateAppend");
    if(ap === NO) return sc_super();
    if(arguments.length > 0)
      if(arguments[0] === XT.APPEND_PANE) {
        var ret = sc_super();
        this._animateAppend();
        return ret;
      }
    this._prepToAppend();
  },

  /** @private
    Initialization routine to help setup the content wrapper.

    @todo This may cause severe binding issues if no tedious
      destroy method is written since references to the views exist
      in two objects.
  */
  createChildViews: function() {
    var cvs = this.get("childViews"),
        base = this._baseView(),
        i=0, len=cvs.length, ccvs = [],
        view, name;
    for(; i<len; ++i) {
      name = cvs[i];
      view = base.createChildView(this[name]);
      base.appendChild(view);
      this[name] = view;
    }
    this.set("childViews", [base]);
  },

  /** @private
    Generates a new wrapper view to hold all of the contents of the main pane.
  */
  _baseView: function() {
    var v = this._baseView = this.createChildView(XT.BaseContentView);
    return v;
  },

  /** @private
    Animates the wrapper view when being removed.
  */
  _animateRemove: function() {
    this._baseView.xtAnimate("hideLeft"); 

    // @todo This is hardcoded to a time but it needs to
    //  accurately match whatever the transition duration is
    //  for the animation. This wouldn't be a problem if
    //  XT.AnimationView support callbacks.

    this.invokeLater(this.remove, 600, XT.REMOVE_PANE);
  },

  /** @private
    Prepares the pane to be appended.
  */
  _prepToAppend: function() {
    this._baseView.xtAnimate("prepareLeft");
    this.invokeLater(this.append, 20, XT.APPEND_PANE);
  },

  /** @private
    Animates the wrapper view when appending.
  */
  _animateAppend: function() {
    this._baseView.xtAnimate("showLeft");
  }

}) ;

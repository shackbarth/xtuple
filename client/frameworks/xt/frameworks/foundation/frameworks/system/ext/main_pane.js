
/*globals XT */

sc_require("ext/base_content_view");
sc_require("mixins/logging");

/** @class


*/

XT.REMOVE_PANE = XT.hex();
XT.APPEND_PANE = XT.hex();

XT.APPEND_LEFT = XT.hex();
XT.REMOVE_LEFT = XT.hex();
XT.APPEND_RIGHT = XT.hex();
XT.REMOVE_RIGHT = XT.hex();

XT.MainPane = SC.MainPane.extend(XT.Logging,
  /** @scope XT.MainPane.prototype */ {

  /** @property */
  animateAppend: YES,

  /** @property
    Property hash to be mixed into the XT.BaseContextView.
  */
  extendBaseView: {},

  //...............................................
  // Private Properties
  //

  /** @private */
  appendFrom: null,

  /** @private */
  removeTo: null,

  /** @private */
  nextPane: null,

  //...............................................
  // Private Methods
  //

  /** @private
    Prepares the pane to be appended from the 
    appropriate direction.
  */
  _prepToAppend: function() {
    var dir = this.appendFrom;
    if(SC.none(dir) || dir === XT.APPEND_RIGHT)
      this._baseView.xtAnimate("prepareLeft");
    else if(dir === XT.APPEND_LEFT)
      this._baseView.xtAnimate("prepareRight");
    else this.error("WHAT THE HELLL? (_prepToAppend)", YES);
    this.invokeLater(this.append, 100, XT.APPEND_PANE);
  },

  /** @private
    Animates the wrapper view when appending.
  */
  _animateAppend: function() {
    var dir = this.appendFrom;
    if(SC.none(dir) || dir === XT.APPEND_RIGHT)
      this._baseView.xtAnimate("showLeft");
    else if(dir === XT.APPEND_LEFT)
      this._baseView.xtAnimate("showRight");
    else this.error("WHAT THE HELL? (_animateAppend)", YES);
  },

  /** @private
    Animates the wrapper view when being removed.
  */
  _animateRemove: function() {
    var dir = this.removeTo;
    this.log("_animateRemove: ");
    if(SC.none(dir) || dir === XT.REMOVE_LEFT) {
      this.log("trying to animate hideLeft");
      this._baseView.xtAnimate("hideLeft"); 
    }
    else if(dir === XT.REMOVE_RIGHT) {
      this.log("trying to animate hideRight");
      this._baseView.xtAnimate("hideRight");
    }
    else this.error("WHAT THE HELL? (_animateRemove)", YES);

    // @todo This is hardcoded to a time but it needs to
    //  accurately match whatever the transition duration is
    //  for the animation. This wouldn't be a problem if
    //  XT.AnimationView support callbacks.

    this.invokeLater(this.remove, 200, XT.REMOVE_PANE);
  },

  remove: function() {
    this.warn("MY REMOVE WAS CALLED!");
    if(arguments.length > 0)
      if(arguments[0] === XT.REMOVE_PANE) {
        sc_super();
        if(this.nextPane) this.nextPane.append();
        this.appendFrom = null;
        this.removeTo = null;
        this.nextPane = null;
        return;
      }
    this._animateRemove();  
  },

  append: function() {
    this.warn("MY APPEND WAS CALLED!");
    var ap = this.get("animateAppend");
    if(ap === NO) return sc_super();
    if(arguments.length > 0)
      if(arguments[0] === XT.APPEND_PANE) {
        var ret = sc_super();
        this._animateAppend();

        // @todo Make sure this isn't happening too early...
        this.appendFrom = null;
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
    var v, ext = this.get("extendBaseView");
    v = this._baseView = this.createChildView(XT.BaseContentView, ext);
    return v;
  },




}) ;

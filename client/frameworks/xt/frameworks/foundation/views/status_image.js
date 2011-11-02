
/*globals XT */

/** @class

  Requires appropriate CSS to be available to work properly.

*/
XT.StatusImageView = XT.View.extend(
  /** @scope XT.StatusImageView.prototype */ {
  
  layout: { height: 64, width: 64, centerY: 0 },

  /** @propery */
  imageClass: "",

  /** @property */
  imageLayout: { top: 0, left: 0, right: 0, bottom: 0 },

  /** @property */
  isActive: NO,

  /** @private */
  createChildViews: function() {
    var imageClass = this.get("imageClass"),
        imageLayout = SC.clone(this.get("imageLayout")),
        view;
    view = this._imageView = this.createChildView(SC.ImageView, {
      layout: imageLayout,
      value: imageClass,
      destroy: function() {
        XT.StatusImageController.removeImage(imageClass);
        sc_super();
      }
    });
    this.childViews = [view];
    return this;
  },
  
  /** @private */
  isActiveDidChange: function() {
    var a = this.get("isActive");
    if(a) this.$().addClass("active");
    else if(this.$().hasClass("active"))
      this.$().removeClass("active");
  }.observes("isActive"),

  /** @private */
  _imageView: null,

  init: function() {
    sc_super();
    XT.StatusImageController.addImage(this.get("imageClass"), this);
  }

}) ;


/*globals XT */

/** @namespace


*/
XT.StatusImageController = XT.Object.create(
  /** @scope XT.StatusImageController.prototype */ {

  addImage: function(idx, ref) {
    if(!idx) {
      this.warn("Failed to add status image, no index provided");
      return NO;
    }
    var imgs = this._images;
    if(!imgs[idx]) {
      imgs[idx] = ref;
      this.log("Added new image %@ to XT.StatusImageController".fmt(idx));
    }
    else this.warn("Could not add image %@, index already existed".fmt(idx));
    return YES;
  },

  getImage: function(idx) {
    var imgs = this._images;
    if(imgs[idx]) return imgs[idx];
    else return null;
  },

  removeImage: function(idx) {
    var imgs = this._images;
    if(imgs[idx]) {
      delete imgs[idx];
      return YES;
    } else { return NO; }
  },

  _images: {},

}) ;

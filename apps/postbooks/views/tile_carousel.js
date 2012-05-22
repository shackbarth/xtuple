// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks sc_assert */

sc_require('views/carousel');

var base03 =   "#002b36";
var base02 =   "#073642";
var base01 =   "#586e75";
var base00 =   "#657b83";
var base0 =    "#839496";
var base1 =    "#93a1a1";
var base2 =    "#eee8d5";
var base3 =    "#fdf6e3";
var yellow =   "#b58900";
var orange =   "#cb4b16";
var red =      "#dc322f";
var magenta =  "#d33682";
var violet =   "#6c71c4";
var blue =     "#268bd2";
var cyan =     "#2aa198";
var green =    "#859900";
var white =    "white";

/**
  This surface lays out its subsurfaces, in order, from left to right. Each 
  subsurface is sized so that it's frame is the same size as the Carousel.

  By default, the first subsurface is visible. You can choose another 
  subsurface by doing `carousel.makeSurfaceVisible(theSuburface)`.

  @extends Postbooks.Carousel
*/
Postbooks.TileCarousel = Postbooks.Carousel.extend(
  /** @scope Postbooks.TileCarousel.prototype */{

  didCreateElement: function(div) {
    arguments.callee.base.apply(this, arguments);
    div.style.overflowX = 'scroll';
    div.style.overflowY = 'hidden';
  },

  updateTrayLayout: function() {
    // console.log('Postbooks.TileCarousel#updateTrayLayout()');
    var tray = this._sc_tray,
        frame = SC.MakeRect(this.get('frame')),
        width = frame.width, height = frame.height,
        tilesPerSlide = 2,
        K = Postbooks.TileView;

    sc_assert(tray);

    var slides = 0, surfaces = tray.get('subsurfaces');

    // How many tiles will fit horizontally?
    var horizontalTiles = Math.floor(width/325),
        verticalTiles = Math.floor(height/325);

    // Make sure we have enough room left over on the bottom.
    if ((height % 325) < 60) verticalTiles--;

    // Make sure we have at least two tiles in each direction.
    horizontalTiles = Math.max(horizontalTiles, 2);
    verticalTiles = Math.max(verticalTiles, 2);

    // Calculate and cache the tile frames for a single slide.
    var columns = [], column, tileOrigin, filled = [];
    for (var idx=0, len=horizontalTiles; idx<len; ++idx) {
      column = columns[idx] = [];
      filled[idx] = []; // Used below.
      for (var idx2=0, len2=verticalTiles; idx2<len2; ++idx2) {
        tileOrigin = column[idx2] = SC.MakePoint();

        tileOrigin.x = idx*325 + 5;
        tileOrigin.y = idx2*325 + 5;
      }
    }

    function clearColumns(column) { column.length = 0; }

    var j, k, jlen=horizontalTiles, klen = verticalTiles,
        f, nf = SC.MakeRect(), origin, found;

    for (idx=0, len=surfaces.length; idx<len; ++idx) {
      var surface = surfaces[idx],
          size = surface.get('size');

      found = false;
      nf.width = size.width;
      nf.height = size.height;

      if (size === K.QUARTER_TILE) {
        // No conditions, just use the first unfilled slot.
        for (j=0; j<jlen; ++j) {
          column = filled[j];
          for (k=0; k<klen; ++k) {
            if (!column[k]) {
              found = true;
              break;
            }
          }
          if (found) break;
        }

        if (!found) {
          ++slides;
          filled.forEach(clearColumns);
          j = k = 0;
        }

        origin = columns[j][k];
        filled[j][k] = true;

      } else if (size === K.HORIZONTAL_TILE) {
        // Find the first open slot with an open slot next to it.
        for (j=0; j<jlen; ++j) {
          column = filled[j];
          for (k=0; k<klen; ++k) {
            if (!column[k]) {
              if (j+1 < jlen && !filled[j+1][k]) {
                found = true;
                break;
              }
            }
          }
          if (found) break;
        }

        if (!found) {
          ++slides;
          filled.forEach(clearColumns);
          j = k = 0;
        }

        origin = columns[j][k];
        filled[j][k] = filled[j+1][k] = true;

      } else if (size === K.VERTICAL_TILE) {
        // Find the first open slot with an open slot below it.
        for (j=0; j<jlen; ++j) {
          column = filled[j];
          for (k=0; k<klen; ++k) {
            if (!column[k]) {
              if (k+1 < klen && !column[k+1]) {
                found = true;
                break;
              }
            }
          }
          if (found) break;
        }

        if (!found) {
          ++slides;
          filled.forEach(clearColumns);
          j = k = 0;
        }

        origin = columns[j][k];
        filled[j][k] = filled[j][k+1] = true;

      } else if (size === K.FULL_TILE) {
        // Find the first open slot with an open slot below it.
        for (j=0; j<jlen; ++j) {
          column = filled[j];
          for (k=0; k<klen; ++k) {
            if (!column[k]) {
              if (k+1 < klen && !column[k+1] && j+1 < jlen && !filled[j+1][k]) {
                found = true;
                break;
              }
            }
          }
          if (found) break;
        }

        if (!found) {
          ++slides;
          filled.forEach(clearColumns);
          j = k = 0;
        }

        origin = columns[j][k];
        filled[j][k] = filled[j][k+1] = filled[j+1][k+1] = true;

      } else sc_assert(false, "You specified a tile with an unknown size:", size);

      nf.x = origin.x + slides * (horizontalTiles*325);
      nf.y = origin.y;
      f = surface.get('frame');

      // Only update frames when they change!
      if (!SC.EqualRect(nf, f)) surface.set('frame', nf);
    }

    slides++;

    frame.width = slides*frame.width + 5;
    tray.set('frame', frame);
  },

  initTray: function() {
    var tray;
    tray = this._sc_tray = Postbooks.InternalTileCarouselTray.create();
    this.get('subsurfaces').pushObject(tray);
  }

});

Postbooks.InternalTileCarouselTray = SC.CompositeSurface.extend({

  _sc_backgroundColor: 'transparent',

  didCreateElement: function(div) {
    arguments.callee.base.apply(this, arguments);
    if (SC.isTouch()) {
      div.style.webkitBackfaceVisibility = 'hidden';
      div.style.webkitTransform = 'translate3d(0,0,0)';
    }
  },

  carousel: function() {
    return this.get('supersurface');
  }.property()

});

if (!SC.isTouch()) {
  SC.mixin(Postbooks.InternalTileCarouselTray.prototype, {

    mouseDown: function(evt) {
      // console.log('Postbooks.InternalTileCarouselTray#mouseDown()');
      this._clientX = evt.clientX;
      this._startX = this.get('frame').x;
      // this._clientY = evt.clientY;
      this._needDirection = true;
      evt.stop();
      return true;
    },
    
    mouseDragged: function(evt) {
      // console.log('Postbooks.InternalTileCarouselTray#mouseDragged()');
      SC.AnimationTransaction.begin({ duration: 0 });
      var frame = this.get('frame');
      if (this._needDirection) {
        // debugger;
        this._needDirection = false;
        var currentSlide = this._nextSlide || 0;
        if (evt.clientX - this._clientX > 0) {
          currentSlide--;
        } else {
          currentSlide++;
        }
    
        if (currentSlide >= this.__slides__) currentSlide = this.__slides__ - 1;
        if (currentSlide < 0) currentSlide = 0;
    
        this._nextSlide = currentSlide;
      }
      frame.x = frame.x + evt.clientX - this._clientX;
      // frame.y = frame.y + evt.clientY - this._clientY;
      this._clientX = evt.clientX;
      // this._clientY = evt.clientY;
      SC.AnimationTransaction.end();
      evt.stop();
      return true;
    },
    
    mouseUp: function(evt) {
      // console.log('Postbooks.InternalTileCarouselTray#mouseUp()');
      SC.AnimationTransaction.begin({ duration: 300 });
      var frame = this.get('frame');
      // frame.x = frame.x + evt.clientX - this._clientX;
      frame.x = this._nextSlide * -325; //this.getPath('carousel.frame').width;
      // frame.x = this._startX;
      // frame.y = frame.y + evt.clientY - this._clientY;
      this.set('frame', frame);
      delete this._clientX;
      // delete this._clientY;
      SC.AnimationTransaction.end();
      evt.stop();
      return true;
    }

  });
}
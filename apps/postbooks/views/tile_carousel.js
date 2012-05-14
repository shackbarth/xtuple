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

  updateTrayLayout: function() {
    // console.log('Postbooks.TileCarousel#updateTrayLayout()');
    var tray = this._sc_tray,
        frame = SC.MakeRect(this.get('frame')),
        width = frame.width, height = frame.height,
        tilesPerSlide = 2,
        K = Postbooks.TileView;

    sc_assert(tray);
    var slides = 0, surfaces = tray.get('subsurfaces'); len = surfaces.length || 1; // Make at least one.
    
    // Take various widths of slides into consideration
    for (var i=0; i<len; i++) {
      var size = surfaces.objectAt(i).get('size') || K.QUARTER_TILE;
      slides += Math.ceil(size.width/320);
    }

    // Need to calculate the number of tiles per slide, then figure out 
    // the number of slides.
    if (slides <= 4 || width <= 678 || height <= 704) {
      //tilesPerSlide = 2; // This is our minimum.
      tray.__horizontalTiles__ = tray.__verticalTiles__ = 2;
    } else {
      // See if we can fit more tiles per slide.
      var horizontalTiles = Math.floor((width-38)/320),
          verticalTiles = 2; //Math.floor((height-55)/320);

      //tilesPerSlide = 2; //horizontalTiles * verticalTiles;
      tray.__horizontalTiles__ = horizontalTiles;
      tray.__verticalTiles__ = verticalTiles;
    }

    slides = Math.ceil((slides+1)/tilesPerSlide);

    frame[2]/*width*/ = 320/*width*/ * slides;
    tray.set('frame', frame);
    tray.__slides__ = slides;
  },

  initTray: function() {
    var tray;
    tray = this._sc_tray = Postbooks.InternalTileCarouselTray.create();
    this.get('subsurfaces').pushObject(tray);
  }

});

Postbooks.InternalTileCarouselTray = SC.CompositeSurface.extend({

  _sc_backgroundColor: 'clear',

  mouseDown: function(evt) {
    // console.log('Postbooks.InternalTileCarouselTray#mouseDown()');
    this._clientX = evt.clientX;
    this._startX = this.get('frame').x;
    // this._clientY = evt.clientY;
    this._needDirection = true;
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
    return true;
  },

  mouseUp: function(evt) {
    // console.log('Postbooks.InternalTileCarouselTray#mouseUp()');
    SC.AnimationTransaction.begin({ duration: 300 });
    var frame = this.get('frame');
    // frame.x = frame.x + evt.clientX - this._clientX;
    frame.x = this._nextSlide * -315; //this.getPath('carousel.frame').width;
    // frame.x = this._startX;
    // frame.y = frame.y + evt.clientY - this._clientY;
    this.set('frame', frame);
    delete this._clientX;
    // delete this._clientY;
    SC.AnimationTransaction.end();
    return true;
  },

  carousel: function() {
    return this.get('supersurface');
  }.property(),

  updateLayout: function() {
    // console.log('Postbooks.InternalTileCarouselTray#updateLayout()');
    var subsurfaces = this.get('subsurfaces'),
        frame = SC.MakeRect(this.get('frame')),
        totalWidth = frame.width,
        slides = this.__slides__, // Set by our Carousel.
        width = Math.floor(frame.width / slides),
        height = frame.height,
        horizontalTiles = this.__horizontalTiles__,
        verticalTiles = this.__verticalTiles__,
        tilesPerSlide = horizontalTiles * verticalTiles,
        slide = 0;

    // HACK: this requires careful planning of tile creation to work right. 
    // To be replaced by Cassowary constraint solver.
    // This implementation currently only works with `Postbooks.TileView.QUARTER_TILE`
    // and `Postbooks.TileView.HORIZONTAL_TILE`.
    
    // Loop over tiles and place them
    var horizontalCenter = 160;
    var horizontalOffset = 320;
    var verticalCenter = 160;
    var verticalOffset = 320;
    var col = 0, row = 0;

    subsurfaces.forEach(function(tile) {
      var tileFrame = SC.MakeRect(),
          K = Postbooks.TileView,
          size = tile.get('size') || K.QUARTER_TILE,
          xMargin = col? 0 : K.TILE_MARGIN,
          yMargin = row? 0 : K.TILE_MARGIN;
          
      tileFrame.width = size.width - K.TILE_MARGIN * 2;
      tileFrame.height = size.height - K.TILE_MARGIN * 2;
      tileFrame.x = ((col*horizontalOffset)+horizontalCenter) - 160 + xMargin;
      tileFrame.y = ((row*verticalOffset)+verticalCenter) - 160 + yMargin;
          
      // We need to move the tileFrame to the correct slide.
      var x = tileFrame.x;
      tileFrame.x = x + width*slide*horizontalTiles;
      sc_assert(tileFrame);
      tile.set('frame', tileFrame);
      tileFrame.x = x; // Restore the original.
      
      // Advance to next frame
      col += Math.ceil(size.width/320);
      if (col >= horizontalTiles) {
        col = 0;
        row += 1;
      }
      if (row >= verticalTiles) {
        col = 0;
        row = 0;
        slide++;
      }
    }, this)

/*    
    // Calculate and cache the tile frames for a single slide.
    var columns = [], column, tileFrame;
    var horizontalCenter = Math.floor((width/horizontalTiles)/2);
    var horizontalOffset = Math.floor(width/horizontalTiles);
    var verticalCenter = Math.floor(((height-55)/verticalTiles)/2);
    var verticalOffset = Math.floor((height-55)/verticalTiles);
    for (var idx=0, len=horizontalTiles; idx<len; ++idx) {
      column = columns[idx] = [];
      for (var idx2=0, len2=verticalTiles; idx2<len2; ++idx2) {
        tileFrame = column[idx2] = SC.MakeRect();
        if (Postbooks.USE_320_TILES) {
          tileFrame.width = tileFrame.height = 320;
          tileFrame.x = ((idx*horizontalOffset)+horizontalCenter) - 160;
          tileFrame.y = ((idx2*verticalOffset)+verticalCenter) - 160;
        } else {
          tileFrame.width = horizontalOffset - 12;
          tileFrame.height = verticalOffset - 12;
          tileFrame.x = ((idx*horizontalOffset)+horizontalCenter) - (horizontalOffset/2) + 6;
          tileFrame.y = ((idx2*verticalOffset)+verticalCenter) - (verticalOffset/2) + 6;
        }
      }
    }

    // Loop over the slides and set the tile frames using the cached frames.
    for (var i=0, ilen=slides; i<ilen; ++i) {
      // Loop over the tiles in that slide (not all tiles need to exist);
      for (var j=i*tilesPerSlide, jlen=j+tilesPerSlide; j<jlen; ++j) {
        var tile = subsurfaces[j];
        if (tile) {
          sc_assert(tile.isTile);

          // Look up the cached frame for this tile.
          var slideIndex = j - (i*tilesPerSlide);
          var columnIndex = slideIndex % horizontalTiles;
          var rowIndex = Math.floor(slideIndex/horizontalTiles);
          
          tileFrame = columns[columnIndex][rowIndex];

          // We need to move the tileFrame to the correct slide.
          var x = tileFrame.x;
          tileFrame.x = x + width*i;
          sc_assert(tileFrame);
          tile.set('frame', tileFrame);
          tileFrame.x = x; // Restore the original.
        }
      }
    }
*/
  }
});

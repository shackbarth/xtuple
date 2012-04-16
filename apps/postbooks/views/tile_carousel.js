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

  @extends SC.CompositeSurface
*/
Postbooks.TileCarousel = Postbooks.Carousel.extend({

  updateTrayLayout: function() {
    // console.log('Postbooks.TileCarousel#updateTrayLayout()');
    var tray = this._sc_tray,
        frame = SC.MakeRect(this.get('frame')),
        width = frame.width, height = frame.height,
        tilesPerSlide = 4;

    sc_assert(tray);
    var slides = tray.get('subsurfaces').length || 1; // Make at least one.

    // Need to calculate the number of tiles per slide, then figure out 
    // the number of slides.
    if (width <= 678 || height <= 704) {
      tilesPerSlide = 4; // This is our minimum.
      tray.__horizontalTiles__ = tray.__verticalTiles__ = 2;
    } else {
      // See if we can fit more tiles per slide.
      var horizontalTiles = Math.floor((width-38)/320),
          verticalTiles = Math.floor((height-55)/320);

      tilesPerSlide = horizontalTiles * verticalTiles;
      tray.__horizontalTiles__ = horizontalTiles;
      tray.__verticalTiles__ = verticalTiles;
    }

    slides = Math.ceil(slides/tilesPerSlide);

    frame[2]/*width*/ = frame[2]/*width*/ * slides;
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

  _sc_backgroundColor: base01,

  mouseDown: function(evt) {
    // console.log('Postbooks.InternalTileCarouselTray#mouseDown()');
    this._clientX = evt.clientX;
    this._startX = this.get('frame').x;
    // this._clientY = evt.clientY;
    return true;
  },

  mouseDragged: function(evt) {
    // console.log('Postbooks.InternalTileCarouselTray#mouseDragged()');
    SC.AnimationTransaction.begin({ duration: 0 });
    var frame = this.get('frame');
    frame.x = frame.x + evt.clientX - this._clientX;
    // frame.y = frame.y + evt.clientY - this._clientY;
    this._clientX = evt.clientX;
    // this._clientY = evt.clientY;
    SC.AnimationTransaction.end();
    return true;
  },

  mouseUp: function(evt) {
    // console.log('Postbooks.InternalTileCarouselTray#mouseUp()');
    SC.AnimationTransaction.begin({ duration: 400 });
    var frame = this.get('frame');
    // frame.x = frame.x + evt.clientX - this._clientX;
    frame.x = this._startX;
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
        tilesPerSlide = horizontalTiles * verticalTiles;

    // Calculate and cache the tile frames for a single slide.
    var columns = [], column, tileFrame;
    var horizontalCenter = Math.floor((width/horizontalTiles)/2);
    var horizontalOffset = Math.floor(width/horizontalTiles);
    var verticalCenter = Math.floor((height/verticalTiles)/2);
    var verticalOffset = Math.floor(height/verticalTiles);
    for (var idx=0, len=horizontalTiles; idx<len; ++idx) {
      column = columns[idx] = [];
      for (var idx2=0, len2=verticalTiles; idx2<len2; ++idx2) {
        tileFrame = column[idx2] = SC.MakeRect();
        tileFrame.width = tileFrame.height = 320;
        tileFrame.x = ((idx*horizontalOffset)+horizontalCenter) - 160;
        tileFrame.y = ((idx2*verticalOffset)+verticalCenter) - 160;
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
  }

});

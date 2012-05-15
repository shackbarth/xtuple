// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks sc_assert */

sc_require('stackblur');

/** @class

  (Document your Model here)

  @extends SC.View
*/
Postbooks.TileView = SC.View.extend(
  /** @scope Postbooks.TileView.prototype */{
  
  isTile: true, // Walk like a duck.
  
  layout: { top: 0, left: 0, right: 0, height: 0 }, // height set below

  title: "_overview".loc(),
  
  /**
    Tile size.
    
    @default Postbooks.TileView.QUARTER_TILE;
  */
  size: null,

  didCreateElement: function(el) {
    arguments.callee.base.apply(this, arguments);
    var style = el.style;
    style.backgroundImage =  Postbooks.createDataUrlForSprite('tile-texture');
    style.backgroundPosition = 'left top';
    style.backgroundRepeat = 'repeat';
  },

  clearBackground: true,

  willRenderLayers: function(context) { 
    var title = this.get('title'),
        w = context.width, h = context.height;
           
    // title bar
    // context.fillStyle = base3;
    // context.fillRect(0, 3, context.width, 32);

    // image frame
    // context.fillStyle = base00;
    // context.fillRect(20, 7, 24, 24);

    context.globalAlpha = 0.2;
    context.strokeStyle = 'black';
    context.lineWidth = 20;
    context.beginPath();
    context.rect(0,-5,w,h);
    context.stroke();
    Postbooks.StackBlurCanvasRGBA(context, 0, 0, w, h, 30);
    context.globalAlpha = 1.0;

    // title text
    var K = Postbooks;
    context.font = "12pt "+K.TYPEFACE;
    context.fillStyle = 'white';
    context.textAlign = 'left';
    context.textBaseline = 'middle';

    context.fillText(this.get('title'), 18, 19  );
  },
  
  init: function() {
    arguments.callee.base.apply(this, arguments);
    if (!this.get('size')) this.set('size', Postbooks.TileView.QUARTER_TILE);
  },
  
  _sc_cornerRadius: 5,
  _sc_backgroundColor: 'white'
});

Postbooks.TileView.mixin( /** @scope Postbooks.TileView */ {

  /**
    Constant value for a quarter screen tile.
    
    @static
    @constant
    @type Number
    @default 230Hx320W
  */
  QUARTER_TILE: { height: 320, width: 320},  

  /**
    Constant value for a half screen horizontal tile.
    
    @static
    @constant
    @type Number
    @default 230Hx640W
  */
  HORIZONTAL_TILE: { height: 320, width: 640 },
  
  /**
    Constant value for a half screen vertical tile.
    
    @static
    @constant
    @type Number
    @default 640Hx320W
  */
  VERTICAL_TILE: { hieght: 640, width: 320},
  
  /**
    Constant value for a full screen tile.
    
    @static
    @constant
    @type Number
    @default 640Hx640W
  */
  FULL_TILE: { height: 640, width: 640},
  
  /**
    Constant value for a full screen tile.
    
    @static
    @constant
    @type Number
    @default 5
  */
  TILE_MARGIN: 5

});
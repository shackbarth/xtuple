// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks sc_assert */

Postbooks.TileView = SC.View.extend({
  isTile: true, // Walk like a duck.
  
  layout: { top: 0, left: 0, right: 0, height: 0 }, // height set below

  title: "_overview".loc(),
  
  /**
    Tile size.
    
    @default Postbooks.TileView.QUARTER_TILE;
  */
  size: null,
  
  willRenderLayers: function(context) { 
    var title = this.get('title');
           
    // title bar
    context.fillStyle = base3;
    context.fillRect(0, 3, context.width, 32);

    // image frame
    context.fillStyle = base00;
    context.fillRect(20, 7, 24, 24);

    // title text
    var K = Postbooks;
    context.font = "12pt "+K.TYPEFACE;
    context.fillStyle = 'black';
    context.textAlign = 'left';
    context.textBaseline = 'middle';

    context.fillText(this.get('title'), 72, 19  );
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
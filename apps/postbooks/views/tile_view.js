// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks sc_assert */

Postbooks.TileView = SC.View.extend({
  isTile: true, // Walk like a duck.
  
  layout: { top: 0, left: 0, right: 0, height: 0 }, // height set below

  title: "_overview".loc(),

  willRenderLayers: function(context) { 
    var title = this.get('title');
           
    context.fillStyle = base3;
    context.fillRect(0, 3, context.width, 32);

    context.fillStyle = base00;
    context.fillRect(20, 7, 24, 24);

    var K = Postbooks;
    context.font = "12pt "+K.TYPEFACE;
    context.fillStyle = 'black';
    context.textAlign = 'left';
    context.textBaseline = 'middle';

    context.fillText(this.get('title'), 72, 19  );
  },
  
  _sc_cornerRadius: 5,
  _sc_backgroundColor: 'white'
});

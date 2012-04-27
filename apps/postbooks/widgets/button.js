// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XT XM sc_assert */

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

Postbooks.Button = SC.ButtonWidget.extend({

  displayProperties: 'name'.w(),

  name: "_back".loc(),

  displayName: function() {
    return this.get('name');
  }.property('name'),

  cornerRadius: 5,

  dragPoint: null,

  render: function(ctx) {
    console.log('IconLayer.render()', SC.guidFor(this));
    ctx.beginPath();
    this.renderHitTestPath(ctx);
    ctx.fillStyle = base02;
    ctx.fill();

    // Draw some text.
    ctx.fillStyle = this.get('isEnabled')? base3 : base1;
    
    var K = Postbooks;
    ctx.font = "13pt "+K.TYPEFACE;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.shadowBlur = 0;
    ctx.shadowColor = "rgba(0,0,0,0)";
    ctx.fillText(this.get('displayName'), ctx.width/2, ctx.height/2);
  }

});

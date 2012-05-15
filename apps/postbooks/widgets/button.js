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

  tooltip: "Button Tooltip",

  name: "_back".loc(),

  displayName: function() {
    return this.get('name');
  }.property('name'),

  cornerRadius: 5,

  dragPoint: null,

  renderButtonShape: function(ctx) {
    var bounds = this.get('bounds'),
        w = bounds.width, h = bounds.height,
        radius = this.get('cornerRadius');

    if (radius === undefined) radius = 5;

    SC.CreateRoundRectPath(ctx, 1.5, 1.5, w-3, h-3, radius);
  },

  render: function(ctx) {
    //console.log('IconLayer.render()', SC.guidFor(this));
    var bounds = this.get('bounds'),
        w = bounds.width, h = bounds.height,
        isEnabled = this.get('isEnabled');

    var lingrad = ctx.createLinearGradient(0,0,0,h);
    lingrad.addColorStop(0, 'rgb(252,188,126)');
    lingrad.addColorStop(0.9, 'rgb(255,102,0)');
    lingrad.addColorStop(1, 'rgb(255,178,128)');

    ctx.globalAlpha = isEnabled? 1.0 : 0.5;

    ctx.beginPath();
    ctx.fillStyle = lingrad;
    this.renderButtonShape(ctx);
    ctx.fill();
    ctx.strokeStyle = white;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw some text.
    ctx.fillStyle = isEnabled? white : 'rgba(255,255,255,0.7)';
    
    var K = Postbooks;
    ctx.font = "10pt "+K.TYPEFACE;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.shadowBlur = 0;
    ctx.shadowColor = "rgba(0,0,0,0)";
    ctx.fillText(this.get('displayName'), w/2, h/2);
  }

});

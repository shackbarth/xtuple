
/*globals XT */

sc_require("mixins/logging");

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

/** @class
  
*/
XT.MainPane = SC.MainPane.extend(XT.Logging,
  /** @scope XT.MainPane.prototype */ {

  classNames: "xt-main-pane".w(),

  init: function() {
    var ret = arguments.callee.base.apply(this, arguments);
    XT.BASE_PANE = this;
    return ret;
  },

  render: function(ctx) {
    var w = ctx.width, h = ctx.height;
    // Draw background.
    ctx.fillStyle = base3;
    ctx.fillRect(0, 0, ctx.width, ctx.height);
    ctx.strokeStyle = base0;
    ctx.lineWidth = 2; // overlap of 1 on the inside
    ctx.strokeRect(0, 0, ctx.width, ctx.height);

    // Draw lines overlay.
    ctx.beginPath();
    ctx.moveTo(0, h/2);
    ctx.lineTo(w, h/2);
    ctx.moveTo(w/2, 0);
    ctx.lineTo(w/2, h);
    ctx.strokeStyle = orange;
    ctx.lineWidth = 0.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(w/2, h/2, 3, 0, 2*Math.PI, false);
    ctx.fillStyle = orange;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w/2, h/2, 15, 0, 2*Math.PI, false);
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

}) ;

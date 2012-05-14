// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals global Postbooks XM XT sc_assert */

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

Postbooks.DefaultMasterRenderRow = function(context, width, height, index, object, isSelected) {
  context.fillStyle = 'clear';
  context.fillRect(0, 0, width, height);

  context.strokeStyle = 'grey';
  context.lineWidth = 1;

  context.beginPath();
  context.moveTo(32, height - 0.5);
  context.lineTo(width-32, height - 0.5);
  context.stroke();

  // context.fillStyle = base00;
  // context.fillRect(20, 6, 32, 32);

  var K = Postbooks;
  context.font = "12pt "+K.TYPEFACE;
  context.fillStyle = 'white';
  context.textAlign = 'left';
  context.textBaseline = 'middle';

  context.fillText(object.get('title'), 64, height/2);

  if (isSelected) {
    context.beginPath();
    context.moveTo(48, height/2 - 7);
    context.lineTo(56, height/2 - 1);
    context.lineTo(48, height/2 + 5);
    context.closePath();
    context.fillStyle = 'rgb(252,102,32)';
    context.fill();
  }
};

/** @class

  (Document your Model here)

  @extends SC.ListView
*/
Postbooks.MasterListView = SC.ListView.extend(
  /** @scope Postbooks.MasterListView.prototype */{

  layout: { top: 44, left: 0, width: 319, bottom: 0 },
  rowHeight: 44,
  hasHorizontalScroller: false,

  didCreateElement: function(el) {
    arguments.callee.base.apply(this, arguments);
    var style = el.style;
    style.backgroundImage =  Postbooks.createDataUrlForSprite('tile-texture');
    style.backgroundPosition = 'left top';
    style.backgroundRepeat = 'repeat';
  },

  willRenderLayers: function(context) {
    context.fillStyle = 'clear';
    context.fillRect(0, 0, context.width, context.height);
  },

  renderRow: Postbooks.DefaultMasterRenderRow

});

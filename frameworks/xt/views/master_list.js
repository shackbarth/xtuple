// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals global XT XM XT sc_assert */

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

XT.DefaultMasterRenderRow = function(context, width, height, index, object, isSelected) {
  context.fillStyle = isSelected? '#99CCFF' : 'white';
  context.fillRect(0, 0, width, height);

  context.strokeStyle = 'grey';
  context.lineWidth = 1;

  context.beginPath();
  context.moveTo(0, height - 0.5);
  context.lineTo(width, height - 0.5);
  context.stroke();

  context.fillStyle = base00;
  context.fillRect(20, 6, 32, 32);

  context.font = "12pt Helvetica";
  context.fillStyle = 'black';
  context.textAlign = 'left';
  context.textBaseline = 'middle';

  context.fillText(object.get('title'), 72, height/2);
};

XT.MasterListView = SC.ListView.extend({

  layout: { top: 44, left: 0, width: 319, bottom: 0 },
  rowHeight: 44,
  hasHorizontalScroller: false,

  willRenderLayers: function(context) {
    context.fillStyle = 'white';
    context.fillRect(0, 0, context.width, context.height);
  },

  renderRow: XT.DefaultMasterRenderRow

});

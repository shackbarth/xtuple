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

Postbooks.DefaultRecordListRenderRow = function(context, width, height, index, object, isSelected) {
  context.fillStyle = isSelected? '#99CCFF' : 'white';
  context.fillRect(0, 0, width, height);

  context.strokeStyle = 'grey';
  context.lineWidth = 1;

  context.beginPath();
  context.moveTo(0, height - 0.5);
  context.lineTo(width, height - 0.5);
  context.stroke();

  var K = Postbooks;
  context.font = "12pt "+K.TYPEFACE;
  context.fillStyle = 'black';
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  context.fillText(object.get('guid') + ': ' + (object.get('name') || object.get('description') || object.get('number')), width/2, height/2);
};

/** @class

  (Document your Model here)

  @extends SC.ListView
*/
Postbooks.RecordListView = SC.ListView.extend(
  /** @scope Postbooks.RecordListView.prototype */{

  layout: { top: 0, left: 0, right: 0, bottom: 0 },
  rowHeight: Postbooks.HEIGHT_2_ROW,
  hasHorizontalScroller: false,

  willRenderLayers: function(ctx) {
    var content = this.get('content');

    if (content && content.get('length') === 0) {
      var w = ctx.width, h = ctx.height;

      var text = '_noRecords'.loc(),
          status = content? content.get('status') : null;

      if (status && status === SC.Record.BUSY_LOADING) {
        text = "_loading".loc();
      }

      // Clear background.
      ctx.fillStyle = base3;
      ctx.fillRect(0, 0, w, h);

      // Draw view name.
      var K = Postbooks;
      ctx.fillStyle = base03;
      ctx.font = "11pt "+K.TYPEFACE;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillText(text, w/2, h/2);
    }
  },
  
  renderRow: Postbooks.DefaultRecordListRenderRow

});

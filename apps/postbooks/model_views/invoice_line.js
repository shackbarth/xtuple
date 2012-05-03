// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XM sc_assert */

sc_require('views/record_list');

Postbooks.InvoiceLine = {};
Postbooks.InvoiceLine.RenderRecordListRow = function(context, width, height, index, object, isSelected) {
  var K = Postbooks, val;

  // Rect
  context.fillStyle = isSelected? '#99CCFF' : 'white';
  context.fillRect(0, 0, width, height);

  context.strokeStyle = 'grey';
  context.lineWidth = 1;

  context.beginPath();
  context.moveTo(0, height - 0.5);
  context.lineTo(width, height - 0.5);
  context.stroke();
  
  context.textAlign = 'left';
  context.textBaseline = 'middle';
  
  // Number
  val = object.get('lineNumber');
  context.font = "bold 10pt "+K.TYPEFACE;
  context.fillStyle = 'black';
  context.textAlign = 'left';
  context.fillText(val, 15, 15);
  
  // Item
  item = object.get('item');
  val = item? item.get('number') : object.get('itemNumber');
  context.font = "9pt "+K.TYPEFACE;
  context.textAlign = 'left';
  if (val) val = val.elide(context, 200);
  context.fillText(val , 45, 15);
  
  // Sales Category
  val = item? '' : object.getPath('salesCategory.name');
  context.font = "9pt "+K.TYPEFACE;
  context.textAlign = 'right';
  if (val) val = val.elide(context, 65);
  context.fillText(val , 315, 15);
  
  // Description
  val = item? item.getPath('description1') : object.getPath('description');
  context.font = "italic 9pt "+K.TYPEFACE;
  context.textAlign = 'left';
  //if (val) val = val.elide(context, 325);
  context.fillText(val , 325, 15);

  // Ordered
  var orderedLabel = "_ordered".loc()+":";
  var orderedLabelWidth = context.measureText(orderedLabel).width;
  context.font = "9pt "+K.TYPEFACE;
  context.fillText(orderedLabel, 45, 35);

  val = object.get('ordered').toLocaleString();
  context.textAlign = 'right';
  if (val) val = val.elide(context, 100-orderedLabelWidth);
  context.fillText(val , 150, 35);
  
  // Billed
  var billedLabel = "_billed".loc()+":";
  var billedLabelWidth = context.measureText(billedLabel).width;
  context.textAlign = 'left';
  context.fillText(billedLabel, 155, 35);

  val = object.get('billed').toLocaleString();
  context.textAlign = 'right';
  if (val) val = val.elide(context, 100-billedLabelWidth);
  context.fillText(val , 260, 35);
  
  // Quantity Unit
  val = object.getPath('quantityUnit.name') || '';
  context.textAlign = 'left';
  if (val) val = val.elide(context, 50);
  context.fillText(val , 265, 35);
  
  // Price
  val = object.get('price').toLocaleString();
  context.textAlign = 'right';
  if (val) val = val.elide(context, 100);
  context.fillText(val , 400, 35);
  
  // Price Unit
  val = object.getPath('priceUnit.name') || '';
  context.textAlign = 'left';
  if (val) val = val.elide(context, 50);
  context.fillText(val , 405, 35);
  
  // Price
  var extendedLabel = "_extended".loc()+":";
  var extendedLabelWidth = context.measureText(extendedLabel).width;
  context.textAlign = 'left';
  context.fillText(extendedLabel, 485, 35);
  
  val = object.get('extendedPrice').toLocaleString();
  context.textAlign = 'right';
  if (val) val = val.elide(context, 100);
  context.fillText(val , 635, 35);

};

Postbooks.InvoiceLine.RecordListView = Postbooks.RecordListView.extend({

  rowHeight: Postbooks.HEIGHT_2_ROW,
  renderRow: Postbooks.InvoiceLine.RenderRecordListRow

});

Postbooks.InvoiceLine.CreateDetailListView = function(controller) {
  var list = Postbooks.InvoiceLine.RecordListView.create({
    layout: { top: 13, left: 0, right: 0, bottom: 0 },

    contentBinding: SC.Binding.from('arrangedObjects', controller).oneWay(),
    selectionBinding: SC.Binding.from('selection', controller),

    action: function(object, index) {
      var that = this;
      var instance = this.get('content').objectAt(index);
      if (instance) {
        Postbooks.LoadModal("InvoiceLine", "Back", instance);

        // Deselect our row after the modal transition ends.
        setTimeout(function() {
          SC.RunLoop.begin();
          that.get('content').deselectObject(instance);
          SC.RunLoop.end();
        }, 250);
      }
    }

  });
  
  return list;
};

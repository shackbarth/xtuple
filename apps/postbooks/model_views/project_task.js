// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XM sc_assert */

sc_require('views/record_list');

Postbooks.ProjectTask = {};
Postbooks.ProjectTask.RenderRecordListRow = function(context, width, height, index, object, isSelected) {
  var K = Postbooks, val;
  var currency = XT.store.find('XM.Currency', XM.Currency.BASE);

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
  
  // Due Date
  var dt = object.get('dueDate');
  var dateWidth = 0;
  if (dt) {
    val = dt.toLocaleDateString();
    var isDue = object.get('projectTaskStatus') !== XM.Project.COMPLETED &&
                XT.DateTime.compareDate(dt, XT.DateTime.create()) <= 0;
    context.font = "10pt "+K.TYPEFACE;
    context.textAlign = 'right';
    context.fillStyle = isDue? XT.EXPIRED : 'black';
    context.fillText(val , 315, 15);
    dateWidth += context.measureText(val).width + 5;
  }
  
  // Number
  val = object.get('number');
  context.font = "bold 10pt "+K.TYPEFACE;
  context.fillStyle = 'black';
  context.textAlign = 'left';
  val = val.elide(context, 290 - dateWidth);
  context.fillText(val, 15, 15);
  
  // Name
  val = object.get('name') || '';
  context.font = "9pt "+K.TYPEFACE;
  context.textAlign = 'left';
  if (val) val = val.elide(context, 300);
  context.fillText(val , 15, 35);
  
  // Status
  val = object.get('projectTaskStatusString');
  context.font = "9pt "+K.TYPEFACE;
  if (val) val = val.elide(context, 70);
  context.fillText(val , 325, 15);

  // Assigned To
  val = object.getPath('assignedTo.username') || '';
  if (val) val = val.elide(context, 70);
  context.fillText(val , 325, 35);

  // labels 
  var budgetLabel = "_budget".loc()+":";
  var budgetLabelWidth = context.measureText(budgetLabel).width;
  context.fillText(budgetLabel, 400, 15);
  var actualLabel = "_actual".loc()+":";
  var actualLabelWidth = context.measureText(actualLabel).width;
  context.fillText(actualLabel, 400, 35);

  // Budgeted Hours Total 
  val = object.get('budgetedHours');
  val = val.toLocaleString()+" "+"_hrs".loc();
  context.textAlign = 'right';
  val = val.elide(context, 145 - budgetLabelWidth);
  context.fillText(val, 535, 15);

  // Budgeted Expenses Total 
  val = object.get('budgetedExpenses');
  val = currency.toLocaleString(val);
  val = val.elide(context, 95);
  context.fillText(val, 635, 15);

  // Actual Hours Total 
  val = object.get('actualHours');
  val = val.toLocaleString()+" "+"_hrs".loc();
  val = val.elide(context, 145 - actualLabelWidth);
  context.fillText(val, 535, 35);
  
  // Actual Expenses Total 
  val = object.get('actualExpenses')
  val = currency.toLocaleString(val);
  val = val.elide(context, 95);
  context.fillText(val, 635, 35);
  
};

Postbooks.ProjectTask.RecordListView = Postbooks.RecordListView.extend({

  renderRow: Postbooks.ProjectTask.RenderRecordListRow

});

Postbooks.ProjectTask.CreateDetailListView = function(controller) {
  var list = Postbooks.ProjectTask.RecordListView.create({
    layout: { top: 13, left: 0, right: 0, bottom: 0 },

    contentBinding: SC.Binding.from('arrangedObjects', controller).oneWay(),
    selectionBinding: SC.Binding.from('selection', controller),

    action: function(object, index) {
      var that = this;
      var instance = this.get('content').objectAt(index);
      if (instance) {
        Postbooks.LoadModal("ProjectTask", "Back", instance);

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

// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XM sc_assert */

Postbooks.Project = {};
Postbooks.Project.RenderRecordListRow = function(context, width, height, index, object, isSelected) {
  var K = Postbooks, val;
  var contact = object.getPath('contact.name');
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
    var isDue = object.get('projectStatus') !== XM.Project.COMPLETED &&
                XT.DateTime.compareDate(dt, XT.DateTime.create()) <= 0;
    context.font = "8pt "+K.TYPEFACE;
    context.textAlign = 'right';
    context.fillStyle = isDue? XT.EXPIRED : 'black';
    context.fillText(val , 265, 15);
    dateWidth += context.measureText(val).width + 5;
  }
  
  // Number
  val = object.get('number');
  context.font = "bold 10pt "+K.TYPEFACE;
  context.fillStyle = 'black';
  context.textAlign = 'left';
  if (val) val = val.elide(context, 250 - dateWidth);
  context.fillText(val, 15, 15);

  // Name
  val = object.get('name');
  context.font = "8pt "+K.TYPEFACE;
  context.fillStyle = 'black';
  context.fillText(val , 15, 35);

  // Account Name
  val = object.getPath('account.name') || '';
  context.font = "italic 8pt "+K.TYPEFACE;
  if (contact) val = val.elide(context, 255);
  context.fillText(val , 15, 55);

  // Contact Name
  val = contact || '';
  context.font = "8pt "+K.TYPEFACE;
  if (val) val = val.elide(context, 120);
  context.fillText(val , 275, 55);

  // Status
  val = object.get('projectStatusString');
  if (val) val = val.elide(context, 120);
  context.fillText(val , 275, 15);

  // Assigned To
  val = object.getPath('assignedTo.username') || '';
  if (val) val = val.elide(context, 120);
  context.fillText(val , 275, 35);

  // labels 
  var budgetLabel = "_budget".loc()+":";
  var budgetLabelWidth = context.measureText(budgetLabel).width;
  context.fillText(budgetLabel, 400, 15);
  var actualLabel = "_actual".loc()+":";
  var actualLabelWidth = context.measureText(actualLabel).width;
  context.fillText(actualLabel, 400, 35);
  var balanceLabel = "_balance".loc()+":";
  var balanceLabelWidth = context.measureText(balanceLabel).width;
  context.fillText(balanceLabel, 400, 55);

  // Budgeted Hours Total 
  val = object.get('budgetedHoursTotal');
  val = val.toLocaleString()+" "+"_hrs".loc();
  context.textAlign = 'right';
  val = val.elide(context, 145 - budgetLabelWidth);
  context.fillText(val, 550, 15);

  // Budgeted Expenses Total 
  val = object.get('budgetedExpensesTotal');
  val = currency.toLocaleString(val);
  val = val.elide(context, 95);
  context.fillText(val, 650, 15);

  // Actual Hours Total 
  val = object.get('actualHoursTotal');
  val = val.toLocaleString()+" "+"_hrs".loc();
  val = val.elide(context, 145 - actualLabelWidth);
  context.fillText(val, 550, 35);
  
  // Actual Expenses Total 
  val = object.get('actualExpensesTotal')
  val = currency.toLocaleString(val);
  val = val.elide(context, 95);
  context.fillText(val, 650, 35);
  
  // Balance Hours Total 
  val = object.get('balanceHoursTotal');
  context.fillStyle = val && val.valueOf() >= 0? 'black' :  XT.ERROR;
  val = val.toLocaleString()+" "+"_hrs".loc();
  val = val.elide(context, 145 - balanceLabelWidth);
  context.fillText(val, 550, 55);
  
  // Balance Expenses Total 
  val = object.get('balanceExpensesTotal');
  context.fillStyle = val && val.valueOf() >= 0? 'black' :  XT.ERROR;
  val = currency.toLocaleString(val);
  val = val.elide(context, 95);
  context.fillText(val, 650, 55);

};

Postbooks.Project.RecordListView = Postbooks.RecordListView.extend({

  rowHeight: Postbooks.HEIGHT_3_ROW,
  renderRow: Postbooks.Project.RenderRecordListRow

});

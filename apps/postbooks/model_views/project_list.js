// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XM sc_assert */

XM.Project.RenderRecordListRow = function(context, width, height, index, object, isSelected) {
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
  
  // Due Date
  var dt = object.get('dueDate'), dateWidth = 0;
  if (dt) {
    val = dt.toLocaleDateString();
    var isDue = SC.DateTime.compareDate(dt, SC.DateTime.create()) <= 0;
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
  context.fillText(val , 15, 55);

  // Contact Name
  val = object.getPath('contact.name') || '';
  context.font = "8pt "+K.TYPEFACE;
  if (val) val = val.elide(context, 120);
  context.fillText(val , 275, 55);

  // Status
  val = object.get('projectStatusString');
  if (val) val = val.elide(context, 120);
  context.fillText(val , 275, 15);

  // Assigned To
  //FIXME: when user name is used assertion erros show up. why?
  val = 'FIXME'; //val = object.getPath('assignedTo.username') || '';
  if (val) val = val.elide(context, 120);
  context.fillText(val , 275, 35);

  // labels 
  context.fillText("_budget".loc()+":", 400, 15);
  context.fillText("_actual".loc()+":", 400, 35);
  context.fillText("_balance".loc()+":", 400, 55);

  // Budgeted Hours Total 
  val = object.get('budgetedHoursTotal');
  val = (val? val.valueOf().toFixed() : "0")+" "+"_hrs".loc();
  context.textAlign = 'right';
  context.fillText(val, 550, 15);

  // Actual Expenses Total 
  val = object.get('budgetedlExpensesTotal');
  val = val? val.valueOf().toFixed() : "0";
  context.fillText(val, 625, 15);

  // Actual Hours Total 
  val = object.get('actualHoursTotal');
  val = (val? val.valueOf().toFixed() : "0")+" "+"_hrs".loc();
  context.fillText(val, 550, 35);
  
  // Actual Expenses Total 
  val = object.get('actualExpensesTotal');
  val = val? val.valueOf().toFixed() : "0";
  context.fillText(val, 625, 35);
  
  // Balance Hours Total 
  val = object.get('balanceHoursTotal');
  context.fillStyle = val && val.valueOf() >= 0? 'black' :  XT.ERROR;
  val = (val? val.valueOf().toFixed() : "0")+" "+"_hrs".loc();
  context.textAlign = 'right';
  context.fillText(val, 550, 55);
  
  // Balance Expenses Total 
  val = object.get('balanceExpensesTotal');
  context.fillStyle = val && val.valueOf() >= 0? 'black' :  XT.ERROR;
  val = val? val.valueOf().toFixed() : "0";
  context.fillText(val, 625, 55);

};

Postbooks.RecordListView = SC.ListView.extend({

  layout: { top: 0, left: 0, right: 0, bottom: 0 },
  rowHeight: Postbooks.HEIGHT_3_ROW,
  hasHorizontalScroller: false,
  landscapeRows: 3,
  portraitRows: 3,

  renderRow: Postbooks.DefaultRecordListRenderRow

});

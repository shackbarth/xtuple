// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XM sc_assert */

XM.Receivable.RenderRecordListRow = function(context, width, height, index, object, isSelected) {
  var K = Postbooks, val;
  var contact = object.getPath('contact.name');
  var currency = object.get('currency');
  var base = XT.store.find('XM.Currency', XM.Currency.BASE);
  var sense = (object.get('documentType') === (XM.SubLedger.INVOICE || XM.SubLedger.DEBIT_MEMO))? 1 : -1;
  
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
    var isDue = object.get('isOpen') &&
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
  
  // Amount
  val = object.get('amount');
  val = currency.toLocaleString(val);
  val = val.elide(context, 95);
  context.font = "8pt "+K.TYPEFACE;
  context.textAlign = 'right';
  context.fillText(val, 165, 15);

  // Document Type
  val = object.get('documentTypeString');
  context.font = "8pt "+K.TYPEFACE;
  context.fillStyle = object.get('color');
  context.fillText(val , 165, 35);

  // Customer Name
  val = object.getPath('customer.name') || '';
  context.font = "italic 8pt "+K.TYPEFACE;
  context.textAlign = 'left';
  context.fillStyle = 'black';
  val = val.elide(context, 195);
  context.fillText(val , 275, 15);
  
  // Notes
  val = object.get('notes') || '';
  context.font = "8pt "+K.TYPEFACE;
  val = val.elide(context, 170);
  context.fillText(val , 275, 35);

  // labels 
  context.font = "8pt "+K.TYPEFACE;
  var paidLabel = "_paid".loc()+":";
  var paidLabelWidth = context.measureText(paidLabel).width;
  context.fillText(paidLabel, 475, 15);
  var balanceLabel = "_balance".loc()+":";
  var balanceLabelWidth = context.measureText(balanceLabel).width;
  context.fillText(balanceLabel, 475, 35);
  context.textAlign = 'right';

  // Paid
  val = (object.get('paid') * sense).toMoney();
  val = currency.toLocaleString(val);
  val = val.elide(context, 95);
  context.fillText(val, 600, 15);
  
  // Balance
  var balance = (object.get('balance') * sense).toMoney();
  balance = (balance * sense).toMoney();
  val = currency.toLocaleString(balance);
  val = val.elide(context, 95);
  context.fillText(val, 600, 35);
  
  // Balance
  val = base.toLocaleString(balance);
  val = val.elide(context, 95);
  context.fillText(val, 675, 35);

};


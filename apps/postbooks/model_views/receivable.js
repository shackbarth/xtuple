// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XM sc_assert */

Postbooks.Receivable = {};
Postbooks.Receivable.RenderRecordListRow = function(context, width, height, index, object, isSelected) {
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
  if (val && val.elide) val = val.elide(context, 250 - dateWidth);
  context.fillText(val, 15, 15);
  
  // Amount
  val = object.get('amount');
  val = currency.toLocaleString(val);
  if (val && val.elide) val = val.elide(context, 95);
  context.font = "9pt "+K.TYPEFACE;
  context.textAlign = 'right';
  context.fillText(val, 315, 35);

  // Document Type
  val = object.get('documentTypeString');
  context.font = "9pt "+K.TYPEFACE;
  context.textAlign = 'left';
  context.fillStyle = object.get('color');
  context.fillText(val , 15, 35);

  // Customer Name
  val = object.getPath('customer.name') || '';
  context.font = "italic 9pt "+K.TYPEFACE;
  context.textAlign = 'left';
  context.fillStyle = 'black';
  if (val && val.elide) val = val.elide(context, 160);
  context.fillText(val , 325, 15);
  
  // Notes
  val = object.get('notes') || '';
  context.font = "9pt "+K.TYPEFACE;
  if (val && val.elide) val = val.elide(context, 160);
  context.fillText(val , 325, 35);

  // labels 
  context.font = "9pt "+K.TYPEFACE;
  var paidLabel = "_paid".loc();
  var paidLabelWidth = context.measureText(paidLabel).width;
  context.fillText(paidLabel, 490, 15);
  var balanceLabel = "_balance".loc();
  var balanceLabelWidth = context.measureText(balanceLabel).width;
  context.fillText(balanceLabel, 490, 35);
  context.textAlign = 'right';

  // Paid
  val = (object.get('paid') * sense).toMoney();
  val = currency.toLocaleString(val);
  if (val && val.elide) val = val.elide(context, 95);
  context.fillText(val, 600, 15);
  
  // Balance
  var balance = (object.get('balance') * sense).toMoney();
  balance = (balance * sense).toMoney();
  val = currency.toLocaleString(balance);
  if (val && val.elide) val = val.elide(context, 95);
  context.fillText(val, 600, 35);
  
  // Balance
  // FIXME: Why doesn't this get updated even when re-rendering the view? 
  // It seems property changed is not being called
  if (currency.get('id') !== base.get('id')) {
    balance = (object.getPath('balanceMoney.baseValue') * sense).toMoney();
    val = "- " + base.toLocaleString(balance);
    context.textAlign = 'left';
    if (val && val.elide) val = val.elide(context, 95);
    context.fillText(val, 605, 35);
  }

};


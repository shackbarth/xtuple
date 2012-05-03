// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XM sc_assert */

Postbooks.CashReceipt = {};
Postbooks.CashReceipt.RenderRecordListRow = function(context, width, height, index, object, isSelected) {
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
  val = object.get('number');
  context.font = "bold 10pt "+K.TYPEFACE;
  context.fillStyle = 'black';
  context.fillText(val, 15, 15);
  var numberWidth = context.measureText(val).width;

  // Amount
  var amount = object.getPath('amount');
  var currency = object.getPath('currency');
  val = currency.toLocaleString(amount);
  context.font = "9pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.textAlign = 'right';
  context.fillText(val, 315, 35);

  // Distribution Date
  var dt = object.get('distributionDate');
  if (dt) {
    val = dt.toLocaleDateString();
    var isDue = !object.get('isPosted') &&
                XT.DateTime.compareDate(dt, XT.DateTime.create()) <= 0;
    context.font = "10pt "+K.TYPEFACE;
    context.textAlign = 'right';
    context.fillStyle = isDue? XT.EXPIRED : 'black';
    context.fillText(val , 315, 15);
  }

  // Funds Type
  var docNumber = object.getPath('documentNumber') || '';
  val = object.get('fundsTypeString');
  if (docNumber) val += ": "+docNumber;
  context.font = "9pt "+K.TYPEFACE;
  context.fillStyle = 'black';
  context.textAlign = 'left';
  context.fillText(val, 15, 35);

  // Customer Name
  val = object.getPath('customer.name');
  context.font = "italic 9pt "+K.TYPEFACE;
  context.textAlign = 'left';
  context.fillStyle = 'black';
  context.fillText(val , 325, 15);
  
  // Posted
  var isPosted = object.getPath('isPosted');
  val = isPosted? "_posted".loc() : '';
  context.fillText(val, 490, 35);
  
  // Bank Account
  val = object.getPath('bankAccount.description') || '';
  context.font = "9pt "+K.TYPEFACE;
  if (isPosted) val = val.elide(context, 160);
  context.fillText(val, 325, 35);

};


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
  context.font = "8pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.textAlign = 'right';
  val = val.elide(context, 145 - numberWidth);
  context.fillText(val, 165, 15);

  // Distribution Date
  var dt = object.get('distributionDate');
  if (dt) {
    val = dt.toLocaleDateString();
    context.font = "8pt "+K.TYPEFACE;
    context.textAlign = 'right';
    context.fillStyle = 'black';
    context.fillText(val , 265, 15);
  }

  // Funds Type
  val = object.get('fundsTypeString');
  context.fillStyle = 'black';
  context.fillText(val, 265, 35);

  // Customer Name
  val = object.getPath('customer.name');
  context.font = "italic 8pt "+K.TYPEFACE;
  context.textAlign = 'left';
  context.fillStyle = 'black';
  if (isPosted) val.elide(context, 195);
  context.fillText(val , 275, 15);
  
  // Document Number
  val = object.getPath('documentNumber') || '';
  context.font = "8pt "+K.TYPEFACE;
  context.fillText(val, 275, 35);
  
  // Bank Account
  val = object.getPath('bankAccount.name') || '';
  context.fillText(val, 475, 15);
  
  // Posted
  var isPosted = object.getPath('isPosted');
  val = isPosted? "_posted".loc() : '';
  context.fillText(val, 475, 35);

};


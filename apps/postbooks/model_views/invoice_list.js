// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XM sc_assert */

XM.Invoice.RenderRecordListRow = function(context, width, height, index, object, isSelected) {
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

  // Total
  var amount = object.getPath('total');
  var currency = object.getPath('currency');
  val = currency.toLocaleString(amount);
  context.font = "8pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.textAlign = 'right';
  val = val.elide(context, 145 - numberWidth);
  context.fillText(val, 165, 15);

  // Invoice Date
  val = object.get('invoiceDate').toLocaleDateString();
  context.font = "8pt "+K.TYPEFACE;
  context.textAlign = 'right';
  val = val.elide(context, 95);
  context.fillText(val , 265, 15);
 
  // Printed
  var isPrinted = object.getPath('isPrinted');
  val = isPrinted? "_printed".loc() : '';
  context.textAlign = 'left';
  context.fillStyle = 'black';
  context.fillText(val, 475, 15);
 
  // Posted
  var isPosted = object.getPath('isPosted');
  val = isPosted? "_posted".loc() : '';
  context.fillStyle = 'black';
  context.fillText(val, 475, 35);
  
  // Terms
  val = object.getPath('terms.code');
  context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.fillText(val? val : "_noTerms".loc(), 575, 15);
  
  // Sales Rep
  val = object.getPath('salesRep.name');
  context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.fillText(val? val : "_noSalesRep".loc(), 575, 35);
    
  // Billto Name
  val = object.getPath('billtoName');
  context.font = "italic 8pt "+K.TYPEFACE;
  context.fillStyle = 'black';
  if (isPrinted) val.elide(context, 195);
  context.fillText(val , 275, 15);
  
  // Shipto Label
  context.textAlign = 'right';
  context.font = "8pt "+K.TYPEFACE;
  context.fillText("_shipto".loc()+":" , 265, 35);
  
  // Shipto Name
  val = object.getPath('shiptoName');
  context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.textAlign = 'left';
  context.fillText(val? val : "_sameAsBillto".loc(), 275, 35);

};


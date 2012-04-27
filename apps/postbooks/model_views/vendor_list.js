// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XM sc_assert */

XM.Vendor.RenderRecordListRow = function(context, width, height, index, object, isSelected) {
  var K = Postbooks, val;
  var contact = object.get('primaryContact');
  var address = contact? contact.get('address') : null;
  address = address? address.formatShort() : '';
  
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
  
  // Primary Contact Phone
  var phoneWidth = 0;
  val = contact? contact.get('phone') : '';
  context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.textAlign = 'right';
  if (val) val = val.elide(context, 195);
  context.fillText(val, 265, 15);
  if (val) phoneWidth = context.measureText(val).width + 5;
  if (phoneWidth < 0) phoneWidth = 0;
  
  // Number
  val = object.get('number');
  context.font = (val? "bold " : "italic ")+"10pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.textAlign = 'left';
  val = val.elide(context, 255 - phoneWidth);
  context.fillText(val, 15, 15);
  
  // Name
  val = object.get('name');
  context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  if (address) val = val.elide(context, 255);
  context.fillText(val? val : "_noName".loc(), 15, 35);

  // Primary Contact Name
  val = contact? contact.get('name') : '';
  context.font = "italic 8pt "+K.TYPEFACE;
  context.textAlign = 'left';
  context.fillStyle = val? 'black' : base1;
  val = val? val : "_noContact".loc();
  val = val.elide(context, 195);
  context.fillText(val, 275, 15);
          
  // Primary Contact Email
  val = contact? contact.get('primaryEmail') : '';
  context.font = "8pt "+K.TYPEFACE;
  context.textAlign = 'left';
  context.fillStyle = 'blue';
  context.fillText(val, 475, 15);
  
  // Primary Contact Location
  val = address;
  context.font = "8pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.fillText(val , 275, 35);

};

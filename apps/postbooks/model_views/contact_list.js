// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XM sc_assert */

sc_require('views/record_list');

XM.Contact.RenderRecordListRow = function(context, width, height, index, object, isSelected) {
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
 
  // Phone
  var phoneWidth = 0;
  val = object.get('phone') || '';
  context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.textAlign = 'right';
  if (val) val = val.elide(context, 195);
  context.fillText(val, 265, 15);
  if (val) phoneWidth = context.measureText(val).width + 5;
  if (phoneWidth < 0) phoneWidth = 0;
    
  // Contact Name
  val = object.get('name');
  context.font = (val? "bold " : "italic ")+"10pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.textAlign = 'left';
  val = val? val : "_noName".loc()
  val = val.elide(context, 255 - phoneWidth);
  context.fillText(val, 15, 15);

  // Account Name
  val = object.getPath('account.name');
  context.font = "italic 8pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.textAlign = 'left';
  val = val? val : "_noAccountName".loc()
  val = val.elide(context, 195);
  context.fillText(val , 275, 15);
  
  // Title
  val = object.get('jobTitle');
  context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  val = val? val : "_noJobTitle".loc();
  val = val.elide(context, 195);
  context.fillText(val , 15, 35);

  // Email
  val = object.getPath('primaryEmail');
  val = val? val : "_noEmail".loc();
  context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
  context.fillStyle = val? 'blue' : base1;
  context.fillText(val , 475, 15);

  // Location
  val = object.get('address');
  val = val? val.formatShort() : '';
  context.font = "8pt "+K.TYPEFACE;
  context.fillStyle = 'black';
  context.fillText(val , 275, 35);

};


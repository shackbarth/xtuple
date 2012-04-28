// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XM sc_assert */

XM.Account.RenderRecordListRow = function(context, width, height, index, object, isSelected) {
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
  context.font = (val? "bold " : "italic ")+"10pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  if (val) val = val.elide(context, 115);
  context.fillText(val? val : "_noNumber".loc(), 15, 15);
  
  // Name
  val = object.get('name');
  context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  if (val) val = val.elide(context, 295);
  context.fillText(val? val : "_noName".loc(), 15, 35);

  // Primary Contact Name
  var contact = object.get('primaryContact') || ''; 
  val = contact? contact.get('name') : '';
  context.font = (val? "" : "italic ")+"10pt "+K.TYPEFACE;
  context.textAlign = 'left';
  context.fillStyle = val? 'black' : base1;
  if (val) val = val.elide(context, 175);
  context.fillText(val, 135, 15);
  
  // Primary Contact Phone
  val = contact? contact.get('phone') : '';
  context.font = "10pt "+K.TYPEFACE;
  context.textAlign = 'left';
  context.fillStyle = 'black';
  if (val) val = val.elide(context, 120);
  context.fillText(val, 315, 15);
  
  // 3 Row format
  if (width<K.PORTRAIT_LIST_WIDTH) {
  
    // Primary Contact Email
    val = contact? contact.get('primaryEmail') : '';
    context.font = "8pt "+K.TYPEFACE;
    context.textAlign = 'left';
    context.fillStyle = 'blue';
    context.fillText(val, 315, 35);
    
    // Primary Contact Location
    val = contact? contact.get('address') : null;
    val = val? val.formatShort() : '';
    context.font = "italic 8pt "+K.TYPEFACE;
    context.fillStyle = val? 'black' : base1;
    context.fillText(val , 15, 55);


  // 2 Row format
  } else {
          
    // Primary Contact Email
    val = contact? contact.get('primaryEmail') : '';
    context.font = "8pt "+K.TYPEFACE;
    context.textAlign = 'left';
    context.fillStyle = 'blue';
    context.fillText(val, 435, 15);
    
    // Primary Contact Location
    val = contact? contact.get('address') : null;
    val = val? val.formatShort() : '';
    context.font = "italic 8pt "+K.TYPEFACE;
    context.fillStyle = val? 'black' : base1;
    context.fillText(val , 315, 35);

  }

};

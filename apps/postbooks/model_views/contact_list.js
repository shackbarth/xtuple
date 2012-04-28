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
  
  // Contact Name
  val = object.get('name');
  context.font = (val? "bold " : "italic ")+"10pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  if (val) val = val.elide(context, 195);
  context.fillText(val? val : "_noName".loc(), 15, 15);

  // Phone
  val = object.get('phone');
  context.font = (val? "" : "italic ")+"10pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  if (val) val = val.elide(context, 195);
  context.fillText(val? val : "_noPhone".loc(), 215, 15);

  // Title
  val = object.get('jobTitle');
  context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  if (val) val = val.elide(context, 195);
  context.fillText(val? val : "_noJobTitle".loc() , 15, 35);

  // 3 Row format
  if (width<K.PORTRAIT_LIST_WIDTH) {

    // Account Name
    val = object.getPath('account.name');
    context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
    context.fillStyle = val? 'black' : base1;
    if (val) val = val.elide(context, 195);
    context.fillText(val? val : "_noAccountName".loc() , 15, 55);
  
    // Email
    val = object.getPath('primaryEmail');
    context.font = (val? "" : "italic ")+"10pt "+K.TYPEFACE;
    context.fillStyle = val? 'blue' : base1;
    context.fillText(val? val : "_noEmail".loc() , 215, 35);
    
    // Location
    val = object.get('address');
    val = val? val.formatShort() : '';
    context.font = "italic 8pt "+K.TYPEFACE;
    context.fillStyle = 'black';
    context.fillText(val , 215, 55);

  // 2 Row format
  } else {
          
    // Account Name
    val = object.getPath('account.name');
    context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
    context.fillStyle = val? 'black' : base1;
    if (val) val = val.elide(context, 195);
    context.fillText(val? val : "_noAccountName".loc() , 215, 35);
  
    // Email
    val = object.getPath('primaryEmail');
    context.font = (val? "" : "italic ")+"10pt "+K.TYPEFACE;
    context.fillStyle = val? 'blue' : base1;
    context.fillText(val? val : "_noEmail".loc() , 415, 15);

    // Location
    val = object.get('address');
    val = val? val.formatShort() : '';
    context.font = "italic 8pt "+K.TYPEFACE;
    context.fillStyle = 'black';
    context.fillText(val , 415, 35);

  }

};


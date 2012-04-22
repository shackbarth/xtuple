// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XM sc_assert */

XM.Incident.RenderRecordListRow = function(context, width, height, index, object, isSelected) {
  var K = Postbooks, val;
  
  // Rect
  val = object.get('color');
  context.fillStyle = isSelected? '#99CCFF' : val;
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
  context.fillText(val? val : "_noNumber".loc(), 15, 15);
  
  // Updated
  var dt = object.get('updated');
  val = new Date(dt.get('milliseconds')).toLocaleDateString();
  var isToday = SC.DateTime.compareDate(dt, SC.DateTime.create()) == 0;
  context.font = (isToday? "bold " : "")+"8pt "+K.TYPEFACE;
  context.textAlign = 'right';
  context.fillStyle = 'black';
  context.fillText(val , 265, 15);

  // Status
  val = object.get('incidentStatusString');
  context.font = "10pt "+K.TYPEFACE;
  context.textAlign = 'left';
  context.fillStyle = val? 'black' : base1;
  context.fillText(val , 300, 15);
  
  // Description
  val = object.get('description');
  context.font = "8pt "+K.TYPEFACE;
  context.fillStyle = 'black';
  context.fillText(val , 15, 35);

  // Priority
  val = object.getPath('priority.name');
  var emphasis = object.getPath('priority.order')<=1? "bold " : "";
  context.font = (val? emphasis : "italic ")+"8pt "+K.TYPEFACE;
  context.fillStyle = val? black : base1;
  context.fillText(val? val : "_noPriority".loc(), 375, 15);
  
  // Category
  val = object.getPath('category.name');
  context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.fillText(val? val : "_noCategory".loc(), 375, 35);
  
  // 3 Row format
  if (width<K.PORTRAIT_LIST_WIDTH) {

    // Account Name
    val = object.getPath('account.name');
    context.font = "italic 8pt "+K.TYPEFACE;
    context.fillStyle = val? 'black' : base1;
    context.fillText(val , 15, 55);
   
    // Contact Name
    val = object.getPath('contact.name');
    context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
    context.fillStyle = val? 'black' : base1;
    context.fillText(val? val : "_noName".loc() , 300, 55);

  // 2 Row format
  } else {
          
    // Account Name
    val = object.getPath('account.name');
    context.font = "italic 8pt "+K.TYPEFACE;
    context.fillStyle = val? 'black' : base1;
    context.fillText(val , 450, 15);
   
    // Contact Name
    val = object.getPath('contact.name');
    context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
    context.fillStyle = val? 'black' : base1;
    context.fillText(val? val : "_noName".loc() , 450, 35);

  }

};

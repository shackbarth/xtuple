// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XM sc_assert */

XM.ToDo.RenderRecordListRow = function(context, width, height, index, object, isSelected) {
  var K = Postbooks, val;
  var contact = object.getPath('contact.name');
  var assignedTo = object.getPath('assignedTo.username');
  
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
    var isDue = object.get('isActive') &&
                XT.DateTime.compareDate(dt, XT.DateTime.create()) <= 0;
    context.font = "8pt "+K.TYPEFACE;
    context.textAlign = 'right';
    context.fillStyle = isDue? XT.EXPIRED : 'black';
    context.fillText(val , 265, 15);
    dateWidth += context.measureText(val).width + 5;
  }
  
  // Name
  val = object.get('name');
  context.font = (val? "bold " : "italic ")+"10pt "+K.TYPEFACE;
  context.fillStyle = 'black';
  context.textAlign = 'left';
  val = val.elide(context, 250 - dateWidth);
  context.fillText(val? val : "_noName".loc(), 15, 15);
  
  // 3 Row format
  if (width<K.PORTRAIT_LIST_WIDTH) {
    // Description
    val = object.get('description');
    context.font = "8pt "+K.TYPEFACE;
    val = (val && assignedTo)? val.elide(context, 255) : '';
    context.fillText(val , 15, 35);

    // Status
    val = object.get('toDoStatusString');
    context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
    context.fillStyle = val? 'black' : base1;
    context.fillText(val? val : "_noStatus".loc(), 275, 15);
    
    // Assigned To
    val = assignedTo || '';
    context.font = "8pt "+K.TYPEFACE;
    context.fillStyle = 'black';
    context.fillText(val , 275, 35);  
    
    // Priority
    val = object.getPath('priority.name');
    var emphasis = object.getPath('priority.order')<=1? "bold " : "";
    context.font = (val? emphasis : "italic ")+"8pt "+K.TYPEFACE;
    context.fillStyle = val? black : base1;
    context.fillText(val? val : "_noPriority".loc(), 375, 15);

    // Account Name
    val = object.getPath('account.name');
    context.font = "italic 8pt "+K.TYPEFACE;
    context.fillStyle = val? 'black' : base1;
    val = (val && contact)? val.elide(context, 255) : '';
    context.fillText(val? val : "_noAccountName".loc() , 15, 55);
   
    // Contact Name
    val = contact || '';
    context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
    context.fillStyle = val? 'black' : base1;
    context.fillText(val, 275, 55);

  // 2 Row format
  } else {
  // Description
    val = object.get('description');
    context.font = "8pt "+K.TYPEFACE;
    if (val && contact) val = val.elide(context, 250);
    context.fillText(val , 15, 35);
  
    // Account Name
    val = object.getPath('account.name');
    context.font = "italic 8pt "+K.TYPEFACE;
    context.fillStyle = val? 'black' : base1;
    val = val? val.elide(context, 195) : null;
    context.fillText(val? val : "_noAccountName".loc() , 275, 15);
  
    // Contact Name
    val = contact;
    context.font = "8pt "+K.TYPEFACE;
    context.fillStyle = val? 'black' : base1;
    val = val? val.elide(context, 195) : '';
    context.fillText(val, 275, 35);
  
    // Status
    val = object.get('toDoStatusString');
    context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
    context.fillStyle = val? 'black' : base1;
    context.fillText(val? val : "_noStage".loc(), 475, 15);
    
    // Assigned To
    val = assignedTo || '';
    context.font = "8pt "+K.TYPEFACE;
    context.fillStyle = 'black';
    context.fillText(val , 475, 35);  

    // Priority
    val = object.getPath('priority.name');
    var emphasis = object.getPath('priority.order')<=1? "bold " : "";
    context.font = (val? emphasis : "italic ")+"8pt "+K.TYPEFACE;
    context.fillStyle = val? black : base1;
    context.fillText(val? val : "_noPriority".loc(), 575, 15);

  }

};

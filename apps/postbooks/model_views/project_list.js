// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XM sc_assert */

XM.Project.RenderRecordListRow = function(context, width, height, index, object, isSelected) {
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
  context.fillText(val? val : "_noNumber".loc(), 15, 15);
  
  // Updated
  var dt = object.get('dueDate');
  if (dt) {
    val = new Date(dt.get('milliseconds')).toLocaleDateString();
    var isDue = SC.DateTime.compareDate(dt, SC.DateTime.create()) <= 0;
    context.font = "8pt "+K.TYPEFACE;
    context.textAlign = 'right';
    context.fillStyle = isDue? XT.EXPIRED : 'black';
    context.fillText(val , 265, 15);
  }
  
  // Name
  val = object.get('name');
  context.font = "8pt "+K.TYPEFACE;
  context.textAlign = 'left';
  context.fillStyle = 'black';
  context.fillText(val , 15, 35);
  
  // 3 Row format
  if (width<K.PORTRAIT_LIST_WIDTH) {

    // Account Name
    val = object.getPath('account.name');
    context.font = "italic 8pt "+K.TYPEFACE;
    context.fillStyle = val? 'black' : base1;
    context.fillText(val? val : "_noAccountName".loc() , 15, 55);
   
    // Contact Name
    val = object.getPath('contact.name');
    context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
    context.fillStyle = val? 'black' : base1;
    context.fillText(val? val : "_noContact".loc(), 275, 55);
  
    // Status
    val = object.get('projectStatusString');
    context.font = "8pt "+K.TYPEFACE;
    context.fillStyle = 'black';
    context.fillText(val , 275, 15);
    
    // Assigned To
    val = object.getPath('assignedTo.username') || '';
    context.font = "8pt "+K.TYPEFACE;
    context.fillStyle = 'black';
    context.fillText(val , 275, 35);

    // Total Actual Hours
    val = object.get('actualHoursTotal');
    val = val? val.toString() : "0";
    context.textAlign = 'right';
    context.fillStyle = val? black : base1;
    context.fillText(val, 425, 15);
    
    // Total Actual Expenses
    val = object.get('actualExpensesTotal');
    val = val? val.toString() : "0";
    context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
    context.fillStyle = val? 'black' : base1;
    context.fillText(val, 425, 35);

  // 2 Row format
  } else {
          
    // Account Name
    val = object.getPath('account.name');
    context.font = "italic 8pt "+K.TYPEFACE;
    context.textAlign = 'left';
    context.fillStyle = val? 'black' : base1;
    context.fillText(val? val : "_noAccountName".loc() , 275, 15);
   
    // Contact Name
    val = object.getPath('contact.name');
    context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
    context.fillStyle = val? 'black' : base1;
    context.fillText(val? val : "_noContact".loc() , 275, 35);
    
    // Status
    val = object.get('projectStatusString');
    context.font = "8pt "+K.TYPEFACE;
    context.fillStyle = 'black';
    context.fillText(val , 475, 15);
    
    // Assigned To
    val = object.getPath('assignedTo.username') || '';
    context.font = "8pt "+K.TYPEFACE
    context.fillStyle = 'black';
    context.fillText(val , 475, 35);

    // Total Actual Hours
    val = object.get('actualHoursTotal');
    val = val? val.toString() : "0";
    context.textAlign = 'right';
    context.fillStyle = val? black : base1;
    context.fillText(val, 625, 15);
    
    // Total Actual Expenses
    val = object.get('actualExpensesTotal');
    val = val? val.toString() : "0";
    context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
    context.fillStyle = val? 'black' : base1;
    context.fillText(val, 625, 35);

  }

};

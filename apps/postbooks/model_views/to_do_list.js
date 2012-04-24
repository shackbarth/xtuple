// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XM sc_assert */

XM.ToDo.RenderRecordListRow = function(context, width, height, index, object, isSelected) {
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

  // Name
  val = object.get('name');
  context.font = (val? "bold " : "italic ")+"10pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.fillText(val? val : "_noName".loc(), 15, 15);
  
  // Due Date
  var dt = object.get('dueDate');
  if (dt) {
    val = dt.toLocaleDateString();
    var isDue = SC.DateTime.compareDate(dt, SC.DateTime.create()) <= 0;
    context.font = "8pt "+K.TYPEFACE;
    context.textAlign = 'right';
    context.fillStyle = isDue? XT.EXPIRED : 'black';
    context.fillText(val , 265, 15);
  }
  
  // Description
  val = object.get('description');
  context.font = "8pt "+K.TYPEFACE;
  context.textAlign = 'left';
  context.fillStyle = 'black';
  context.fillText(val , 15, 35);
  
  // 3 Row format
  if (width<K.PORTRAIT_LIST_WIDTH) {

    // Status
    val = object.get('toDoStatusString');
    context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
    context.fillStyle = val? 'black' : base1;
    context.fillText(val? val : "_noStatus".loc(), 275, 15);
    
    // Assigned To
    //FIXME: when user name is used assertion erros show up. why?
    val = 'FIXME'; //val = object.getPath('assignedTo.username') || '';
    context.font = "8pt "+K.TYPEFACE;
    context.fillStyle = 'black';
    context.fillText(val , 275, 35);  
    
    // Priority
    val = object.getPath('priority.name');
    var emphasis = object.getPath('priority.order')<=1? "bold " : "";
    context.font = (val? emphasis : "italic ")+"8pt "+K.TYPEFACE;
    context.fillStyle = val? black : base1;
    context.fillText(val? val : "_noPriority".loc(), 375, 15);
   /* 
    // Type
    val = object.getPath('opportunityType.name');
    context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
    context.fillStyle = val? 'black' : base1;
    context.fillText(val? val : "_noType".loc(), 375, 35);
*/
    // Account Name
    val = object.getPath('account.name');
    context.font = "italic 8pt "+K.TYPEFACE;
    context.fillStyle = val? 'black' : base1;
    context.fillText(val? val : "_noAccountName".loc() , 15, 55);
   
    // Contact Name
    val = object.getPath('contact.name') || '';
    context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
    context.fillStyle = val? 'black' : base1;
    context.fillText(val? val : "_noContact".loc(), 275, 55);

  // 2 Row format
  } else {
  
    // Account Name
    val = object.getPath('account.name');
    context.font = "italic 8pt "+K.TYPEFACE;
    context.fillStyle = val? 'black' : base1;
    context.fillText(val? val : "_noAccountName".loc() , 275, 15);
  
    // Contact Name
    val = object.getPath('contact.name') || '';
    context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
    context.fillStyle = val? 'black' : base1;
    context.fillText(val? val : "_noContact".loc(), 275, 35);
  
    // Status
    val = object.get('toDoStatusString');
    context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
    context.fillStyle = val? 'black' : base1;
    context.fillText(val? val : "_noStage".loc(), 475, 15);
    
    // Assigned To
    val = object.getPath('assignedTo.username') || '';
    context.font = "8pt "+K.TYPEFACE;
    context.fillStyle = 'black';
    context.fillText(val , 475, 35);  

    // Priority
    val = object.getPath('priority.name');
    var emphasis = object.getPath('priority.order')<=1? "bold " : "";
    context.font = (val? emphasis : "italic ")+"8pt "+K.TYPEFACE;
    context.fillStyle = val? black : base1;
    context.fillText(val? val : "_noPriority".loc(), 575, 15);
    /*
    // Type
    val = object.getPath('opportunityType.name');
    context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
    context.fillStyle = val? 'black' : base1;
    context.fillText(val? val : "_noType".loc(), 575, 35);
*/
  }

};

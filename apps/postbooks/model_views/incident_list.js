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
  context.font = "bold 10pt "+K.TYPEFACE;
  context.fillStyle = 'black';
  context.fillText(val, 15, 15);
  
  // Updated
  var dt = object.get('updated');
  val = dt.toLocaleDateString();
  var isToday = XT.DateTime.compareDate(dt, XT.DateTime.create()) == 0;
  context.font = (isToday? "bold " : "")+"8pt "+K.TYPEFACE;
  context.textAlign = 'right';
  context.fillStyle = 'black';
  context.fillText(val , 265, 15);
  
  // Description
  val = object.get('description');
  context.font = "8pt "+K.TYPEFACE;
  context.textAlign = 'left';
  context.fillStyle = 'black';
  if (val) val = val.elide(context, 255);
  context.fillText(val , 15, 35);
  
  // 3 Row format
  if (width<K.PORTRAIT_LIST_WIDTH) {

    // Account Name
    val = object.getPath('account.name');
    context.font = "italic 8pt "+K.TYPEFACE;
    context.fillStyle = val? 'black' : base1;
    if (val) val = val.elide(context, 255);
    context.fillText(val , 15, 55);
   
    // Contact Name
    val = object.getPath('contact.name');
    context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
    context.fillStyle = val? 'black' : base1;
    context.fillText(val? val : "_noName".loc() , 275, 55);
  
    // Status
    val = object.get('incidentStatusString');
    context.font = "8pt "+K.TYPEFACE;
    context.fillStyle = 'black';
    if (val) val = val.elide(context, 95);
    context.fillText(val , 275, 15);
    
    // Assigned To
    val = object.getPath('assignedTo.username') || '';
    context.font = "8pt "+K.TYPEFACE;
    context.fillStyle = 'black';
    if (val) val = val.elide(context, 95);
    context.fillText(val , 275, 35);
        
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

  // 2 Row format
  } else {
          
    // Account Name
    val = object.getPath('account.name');
    context.font = "italic 8pt "+K.TYPEFACE;
    context.fillStyle = val? 'black' : base1;
    if (val) val = val.elide(context, 195);
    context.fillText(val , 275, 15);
   
    // Contact Name
    val = object.getPath('contact.name');
    context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
    context.fillStyle = val? 'black' : base1;
    if (val) val = val.elide(context, 195);
    context.fillText(val? val : "_noName".loc() , 275, 35);
    
    // Status
    val = object.get('incidentStatusString');
    context.font = "8pt "+K.TYPEFACE;
    context.fillStyle = 'black';
    if (val) val = val.elide(context, 95);
    context.fillText(val , 475, 15);
    
    // Assigned To
    val = object.get('assignedTo');
    val = val? val.get('username') : '';
    context.font = "8pt "+K.TYPEFACE;
    context.fillStyle = 'black';
    if (val) val = val.elide(context, 95);
    context.fillText(val , 475, 35);
        
    // Priority
    val = object.getPath('priority.name');
    var emphasis = object.getPath('priority.order')<=1? "bold " : "";
    context.font = (val? emphasis : "italic ")+"8pt "+K.TYPEFACE;
    context.fillStyle = val? black : base1;
    context.fillText(val? val : "_noPriority".loc(), 575, 15);
    
    // Category
    val = object.getPath('category.name');
    context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
    context.fillStyle = val? 'black' : base1;
    context.fillText(val? val : "_noCategory".loc(), 575, 35);

  }

};

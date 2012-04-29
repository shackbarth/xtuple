// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XM sc_assert */

Postbooks.Opportunity = {};
Postbooks.Opportunity.RenderRecordListRow = function(context, width, height, index, object, isSelected) {
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

  // Target Close
  var dt = object.get('targetClose');
  context.textAlign = 'right';
  if (dt) {
    val = dt.toLocaleDateString();
    var isDue = object.get('isActive') &&
                XT.DateTime.compareDate(dt, XT.DateTime.create()) <= 0;
    context.font = "10pt "+K.TYPEFACE;
    context.fillStyle = isDue? XT.EXPIRED : 'black';
    context.fillText(val , 315, 15);
  } else {
    context.font = "italic 8pt "+K.TYPEFACE;
    context.fillStyle = base1;
    context.fillText("_noTargetDate".loc() , 315, 15);
  }
  
  // Amount
  var amount = object.getPath('amount');
  var currency = object.getPath('currency');
  var amountWidth = 0;
  if (amount) {
    val = currency.toLocaleString(amount);
    val = val? val.toLocaleString() : '';
    context.font = "8pt "+K.TYPEFACE;
    context.fillStyle = val? 'black' : base1;
    context.textAlign = 'right';
    context.fillText(val, 315, 35);
    amountWidth = val.length? context.measureText(val).width + 5 : 0;
  }
  
  // Name
  val = object.get('name');
  context.font = "8pt "+K.TYPEFACE;
  context.textAlign = 'left';
  context.fillStyle = 'black';
  if (val) val = val.elide(context, 300 - amountWidth);
  context.fillText(val , 15, 35);
  
  // Account Name
  val = object.getPath('account.name');
  context.font = "italic 8pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  if (val) val = val.elide(context, 160);
  context.fillText(val , 325, 15);

  // Contact Name
  val = object.getPath('contact.name') || '';
  context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  if (val) val = val.elide(context, 160);
  context.fillText(val? val : "_noContact".loc(), 325, 35);

  // Stage
  val = object.getPath('opportunityStage.name');
  context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  if (val) val = val.elide(context, 70);
  context.fillText(val? val : "_noStage".loc(), 490, 15);
  
  // Assigned To
  val = object.getPath('assignedTo.username') || '';
  context.font = "8pt "+K.TYPEFACE;
  context.fillStyle = 'black';
  if (val) val = val.elide(context, 70);
  context.fillText(val , 490, 35);  

  // Priority
  val = object.getPath('priority.name');
  var emphasis = object.getPath('priority.order')<=1? "bold " : "";
  context.font = (val? emphasis : "italic ")+"8pt "+K.TYPEFACE;
  context.fillStyle = val? black : base1;
  context.fillText(val? val : "_noPriority".loc(), 565, 15);
  
  // Type
  val = object.getPath('opportunityType.name');
  context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.fillText(val? val : "_noType".loc(), 565, 35);

};

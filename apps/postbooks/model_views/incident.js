// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XM sc_assert */

var base03 =   "#002b36";
var base02 =   "#073642";
var base01 =   "#586e75";
var base00 =   "#657b83";
var base0 =    "#839496";
var base1 =    "#93a1a1";
var base2 =    "#eee8d5";
var base3 =    "#fdf6e3";
var yellow =   "#b58900";
var orange =   "#cb4b16";
var red =      "#dc322f";
var magenta =  "#d33682";
var violet =   "#6c71c4";
var blue =     "#268bd2";
var cyan =     "#2aa198";
var green =    "#859900";
var white =    "white";

XM.Incident.RenderRecordListRow = function(context, width, height, index, object, isSelected) {
  var K = Postbooks;
  
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

  // Contact Number
  var val = object.get('number');
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
  context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
  context.textAlign = 'left';
  context.fillStyle = val? 'black' : base1;
  context.fillText(val , 300, 15);
  
  // Description
  val = object.get('description');
  context.font = (val? "" : "italic ")+"10pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.fillText(val? val : "_noDescription".loc() , 15, 35);

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

  // Priority
  val = object.getPath('priority.name');
  var color = object.getPath('priority.color');
  context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
  context.fillStyle = val? color : base1;
  context.fillText(val? val : "_noPriority".loc(), 400, 15);
  
  // Category
  val = object.getPath('category.name');
  context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.fillText(val? val : "_noCategory".loc(), 400, 35);;
  
  // Severity
  val = object.getPath('severity.name');
  context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.fillText(val? val : "_noSeverity".loc(), 400, 55);

};

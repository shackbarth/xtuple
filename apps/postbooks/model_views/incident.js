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
  // Rect
  context.fillStyle = isSelected? '#99CCFF' : 'white';
  context.fillRect(0, 0, width, height);

  context.strokeStyle = 'grey';
  context.lineWidth = 1;

  context.beginPath();
  context.moveTo(0, height - 0.5);
  context.lineTo(width, height - 0.5);
  context.stroke();

  // Contact Number
  var val = object.get('number');
  context.font = (val? "bold " : "italic ")+"10pt Helvetica";
  context.fillStyle = val? 'black' : base1;
  context.textAlign = 'left';
  context.textBaseline = 'middle';
  context.fillText(val? val : "_noNumber".loc(), 15, 15);
  
  // Updated
  /*
  TODO: implement interval aging like github
  context.save();
  var dt = object.get('updated') || SC.DateTime.create();
  val = new Date(dt.get('milliseconds')).toLocaleDateString();
  context.font = "10pt Helvetica";
  context.fillStyle = 'black';
  context.textAlign = 'left';
  context.textBaseline = 'middle';
  context.fillText(val , 170, 15);
  context.restore();
  */
  
  // Status
  context.save();
  val = object.get('incidentStatusString');
  context.font = (val? "" : "italic ")+"8pt Helvetica";
  context.fillStyle = val? 'black' : base1;
  context.textAlign = 'left';
  context.textBaseline = 'middle';
  context.fillText(val , 255, 15);
  context.restore();
  
  // Description
  context.save();
  val = object.get('description');
  context.font = (val? "" : "italic ")+"10pt Helvetica";
  context.fillStyle = val? 'black' : base1;
  context.textAlign = 'left';
  context.textBaseline = 'middle';
  context.fillText(val? val : "_noDescription".loc() , 15, 35);
  context.restore();
  
  // Account Name
  context.save();
  val = object.getPath('account.name');
  context.font = "italic 8pt Helvetica";
  context.fillStyle = val? 'black' : base1;
  context.textAlign = 'left';
  context.textBaseline = 'middle';
  context.fillText(val , 15, 55);
  context.restore();
 
  // Contact Name
  context.save();
  val = object.getPath('contact.name');
  context.font = (val? "" : "italic ")+"8pt Helvetica";
  context.fillStyle = val? 'black' : base1;
  context.textAlign = 'left';
  context.textBaseline = 'middle';
  context.fillText(val? val : "_noName".loc() , 255, 55);
  context.restore();
    
  // Priority
  context.save();
  val = object.getPath('priority.name');
  var color = object.getPath('priority.color');
  context.font = (val? "" : "italic ")+"8pt Helvetica";
  context.fillStyle = val? color : base1;
  context.textAlign = 'left';
  context.textBaseline = 'middle';
  context.fillText(val? val : "_noPriority".loc(), 355, 15);
  context.restore();
  
  // Category
  context.save();
  val = object.getPath('incidentCategory.name');
  context.font = (val? "" : "italic ")+"8pt Helvetica";
  context.fillStyle = val? 'black' : base1;
  context.textAlign = 'left';
  context.textBaseline = 'middle';
  context.fillText(val? val : "_noCategory".loc(), 455, 15);
  context.restore();
  
  // Severity
  context.save();
  val = object.getPath('severity.name');
  context.font = (val? "" : "italic ")+"8pt Helvetica";
  context.fillStyle = val? 'black' : base1;
  context.textAlign = 'left';
  context.textBaseline = 'middle';
  context.fillText(val? val : "_noSeverity".loc(), 455, 35);
  context.restore();

};

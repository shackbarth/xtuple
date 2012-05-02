// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XM sc_assert */

sc_require('views/carousel');
sc_require('views/tile_view');

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

Postbooks.Incident = {};

Postbooks.Incident.RenderRecordListRow = function(context, width, height, index, object, isSelected) {
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
  context.font = (isToday? "bold " : "")+"10pt "+K.TYPEFACE;
  context.textAlign = 'right';
  context.fillStyle = 'black';
  context.fillText(val , 315, 15);
  
  // Description
  val = object.get('description');
  context.font = "8pt "+K.TYPEFACE;
  context.textAlign = 'left';
  context.fillStyle = 'black';
  if (val) val = val.elide(context, 295);
  context.fillText(val , 15, 35);
          
  // Account Name
  val = object.getPath('account.name');
  context.font = "italic 8pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  if (val) val = val.elide(context, 160);
  context.fillText(val , 325, 15);
 
  // Contact Name
  val = object.getPath('contact.name');
  context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  if (val) val = val.elide(context, 160);
  context.fillText(val? val : "_noName".loc() , 325, 35);
  
  // Status
  val = object.get('incidentStatusString');
  context.font = "8pt "+K.TYPEFACE;
  context.fillStyle = 'black';
  if (val) val = val.elide(context, 70);
  context.fillText(val , 490, 15);
  
  // Assigned To
  val = object.get('assignedTo');
  val = val? val.get('username') : '';
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
  
  // Category
  val = object.getPath('category.name');
  context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.fillText(val? val : "_noCategory".loc(), 565, 35);

};

Postbooks.Incident.Tiles = function(controller, isRoot) {
  console.log('Postbooks.Incident.Tiles()');
  
  var klass = XM.Incident,
      tiles = [],
      proto = klass.prototype;
      properties = [];

  // overview
  tiles.push(Postbooks.Incident.CreateOverviewTileView(controller));

  // details
  properties = ' category incidentStatus severity priority resolution '.w();
  tiles.push(Postbooks.CreateTileView(klass, controller, "_details".loc(), properties));

  // contact
  tiles.push(Postbooks.Incident.CreateContactTileView(controller));

  //notes
  tiles.push(Postbooks.CreateNotesTileView(controller));
  
  return tiles;
};

Postbooks.Incident.CreateOverviewTileView = function(controller) {
  console.log('Postbooks.Incident.CreateOverviewTileView(', controller, ')');

  var view = Postbooks.TileView.create(),
      layers = view.get('layers'),
      y = 42,
      proto = XM.Incident.prototype,
      K = Postbooks,
      key, property,
      left = 120, right = 12,
      label = null, widget = null;
 
  // isPublic 
  key = 'isPublic';
  property = proto[key];
  widget = SC.CheckboxWidget.create({
    layout: { top: y, left: left, height: 24, right: right },
    title: "_isPublic".loc(),
    valueBinding: SC.Binding.transform(function(val) {
      return !!val;
    }).from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(widget);

  // number
  key = 'number';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_number".loc() + ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 24, right: right },
    valueBinding: SC.Binding.from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);

  // description 
  key = 'description';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_description".loc() + ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 24, right: right },
    valueBinding: SC.Binding.from(key, controller)
  });
  y += K.VERT_SPACER;
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);

  // crm account 
  key = 'account';
  console.log('crm account type: %@'.fmt(proto[key].type));
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_account".loc() + ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 24, right: right },
    valueBinding: SC.Binding.transform(function(val) {
      return String(val);
    }).from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);
  label = SC.LabelLayer.create({
    layout: { top: y, left: left+5, height: 12, width: left - 18 },
    font: "bold 6pt "+K.TYPEFACE,
    fontStyle: "italic",
    backgroundColor: 'white',
    textAlign: 'left',
    valueBinding: SC.Binding.transform(function(val) {
      return String(val);
    }).from(key, controller)
  });
  y += 10 + K.SPACING;
  layers.pushObject(label);

  // owner 
  key = 'owner';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_owner".loc() + ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 24, right: right },
    valueBinding: SC.Binding.transform(function(val) {
      return String(val);
    }).from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);
  label = SC.LabelLayer.create({
    layout: { top: y, left: left+5, height: 12, width: left - 18 },
    font: "bold 6pt "+K.TYPEFACE,
    fontStyle: "italic",
    backgroundColor: 'white',
    textAlign: 'left',
    valueBinding: SC.Binding.transform(function(val) {
      return String(val);
    }).from(key, controller)
  });
  y += 10 + K.SPACING;
  layers.pushObject(label);

  // assignedTo 
  key = 'assignedTo';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_assignedTo".loc() + ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 24, right: right },
    valueBinding: SC.Binding.transform(function(val) {
      return String(val);
    }).from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);
  label = SC.LabelLayer.create({
    layout: { top: y, left: left+5, height: 12, width: left - 18 },
    font: "bold 6pt "+K.TYPEFACE,
    fontStyle: "italic",
    backgroundColor: 'white',
    textAlign: 'left',
    valueBinding: SC.Binding.transform(function(val) {
      return String(val);
    }).from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);

  return view;
};

Postbooks.Incident.CreateContactTileView = function(controller) {
  console.log('Postbooks.Incident.CreateOverviewTileView(', controller, ')');

  var proto = XM.Incident.prototype,
      key, property, objectKlass, objectController;
 
  key = 'contact';
  property = proto[key];
  objectKlass = property.get('typeClass');
  objectController = SC.ObjectController.create({
    contentBinding: SC.Binding.from(key, controller).single().oneWay()
  });

  return Postbooks.CreateTileViewForClass(objectKlass, objectController, "_contact".loc());

};

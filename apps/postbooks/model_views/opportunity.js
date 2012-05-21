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
    context.font = "italic 9pt "+K.TYPEFACE;
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
    context.font = "9pt "+K.TYPEFACE;
    context.fillStyle = val? 'black' : base1;
    context.textAlign = 'right';
    context.fillText(val, 315, 35);
    amountWidth = val.length? context.measureText(val).width + 5 : 0;
  }
  
  // Name
  val = object.get('name');
  context.font = "9pt "+K.TYPEFACE;
  context.textAlign = 'left';
  context.fillStyle = 'black';
  if (val && val.elide) val = val.elide(context, 300 - amountWidth);
  context.fillText(val , 15, 35);
  
  // Account Name
  val = object.getPath('account.name');
  context.font = "italic 9pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  if (val && val.elide) val = val.elide(context, 160);
  context.fillText(val , 325, 15);

  // Contact Name
  val = object.getPath('contact.name') || '';
  context.font = (val? "" : "italic ")+"9pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  if (val && val.elide) val = val.elide(context, 160);
  context.fillText(val? val : "_noContact".loc(), 325, 35);

  // Stage
  val = object.getPath('opportunityStage.name');
  context.font = (val? "" : "italic ")+"9pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  if (val && val.elide) val = val.elide(context, 70);
  context.fillText(val? val : "_noStage".loc(), 490, 15);
  
  // Assigned To
  val = object.getPath('assignedTo.username') || '';
  context.font = "9pt "+K.TYPEFACE;
  context.fillStyle = 'black';
  if (val && val.elide) val = val.elide(context, 70);
  context.fillText(val , 490, 35);  

  // Priority
  val = object.getPath('priority.name');
  var emphasis = object.getPath('priority.order')<=1? "bold " : "";
  context.font = (val? emphasis : "italic ")+"9pt "+K.TYPEFACE;
  context.fillStyle = val? black : base1;
  context.fillText(val? val : "_noPriority".loc(), 565, 15);
  
  // Type
  val = object.getPath('opportunityType.name');
  context.font = (val? "" : "italic ")+"9pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.fillText(val? val : "_noType".loc(), 565, 35);

};

Postbooks.Opportunity.Tiles = function(controller, isRoot) {
  console.log('Postbooks.Opportunity.Tiles()');
  
  var klass = XM.Opportunity,
      tiles = [],
      proto = klass.prototype;
      properties = [];

  // overview
  tiles.push(Postbooks.Opportunity.CreateOverviewTileView(controller));

  // details
  properties = ' opportunityStage priority opportunitySource opportunityType spacer startDate assignDate targetClose actualClose '.w();
  tiles.push(Postbooks.CreateTileView(klass, controller, "_details".loc(), properties));

  // contact
  tiles.push(Postbooks.Opportunity.CreateContactTileView(controller));

  //notes
  tiles.push(Postbooks.CreateNotesTileView(controller));

  //to-many relationships
  for (var key in proto) {
    if (key === 'guid') continue;
    if (key === 'type') continue;
    if (key === 'dataState') continue;

    var property = proto[key],
        title = ("_"+key).loc();

    if (property && (property.isChildrenAttribute || property.isManyAttribute)) {
      var arrayKlass = property.get('typeClass');

      var arrayController = SC.ArrayController.create({
        contentBinding: SC.Binding.from(key, controller).multiple().oneWay()
      });

      tiles.push(Postbooks.CreateTileListViewForClass(arrayKlass, arrayController, title));
    }
  }

  return tiles;
};

Postbooks.Opportunity.CreateOverviewTileView = function(controller) {
  console.log('Postbooks.Opportunity.CreateOverviewTileView(', controller, ')');

  var view = Postbooks.TileView.create(),
      layers = view.get('layers'),
      y = 42,
      proto = XM.Opportunity.prototype,
      K = Postbooks,
      key, property,
      left = 120, right = 12,
      label = null, widget = null;
 
  // isActive
  key = 'isActive';
  property = proto[key];
  widget = SC.CheckboxWidget.create({
    layout: { top: y, left: left, height: 22, right: right },
    title: "_isActive".loc(),
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
    layout: { top: y + 3, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'transparent',
    color: 'white',
    textAlign: 'right',
    value: "_number".loc() + ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 22, right: right },
    valueBinding: SC.Binding.from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);

  // name 
  key = 'name';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 3, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'transparent',
    color: 'white',
    textAlign: 'right',
    value: "_name".loc() + ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 22, right: right },
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
    layout: { top: y + 3, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'transparent',
    color: 'white',
    textAlign: 'right',
    value: "_account".loc() + ':'
  });
  objectKlass = property.get('typeClass');
  objectController = SC.ObjectController.create({
    contentBinding: SC.Binding.from(key, controller).single().oneWay()
  });
  objectKey = 'number';
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 22, right: right },
    valueBinding: SC.Binding.from(objectKey, objectController)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);
  objectKlass = property.get('typeClass');
  objectController = SC.ObjectController.create({
    contentBinding: SC.Binding.from(key, controller).single().oneWay()
  });
  objectKey = 'name';
  label = SC.LabelLayer.create({
    layout: { top: y, left: left+5, height: 18, width: left },
    font: "8pt "+K.TYPEFACE,
    fontStyle: "italic",
    backgroundColor: 'transparent',
    color: 'white',
    textAlign: 'left',
    valueBinding: SC.Binding.from(objectKey, objectController)
  });
  y += 12 + K.SPACING;
  layers.pushObject(label);

  // owner 
  key = 'owner';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 3, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'transparent',
    color: 'white',
    textAlign: 'right',
    value: "_owner".loc() + ':'
  });
  objectKlass = property.get('typeClass');
  objectController = SC.ObjectController.create({
    contentBinding: SC.Binding.from(key, controller).single().oneWay()
  });
  objectKey = 'username';
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 22, right: right },
    valueBinding: SC.Binding.from(objectKey, objectController)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);
  objectKey = 'propername';
  label = SC.LabelLayer.create({
    layout: { top: y, left: left+5, height: 18, width: left },
    font: "8pt "+K.TYPEFACE,
    fontStyle: "italic",
    backgroundColor: 'transparent',
    color: 'white',
    textAlign: 'left',
    valueBinding: SC.Binding.from(objectKey, objectController)
  });
  y += 12 + K.SPACING;
  layers.pushObject(label);

  // assignedTo 
  key = "assignedTo";
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 3, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'transparent',
    color: 'white',
    textAlign: 'right',
    value: "_assignedTo".loc() + ':'
  });
  objectKlass = property.get('typeClass');
  objectController = SC.ObjectController.create({
    contentBinding: SC.Binding.from(key, controller).single().oneWay()
  });
  objectKey = 'username';
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 22, right: right },
    valueBinding: SC.Binding.from(objectKey, objectController)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);
  objectKlass = property.get('typeClass');
  objectController = SC.ObjectController.create({
    contentBinding: SC.Binding.from(key, controller).single().oneWay()
  });
  objectKey = 'propername';
  label = SC.LabelLayer.create({
    layout: { top: y, left: left+5, height: 18, width: left },
    font: "8pt "+K.TYPEFACE,
    fontStyle: "italic",
    backgroundColor: 'transparent',
    color: 'white',
    textAlign: 'left',
    valueBinding: SC.Binding.from(objectKey, objectController)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);

  return view;
};

Postbooks.Opportunity.CreateContactTileView = function(controller) {
  console.log('Postbooks.Opportunity.CreateOverviewTileView(', controller, ')');

  var proto = XM.Opportunity.prototype,
      key, property, objectKlass, objectController;
 
  key = 'contact';
  property = proto[key];
  objectKlass = property.get('typeClass');
  objectController = SC.ObjectController.create({
    contentBinding: SC.Binding.from(key, controller).single().oneWay()
  });

  return Postbooks.CreateTileViewForClass(objectKlass, objectController, "_contact".loc());

};

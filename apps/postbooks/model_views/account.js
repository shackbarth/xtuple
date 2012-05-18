// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XM sc_assert */

Postbooks.Account = {};
Postbooks.Account.RenderRecordListRow = function(context, width, height, index, object, isSelected) {
  var K = Postbooks, val;
  var contact = object.get('primaryContact');
  var address = contact? contact.get('address') : null;
  address = address? address.formatShort() : '';
  
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
  
  // Primary Contact Phone
  var phoneWidth = 0;
  val = contact? contact.get('phone') : '';
  context.font = (val? "" : "italic ")+"10pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.textAlign = 'right';
  if (val && val.elide) val = val.elide(context, 195);
  context.fillText(val, 315, 15);
  if (val) phoneWidth = context.measureText(val).width + 5;
  if (phoneWidth < 0) phoneWidth = 0;
  
  // Number
  val = object.get('number');
  context.font = (val? "bold " : "italic ")+"10pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.textAlign = 'left';
  if (val && val.elide) val = val.elide(context, 295 - phoneWidth);
  context.fillText(val, 15, 15);
 
  // Primary Contact Email
  var emailWidth = 0;
  val = contact? contact.get('primaryEmail') : '';
  context.font = "9pt "+K.TYPEFACE;
  context.textAlign = 'right';
  context.fillStyle = 'blue';
  context.fillText(val, 315, 35);
  if (val) emailWidth = context.measureText(val).width + 5;
    
  // Name
  val = object.get('name');
  context.font = (val? "" : "italic ")+"9pt "+K.TYPEFACE;
  context.textAlign = 'left';
  context.fillStyle = val? 'black' : base1;
  if (val && val.elide) val = val.elide(context, 300 - emailWidth);
  context.fillText(val? val : "_noName".loc(), 15, 35);

  // Primary Contact Name
  val = contact? contact.get('name') : '';
  context.font = "italic 9pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  val = val? val : "_noContact".loc();
  context.fillText(val, 325, 15);
  
  // Primary Contact Location
  val = address;
  context.font = "9pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.fillText(val , 325, 35);

};

Postbooks.Account.Tiles = function(controller, isRoot) {
  console.log('Postbooks.Account.Tiles()');
  
  var klass = XM.Account,
      tiles = [],
      proto = klass.prototype;
      properties = [];

  // overview
  tiles.push(Postbooks.Account.CreateOverviewTileView(controller));

  // primaryContact
  tiles.push(Postbooks.Account.CreatePrimaryContactTileView(controller));

  // secondaryContact
  tiles.push(Postbooks.Account.CreateSecondaryContactTileView(controller));

  //notes
  tiles.push(Postbooks.CreateNotesTileView(controller));
  
  //to-many relationships
  for (var key in proto) {
    if (key === 'guid') continue;
    if (key === 'type') continue;
    if (key === 'dataState') continue;

    var property = proto[key],
        title = ("_"+key).loc()+":";

    if (property && (property.isChildrenAttribute || property.isManyAttribute)) {
      var arrayKlass = property.get('typeClass');

      var arrayController = SC.ArrayController.create({
        contentBinding: SC.Binding.from(key, controller).multiple().oneWay()
      });

      tiles.push(Postbooks.CreateTileListViewForClass(arrayKlass, arrayController));
    }
  }

  return tiles;
};

Postbooks.Account.CreateOverviewTileView = function(controller) {
  console.log('Postbooks.Account.CreateOverviewTileView(', controller, ')');

  var view = Postbooks.TileView.create(),
      layers = view.get('layers'),
      y = 42,
      proto = XM.Account.prototype,
      K = Postbooks,
      key, property,
      left = 120, right = 12,
      label = null, widget = null;
 
  // isActive
  key = 'isActive';
  property = proto[key];
  widget = SC.CheckboxWidget.create({
    layout: { top: y, left: right, height: 22, right: right },
    title: "_isActive".loc(),
    valueBinding: SC.Binding.transform(function(val) {
      return !!val;
    }).from(key, controller)
  });
  layers.pushObject(widget);

  // accounType
  key = 'accountType';
  var radio = SC.RadioWidget.create({
    layout: { top: y, left: left, height: 24, width: left },
    items: [{ title: "_organization".loc(),
              value: XM.Account.ORGANIZATION,
              enabled: true,
              width: 120
            },
            { title: "_individual".loc(),
              value: XM.Account.INDIVIDUAL,
              enabled: true,
              width: 120
            }],
    valueBinding: SC.Binding.from(key, controller),
    itemTitleKey: 'title',
    itemValueKey: 'value',
    itemIsEnabledKey: 'enabled',
    layoutDirection: SC.LAYOUT_HORIZONTAL,
    itemWidthKey: 'width'
  });
  y += 48 + K.SPACING;
  y += K.VERT_SPACER;
  layers.push(radio);

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

  // parent 
  key = 'parent';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 3, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'transparent',
    color: 'white',
    textAlign: 'right',
    value: "_parent".loc() + ':'
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

  return view;
};

Postbooks.Account.CreatePrimaryContactTileView = function(controller) {
  console.log('Postbooks.Account.CreatePrimaryContactTileView(', controller, ')');

  var proto = XM.Account.prototype,
      key, property, objectKlass, objectController;
 
  key = 'primaryContact';
  property = proto[key];
  objectKlass = property.get('typeClass');
  objectController = SC.ObjectController.create({
    contentBinding: SC.Binding.from(key, controller).single().oneWay()
  });

  return Postbooks.CreateTileViewForClass(objectKlass, objectController, "_primaryContact".loc());

};

Postbooks.Account.CreateSecondaryContactTileView = function(controller) {
  console.log('Postbooks.Account.CreateSecondaryContactTileView(', controller, ')');

  var proto = XM.Account.prototype,
      key, property, objectKlass, objectController;
 
  key = 'secondaryContact';
  property = proto[key];
  objectKlass = property.get('typeClass');
  objectController = SC.ObjectController.create({
    contentBinding: SC.Binding.from(key, controller).single().oneWay()
  });

  return Postbooks.CreateTileViewForClass(objectKlass, objectController, "_secondaryContact".loc());

};

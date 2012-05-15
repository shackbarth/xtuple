// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XM sc_assert */

sc_require('views/record_list');

Postbooks.CustomerShipto = {};
Postbooks.CustomerShipto.RenderRecordListRow = function(context, width, height, index, object, isSelected) {
  var K = Postbooks, val;
  var contact = object.get('contact');
  var address = object.get('address');
  var base1 = "#93a1a1";
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
  
  // Contact Phone
  var phoneWidth = 0;
  val = contact? contact.get('phone') : '';
  context.font = (val? "" : "italic ")+"9pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.textAlign = 'right';
  if (val) val = val.elide(context, 195);
  context.fillText(val, 315, 15);
  if (val) phoneWidth = context.measureText(val).width + 5;
  if (phoneWidth < 0) phoneWidth = 0;
  
  // Number
  val = object.get('number');
  context.font = (val? "bold " : "italic ")+"10pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.textAlign = 'left';
  val = val.elide(context, 295 - phoneWidth);
  context.fillText(val, 15, 15);
  
  // Contact Email
  var emailWidth = 0;
  val = contact? contact.get('primaryEmail') : '';
  context.font = "10pt "+K.TYPEFACE;
  context.textAlign = 'right';
  context.fillStyle = 'blue';
  context.fillText(val, 315, 35);
  if (val) emailWidth = context.measureText(val).width + 5; 
   
  // Name
  val = object.get('name');
  context.font = (val? "" : "italic ")+"9pt "+K.TYPEFACE;
  context.textAlign = 'left';
  context.fillStyle = val? 'black' : base1;
  if (address) val = val.elide(context, 300 - emailWidth);
  context.fillText(val? val : "_noName".loc(), 15, 35);

  // Contact Name
  val = contact? contact.get('name') : '';
  context.font = "italic 9pt "+K.TYPEFACE;
  context.textAlign = 'left';
  context.fillStyle = val? 'black' : base1;
  val = val? val : "_noContact".loc();
  context.fillText(val, 325, 15);
  
  // Shipto Location
  val = address;
  context.font = "9pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.fillText(val , 325, 35);

  // Active
  var isActive = object.getPath('isActive');
  val = isActive? "_active".loc() : '';
  context.textAlign = 'left';
  context.fillStyle = 'black';
  context.fillText(val, 490, 15);
 
  // Default
  var isDefault = object.getPath('isDefault');
  val = isDefault? "_default".loc() : '';
  context.fillStyle = 'black';
  context.fillText(val, 490, 35);
  
};

Postbooks.CustomerShipto.RecordListView = Postbooks.RecordListView.extend({

  renderRow: Postbooks.CustomerShipto.RenderRecordListRow

});

Postbooks.CustomerShipto.CreateDetailListView = function(controller) {
  var list = Postbooks.CustomerShipto.RecordListView.create({
    layout: { top: 13, left: 0, right: 0, bottom: 0 },

    contentBinding: SC.Binding.from('arrangedObjects', controller).oneWay(),
    selectionBinding: SC.Binding.from('selection', controller),

    action: function(object, index) {
      var that = this;
      var instance = this.get('content').objectAt(index);
      if (instance) {
        Postbooks.LoadModal("CustomerShipto", "Back", instance);

        // Deselect our row after the modal transition ends.
        setTimeout(function() {
          SC.RunLoop.begin();
          that.get('content').deselectObject(instance);
          SC.RunLoop.end();
        }, 250);
      }
    }

  });
  
  return list;
};

Postbooks.CustomerShipto.Tiles = function(controller, isRoot) {
  console.log('Postbooks.CustomerShipto.Tiles()');
  
  var klass = XM.CustomerShipto,
      tiles = [],
      proto = klass.prototype;
      properties = [];

  // overview
  tiles.push(Postbooks.CustomerShipto.CreateOverviewTileView(controller));

  // contact
  tiles.push(Postbooks.CustomerShipto.CreateContactTileView(controller));

  // general notes
  tiles.push(Postbooks.CreateNotesTileView(controller, "_generalNotes".loc()));

  // shipping notes
  tiles.push(Postbooks.CreateNotesTileView(controller, "_shippingNotes".loc(), 'shippingNotes'));

  return tiles;
};

Postbooks.CustomerShipto.CreateOverviewTileView = function(controller) {
  console.log('Postbooks.CustomerShipto.CreateOverviewTileView(', controller, ')');

  var view = Postbooks.TileView.create(),
      layers = view.get('layers'),
      y = 42,
      proto = XM.CustomerShipto.prototype,
      K = Postbooks,
      left = 120, right = 12,
      label = null, widget = null,
      key, objectKlass, objectController, objectKey;
 
  // customer number
  key = 'customer';
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_customer".loc() + ':'
  });
  layers.pushObject(label);
  objectController = SC.ObjectController.create({
    contentBinding: SC.Binding.from(key, controller).single().oneWay()
  });
  objectKey = 'number';
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: left, height: 24, right: right },
    backgroundColor: 'white',
    textAlign: 'left',
    valueBinding: SC.Binding.from(objectKey, objectController)
  });
  y += 18 + K.SPACING;
  layers.pushObject(label);
  objectKey = 'name';
  label = SC.LabelLayer.create({
    layout: { top: y, left: left, height: 24, right: right },
    backgroundColor: 'white',
      valueBinding: SC.Binding.transform(function(val) {
      return val? val.elide(label.get('context'), left + 20) : '';
    }).from(objectKey, objectController)
  });
  y += 18 + K.SPACING;
  layers.pushObject(label);

  // shipto number
  key = 'number';
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_shipto".loc() + ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 24, right: right },
    valueBinding: SC.Binding.from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);

  // shipto name
  key = 'name';
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_name".loc() + ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 24, right: right },
    valueBinding: SC.Binding.from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);

  // active
  key = 'isActive';
  widget = SC.CheckboxWidget.create({
    layout: { top: y, left: left, height: 24, width: left - 18 },
    title: "_active".loc(),
    valueBinding: SC.Binding.transform(function(val) {
      return !!val;
    }).from(key, controller),
  });
  layers.pushObject(widget);

  // default
  key = 'isDefault';
  widget = SC.CheckboxWidget.create({
    layout: { top: y, left: left + 80, height: 24, right: right },
    title: "_default".loc(),
    valueBinding: SC.Binding.transform(function(val) {
      return !!val;
    }).from(key, controller),
  });
  y += 24 + K.SPACING;
  layers.pushObject(widget);

  return view;
};

Postbooks.CustomerShipto.CreateContactTileView = function(controller) {
  console.log('Postbooks.CustomerShipto.CreateContactTileView(', controller, ')');

  var proto = XM.CustomerShipto.prototype,
      key, property, objectKlass, objectController;
 
  key = 'contact';
  property = proto[key];
  objectKlass = property.get('typeClass');
  objectController = SC.ObjectController.create({
    contentBinding: SC.Binding.from(key, controller).single().oneWay()
  });

  return Postbooks.CreateTileViewForClass(objectKlass, objectController, "_contact".loc());
};

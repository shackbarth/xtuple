// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XM sc_assert */

Postbooks.Invoice = {};
Postbooks.Invoice.RenderRecordListRow = function(context, width, height, index, object, isSelected) {
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
  var numberWidth = context.measureText(val).width;

  // Invoice Date
  dt = object.get('invoiceDate');
  if (dt) {
    val = dt.toLocaleDateString();
    var isDue = !object.get('isPosted') &&
                XT.DateTime.compareDate(dt, XT.DateTime.create()) <= 0;
    context.font = "10pt "+K.TYPEFACE;
    context.textAlign = 'right';
    context.fillStyle = isDue? XT.EXPIRED : 'black';
    context.fillText(val , 315, 15);
  }
  
  // Total
  var amount = object.getPath('total');
  var currency = object.getPath('currency');
  val = currency.toLocaleString(amount);
  context.font = "9pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.textAlign = 'right';
  context.fillText(val, 315, 35);
  var amountWidth = context.measureText(val).width + 5;
  
  // Purchase Order Number
  val = object.get('purchaseOrderNumber') || '';
  context.font = "9pt "+K.TYPEFACE;
  context.textAlign = 'left';
  context.fillStyle = 'black';
  if (val && val.elide) val = val.elide(context, 300 - amountWidth);
  context.fillText(val , 15, 35);
 
  // Printed
  var isPrinted = object.getPath('isPrinted');
  val = isPrinted? "_printed".loc() : '';
  context.textAlign = 'left';
  context.fillStyle = 'black';
  context.fillText(val, 490, 15);
 
  // Posted
  var isPosted = object.getPath('isPosted');
  val = isPosted? "_posted".loc() : '';
  context.fillStyle = 'black';
  context.fillText(val, 490, 35);
  
  // Terms
  val = object.getPath('terms.code');
  context.font = (val? "" : "italic ")+"9pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.fillText(val? val : "_noTerms".loc(), 565, 15);
  
  // Sales Rep
  val = object.getPath('salesRep.name');
  context.font = (val? "" : "italic ")+"9pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.fillText(val? val : "_noSalesRep".loc(), 565, 35);
    
  // Billto Name
  val = object.getPath('billtoName');
  context.font = "italic 9pt "+K.TYPEFACE;
  context.fillStyle = 'black';
  if (isPrinted && val && val.elide) val = val.elide(context, 160);
  context.fillText(val , 325, 15);
  
  // Shipto Name
  val = object.getPath('shiptoName');
  context.font = (val? "" : "italic ")+"9pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.textAlign = 'left';
  if (isPosted && val && val.elide) val = val.elide(context, 160);
  context.fillText(val? val : "_sameAsBillto".loc(), 325, 35);

};

Postbooks.Invoice.Tiles = function(controller, isRoot) {
  console.log('Postbooks.Invoice.Tiles()');
  
  var klass = XM.Invoice,
      tiles = [],
      proto = klass.prototype;
      properties = [];

  // Overview
  tiles.push(Postbooks.Invoice.CreateBilltoTileView(controller));

  // Shipping
  tiles.push(Postbooks.Invoice.CreateShiptoTileView(controller));

  // Lines
  tiles.push(Postbooks.Invoice.CreateLinesTileView(controller));

  // Additional
  properties = 'terms taxZone spacer salesRep commission spacer shipDate'.w();
  tiles.push(Postbooks.CreateTileView(klass, controller, "_additional".loc(), properties));

  // Totals
  tiles.push(Postbooks.Invoice.CreateTotalsTileView(controller));

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

Postbooks.Invoice.CreateBilltoTileView = function(controller) {
  console.log('Postbooks.Invoice.CreateBilltoTileView(', controller, ')');

  var view = Postbooks.TileView.create(),
      layers = view.get('layers'),
      y = 42,
      proto = XM.Invoice.prototype,
      K = Postbooks,
      key, property,
      left = 120, right = 12,
      label = null, widget = null;
 
  // Number
  key = 'number';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 3, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'clear',
    color: 'white',
    textAlign: 'right',
    value: ("_"+key).loc()+ ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 22, right: right },
    valueBinding: SC.Binding.from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);
  
  // Invoice date
  key = 'invoiceDate';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 3, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'clear',
    color: 'white',
    textAlign: 'right',
    value: ("_"+key).loc()+ ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 22, right: right },
    valueBinding: SC.Binding.transform(function(val) {
      return val? val.toLocaleDateString() : "";
    }).from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);

  // Purchase order
  key = 'purchaseOrderNumber';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 3, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'clear',
    color: 'white',
    textAlign: 'right',
    value: ("_"+key).loc()+ ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 22, right: right },
    valueBinding: SC.Binding.from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);

  // Customer
  key = 'customer';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 3, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'clear',
    color: 'white',
    textAlign: 'right',
    value: ("_"+key).loc()+ ':'
  });
  widget = Postbooks.RelationWidget.create({
    layout: { top: y, left: left, height: 22, right: right },
    recordType: XM.Customer,
    store: controller.getPath('content.store'),
    displayKey: 'name',
    controller: controller,
    controllerKey: key,
    valueBinding: SC.Binding.from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);
  
  // Bill-to address
  key = 'billtoAddress';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 3, left: 12, height: 22, right: right },
    backgroundColor: 'clear',
    color: 'white',
    textAlign: 'left',
    value: "_billtoAddress".loc() + ':'
  });
  y += 24;
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: 12, height: 22, right: right },
    isSingleLine: false,
    font: "italic 8pt "+K.TYPEFACE,
    valueBinding: SC.Binding.from(key, controller)
  });
  y += 144 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);

  return view;
};

Postbooks.Invoice.CreateShiptoTileView = function(controller) {
  console.log('Postbooks.Invoice.ShiptoTileView(', controller, ')');

  var view = Postbooks.TileView.create({ title: "_shipping".loc() }),
      layers = view.get('layers'),
      y = 42,
      proto = XM.Invoice.prototype,
      K = Postbooks,
      key, property,
      left = 120, right = 12,
      label = null, widget = null;
  
  // Ship via
  key = 'shipVia';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 3, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'clear',
    color: 'white',
    textAlign: 'right',
    value: ("_"+key).loc()+ ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 22, right: right },
    valueBinding: SC.Binding.from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);
 
  // Inco Terms
  key = 'incoTerms';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 3, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'clear',
    color: 'white',
    textAlign: 'right',
    value: ("_"+key).loc()+ ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 22, right: right },
    valueBinding: SC.Binding.from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);
  
  // ShipCharge
  key = 'shipCharge';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 3, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'clear',
    color: 'white',
    textAlign: 'right',
    value: ("_"+key).loc()+ ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 22, right: right },
    valueBinding: SC.Binding.transform(function(val) {
      return String(val);
    }).from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);
  
  // Shipto
  key = 'shipto';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 3, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'clear',
    color: 'white',
    textAlign: 'right',
    value: ("_"+key).loc()+ ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 22, right: right },
    valueBinding: SC.Binding.transform(function(val) {
      return String(val);
    }).from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);
  
  // Ship-to address
  key = 'shiptoAddress';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 3, left: 12, height: 22, right: right },
    backgroundColor: 'clear',
    color: 'white',
    textAlign: 'left',
    value: "_shiptoAddress".loc() + ':'
  });
  y += 24;
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: 12, height: 22, right: right },
    isSingleLine: false,
    font: "italic 8pt "+K.TYPEFACE,
    valueBinding: SC.Binding.from(key, controller)
  });
  y += 144 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);

  return view;
};

Postbooks.Invoice.CreateLinesTileView = function(controller) {
  console.log('Postbooks.Invoice.CreateTotalsTileView(', controller, ')');

  var K = Postbooks.TileView,
      view = Postbooks.TileView.create({ 
        title: "_lines".loc(), 
        size: K.HORIZONTAL_TILE 
      }),
      layers = view.get('layers'),
      y = 42,
      proto = XM.Invoice.prototype,
      K = Postbooks,
      key, property,
      left = 120, right = 12,
      label = null, widget = null;
 

  return view;
};


Postbooks.Invoice.CreateTotalsTileView = function(controller) {
  console.log('Postbooks.Invoice.CreateTotalsTileView(', controller, ')');

  var K = Postbooks.TileView,
      view = Postbooks.TileView.create({ 
        title: "_totals".loc(), 
        size: K.QUARTER_TILE 
      }),
      layers = view.get('layers'),
      y = 42,
      proto = XM.Invoice.prototype,
      K = Postbooks,
      key, property,
      left = 120, right = 12,
      label = null, widget = null;
 
  // Credits
  key = 'allocatedCredit';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 3, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'clear',
    color: 'white',
    textAlign: 'right',
    value: "_allocatedCredit".loc() + ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 22, right: right },
    valueBinding: SC.Binding.transform(function(val) {
      return val? val.toLocaleString() : "";
    }).from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);
  
  // Spacer
  y += K.VERT_SPACER;
 
  // Subtotal
  key = 'subTotal';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 3, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'clear',
    color: 'white',
    textAlign: 'right',
    value: "_subtotal".loc() + ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 22, right: right },
    valueBinding: SC.Binding.transform(function(val) {
      return val? val.toLocaleString() : "";
    }).from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);
 
  // Freight
  key = 'freight';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 3, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'clear',
    color: 'white',
    textAlign: 'right',
    value: ("_"+key).loc()+ ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 22, right: right },
    valueBinding: SC.Binding.transform(function(val) {
      return val? val.toLocaleString() : "";
    }).from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);
  
  // Tax total
  key = 'taxTotal';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 3, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'clear',
    color: 'white',
    textAlign: 'right',
    value: "_tax".loc() + ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 22, right: right },
    valueBinding: SC.Binding.transform(function(val) {
      return val? val.toLocaleString() : "";
    }).from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);
  
  // Total
  key = 'total';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 3, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'clear',
    color: 'white',
    textAlign: 'right',
    value: "_total".loc() + ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 22, right: right },
    valueBinding: SC.Binding.transform(function(val) {
      return val? val.toLocaleString() : "";
    }).from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);

  return view;
};


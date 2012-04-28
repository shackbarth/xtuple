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

  // Total
  var amount = object.getPath('total');
  var currency = object.getPath('currency');
  val = currency.toLocaleString(amount);
  context.font = "8pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.textAlign = 'right';
  val = val.elide(context, 145 - numberWidth);
  context.fillText(val, 165, 15);

  // Invoice Date
  val = object.get('invoiceDate').toLocaleDateString();
  context.font = "8pt "+K.TYPEFACE;
  context.textAlign = 'right';
  val = val.elide(context, 95);
  context.fillText(val , 265, 15);
 
  // Printed
  var isPrinted = object.getPath('isPrinted');
  val = isPrinted? "_printed".loc() : '';
  context.textAlign = 'left';
  context.fillStyle = 'black';
  context.fillText(val, 475, 15);
 
  // Posted
  var isPosted = object.getPath('isPosted');
  val = isPosted? "_posted".loc() : '';
  context.fillStyle = 'black';
  context.fillText(val, 475, 35);
  
  // Terms
  val = object.getPath('terms.code');
  context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.fillText(val? val : "_noTerms".loc(), 575, 15);
  
  // Sales Rep
  val = object.getPath('salesRep.name');
  context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.fillText(val? val : "_noSalesRep".loc(), 575, 35);
    
  // Billto Name
  val = object.getPath('billtoName');
  context.font = "italic 8pt "+K.TYPEFACE;
  context.fillStyle = 'black';
  if (isPrinted) val.elide(context, 195);
  context.fillText(val , 275, 15);
  
  // Shipto Label
  context.textAlign = 'right';
  context.font = "8pt "+K.TYPEFACE;
  context.fillText("_shipto".loc()+":" , 265, 35);
  
  // Shipto Name
  val = object.getPath('shiptoName');
  context.font = (val? "" : "italic ")+"8pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.textAlign = 'left';
  context.fillText(val? val : "_sameAsBillto".loc(), 275, 35);

};

Postbooks.Invoice.Tiles = function(controller, isRoot) {
  console.log('Postbooks.Invoice.Tiles()');
  
  var klass = XM.Invoice,
      tiles = [],
      proto = klass.prototype;
      properties = [];

  // bill-to
  tiles.push(Postbooks.Invoice.CreateBilltoTileView(controller));

  // ship-to
  tiles.push(Postbooks.Invoice.CreateShiptoTileView(controller));

  // additional
  properties = ' terms taxZone spacer salesRep commission spacer shipDate'.w();
  tiles.push(Postbooks.CreateTileView(klass, controller, "_additional".loc(), properties));
  
  // totals
  tiles.push(Postbooks.Invoice.CreateTotalsTileView(controller));

  return tiles;
};

Postbooks.Invoice.CreateBilltoTileView = function(controller) {
  console.log('Postbooks.Invoice.CreateBilltoTileView(', controller, ')');

  var view = Postbooks.TileView.create({ title: "_billto".loc() }),
      layers = view.get('layers'),
      y = 42,
      proto = XM.Invoice.prototype,
      K = Postbooks,
      key, property,
      left = 120, right = 12,
      label = null, widget = null;
 
  // number
  key = 'number';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: property.label + ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 24, right: right },
    valueBinding: SC.Binding.from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);
 
  // purchase order
  key = 'purchaseOrderNumber';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: property.label + ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 24, right: right },
    valueBinding: SC.Binding.from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);
  
  // invoice date
  key = 'invoiceDate';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: property.label + ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 24, right: right },
    valueBinding: SC.Binding.transform(function(val) {
      return val? val.toLocaleDateString() : "";
    }).from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);

  // customer
  key = 'customer';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: property.label + ':'
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
  
  // bill-to address
  key = 'billtoAddress';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'left',
    value: "_billto".loc() + ':'
  });
  y += 24;
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: 12, height: 24, right: right },
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

  var view = Postbooks.TileView.create({ title: "_shipto".loc() }),
      layers = view.get('layers'),
      y = 42,
      proto = XM.Invoice.prototype,
      K = Postbooks,
      key, property,
      left = 120, right = 12,
      label = null, widget = null;
  
  // ship via
  key = 'shipVia';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: property.label + ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 24, right: right },
    valueBinding: SC.Binding.from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);
 
  // inco terms
  key = 'incoTerms';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: property.label + ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 24, right: right },
    valueBinding: SC.Binding.from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);
  
  // shipCharge
  key = 'shipCharge';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: property.label + ':'
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
  
  // shipto
  key = 'shipto';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_shipto".loc() + ':'
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
  
  // ship-to address
  key = 'shiptoAddress';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'left',
    value: "_shipto".loc() + ':'
  });
  y += 24;
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: 12, height: 24, right: right },
    isSingleLine: false,
    font: "italic 8pt "+K.TYPEFACE,
    valueBinding: SC.Binding.from(key, controller)
  });
  y += 144 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);

  return view;
};

Postbooks.Invoice.CreateTotalsTileView = function(controller) {
  console.log('Postbooks.Invoice.CreateTotalsTileView(', controller, ')');

  var view = Postbooks.TileView.create({ title: "_totals".loc() }),
  layers = view.get('layers'),
  y = 42,
  proto = XM.Invoice.prototype,
  K = Postbooks,
  key, property,
  left = 120, right = 12,
  label = null, widget = null;
 
  // subtotal
  key = 'subTotal';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_subtotal".loc() + ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 24, right: right },
    valueBinding: SC.Binding.transform(function(val) {
      return val? val.toLocaleString() : "";
    }).from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);
 
  // freight
  key = 'freight';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: property.label + ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 24, right: right },
    valueBinding: SC.Binding.transform(function(val) {
      return val? val.toLocaleString() : "";
    }).from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);
  
  // tax total
  key = 'taxTotal';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_tax".loc() + ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 24, right: right },
    valueBinding: SC.Binding.transform(function(val) {
      return val? val.toLocaleString() : "";
    }).from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);
  
  // total
  key = 'total';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_total".loc() + ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 24, right: right },
    valueBinding: SC.Binding.transform(function(val) {
      return val? val.toLocaleString() : "";
    }).from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);

  return view;
};


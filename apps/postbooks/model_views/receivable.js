// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XM sc_assert */

Postbooks.Receivable = {};
Postbooks.Receivable.RenderRecordListRow = function(context, width, height, index, object, isSelected) {
  var K = Postbooks, val;
  var contact = object.getPath('contact.name');
  var currency = object.get('currency');
  var base = XT.store.find('XM.Currency', XM.Currency.BASE);
  var sense = (object.get('documentType') === (XM.SubLedger.INVOICE || XM.SubLedger.DEBIT_MEMO))? 1 : -1;
  
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
  
  // Due Date
  var dt = object.get('dueDate');
  var dateWidth = 0;
  if (dt) {
    val = dt.toLocaleDateString();
    var isDue = object.get('isOpen') &&
                XT.DateTime.compareDate(dt, XT.DateTime.create()) <= 0;
    context.font = "10pt "+K.TYPEFACE;
    context.textAlign = 'right';
    context.fillStyle = isDue? XT.EXPIRED : 'black';
    context.fillText(val , 315, 15);
    dateWidth += context.measureText(val).width + 5;
  }
  
  // Number
  val = object.get('number');
  context.font = "bold 10pt "+K.TYPEFACE;
  context.fillStyle = 'black';
  context.textAlign = 'left';
  if (val) val = val.elide(context, 250 - dateWidth);
  context.fillText(val, 15, 15);
  
  // Amount
  val = object.get('amount');
  val = currency.toLocaleString(val);
  val = val.elide(context, 95);
  context.font = "9pt "+K.TYPEFACE;
  context.textAlign = 'right';
  context.fillText(val, 315, 35);

  // Document Type
  val = object.get('documentTypeString');
  context.font = "9pt "+K.TYPEFACE;
  context.textAlign = 'left';
  context.fillStyle = object.get('color');
  context.fillText(val , 15, 35);

  // Customer Name
  val = object.getPath('customer.name') || '';
  context.font = "italic 9pt "+K.TYPEFACE;
  context.textAlign = 'left';
  context.fillStyle = 'black';
  val = val.elide(context, 160);
  context.fillText(val , 325, 15);
  
  // Notes
  val = object.get('notes') || '';
  context.font = "9pt "+K.TYPEFACE;
  val = val.elide(context, 160);
  context.fillText(val , 325, 35);

  // labels 
  context.font = "9pt "+K.TYPEFACE;
  var paidLabel = "_paid".loc()+":";
  var paidLabelWidth = context.measureText(paidLabel).width;
  context.fillText(paidLabel, 490, 15);
  var balanceLabel = "_balance".loc()+":";
  var balanceLabelWidth = context.measureText(balanceLabel).width;
  context.fillText(balanceLabel, 490, 35);
  context.textAlign = 'right';

  // Paid
  val = (object.get('paid') * sense).toMoney();
  val = currency.toLocaleString(val);
  val = val.elide(context, 95);
  context.fillText(val, 600, 15);
  
  // Balance
  var balance = (object.get('balance') * sense).toMoney();
  balance = (balance * sense).toMoney();
  val = currency.toLocaleString(balance);
  val = val.elide(context, 95);
  context.fillText(val, 600, 35);
  
  // Balance
  // FIXME: Why doesn't this get updated even when re-rendering the view? 
  // It seems property changed is not being called
  if (currency.get('id') !== base.get('id')) {
    balance = (object.getPath('balanceMoney.baseValue') * sense).toMoney();
    val = "- " + base.toLocaleString(balance);
    context.textAlign = 'left';
    val = val.elide(context, 95);
    context.fillText(val, 605, 35);
  }

};

Postbooks.Receivable.Tiles = function(controller, isRoot) {
  console.log('Postbooks.Receivable.Tiles()');
  
  var klass = XM.Receivable,
      tiles = [],
      proto = klass.prototype;
      properties = [];

  // Overview
  tiles.push(Postbooks.Receivable.CreateOverviewTileView(controller));

  // Document
  properties = ' documentType number orderNumber reasonCode '.w();
  tiles.push(Postbooks.CreateTileView(klass, controller, "_document".loc(), properties));

  // Details
  tiles.push(Postbooks.Receivable.CreateDetailsTileView(controller));
  
  // Notes
  tiles.push(Postbooks.CreateNotesTileView(controller));

  return tiles;
};

Postbooks.Receivable.CreateOverviewTileView = function(controller) {
  console.log('Postbooks.Receivable.CreateOverviewTileView(', controller, ')');

  var view = Postbooks.TileView.create(),
      layers = view.get('layers'),
      y = 42,
      proto = XM.Receivable.prototype,
      K = Postbooks,
      key, property,
      left = 120, right = 12,
      label = null, widget = null;
 
  key = "customer";
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_customer".loc() + ':'
  });
  objectController = SC.ObjectController.create({
    contentBinding: SC.Binding.from(key, controller).single().oneWay()
  });
  objectKey = 'number';
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 24, right: right },
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
    backgroundColor: 'white',
    textAlign: 'left',
    valueBinding: SC.Binding.from(objectKey, objectController)
  });
  y += 12 + K.SPACING;
  layers.pushObject(label);
  objectKey = 'billingContact';
  objectController = SC.ObjectController.create({
    contentBinding: SC.Binding.from(objectKey, objectController).single().oneWay()
  });
  objectKey = 'address';
  objectController = SC.ObjectController.create({
    contentBinding: SC.Binding.from(objectKey, objectController).single().oneWay()
  });
  objectKey = 'line1';
  label = SC.LabelLayer.create({
    layout: { top: y, left: left+5, height: 18, width: left },
    font: "8pt "+K.TYPEFACE,
    fontStyle: "italic",
    backgroundColor: 'white',
    textAlign: 'left',
    valueBinding: SC.Binding.from(objectKey, objectController)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);

  // documentDate
  key = 'documentDate';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_documentDate".loc() + ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 24, right: right },
    valueBinding: SC.Binding.transform(function(val) {
      return val? val.toLocaleDateString() : "no date set";
    }).from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);

  // dueDate
  key = 'dueDate';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_dueDate".loc() + ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 24, right: right },
    valueBinding: SC.Binding.transform(function(val) {
      return val? val.toLocaleDateString() : "no date set";
    }).from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);

  // terms
  key = 'terms';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_terms".loc() + ':'
  });
  objectController = SC.ObjectController.create({
    contentBinding: SC.Binding.from(key, controller).single().oneWay()
  });
  objectKey = 'description';
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 24, right: right },
    valueBinding: SC.Binding.from(objectKey, objectController)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);

  // salesRep
  key = 'salesRep';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_salesRep".loc() + ':'
  });
  objectController = SC.ObjectController.create({
    contentBinding: SC.Binding.from(key, controller).single().oneWay()
  });
  objectKey = 'name';
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 24, right: right },
    valueBinding: SC.Binding.from(objectKey, objectController)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);

  return view;
};

Postbooks.Receivable.CreateDetailsTileView = function(controller) {
  console.log('Postbooks.Receivable.CreateDetailsTileView(', controller, ')');

  var view = Postbooks.TileView.create({ title: "_details".loc() }),
      layers = view.get('layers'),
      y = 42,
      proto = XM.Receivable.prototype,
      K = Postbooks,
      key, property,
      left = 120, right = 12,
      label = null, widget = null;
 
  // Amount
  key = 'amount';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_amount".loc() + ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 24, right: right },
    valueBinding: SC.Binding.from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);

  // Paid
  key = 'paid';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_paid".loc() + ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 24, right: right },
    valueBinding: SC.Binding.from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);

  // Balance
  key = 'balance';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_balance".loc() + ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 24, right: right },
    valueBinding: SC.Binding.from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);

  // Tax
  key = 'miscTax';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_tax".loc() + ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 24, right: right },
    valueBinding: SC.Binding.from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);

  // Commission Due
  key = 'commissionDue';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_commissionDue".loc() + ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 24, right: right },
    valueBinding: SC.Binding.from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);

  return view;
};

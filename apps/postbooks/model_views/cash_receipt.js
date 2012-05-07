// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XM sc_assert */

Postbooks.CashReceipt = {};
Postbooks.CashReceipt.RenderRecordListRow = function(context, width, height, index, object, isSelected) {
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

  // Amount
  var amount = object.getPath('amount');
  var currency = object.getPath('currency');
  val = currency.toLocaleString(amount);
  context.font = "9pt "+K.TYPEFACE;
  context.fillStyle = val? 'black' : base1;
  context.textAlign = 'right';
  context.fillText(val, 315, 35);

  // Distribution Date
  var dt = object.get('distributionDate');
  if (dt) {
    val = dt.toLocaleDateString();
    var isDue = !object.get('isPosted') &&
                XT.DateTime.compareDate(dt, XT.DateTime.create()) <= 0;
    context.font = "10pt "+K.TYPEFACE;
    context.textAlign = 'right';
    context.fillStyle = isDue? XT.EXPIRED : 'black';
    context.fillText(val , 315, 15);
  }

  // Funds Type
  var docNumber = object.getPath('documentNumber') || '';
  val = object.get('fundsTypeString');
  if (docNumber) val += ": "+docNumber;
  context.font = "9pt "+K.TYPEFACE;
  context.fillStyle = 'black';
  context.textAlign = 'left';
  context.fillText(val, 15, 35);

  // Customer Name
  val = object.getPath('customer.name');
  context.font = "italic 9pt "+K.TYPEFACE;
  context.textAlign = 'left';
  context.fillStyle = 'black';
  context.fillText(val , 325, 15);
  
  // Posted
  var isPosted = object.getPath('isPosted');
  context.font = "9pt "+K.TYPEFACE;
  val = isPosted? "_posted".loc() : '';
  context.fillText(val, 490, 35);
  
  // Bank Account
  val = object.getPath('bankAccount.description') || '';
  context.font = "9pt "+K.TYPEFACE;
  if (isPosted) val = val.elide(context, 160);
  context.fillText(val, 325, 35);

};

Postbooks.CashReceipt.Tiles = function(controller, isRoot) {
  console.log('Postbooks.CashReceipt.Tiles()');
  
  var klass = XM.CashReceipt,
      tiles = [],
      proto = klass.prototype;
      properties = [];

  // Overview
  tiles.push(Postbooks.CashReceipt.CreateOverviewTileView(controller));
  
  // Additional
  properties = 'fundsType documentNumber documentDate bankAccount distributionDate applicationDate'.w();
  tiles.push(Postbooks.CreateTileView(klass, controller, "_additional".loc(), properties));

  // Notes
  tiles.push(Postbooks.CreateNotesTileView(controller));

  return tiles;
};

Postbooks.CashReceipt.CreateOverviewTileView = function(controller) {
  console.log('Postbooks.CashReceipt.CreateOverviewTileView(', controller, ')');

  var view = Postbooks.TileView.create(),
      layers = view.get('layers'),
      y = 42,
      proto = XM.Invoice.prototype,
      K = Postbooks,
      key, property,
      left = 125, right = 12,
      label = null, widget = null;
 
  // Number
  key = 'number';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: ("_"+key).loc()+ ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 24, right: right },
    valueBinding: SC.Binding.from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);
  
  // Customer
  key = 'customer';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: ("_"+key).loc()+ ':'
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
    valueBinding: SC.Binding.transform(function(val) {
      return val? val.toLocaleString() : "";
    }).from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);
  
  // Discount
  key = 'discount';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_discount".loc() + ':'
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
    valueBinding: SC.Binding.transform(function(val) {
      return val? val.toLocaleString() : "";
    }).from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);

  // Apply balance
  if (XT.session.settings.get('EnableCustomerDeposits')) {
    key = 'applyBalanceLabel';
    label = SC.LabelLayer.create({
      layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
      backgroundColor: 'white',
      textAlign: 'right',
      valueBinding: SC.Binding.transform(function(val) {
        return val+":";
      }).from(key, controller).oneWay().noDelay()
    });
    key = 'isUseCustomerDeposit';
    var radio = SC.RadioWidget.create({
      layout: { top: y, left: left, height: 24, width: 140 },
      items: [{ title: "_creditMemo".loc(),
                value: false,
                enabled: true,
                width: 120
              },
              { title: "_customerDeposit".loc(),
                value: true,
                enabled: true,
                width: 120
              }],
      valueBinding: SC.Binding.from(key, controller),
      itemTitleKey: 'title',
      itemValueKey: 'value',
      itemIsEnabledKey: 'enabled',
      layoutDirection: SC.LAYOUT_VERTICAL,
      itemWidthKey: 'width'
    });
    y += 48 + K.SPACING;
    y += K.VERT_SPACER;
    layers.pushObject(label);
    layers.push(radio);
  }
  
  return view;
};

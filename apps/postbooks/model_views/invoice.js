// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XM XT base1 sc_assert */

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
  var dt = object.get('invoiceDate');
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
      proto = klass.prototype,
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
        title = ("_"+key).loc();

    if (property && (property.isChildrenAttribute || property.isManyAttribute)) {
      var arrayKlass = property.get('typeClass');

      if (arrayKlass === XM.InvoiceLine) continue;

      var arrayController = SC.ArrayController.create({
        contentBinding: SC.Binding.from(key, controller).multiple().oneWay()
      });

      tiles.push(Postbooks.CreateTileListViewForClass(arrayKlass, arrayController, title, controller, arrayController));
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
    backgroundColor: 'transparent',
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
    backgroundColor: 'transparent',
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
    backgroundColor: 'transparent',
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
    backgroundColor: 'transparent',
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
    backgroundColor: 'transparent',
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
    backgroundColor: 'transparent',
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
    backgroundColor: 'transparent',
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
    backgroundColor: 'transparent',
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
    backgroundColor: 'transparent',
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
    backgroundColor: 'transparent',
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

Postbooks.Invoice.CreateLinesTileView = function(objectController) {
  console.log('Postbooks.CreateLinesTileView()');
  var klass = XM.InvoiceLine,
      title = "Lines";

  // See if we have an override.
  var className = klass.prototype.className;
  className = className.slice(className.indexOf('.') + 1); // drop name space

  var controller = SC.ArrayController.create({
    contentBinding: SC.Binding.from('lines', objectController).multiple().oneWay()
  });

  var layoutSurface = SC.LayoutSurface.create({

    size: Postbooks.TileView.HORIZONTAL_TILE,

    didCreateElement: function(el) {
      arguments.callee.base.apply(this, arguments);
      var style = el.style;
      style.backgroundImage =  Postbooks.createDataUrlForSprite('tile-texture');
      style.backgroundPosition = 'left top';
      style.backgroundRepeat = 'repeat';

      var kind, size = this.get('size'); 
      if (document.getCSSCanvasContext && size) {
        // Figure out what size we have.
        'QUARTER_TILE HORIZONTAL_TILE VERTICAL_TILE FULL_TILE'.w().forEach(function(type) {
          var spec = Postbooks.TileView[type];
          if (spec.width === size.width && spec.height === size.height) {
            kind = type;
          }
        });
      }

      if (kind) {
        style.backgroundImage =  '-webkit-canvas('+kind.toLowerCase().dasherize() + '), ' + Postbooks.createDataUrlForSprite('tile-texture');
        style.backgroundPosition = 'left top, left top';
        style.backgroundRepeat = 'no-repeat, repeat';
      } else {
        style.backgroundImage =  Postbooks.createDataUrlForSprite('tile-texture');
        style.backgroundPosition = 'left top';
        style.backgroundRepeat = 'repeat';
      }
    }

  });
  layoutSurface.set('frame', SC.MakeRect(0, 42, 320, 320));
  // layoutSurface.set('backgroundColor', "white");

  var topbar = SC.View.create({
    layout: { top: 3, left: 0, right: 0, height: 32 },

    _sc_backgroundColor: 'transparent',
    clearBackground: true,

    willRenderLayers: function(context) { 
      var w = context.width, h = context.height;

      // title text
      var K = Postbooks;
      context.font = "12pt "+K.TYPEFACE;
      context.fillStyle = 'white';
      context.textAlign = 'left';
      context.textBaseline = 'middle';

      if (title) context.fillText(title, 18, 19);
    }
  });

  topbar.get('layers').pushObject(Postbooks.Button.create({
    layout: { top: 6, right: 12, height: 22, width: 60 },
    name: '_new'.loc(),
    target: Postbooks.statechart,
    action: 'newRecord',
    objectController: objectController,
    listController: controller,
    klass: klass,
    store: objectController.get('content').get('store')
  }));

  // Nope, generate the default tile view on the fly.
  var list = Postbooks.TileListView.create({
    layout: { top: 50, left: 12, right: 12, bottom: 16 },

    rowHeight: klass.ListRowHeight !== undefined? klass.ListRowHeight : 60,
    hasHorizontalScroller: false,

    contentBinding: SC.Binding.from('arrangedObjects', controller).oneWay(),
    selectionBinding: SC.Binding.from('selection', controller),

    baseClass: klass,

    didCreateElement: function(el) {
      arguments.callee.base.apply(this, arguments);
      var style = el.style;
      style.backgroundColor = 'clear'; // 'rgba(70,70,70,0.5)';
      style.color = 'black';
      style.padding = '6px';
      style.borderStyle = 'solid ';
      style.borderWidth = '1px';
      // style.borderRadius = '5px'; // doesn't work properly in Chrome; avoid for now
      style.borderColor = this.get('isEnabled') ? 'rgb(252,188,126)' : 'grey'; // this.get('borderColor');
      style.outline = 'none';
      style.boxShadow = 'none';
    },

    action: function(object, index) {
      var that = this;
      var instance = this.get('content').objectAt(index);
      if (instance) {
        Postbooks.LoadExclusiveModal(klass.prototype.className.slice(3), "Back", instance, objectController, controller);
      }
    },

    willRenderLayers: function(ctx) {
      var content = this.get('content');

      if (content && content.get('length') === 0) {
        var w = ctx.width, h = ctx.height;

        var text = 'No records.',
            status = content? content.get('status') : null;

        if (status && status === SC.Record.BUSY_LOADING) {
          text = "_loading".loc();
        }

        // Clear background.
        ctx.clearRect(0, 0, w, h);

        // Draw view name.
        ctx.fillStyle = 'rgba(70,70,70,0.5)';
        
        var K = Postbooks;
        ctx.font = "11pt "+K.TYPEFACE;
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillText(text, w/2, h/2);
      } else {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, w, h);
      }
    },

    renderRow: Postbooks.InvoiceLine.RenderRecordListRow

  });

  layoutSurface.get('subsurfaces').pushObjects([topbar, list]);

  return layoutSurface;
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
      key, property,
      left = 120, right = 12,
      label = null, widget = null;

  K = Postbooks;

  // Credits
  key = 'allocatedCredit';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 3, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'transparent',
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
    backgroundColor: 'transparent',
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
    backgroundColor: 'transparent',
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
    backgroundColor: 'transparent',
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
    backgroundColor: 'transparent',
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

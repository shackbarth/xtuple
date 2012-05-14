// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XM sc_assert */

Postbooks.Project = {};
Postbooks.Project.RenderRecordListRow = function(context, width, height, index, object, isSelected) {
  var K = Postbooks, val;
  var currency = XT.store.find('XM.Currency', XM.Currency.BASE);
  
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
    var isDue = object.get('projectStatus') !== XM.Project.COMPLETED &&
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
  if (val) val = val.elide(context, 290 - dateWidth);
  context.fillText(val, 15, 15);

  // Name
  val = object.get('name');
  context.font = "9pt "+K.TYPEFACE;
  context.fillStyle = 'black';
  val = val.elide(context, 295);
  context.fillText(val , 15, 35);

  // Account Name
  val = object.getPath('account.name') || '';
  context.font = "italic 9pt "+K.TYPEFACE;
  val = val.elide(context, 295);
  context.fillText(val , 15, 55);

  // Status
  val = object.get('projectStatusString');
  context.font = "9pt "+K.TYPEFACE;
  if (val) val = val.elide(context, 70);
  context.fillText(val , 325, 15);

  // Assigned To
  val = object.getPath('assignedTo.username') || '';
  if (val) val = val.elide(context, 70);
  context.fillText(val , 325, 35);

  // labels 
  var budgetLabel = "_budget".loc()+":";
  var budgetLabelWidth = context.measureText(budgetLabel).width;
  context.fillText(budgetLabel, 400, 15);
  var actualLabel = "_actual".loc()+":";
  var actualLabelWidth = context.measureText(actualLabel).width;
  context.fillText(actualLabel, 400, 35);
  var balanceLabel = "_balance".loc()+":";
  var balanceLabelWidth = context.measureText(balanceLabel).width;
  context.fillText(balanceLabel, 400, 55);

  // Budgeted Hours Total 
  val = object.get('budgetedHoursTotal');
  val = val.toLocaleString()+" "+"_hrs".loc();
  context.textAlign = 'right';
  val = val.elide(context, 145 - budgetLabelWidth);
  context.fillText(val, 535, 15);

  // Budgeted Expenses Total 
  val = object.get('budgetedExpensesTotal');
  val = currency.toLocaleString(val);
  val = val.elide(context, 95);
  context.fillText(val, 635, 15);

  // Actual Hours Total 
  val = object.get('actualHoursTotal');
  val = val.toLocaleString()+" "+"_hrs".loc();
  val = val.elide(context, 145 - actualLabelWidth);
  context.fillText(val, 535, 35);
  
  // Actual Expenses Total 
  val = object.get('actualExpensesTotal')
  val = currency.toLocaleString(val);
  val = val.elide(context, 95);
  context.fillText(val, 635, 35);
  
  // Balance Hours Total 
  val = object.get('balanceHoursTotal');
  context.fillStyle = val && val.valueOf() >= 0? 'black' :  XT.ERROR;
  val = val.toLocaleString()+" "+"_hrs".loc();
  val = val.elide(context, 145 - balanceLabelWidth);
  context.fillText(val, 535, 55);
  
  // Balance Expenses Total 
  val = object.get('balanceExpensesTotal');
  context.fillStyle = val && val.valueOf() >= 0? 'black' :  XT.ERROR;
  val = currency.toLocaleString(val);
  val = val.elide(context, 95);
  context.fillText(val, 635, 55);

};

Postbooks.Project.RecordListView = Postbooks.RecordListView.extend({

  rowHeight: Postbooks.HEIGHT_3_ROW,
  renderRow: Postbooks.Project.RenderRecordListRow

});

Postbooks.Project.Tiles = function(controller, isRoot) {
  console.log('Postbooks.Project.Tiles()');
  
  var klass = XM.Project,
      tiles = [],
      proto = klass.prototype;
      properties = [];

  // overview
  tiles.push(Postbooks.Project.CreateOverviewTileView(controller));

  // details
  properties = ' projectStatus spacer dueDate startDate assignDate completeDate '.w();
  tiles.push(Postbooks.CreateTileView(klass, controller, "_details".loc(), properties));

  // contact
  tiles.push(Postbooks.Project.CreateContactTileView(controller));

  // summary
  tiles.push(Postbooks.Project.CreateSummaryTileView(controller));
 // properties = ' budgetedHoursTotal actualHoursTotal balanceHoursTotal '.w();
  //tiles.push(Postbooks.Project.CreateSummaryTileView(controller));

  //notes
  tiles.push(Postbooks.CreateNotesTileView(controller));

  return tiles;
};

Postbooks.Project.CreateOverviewTileView = function(controller) {
  console.log('Postbooks.Project.CreateOverviewTileView(', controller, ')');

  var view = Postbooks.TileView.create(),
      layers = view.get('layers'),
      y = 42,
      proto = XM.Project.prototype,
      K = Postbooks,
      left = 120, right = 12,
      label = null, widget = null,
      key, objectKlass, objectController, objectKey;
 
  // number
  key = 'number';
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

  // name 
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
  y += K.VERT_SPACER;
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);

  // crm account 
  key = 'account';
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_account".loc() + ':'
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

  // owner 
  key = 'owner';
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_owner".loc() + ':'
  });
  objectKey = 'username';
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 24, right: right },
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
    backgroundColor: 'white',
    textAlign: 'left',
    valueBinding: SC.Binding.from(objectKey, objectController)
  });
  y += 12 + K.SPACING;
  layers.pushObject(label);

  // assignedTo 
  key = "assignedTo";
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_assignedTo".loc() + ':'
  });
  objectKey = 'username';
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 24, right: right },
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
    backgroundColor: 'white',
    textAlign: 'left',
    valueBinding: SC.Binding.from(objectKey, objectController)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);

  return view;
};

Postbooks.Project.CreateContactTileView = function(controller) {
  console.log('Postbooks.Project.CreateOverviewTileView(', controller, ')');

  var proto = XM.Project.prototype,
      key, objectKlass, objectController;
 
  key = 'contact';
  objectKlass = property.get('typeClass');
  objectController = SC.ObjectController.create({
    contentBinding: SC.Binding.from(key, controller).single().oneWay()
  });

  return Postbooks.CreateTileViewForClass(objectKlass, objectController, "_contact".loc());

};

Postbooks.Project.CreateSummaryTileView = function(controller) {
  console.log('Postbooks.Project.CreateSummaryTileView(', controller, ')');

  var view = Postbooks.TileView.create({ title: "_summary".loc() }),
      layers = view.get('layers'),
      y = 42,
      proto = XM.Project.prototype,
      K = Postbooks,
      key,
      left = 120, right = 12,
      full = 296,
      label = null, widget = null;

  // hours
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: full },
    backgroundColor: 'white',
    font: "bold 10pt "+K.TYPEFACE,
    textAlign: 'center',
    value: "_hours".loc()
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);

  // budgetedHoursTotal
  key = 'budgetedHoursTotal';
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left + 55 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_budgetedHoursTotal".loc() + ':'
  });
  layers.pushObject(label);
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: left + 73, height: 24, right: right },
    backgroundColor: 'white',
    textAlign: 'left',
    value: '0'
    /* TODO: get this computed property binding working.
    valueBinding: SC.Binding.transform(function(val) {
      return val? val.toLocaleString() : "0";
    }).from(key, controller) */
  });
  y += 18 + K.SPACING;
  layers.pushObject(label);

  // actualHoursTotal
  key = 'actualHoursTotal';
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left + 55 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_actualHoursTotal".loc() + ':'
  });
  layers.pushObject(label);
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: left + 73, height: 24, right: right },
    backgroundColor: 'white',
    textAlign: 'left',
    value: '0'
    /* TODO: get this computed property binding working.
    valueBinding: SC.Binding.transform(function(val) {
      return val? val.toLocaleString() : "0";
    }).from(key, controller) */
  });
  y += 18 + K.SPACING;
  layers.pushObject(label);

  // balanceHoursTotal
  key = 'balanceHoursTotal';
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left + 55 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_balance".loc() + ':'
  });
  layers.pushObject(label);
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: left + 73, height: 24, right: right },
    backgroundColor: 'white',
    textAlign: 'left',
    value: '0'
    /* TODO: get this computed property binding working.
    valueBinding: SC.Binding.transform(function(val) {
      return val? val.toLocaleString() : "0";
    }).from(key, controller) */
  });
  y += 18 + K.SPACING;
  layers.pushObject(label);

  // expenses
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: full },
    backgroundColor: 'white',
    font: "bold 10pt "+K.TYPEFACE,
    textAlign: 'center',
    value: "_expenses".loc()
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);

  // budgetedExpensesTotal
  key = 'budgetedHoursTotal';
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left + 55 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_budgetedExpensesTotal".loc() + ':'
  });
  layers.pushObject(label);
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: left + 73, height: 24, right: right },
    backgroundColor: 'white',
    textAlign: 'left',
    value: '0'
    /* TODO: get this computed property binding working.
    valueBinding: SC.Binding.transform(function(val) {
      return val? val.toLocaleString() : "0";
    }).from(key, controller) */
  });
  y += 18 + K.SPACING;
  layers.pushObject(label);

  // actualExpensesTotal
  key = 'actualExpensesTotal';
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left + 55 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_actualExpensesTotal".loc() + ':'
  });
  layers.pushObject(label);
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: left + 73, height: 24, right: right },
    backgroundColor: 'white',
    textAlign: 'left',
    value: '0'
    /* TODO: get this computed property binding working.
    valueBinding: SC.Binding.transform(function(val) {
      return val? val.toLocaleString() : "0";
    }).from(key, controller) */
  });
  y += 18 + K.SPACING;
  layers.pushObject(label);

  // balanceHoursTotal
  key = 'balanceHoursTotal';
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left + 55 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_balance".loc() + ':'
  });
  layers.pushObject(label);
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: left + 73, height: 24, right: right },
    backgroundColor: 'white',
    textAlign: 'left',
    value: '0'
    /* TODO: get this computed property binding working.
    valueBinding: SC.Binding.transform(function(val) {
      return val? val.toLocaleString() : "0";
    }).from(key, controller) */
  });
  y += 18 + K.SPACING;
  layers.pushObject(label);

  return view;
};

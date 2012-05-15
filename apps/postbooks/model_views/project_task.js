// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XM sc_assert */

sc_require('views/record_list');

Postbooks.ProjectTask = {};
Postbooks.ProjectTask.RenderRecordListRow = function(context, width, height, index, object, isSelected) {
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
    var isDue = object.get('projectTaskStatus') !== XM.Project.COMPLETED &&
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
  if (val && val.elide) val = val.elide(context, 290 - dateWidth);
  context.fillText(val, 15, 15);
  
  // Name
  val = object.get('name') || '';
  context.font = "9pt "+K.TYPEFACE;
  context.textAlign = 'left';
  if (val && val.elide) val = val.elide(context, 300);
  context.fillText(val , 15, 35);
  
  // Status
  val = object.get('projectTaskStatusString');
  context.font = "9pt "+K.TYPEFACE;
  if (val && val.elide) val = val.elide(context, 70);
  context.fillText(val , 325, 15);

  // Assigned To
  val = object.getPath('assignedTo.username') || '';
  if (val && val.elide) val = val.elide(context, 70);
  context.fillText(val , 325, 35);

  // labels 
  var budgetLabel = "_budget".loc()+":";
  var budgetLabelWidth = context.measureText(budgetLabel).width;
  context.fillText(budgetLabel, 400, 15);
  var actualLabel = "_actual".loc()+":";
  var actualLabelWidth = context.measureText(actualLabel).width;
  context.fillText(actualLabel, 400, 35);

  // Budgeted Hours Total 
  val = object.get('budgetedHours');
  val = val.toLocaleString()+" "+"_hrs".loc();
  context.textAlign = 'right';
  if (val && val.elide) val = val.elide(context, 145 - budgetLabelWidth);
  context.fillText(val, 535, 15);

  // Budgeted Expenses Total 
  val = object.get('budgetedExpenses');
  val = currency.toLocaleString(val);
  if (val && val.elide) val = val.elide(context, 95);
  context.fillText(val, 635, 15);

  // Actual Hours Total 
  val = object.get('actualHours');
  val = val.toLocaleString()+" "+"_hrs".loc();
  if (val && val.elide) val = val.elide(context, 145 - actualLabelWidth);
  context.fillText(val, 535, 35);
  
  // Actual Expenses Total 
  val = object.get('actualExpenses')
  val = currency.toLocaleString(val);
  if (val && val.elide) val = val.elide(context, 95);
  context.fillText(val, 635, 35);
  
};

Postbooks.ProjectTask.RecordListView = Postbooks.RecordListView.extend({

  renderRow: Postbooks.ProjectTask.RenderRecordListRow

});

Postbooks.ProjectTask.CreateDetailListView = function(controller) {
  var list = Postbooks.ProjectTask.RecordListView.create({
    layout: { top: 13, left: 0, right: 0, bottom: 0 },

    contentBinding: SC.Binding.from('arrangedObjects', controller).oneWay(),
    selectionBinding: SC.Binding.from('selection', controller),

    action: function(object, index) {
      var that = this;
      var instance = this.get('content').objectAt(index);
      if (instance) {
        Postbooks.LoadModal("ProjectTask", "Back", instance);

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

Postbooks.ProjectTask.Tiles = function(controller, isRoot) {
  console.log('Postbooks.ProjectTask.Tiles()');
  
  var klass = XM.ProjectTask,
      tiles = [],
      proto = klass.prototype;
      properties = [];

  // overview
  tiles.push(Postbooks.ProjectTask.CreateOverviewTileView(controller));

  // schedule
  properties = ' dueDate startDate assignDate completeDate '.w();
  tiles.push(Postbooks.CreateTileView(klass, controller, "_schedule".loc(), properties));

  // plan
  tiles.push(Postbooks.ProjectTask.CreatePlanTileView(controller));

  //notes
  tiles.push(Postbooks.CreateNotesTileView(controller));

  return tiles;
};

Postbooks.ProjectTask.CreateOverviewTileView = function(controller) {
  console.log('Postbooks.ProjectTask.CreateOverviewTileView(', controller, ')');

  var view = Postbooks.TileView.create(),
      layers = view.get('layers'),
      y = 42,
      proto = XM.ProjectTask.prototype,
      K = Postbooks,
      left = 120, right = 12,
      label = null, widget = null,
      key, property, objectController, objectKey;
 
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

  // name 
  key = 'name';
  property = proto[key];
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

  // projectTaskStatus 
  key = 'projectTaskStatus';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_status".loc() + ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 24, right: right },
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
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_owner".loc() + ':'
  });
  objectController = SC.ObjectController.create({
    contentBinding: SC.Binding.from(key, controller).single().oneWay()
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
  property = proto[key];
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

Postbooks.ProjectTask.CreatePlanTileView = function(controller) {
  console.log('Postbooks.ProjectTask.CreatePlanTileView(', controller, ')');

  var view = Postbooks.TileView.create({ title: "_plan".loc() }),
      layers = view.get('layers'),
      y = 42,
      proto = XM.ProjectTask.prototype,
      K = Postbooks,
      left = 120, right = 12,
      full = 296,
      label = null, widget = null,
      key, property;
 
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

  // budgetedHours
  key = 'budgetedHours';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_budgeted".loc() + ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 24, right: left - 40 },

    // TODO: Add support for textAlign: 'right' to SC.TextLayer
    textAlign: 'left', /* should be textAligh: right */
    valueBinding: SC.Binding.transform(function(val) {
      return val? val.toLocaleString() : "0";
    }).from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);

  // actualHours
  key = 'actualHours';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_actual".loc() + ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 24, right: left - 40 },
    valueBinding: SC.Binding.transform(function(val) {
      return val? val.toLocaleString() : "0";
    }).from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);

  // balanceHours
  key = 'balanceHours';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_balance".loc() + ':'
  });
  layers.pushObject(label);
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: left, height: 24, right: left - 40 },
    backgroundColor: 'white',
    textAlign: 'left',
    value: "0",
    /* TODO: get this computed property binding working.
    valueBinding: SC.Binding.transform(function(val) {
      return val? val.toLocaleString() : "0";
    }).from(key, controller) */
  });
  y += K.VERT_SPACER;
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

  // budgetedExpenses
  key = 'budgetedExpenses';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_budgeted".loc() + ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 24, right: left - 40 },
    valueBinding: SC.Binding.transform(function(val) {
      return val? val.toLocaleString() : "0";
    }).from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);

  // actualExpenses
  key = 'actualExpenses';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_actual".loc() + ':'
  });
  widget = SC.TextFieldWidget.create({
    layout: { top: y, left: left, height: 24, right: left - 40 },
    valueBinding: SC.Binding.transform(function(val) {
      return val? val.toLocaleString() : "0";
    }).from(key, controller)
  });
  y += 24 + K.SPACING;
  layers.pushObject(label);
  layers.pushObject(widget);

  // balanceExpenses
  key = 'balanceExpenses';
  property = proto[key];
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
    backgroundColor: 'white',
    textAlign: 'right',
    value: "_balance".loc() + ':'
  });
  layers.pushObject(label);
  label = SC.LabelLayer.create({
    layout: { top: y + 4, left: left, height: 24, right: left - 40 },
    backgroundColor: 'white',
    textAlign: 'left',
    value: "0",
    /* TODO: get this computed property binding working.
    valueBinding: SC.Binding.transform(function(val) {
      return val? val.toLocaleString() : "0";
    }).from(key, controller) */
  });
  y += 18 + K.SPACING;
  layers.pushObject(label);

  return view;
};

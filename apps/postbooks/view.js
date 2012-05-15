// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XM XT sc_assert */

sc_require('views/carousel');
sc_require('views/tile_view');
sc_require('widgets/relation');

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

Postbooks.TilesForClass = function(klass, controller, isRoot) {
  console.log('Postbooks.TilesForClass(', klass, ')');

  var tiles = [],
      proto = klass.prototype;

  // see if there is a function for this specific class
  if (Postbooks[klass] && Postbooks[klass].tiles) {
    tiles = Postbooks[klass].tiles(controller, isRoot);
    
  // otherwise generate automatically
  } else {
    tiles.push(Postbooks.CreateTileViewForClass(klass, controller, undefined, true, isRoot));

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

      } else if (property && (property.isChildAttribute || property.isSingleAttribute)) {
        var objectKlass = property.get('typeClass');

        var objectController = SC.ObjectController.create({
          contentBinding: SC.Binding.from(key, controller).single().oneWay()
        });

        tiles.push(Postbooks.CreateTileViewForClass(objectKlass, objectController, title));
      } else if (key === 'customTileViews') {
        property.forEach(function(viewName) {
          var view = SC.objectForPropertyPath(viewName);
          if (view) {
            tiles.push(view.CreateTileView(controller));
          } else { SC.Logger.warn("Could not find view for class %@".fmt(viewName)); }
        });
      }
    }
  }

  return tiles;
};

/** Builds an SC.View subclass from all attributes that can edit properties of the record class. */
Postbooks.CreateTileViewForClass = function(klass, controller, title, isOverview, isRoot) {
  console.log('Postbooks.CreateTileViewForClass(', klass, title, isOverview, ')');

  // See if we have an override.
  if (klass.CreateTileView) {
    return klass.CreateTileView(controller, title, isOverview);
  }

  // Nope, generate the default tile view on the fly.
  var proto = klass.prototype, properties = [], commands = [];

  if (isOverview && isRoot) {
    commands = [{
      title: "\u2699",
      value: null,
      enabled: true
    }, {
      title: "_delete".loc(),
      value: 'delete',
      enabled: true
    }];

    for (var key in klass) {
      var property = klass[key];
      if (typeof property === 'function' && property.isCommand) {
        commands.push({
          title: property.commandName || "(no name)",
          value: property,
          enabled: true
        });
      } else if (property && typeof property === 'object' && property.isCommand && property.call && typeof property.call === 'function') {
        commands.push({
          title: property.commandName || "(no name)",
          value: property,
          enabled: true
        });
      }
    }
  }

  for (key in proto) {
   if (key === 'guid') continue;
    if (key === 'type') continue;
    if (key === 'dataState') continue;

    property = proto[key];

    if (property && (property.isChildrenAttribute || property.isManyAttribute)) {
      continue;
    } else if (property && (property.isChildAttribute || property.isSingleAttribute)) {
      continue;
    } else if (property && property.isRecordAttribute) {
      if (property.isChildrenAttribute)    continue;
      else if (property.isChildAttribute)  continue;
      else if (property.isManyAttribute)   continue;
      else if (property.isSingleAttribute) continue;
      
      properties.push(key);
    }
  }
  
  var view = Postbooks.CreateTileView(klass, controller, title, properties, commands, isOverview);

  return view;
};

/** Builds an SC.View subclass from a specific property list that can edit them the record class. */
Postbooks.CreateTileView = function(klass, controller, title, properties, commands, isOverview) {
  console.log('Postbooks.CreateTileView(', klass, controller, title, properties, commands, isOverview, ')');

  if (!isOverview && title === 'Overview') debugger;

  title = title? title : "_overview".loc();
  var view = Postbooks.TileView.create({
    title: title,
    mouseDown: function(evt) {
      SC.CloseFieldEditor();

      if (XM[title] !== undefined) {
        Postbooks.LoadModal(title, "_back".loc(), controller.get('content'));
      }

      return true;
    }
  }),
  layers = view.get('layers'),
  y = 42,
  proto = klass.prototype,
  K = Postbooks;

  if (commands && commands.get('length')) {
    layers.pushObject(SC.SelectWidget.create({
      layout: { top: 7, right: 10, width: 60, height: 24 },
      theme: 'regular',
      items: commands,
      value: null,
      itemTitleKey: 'title',
      itemValueKey: 'value',
      itemIsEnabledKey: 'enabled',

      valueDidChange: function() {
        var value = this.get('value');
        if (value === 'delete') {
          Postbooks.statechart.sendAction('deleteRecord');
        } else {
          alert('FIXME: Execute command!');
        }
      }.observes('value')
    }));
  }

  properties.forEach(function(key) {
    if (key === 'spacer') {
      y += 12;
    } else {
      var property = proto[key],
          left = 120, right = 12,
          label = null, widget = null,
          title = ("_"+key).loc()+":";

      if (property.isRecordAttribute) {    
        var typeClass = property.get('typeClass');
        // if (key === 'customerType') debugger;

        if (typeClass === String) {
          label = SC.LabelLayer.create({
            layout: { top: y + 3, left: 12, height: 24, width: left - 18 },
            backgroundColor: 'clear',
            color: 'white',
            textAlign: 'right',
            value: title
          });
          if (key === 'incidentStatus') {
            widget = Postbooks.ToOneSelectWidget.create({
              layout: { top: y, left: left, height: 22, right: right },
              recordType: typeClass,
              store: controller.getPath('content.store'),
              valueBinding: SC.Binding.from(key, controller),
              items: XM.Incident.statusItems,
              itemTitleKey: 'title',
              itemValueKey: 'value'
            });
          } else {
            widget = SC.TextFieldWidget.create({
              layout: { top: y, left: left, height: 22, right: right },
              valueBinding: SC.Binding.from(key, controller)
            });
          }
          y += 24 + K.SPACING;
        } else if (property.isSingleAttribute) { // just for now so we can see layout impact
          label = SC.LabelLayer.create({
            layout: { top: y + 3, left: 12, height: 24, width: left - 18 },
            backgroundColor: 'clear',
            color: 'white',
            textAlign: 'right',
            value: title
          });
          if (typeClass === XM.IncidentCategory) {
            widget = Postbooks.ToOneSelectWidget.create({
              layout: { top: y, left: left, height: 22, right: right },
              recordType: typeClass,
              store: controller.getPath('content.store'),
              valueBinding: SC.Binding.from(key, controller),
              items: Postbooks.CRM.createIncidentCategoryRecordArray(),
              itemTitleKey: 'name',
              itemValueKey: null // Use item itself
            });
          } else if (typeClass === XM.Priority) {
            widget = Postbooks.ToOneSelectWidget.create({
              layout: { top: y, left: left, height: 22, right: right },
              recordType: typeClass,
              store: controller.getPath('content.store'),
              valueBinding: SC.Binding.from(key, controller),
              items: Postbooks.CRM.createPriorityRecordArray(),
              itemTitleKey: 'name',
              itemValueKey: null // Use item itself
            });
          } else if (typeClass === XM.IncidentResolution) {
            widget = Postbooks.ToOneSelectWidget.create({
              layout: { top: y, left: left, height: 22, right: right },
              recordType: typeClass,
              store: controller.getPath('content.store'),
              valueBinding: SC.Binding.from(key, controller),
              items: Postbooks.CRM.createIncidentResolutionRecordArray(),
              itemTitleKey: 'name',
              itemValueKey: null // Use item itself
            });
          } else if (typeClass === XM.IncidentSeverity) {
            widget = Postbooks.ToOneSelectWidget.create({
              layout: { top: y, left: left, height: 22, right: right },
              recordType: typeClass,
              store: controller.getPath('content.store'),
              valueBinding: SC.Binding.from(key, controller),
              items: Postbooks.CRM.createIncidentSeverityRecordArray(),
              itemTitleKey: 'name',
              itemValueKey: null // Use item itself
            });
          } else {
            widget = SC.TextFieldWidget.create({
              layout: { top: y, left: left, height: 22, right: right },
              recordType: typeClass,
              store: controller.getPath('content.store'),
              valueBinding: SC.Binding.transform(function(val) {
                return String(val);
              }).from(key, controller)
            });
          }
          y += 24 + K.SPACING;
        } else if (property.isChildrenAttribute) { // just for now so we can see layout impact
          label = SC.LabelLayer.create({
            layout: { top: y + 3, left: 12, height: 24, width: left - 18 },
            backgroundColor: 'clear',
            color: 'white',
            textAlign: 'right',
            value: title
          });
          widget = Postbooks.RelationWidget.create({
            layout: { top: y, left: left, height: 22, right: right },
            recordType: typeClass,
            store: controller.getPath('content.store'),
            valueBinding: SC.Binding.transform(function(val) {
              return String(val);
            }).from(key, controller)
          });
          y += 24 + K.SPACING;
        } else if (typeClass === Number) {
          label = SC.LabelLayer.create({
            layout: { top: y + 3, left: 12, height: 24, width: left - 18 },
            backgroundColor: 'clear',
            color: 'white',
            textAlign: 'right',
            value: title
          });
          // FIXME: Re-enable this!
          // widget = SC.TextFieldWidget.create({
          //   layout: { top: y, left: left, height: 22, right: right },
          //   valueBinding: SC.Binding.transform(function(val) {
          //     return String(val);
          //   }).from(key, controller)
          // });
          y += 24 + K.SPACING;
        } else if (typeClass.isNumeric) {
          label = SC.LabelLayer.create({
            layout: { top: y + 3, left: 12, height: 24, width: left - 18 },
            backgroundColor: 'clear',
            color: 'white',
            textAlign: 'right',
            value: title
          });
          widget = SC.TextFieldWidget.create({
            layout: { top: y, left: left, height: 22, right: right },
            valueBinding: SC.Binding.transform(function(val) {
              return val? val.toLocaleString() : "";
            }).from(key, controller)
          });
          y += 24 + K.SPACING;
        } else if (typeClass === XT.DateTime) {
          label = SC.LabelLayer.create({
            layout: { top: y + 3, left: 12, height: 24, width: left - 18 },
            backgroundColor: 'clear',
            color: 'white',
            textAlign: 'right',
            value: title
          });
          widget = SC.TextFieldWidget.create({
            layout: { top: y, left: left, height: 22, right: right },
            valueBinding: SC.Binding.transform(function(val) {
              return val? val.toLocaleDateString() : "no date set";
            }).from(key, controller)
          });
          y += 24 + K.SPACING;
        } else if (typeClass === Boolean) {
          widget = SC.CheckboxWidget.create({
            layout: { top: y, left: left, height: 22, right: right },
            title: ("_"+key).loc(),
            valueBinding: SC.Binding.transform(function(val) {
              return !!val;
            }).from(key, controller)
          });
          y += 24 + K.SPACING;
        } else if (typeClass === Array) {
          console.log('Unknown property type', 'Array');          
        } else if (typeClass === Object) {
          console.log('Unknown property type', 'Object');          
        } else {
          console.log('Unknown property type', typeClass.displayName? typeClass.displayName : typeClass);          
        }
      }

      if (label)  layers.pushObject(label);
      if (widget) layers.pushObject(widget);
    }
  });

  view.set('backgroundColor', 'rgb(66,66,66)');

  return view;
};

Postbooks.DefaultListRenderRow = function(context, width, height, index, object, isSelected) {
  console.log('Postbooks.DefaultListRenderRow()');

  context.fillStyle = isSelected? '#99CCFF' : 'white';
  context.fillRect(0, 0, width, height);

  context.strokeStyle = 'grey';
  context.lineWidth = 1;

  context.beginPath();
  context.moveTo(0, height - 0.5);
  context.lineTo(width, height - 0.5);
  context.stroke();

  var K = Postbooks;
  context.font = "12pt "+K.TYPEFACE;
  context.fillStyle = 'black';
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  context.fillText(object.get('className') + ': ' + object.get('guid') + ': ' + (object.get('name') || object.get('description') || object.get('number')), width/2, height/2);
};

Postbooks.CreateListViewForClass = function(klass, controller) {
  console.log('Postbooks.CreateListViewForClass(', klass.prototype.className, ')');

  // See if we have an override.
  var className = klass.prototype.className;
  className = className.slice(className.indexOf('.') + 1); // drop name space
  if (Postbooks[className] && Postbooks[className].CreateDetailListView) {
    return Postbooks[className].CreateDetailListView(controller);
  }

  // Nope, generate the default tile view on the fly.
  var list = SC.ListView.create({
    layout: { top: 13, left: 0, right: 0, bottom: 0 },
    rowHeight: klass.ListRowHeight !== undefined? klass.ListRowHeight : 60,
    hasHorizontalScroller: false,

    contentBinding: SC.Binding.from('arrangedObjects', controller).oneWay(),
    selectionBinding: SC.Binding.from('selection', controller),

    baseClass: klass,

    action: function(object, index) {
      var that = this;
      var instance = this.get('content').objectAt(index);
      if (instance) {
        Postbooks.LoadModal(klass.prototype.className.slice(3), "Back", instance);
      
        // Deselect our row after the modal transition ends.
        setTimeout(function() {
          SC.RunLoop.begin();
          that.get('content').deselectObject(instance);
          SC.RunLoop.end();
        }, 250);
      }
    },

    willRenderLayers: function(ctx) {
      var content = this.get('content');

      if (content && content.get('length') === 0) {
        var w = ctx.width, h = ctx.height;

        var text = '_noRecords'.loc(),
            status = content? content.get('status') : null;

        if (status && status === SC.Record.BUSY_LOADING) {
          text = "_loading".loc();
        }

        // Clear background.
        ctx.fillStyle = base3;
        ctx.fillRect(0, 0, w, h);

        // Draw view name.
        ctx.fillStyle = base03;
        
        var K = Postbooks;
        ctx.font = "11pt "+K.TYPEFACE;
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText(text, w/2, h/2);
      } else {
        ctx.fillStyle = base3;
        ctx.fillRect(0, 0, ctx.width, ctx.height);
      }
    },

    renderRow: klass.RenderDetailListRow? klass.RenderDetailListRow : Postbooks.DefaultListRenderRow

  });

  return list;
};

Postbooks.CreateTileListViewForClass = function(klass, controller) {
  console.log('Postbooks.CreateTileListViewForClass(', klass, ')');

  // See if we have an override.
  var className = klass.prototype.className;
  className = className.slice(className.indexOf('.') + 1); // drop name space
  // if (className === 'ContactCharacteristic') debugger;
  if (Postbooks[className] && Postbooks[className].CreateTileListView) {
    return Postbooks[className].CreateTileListView(controller);
  }

  // Nope, generate the default tile view on the fly.
  var list = Postbooks.TileListView.create({
    layout: { top: 0, left: 0, right: 0, bottom: 0 },
    rowHeight: klass.ListRowHeight !== undefined? klass.ListRowHeight : 60,
    hasHorizontalScroller: false,

    contentBinding: SC.Binding.from('arrangedObjects', controller).oneWay(),
    selectionBinding: SC.Binding.from('selection', controller),

    baseClass: klass,

    action: function(object, index) {
      var that = this;
      var instance = this.get('content').objectAt(index);
      if (instance) {
        Postbooks.LoadModal(klass.prototype.className.slice(3), "Back", instance);
      
        // Deselect our row after the modal transition ends.
        setTimeout(function() {
          SC.RunLoop.begin();
          that.get('content').deselectObject(instance);
          SC.RunLoop.end();
        }, 250);
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
        ctx.fillStyle = base03;
        
        var K = Postbooks;
        ctx.font = "11pt "+K.TYPEFACE;
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText(text, w/2, h/2);
      } else {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, w, h);
      }
    },

    renderRow: klass.RenderRecordListRow? klass.RenderRecordListRow : Postbooks.DefaultListRenderRow

  });

  return list;
};

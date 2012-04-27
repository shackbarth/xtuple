// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XM sc_assert */

sc_require('views/carousel');
sc_require('views/tile_view');

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
  var klassName = proto.className;
  var tileView = XT.getViewForModel(klassName, 'Postbooks.TileView');
  if (tileView) {
    tiles.push(tileView.createTileView(controller));
  } else {
    tiles.push(Postbooks.CreateTileViewForClass(klass, controller, undefined, true, isRoot));
  }

  for (var key in proto) {
    if (key === 'guid') continue;
    if (key === 'type') continue;
    if (key === 'dataState') continue;
//    if (key === 'owner') continue;
//    if (key === 'assignedTo') continue;
//console.log('proto keys: '+key);
    var property = proto[key];

    if (property && (property.isChildrenAttribute || property.isManyAttribute)) {
      continue;

    // } else if (property && property.isChildAttribute) {
    } else if (property && (property.isChildAttribute || property.isSingleAttribute)) {
      var objectKlass = property.get('typeClass');

      var objectController = SC.ObjectController.create({
        contentBinding: SC.Binding.from(key, controller).single().oneWay()
      });

      tiles.push(Postbooks.CreateTileViewForClass(objectKlass, objectController, property.label));
    }
    // } else if (key === 'customTileViews') {
    //   property.forEach(function(viewName) {
    //     var view = SC.objectForPropertyPath(viewName);
    //     if (view) {
    //       tiles.push(view.CreateTileView(controller));
    //     } else { SC.Logger.warn("Could not find view for class %@".fmt(viewName)); }
    //   });
    // }
  }

  var customViews = [];

  customViews = customViews.concat(XT.getCustomViewsForModel(klassName).map(function(tileView) {
    return tileView.CreateTileView(controller);
  }));

  for (var i=0; i<customViews.length; i++) {
    console.log("layoutSchema: %@".fmt(customViews[i].layoutSchema.tileSize));
    var idx = customViews[i].layoutSchema.order;
    tiles = tiles.replace(idx, 0, customViews[i]);
  }

/*  tiles = tiles.concat(XM.getCustomViewsForModel(klassName).map(function(tileView) {
    return tileView.CreateTileView(controller);
  }));*/

  return tiles;
};

/** Builds an SC.View subcass that can edit properties of the record class. */
Postbooks.CreateTileViewForClass = function(klass, controller, title, isOverview, isRoot) {
  console.log('Postbooks.CreateTileViewForClass(', klass, title, isOverview, ')');

  // See if we have an override.
  if (klass.CreateTileView) {
    return klass.CreateTileView(controller, title, isOverview);
  }

  // Nope, generate the default tile view on the fly.
  var view = Postbooks.TileView.create({
        layout: { top: 0, left: 0, right: 0, height: 0 }, // height set below

        mouseDown: function(evt) {
          SC.EndEditingTextLayer();

          if (!isOverview) {
            Postbooks.LoadModal(klass.prototype.className.slice(3), "_back".loc(), controller.get('content'));
          }

          return true;
        },

        willRenderLayers: function(context) {        
          context.fillStyle = base3;
          context.fillRect(0, 3, context.width, 38);

          context.fillStyle = base00;
          context.fillRect(20, 6, 32, 32);

          var K = Postbooks;
          context.font = "12pt "+K.TYPEFACE;
          context.fillStyle = 'black';
          context.textAlign = 'left';
          context.textBaseline = 'middle';

          context.fillText(title ? title : "_overview".loc(), 72, 22);
        }

      }),
      layers = view.get('layers'),
      y = 44,
      proto = klass.prototype;

  if (isOverview && isRoot) {
    var commands = [{
      title: "\u2699",
      value: null,
      enabled: true
    }, {
      title: "Delete",
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
      } else if (typeof property === 'object' && property.isCommand && property.call && typeof property.call === 'function') {
        commands.push({
          title: property.commandName || "(no name)",
          value: property,
          enabled: true
        });
      }
    }

    layers.pushObject(SC.SelectWidget.create({
      layout: { top: 10, right: 10, width: 60, height: 24 },
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

  for (key in proto) {
    if (key === 'guid') continue;
    if (key === 'type') continue;
    if (key === 'dataState') continue;
//    if (key === 'owner') continue;
//    if (key === 'assignedTo') continue;

    property = proto[key];
    var left = 120, right = 12;

   if (property && (property.isChildrenAttribute || property.isManyAttribute)) {
     continue;

   } else if (property && (property.isChildAttribute || property.isSingleAttribute)) {
     continue;

    } else if (property && property.isRecordAttribute) {
      if (property.isChildrenAttribute)    continue;
      else if (property.isChildAttribute)  continue;
      else if (property.isManyAttribute)   continue;
      else if (property.isSingleAttribute) continue;
      else if (property.isRecordAttribute && property.isVisibleInView !== false) {
        var label = null, widget = null,
            typeClass = property.get('typeClass');

        if (typeClass === String) {
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
          y += 24;
        } else if (typeClass === Number) {
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
          y += 24;
        } else if (typeClass.isNumeric) {
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
          y += 24;
        } else if (typeClass === SC.DateTime) {
          label = SC.LabelLayer.create({
            layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
            backgroundColor: 'white',
            textAlign: 'right',
            value: property.label + ':'
          });
          widget = SC.TextFieldWidget.create({
            layout: { top: y, left: left, height: 24, right: right },
            valueBinding: SC.Binding.transform(function(val) {
              return val? val.toISO8601() : "no date set";
            }).from(key, controller)
          });
          y += 24;
        } else if (typeClass === Boolean) {
          widget = SC.CheckboxWidget.create({
            layout: { top: y, left: left, height: 24, right: right },
            title: property.label,
            valueBinding: SC.Binding.transform(function(val) {
              return !!val;
            }).from(key, controller)
          });
          y += 24;
        } else if (typeClass === Array) {
          console.log('Unknown property type', 'Array');          
        } else if (typeClass === Object) {
          console.log('Unknown property type', 'Object');          
        } else {
          console.log('Unknown property type', typeClass.displayName? typeClass.displayName : typeClass);          
        }

        if (label)  layers.pushObject(label);
        if (widget) layers.pushObject(widget);
      }
    }
  }

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

  context.fillText(object.get('guid') + ': ' + (object.get('name') || object.get('description') || object.get('number')), width/2, height/2);
};

Postbooks.CreateListViewForClass = function(klass, controller) {
  console.log('Postbooks.CreateListViewForClass(', klass, ')');

  // See if we have an override.
  if (klass.CreateDetailListView) {
    return klass.CreateDetailListView(controller);
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
      // console.log('do something on embedded list index ' + index);
      var that = this;
      // var tray = this.getPath('supersurface'),
      //     next = tray.get('subsurfaces')[1],
      //     carousel = tray.get('carousel');
      // 
      // controller.set('content', XM.store.find(baseClass, Number(object.get('guid'))));
      // if (next) carousel.makeSurfaceVisible(next);
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

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

Postbooks.TilesForClass = function(klass, controller) {
  var tiles = [],
      proto = klass.prototype;

  tiles.push(Postbooks.PropertiesEditorForClass(klass, controller, undefined, true));

  for (var key in proto) {
    if (key === 'guid') continue;
    if (key === 'type') continue;
    if (key === 'dataState') continue;

    var property = proto[key];

    if (property && (property.isChildrenAttribute || property.isManyAttribute)) {
      continue;

    // } else if (property && property.isChildAttribute) {
    } else if (property && (property.isChildAttribute || property.isSingleAttribute)) {
      var objectKlass = property.get('typeClass');

      var objectController = SC.ObjectController.create({
        contentBinding: SC.Binding.from(key, controller).single().oneWay()
      });

      tiles.push(Postbooks.PropertiesEditorForClass(objectKlass, objectController, key));
    }
  }

  return tiles;
};

/** Builds an SC.View subcass that can edit properties of the record class. */
Postbooks.PropertiesEditorForClass = function(klass, controller, propertyKey, isOverview) {
  var view = Postbooks.TileView.create({
        layout: { top: 0, left: 0, right: 0, height: 0 }, // height set below
        hasHorizontalScroller: false,
        mouseDown: function(evt) {
          // var carousel;
          // 
          // carousel = this.get('supersurface');
          // while (carousel && carousel.constructor !== Postbooks.Carousel) {
          //   carousel = carousel.get('supersurface');
          // }
          // 
          // if (!carousel) return false;
          // 
          // var tray = carousel.get('tray'),
          //     next = tray.get('subsurfaces')[0];
          // 
          SC.EndEditingTextLayer();
          // if (next) {
          //   next.set('selection', SC.IndexSet.create().freeze());
          //   carousel.makeSurfaceVisible(next);
          // }

          if (!isOverview) {
            Postbooks.LoadModal(klass.prototype.className.slice(3), "Back", controller.get('content'));
          }

          return true;
        },

        willRenderLayers: function(context) {
          context.fillStyle = base3;
          context.fillRect(0, 3, context.width, 38);

          context.fillStyle = base00;
          context.fillRect(20, 6, 32, 32);

          context.font = "12pt Calibri";
          context.fillStyle = 'black';
          context.textAlign = 'left';
          context.textBaseline = 'middle';

          context.fillText(propertyKey? propertyKey.titleize() : "Overview", 72, 22);
        }
      }),
      layers = view.get('layers'),
      y = 44,
      proto = klass.prototype;

  for (var key in proto) {
    if (key === 'guid') continue;
    if (key === 'type') continue;
    if (key === 'dataState') continue;

    var property = proto[key],
        left = 120, right = 12;

   if (property && (property.isChildrenAttribute || property.isManyAttribute)) {
     continue;

   } else if (property && (property.isChildAttribute || property.isSingleAttribute)) {
     continue;

    } else if (property && property.isRecordAttribute) {
      if (property.isChildrenAttribute)    continue;
      else if (property.isChildAttribute)  continue;
      else if (property.isManyAttribute)   continue;
      else if (property.isSingleAttribute) continue;
      else if (property.isRecordAttribute) {
        var label = null, widget = null,
            typeClass = property.get('typeClass');

        if (typeClass === String) {
          label = SC.LabelLayer.create({
            layout: { top: y + 4, left: 12, height: 24, width: left - 18 },
            backgroundColor: 'white',
            textAlign: 'right',
            value: key.titleize() + ':'
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
            value: key.titleize() + ':'
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
            value: key.titleize() + ':'
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
            value: key.titleize() + ':'
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
            title: key.titleize(),
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

Postbooks.ListViewForClass = function(klass, controller) {
  var list = SC.ListView.create({
    layout: { top: 13, left: 0, right: 0, bottom: 0 },
    rowHeight: 60,
    hasHorizontalScroller: false,

    contentBinding: SC.Binding.from('arrangedObjects', controller).oneWay(),
    selectionBinding: SC.Binding.from('selection', controller).oneWay(),

    baseClass: klass,

    action: function(object, index) {
      console.log('do something on embedded list index ' + index);
      // var tray = this.getPath('supersurface'),
      //     next = tray.get('subsurfaces')[1],
      //     carousel = tray.get('carousel');
      // 
      // controller.set('content', XM.store.find(baseClass, Number(object.get('guid'))));
      // if (next) carousel.makeSurfaceVisible(next);
      var instance = this.get('content').objectAt(index);
      if (instance) {
        Postbooks.LoadModal(klass.prototype.className.slice(3), "Back", instance);
      }
    },

    willRenderLayers: function(ctx) {
      var content = this.get('content');

      if (content && content.get('length') === 0) {
        var w = ctx.width, h = ctx.height;

        var text = 'No records.',
            status = content? content.get('status') : null;

        if (status && status === SC.Record.BUSY_LOADING) {
          text = "Loading...";
        }

        // Clear background.
        ctx.fillStyle = base3;
        ctx.fillRect(0, 0, w, h);

        // Draw view name.
        ctx.fillStyle = base03;
        ctx.font = "11pt Calibri";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText(text, w/2, h/2);
      } else {
        ctx.fillStyle = base3;
        ctx.fillRect(0, 0, ctx.width, ctx.height);
      }
    },

    renderRow: function(context, width, height, index, object, isSelected) {
      context.fillStyle = isSelected? '#99CCFF' : 'white';
      context.fillRect(0, 0, width, height);

      context.strokeStyle = 'grey';
      context.lineWidth = 1;

      context.beginPath();
      context.moveTo(0, height - 0.5);
      context.lineTo(width, height - 0.5);
      context.stroke();

      context.font = "12pt Calibri";
      context.fillStyle = 'black';
      context.textAlign = 'center';
      context.textBaseline = 'middle';

      context.fillText(object.get('guid') + ': ' + (object.get('name') || object.get('description') || object.get('number')), width/2, height/2);
    }
  });

  return list;
};
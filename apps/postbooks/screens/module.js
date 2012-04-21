// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XT XM sc_assert */

sc_require('views/carousel');
sc_require('views/master_list');
sc_require('widgets/back_button');

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

Postbooks.LoadModule = function(name, classes, state) {
  var items = [];
  classes.forEach(function(className, idx) {
    items.push({
      title: ("_" + className.camelize()).loc(),
      value: className + 'Surface',
      enabled: true
    });
  });

  classes.forEach(function(className, idx) {
    var baseClass = XM[className];
    var browseClass = XM[className+'Browse'] || baseClass;
    sc_assert(baseClass);
    sc_assert(baseClass.isClass);
    sc_assert(baseClass.subclassOf(XT.Record));
    sc_assert(browseClass);
    sc_assert(browseClass.isClass);
    sc_assert(browseClass.subclassOf(XT.Record));

    Postbooks[className+'ListController'] = SC.ArrayController.create({
      content: XT.store.find(browseClass),
      allowsEmptySelection: true
    });

    var controller;
    controller = Postbooks[className+'ObjectController'] = SC.ObjectController.create();

    var surface = SC.ListView.create({
      layout: { top: 0, left: 0, right: 0, bottom: 0 },
      rowHeight: 88,
      hasHorizontalScroller: false,

      contentBinding: 'Postbooks.'+className+'ListController.arrangedObjects',
      selectionBinding: 'Postbooks.'+className+'ListController.selection',

      baseClass: baseClass,
      browseClass: browseClass,

      action: function(object, index) {
        // console.log('do something on index ' + index);
        // var tray = this.getPath('supersurface'),
        //     next = tray.get('subsurfaces')[1],
        //     carousel = tray.get('carousel');
        
        controller.set('content', XT.store.find(baseClass, Number(object.get('guid'))));
        // if (next) carousel.makeSurfaceVisible(next);

        Postbooks.statechart.sendAction('show'+className);
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
          ctx.font = "11pt Helvetica";
          ctx.textBaseline = "middle";
          ctx.textAlign = "center";
          ctx.fillText(text, w/2, h/2);
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

        context.font = "12pt Helvetica";
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        context.fillText(object.get('guid') + ': ' + (object.get('name') || object.get('description') || object.get('number')), width/2, height/2);
      }
    });

    items[idx].surface = surface;
  });

  var list = [SC.Object.create({
    title: "_home".loc(),
    surface: SC.View.create({
      willRenderLayers: function(context) {
        context.fillStyle = cyan;
        context.fillRect(0, 0, context.width, context.height);
      }
    })
  })];
  items.forEach(function(item) {
    list.push(SC.Object.create(item));
  });

  var listController = SC.ArrayController.create({
    content: list,
    allowsEmptySelection: false
  });

  listController.selectObject(list[1]);

  var detail = SC.ContainerSurface.create({
    layout: { top: 44, left: 320, right: 0, bottom: 0 },
    orderInTransition:  null,
    replaceTransition:  null,
    orderOutTransition: null
  });

  detail.set('contentSurface', list[1].surface);

  state.listContainer = detail;

  var listView = Postbooks.MasterListView.create({
    contentBinding: SC.Binding.from('arrangedObjects', listController).multiple().oneWay(),
    selectionBinding: SC.Binding.from('selection', listController),

    action: function(object, index) {
      // console.log('do something on index ' + index);
      detail.set('contentSurface', list[index].surface);
    }
  });

  var module = SC.LayoutSurface.create();
  
  var topbar = SC.View.create({
    layout: { top: 0, left: 0, right: 0, height: 44 },

    willRenderLayers: function(ctx) {
      ctx.fillStyle = base3;
      ctx.font = "16pt Helvetica";
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.shadowBlur = 0;
      ctx.shadowColor = "rgba(0,0,0,0)";
      ctx.fillText(name, ctx.width/2, ctx.height/2);
    }
  });
  topbar.set('backgroundColor', base03);
  topbar.get('layers').pushObject(Postbooks.BackButton.create({
    layout: { left: 20, centerY: 0, width: 120, height: 24 },
    name: "_dashboard".loc(),
    target: 'Postbooks.statechart',
    action: 'showDashboard'
  }));

  module.get('subsurfaces').pushObjects([topbar, listView, detail]);

  SC.app.get('ui').pushSurface(module);
};

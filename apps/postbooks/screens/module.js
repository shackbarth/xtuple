// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XT XM sc_assert */

sc_require('views/topbar');
sc_require('views/carousel');
sc_require('views/master_list');
sc_require('views/record_list');
sc_require('widgets/button');
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
  console.log('Postbooks.LoadModule(', name, classes, ')');
  var items = [];
  classes.forEach(function(className, idx) {
    items.push({
      title: ("_" + className.pluralize().camelize()).loc(),
      value: className + 'Surface',
      enabled: true,
      className: className,
      isLoaded: false
    });
  });

  classes.forEach(function(className, idx) {
    var baseClass = XM[className];

    sc_assert(baseClass);
    sc_assert(baseClass.isClass);
    sc_assert(baseClass.subclassOf(XT.Record));

    Postbooks[className+'ListController'] = SC.ArrayController.create({
      content: null,
      allowsEmptySelection: true
    });

    var controller, surface, content, selection;
    controller = Postbooks[className+'ObjectController'] = SC.ObjectController.create();
    content = 'Postbooks.'+className+'ListController.arrangedObjects';
    selection = 'Postbooks.'+className+'ListController.selection';
    
    var action = function(object, index) {
      sc_assert(!Postbooks.store.isNested, "Postbooks.store should be the base store.");
      Postbooks.set('store', Postbooks.get('store').chain());
      controller.set('content', Postbooks.store.find(baseClass, Number(object.get('guid'))));
      Postbooks.submoduleController = controller;
      Postbooks.statechart.sendAction('show'+className);
    };

    // class have it's own list view?
    if (Postbooks[className] && Postbooks[className].RecordListView) {
      surface = Postbooks[className].RecordListView.create({
        contentBinding: content,
        selectionBinding: selection,
        action: action
      });
      
    // nope, default
    } else {
      surface = Postbooks.RecordListView.create({
        contentBinding: content,
        selectionBinding: selection,
        action: action,
        renderRow: Postbooks[className] && Postbooks[className].RenderRecordListRow? 
                   Postbooks[className].RenderRecordListRow : Postbooks.RenderRecordListRow

      });
    }

    items[idx].surface = surface;
  });

  var list = [];
  /* comment out until we can get to filling  'home' content
  var list = [SC.Object.create({
    title: "_home".loc(),
    surface: SC.View.create({
      willRenderLayers: function(context) {
        context.fillStyle = cyan;
        context.fillRect(0, 0, context.width, context.height);
      }
    })
  })];
  */
  items.forEach(function(item) {
    list.push(SC.Object.create(item));
  });

  var listController = SC.ArrayController.create({
    content: list,
    allowsEmptySelection: false
  });

  var startIndex = (name === "CRM")? 4 : 0;

  listController.selectObject(list[startIndex]);

  (function loadFirstItem(item) {
    if (!item.isLoaded) {
      var className = item.className,
          baseClass = XM[className];

      sc_assert(baseClass);
      sc_assert(baseClass.isClass);
      sc_assert(baseClass.subclassOf(XT.Record));

      var aryController = Postbooks[className+'ListController'];

      sc_assert(aryController);
      sc_assert(aryController.kindOf(SC.ArrayController));
      sc_assert(aryController.get('content') === null);

      aryController.set('content', Postbooks.get('store').find(baseClass));
      item.isLoaded = true;
    }
  })(list[startIndex]);

  var detail = SC.ContainerSurface.create({
    layout: { top: 44, left: 320, right: 0, bottom: 0 },
    orderInTransition:  null,
    replaceTransition:  null,
    orderOutTransition: null
  });

  detail.set('contentSurface', list[startIndex].surface);

  state.listContainer = detail;
  state.listController = listController;

  var listView = Postbooks.MasterListView.create({
    contentBinding: SC.Binding.from('arrangedObjects', listController).multiple().oneWay(),
    selectionBinding: SC.Binding.from('selection', listController),

    action: function(object, index) {
      // console.log('do something on index ' + index);
      var item = list[index];

      if (!item.isLoaded) {
        var className = item.className,
            baseClass = XM[className];

        sc_assert(baseClass);
        sc_assert(baseClass.isClass);
        sc_assert(baseClass.subclassOf(XT.Record));

        var aryController = Postbooks[className+'ListController'];

        sc_assert(aryController);
        sc_assert(aryController.kindOf(SC.ArrayController));
        sc_assert(aryController.get('content') === null);

        aryController.set('content', Postbooks.get('store').find(baseClass));
        item.isLoaded = true;
      }

      detail.set('contentSurface', item.surface);
    }
  });

  var module = SC.LayoutSurface.create();
  
  var topbar = Postbooks.Topbar.create({
    name: name
  });

  topbar.get('layers').pushObject(Postbooks.BackButton.create({
    layout: { left: 20, centerY: 0, width: 120, height: 24 },
    name: "_dashboard".loc(),
    target: 'Postbooks.statechart',
    action: 'showDashboard'
  }));
  topbar.get('layers').pushObject(Postbooks.Button.create({
    layout: { right: 20, centerY: 0, width: 120, height: 24 },
    name: "_new".loc(),
    target: 'Postbooks.statechart',
    action: 'newRecord'
  }));

  module.get('subsurfaces').pushObjects([topbar, listView, detail]);

  SC.app.get('ui').pushSurface(module);
};

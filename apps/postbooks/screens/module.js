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
      isLoaded: false,
      isFiltered: false
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

    var controller, list, content, selection;
    controller = items[idx].controller = Postbooks[className+'ObjectController'] = SC.ObjectController.create();
    content = 'Postbooks.'+className+'ListController.arrangedObjects';
    selection = 'Postbooks.'+className+'ListController.selection';
    
    var action = function(object, index) {
      if (!object.isRecord) return; // It's the incremental list surrogate.
      sc_assert(!Postbooks.store.isNested, "Postbooks.store should be the base store.");
      Postbooks.set('store', Postbooks.get('store').chain());
      controller.set('content', Postbooks.store.find(baseClass, Number(object.get('guid'))));
      Postbooks.submoduleController = controller;
      Postbooks.statechart.sendAction('show'+className);
    };

    // class have it's own list view?
    if (Postbooks[className] && Postbooks[className].RecordListView) {
      list = Postbooks[className].RecordListView.create({
        contentBinding: content,
        selectionBinding: selection,
        action: action
      });
      
    // nope, default
    } else {
      list = Postbooks.RecordListView.create({
        contentBinding: content,
        selectionBinding: selection,
        action: action,
        renderRow: Postbooks[className] && Postbooks[className].RenderRecordListRow? 
                   Postbooks[className].RenderRecordListRow : Postbooks.RenderRecordListRow

      });
    }

    items[idx].list = list;
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

      var orderByKey;
      if (baseClass.prototype.number) orderByKey = 'number';
      else if (baseClass.prototype.code) orderByKey = 'code';
      else if (baseClass.prototype.name) orderByKey = 'name';
      else orderByKey = 'guid';

      var query = SC.Query.remote(baseClass, { store: Postbooks.store, orderBy: orderByKey });
      var content = SC.IRecordArray.create({ fetchAmount: 50, offsetKey: 'rowOffset', limitKey: 'rowLimit', query: query });

      aryController.set('content', content);
      item.allRecords = content;
      item.isLoaded = true;
    }
  })(list[startIndex]);

  var detail = SC.ContainerSurface.create({
    layout: { top: 44, left: 320, right: 0, bottom: 0 },
    orderInTransition:  null,
    replaceTransition:  null,
    orderOutTransition: null,

    didCreateElement: function(div) {
      // We don't want SC.View's implementation; don't call it.
      div.style.overflowX = 'hidden';
      div.style.overflowY = 'hidden';

      var style = div.style;
      if (document.getCSSCanvasContext) {
        style.backgroundImage =  '-webkit-canvas(list-shadow)';
        style.backgroundPosition = 'left center';
        style.backgroundSize = '40px 100%';
        style.backgroundRepeat = 'no-repeat';
      }
    }
  });

  detail.set('contentSurface', list[startIndex].list);

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

        var orderByKey;
        if (baseClass.prototype.number) orderByKey = 'number';
        else if (baseClass.prototype.code) orderByKey = 'code';
        else if (baseClass.prototype.name) orderByKey = 'name';
        else orderByKey = 'guid';

        var query = SC.Query.remote(baseClass, { store: Postbooks.store, orderBy: orderByKey });
        var content = SC.IRecordArray.create({ fetchAmount: 50, offsetKey: 'rowOffset', limitKey: 'rowLimit', query: query });

        aryController.set('content', content);
        item.allRecords = content;
        item.isLoaded = true;
      }

      if (item.isFiltered) {
        detail.set('contentSurface', item.get('filteredSurface'));
      } else {
        detail.set('contentSurface', item.list);
      }
    }
  });

  var module = SC.LayoutSurface.create();

  Postbooks.pushContext(SC.Object.create({
    title: name,
    backButtonTitle: "_dashboard".loc(),
    backButtonAction: 'showDashboard',
    firstButtonIsVisible: true,
    secondButtonIsVisible: true,
    store: Postbooks.store
  }));

  var topbar = Postbooks.Topbar.create({
    name: name
  });

  topbar.get('layers').pushObject(Postbooks.BackButton.create({
    layout: { left: 20, centerY: 0, width: 120, height: 24 },
    nameBinding: 'Postbooks.activeContext.backButtonTitle',
    target: 'Postbooks.statechart',
    actionBinding: 'Postbooks.activeContext.backButtonAction'
  }));
  topbar.get('layers').pushObject(Postbooks.Button.create({
    layout: { right: 20, centerY: 0, width: 120, height: 24 },
    name: "_new".loc(),
    target: 'Postbooks.statechart',
    action: 'newRecord',
    isVisibleBinding: 'Postbooks.activeContext.firstButtonIsVisible'
  }));
  topbar.get('layers').pushObject(Postbooks.Button.create({
    layout: { right: 160, centerY: 0, width: 120, height: 24 },
    name: "_filter".loc(),
    target: 'Postbooks.statechart',
    action: 'filterRecords',
    isVisibleBinding: 'Postbooks.activeContext.secondButtonIsVisible'
  }));


  module.get('subsurfaces').pushObjects([topbar, listView, detail]);

  SC.app.get('ui').pushSurface(module);
};

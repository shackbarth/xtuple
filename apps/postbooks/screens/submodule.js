// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XT XM sc_assert */

sc_require('views/carousel');
sc_require('views/master_list');
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

Postbooks.LoadSubmodule = function(className, backButtonTitle) {
  console.log('Postbooks.LoadSubmodule(', className, backButtonTitle, ')');
  var name = ("_" + className.camelize()).loc();

  var baseClass = XM[className];

  sc_assert(baseClass);
  sc_assert(baseClass.isClass);
  sc_assert(baseClass.subclassOf(XT.Record));

  var controller = Postbooks[className+'ObjectController'];
  sc_assert(controller);
  sc_assert(controller.kindOf(SC.ObjectController));

  var tiles;
  if (Postbooks[className] && Postbooks[className].Tiles) {
    tiles = Postbooks[className].Tiles(controller, true);
  } else {
    tiles = Postbooks.TilesForClass(baseClass, controller, true);
  }

  var editor = Postbooks.TileCarousel.create();
  editor.get('tray').set('subsurfaces', tiles);

  var contentArea = SC.ContainerSurface.create({
    layout: { top: 44, left: 320, right: 0, bottom: 0 },
    orderInTransition:  null,
    replaceTransition:  null,
    orderOutTransition: null
  });

  var submodule = SC.LayoutSurface.create();

  Postbooks.pushContext(SC.Object.create({
    title: name,
    backButtonTitle: backButtonTitle,
    backButtonAction: 'back',
    firstButtonIsVisible: true,
    secondButtonIsVisible: true,
    store: Postbooks.store
  }));

  var topbar = Postbooks.Topbar.create({
    nameBinding: 'Postbooks.activeContext.title'
  });

  topbar.get('layers').pushObject(Postbooks.BackButton.create({
    layout: { left: 20, centerY: 0, width: 120, height: 24 },
    nameBinding: 'Postbooks.activeContext.backButtonTitle',
    target: 'Postbooks.statechart',
    actionBinding: 'Postbooks.activeContext.backButtonAction'
  }));

  topbar.get('layers').pushObject(Postbooks.Button.create({
    layout: { right: 20, centerY: 0, width: 120, height: 24 },
    name: "_cancel".loc(),
    target: 'Postbooks.statechart',
    action: 'cancel',
    isEnabledBinding: 'Postbooks.activeContext*store.canCommit',
    isVisibleBinding: 'Postbooks.activeContext.firstButtonIsVisible'
  }));

  topbar.get('layers').pushObject(Postbooks.Button.create({
    layout: { right: 160, centerY: 0, width: 120, height: 24 },
    name: "_save".loc(),
    target: 'Postbooks.statechart',
    action: 'apply',
    isEnabledBinding: 'Postbooks.activeContext*store.canCommit',
    isVisibleBinding: 'Postbooks.activeContext.secondButtonIsVisible'
  }));

  var list = [SC.Object.create({
    title: "_overview".loc(),
    surface: editor,
    isOverview: true
  })];

  if (Postbooks[className] && Postbooks[className].Lists) {
    list = list.concat(Postbooks[className].Lists(controller));
  } else {
    var proto = baseClass.prototype;
    for (var key in proto) {
      if (key === 'guid') continue;
      if (key === 'type') continue;
      if (key === 'dataState') continue;

      var property = proto[key],
          title = ("_"+key).loc();

      if (property && (property.isChildrenAttribute || property.isManyAttribute)) {
        // document assignemnts handled differently
        if (SC.objectForPropertyPath(property.type).prototype.isDocumentAssignment) continue;
      
        var arrayKlass = property.get('typeClass');
      
        var arrayController = SC.ArrayController.create({
          contentBinding: SC.Binding.from(key, controller).multiple().oneWay()
        });

        list.push(SC.Object.create({
          title: title,
          // surface: Postbooks.CreateListViewForClass(arrayKlass, arrayController),
          surface: editor,
          klass: arrayKlass,
          attribute: key
        }));
      }
    }
  }

  var listController = SC.ArrayController.create({
    content: list,
    allowsEmptySelection: false
  });

  listController.selectObject(list[0]);

  contentArea.set('contentSurface', list[0].surface);

  var listView = Postbooks.MasterListView.create({
    contentBinding: SC.Binding.from('arrangedObjects', listController).multiple().oneWay(),
    selectionBinding: SC.Binding.from('selection', listController),

    action: function(object, index) {
      console.log('FIXME: need to implement auto-scroll to the correct tile');
      contentArea.set('contentSurface', list[index].surface);
    }
  });

  submodule.get('subsurfaces').pushObjects([topbar, listView, contentArea]);

  SC.app.get('ui').pushSurface(submodule);
};

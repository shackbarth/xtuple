// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XT XM sc_assert */

sc_require('views/carousel');

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

Postbooks.LoadModal = function(className, backButtonTitle, instance, callback) {
  console.log('Postbooks.LoadModule(', className, backButtonTitle, ')');
  var context = SC.Object.create({
    submoduleTitle: Postbooks.get('submoduleTitle'),
    submoduleBackButtonTitle: Postbooks.get('submoduleBackButtonTitle'),
    submoduleBackButtonAction: Postbooks.get('submoduleBackButtonAction'),
    callback: callback
  });

  Postbooks.set('submoduleTitle', ("_" + className.camelize()).loc());
  Postbooks.set('submoduleBackButtonTitle', backButtonTitle);
  Postbooks.set('submoduleBackButtonAction', 'popModule');

  var baseClass = XM[className];

  sc_assert(baseClass);
  sc_assert(baseClass.isClass);
  sc_assert(baseClass.subclassOf(XT.Record));

  context[className+'ListController'] = SC.ArrayController.create({
    content: Postbooks.get('store').find(baseClass),
    allowsEmptySelection: true
  });

  var controller;
  controller = context[className+'ObjectController'] = SC.ObjectController.create();
  sc_assert(controller);
  sc_assert(controller.kindOf(SC.ObjectController));
  controller.set('content', instance);

  // see if there is a function for this specific class
  if (Postbooks[className] && Postbooks[className].Tiles) {
    var tiles = Postbooks[className].Tiles(controller, true);

  // otherwise generate automatically
  } else {
    var tiles = Postbooks.TilesForClass(baseClass, controller);
  }
  var editor = Postbooks.TileCarousel.create();
  editor.get('tray').set('subsurfaces', tiles);

  var contentArea = SC.ContainerSurface.create({
    layout: { top: 0, left: 320, right: 0, bottom: 0 },
    _sc_backgroundColor: 'black',
    orderInTransition:  null,
    replaceTransition:  null,
    orderOutTransition: null
  });

  var modal = SC.LayoutSurface.create({
    viewportSizeDidChange: function(viewport) {
      console.log('viewportSizeDidChange');
      this.set('frame', SC.MakeRect(64, 44, viewport.width-64, viewport.height - 52));
    }
  });

  modal.set('backgroundColor', 'rgb(95,98,96)');

  var list = [SC.Object.create({
    title: "_overview".loc(),
    surface: editor
  })];

  var proto = baseClass.prototype;
  for (var key in proto) {
    if (key === 'guid') continue;
    if (key === 'type') continue;
    if (key === 'dataState') continue;

    var property = proto[key],
        title = ("_"+key).loc();

    if (property && (property.isChildrenAttribute || property.isManyAttribute)) {
      var arrayKlass = property.get('typeClass');

      var arrayController = SC.ArrayController.create({
        contentBinding: SC.Binding.from(key, controller).multiple().oneWay()
      });

      list.push(SC.Object.create({
        title: title,
        surface: Postbooks.CreateListViewForClass(arrayKlass, arrayController)
      }));
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
      console.log('do something on index ' + index);
      contentArea.set('contentSurface', list[index].surface);
    }
  });
  listView.set('layout', { top: 0, left: 0, width: 319, bottom: 0 });

  modal.get('subsurfaces').pushObjects([listView, contentArea]);

  context.set('surface', modal);

  var viewport = SC.app.computeViewportSize();
  modal.set('frame', SC.MakeRect(viewport.width, 44, viewport.width-64, viewport.height - 52));

  Postbooks.get('modalContexts').pushObject(context);
  SC.app.addSurface(modal);
  setTimeout(function() {
    SC.RunLoop.begin();
    modal.set('frame', SC.MakeRect(64, 44, viewport.width-64, viewport.height - 52));
    SC.RunLoop.end();
  },0);
};

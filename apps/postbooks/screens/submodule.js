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

Postbooks.LoadSubmodule = function(className, backButtonTitle) {
  var name = ("_" + className.camelize()).loc();

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

  var controller = Postbooks[className+'ObjectController'];
  sc_assert(controller);
  sc_assert(controller.kindOf(SC.ObjectController));

  var tiles = Postbooks.TilesForClass(baseClass, controller);
  console.log(tiles);

  var editor = Postbooks.TileCarousel.create();
  editor.get('tray').set('subsurfaces', tiles);

  var contentArea = SC.ContainerSurface.create({
    layout: { top: 44, left: 320, right: 0, bottom: 0 },
    orderInTransition:  null,
    replaceTransition:  null,
    orderOutTransition: null
  });

  var submodule = SC.LayoutSurface.create();

  Postbooks.set('submoduleTitle', name);

  var topbar = SC.View.create({
    layout: { top: 0, left: 0, right: 0, height: 44 },

    nameBinding: 'Postbooks.submoduleTitle',

    willRenderLayers: function(ctx) {
      ctx.fillStyle = base3;
      
      var K = Postbooks;
      ctx.font = "16pt "+K.TYPEFACE;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.shadowBlur = 0;
      ctx.shadowColor = "rgba(0,0,0,0)";
      ctx.fillText(this.get('name'), ctx.width/2, ctx.height/2);
    }
  });
  topbar.set('backgroundColor', base03);

  Postbooks.set('submoduleBackButtonTitle', backButtonTitle);
  Postbooks.set('submoduleBackButtonAction', 'showCRM');

  topbar.get('layers').pushObject(Postbooks.BackButton.create({
    layout: { left: 20, centerY: 0, width: 120, height: 24 },
    nameBinding: 'Postbooks.submoduleBackButtonTitle',
    target: 'Postbooks.statechart',
    actionBinding: 'Postbooks.submoduleBackButtonAction'
  }));

  var list = [SC.Object.create({
    title: "_overview".loc(),
    surface: editor
  })];

  var proto = baseClass.prototype;
  for (var key in proto) {
    if (key === 'guid') continue;
    if (key === 'type') continue;
    if (key === 'dataState') continue;

    var property = proto[key];

    if (property && (property.isChildrenAttribute || property.isManyAttribute)) {
      var arrayKlass = property.get('typeClass');

      var arrayController = SC.ArrayController.create({
        contentBinding: SC.Binding.from(key, controller).multiple().oneWay()
      });

      list.push(SC.Object.create({
        title: property.label,
        surface: Postbooks.CreateListViewForClass(arrayKlass, arrayController)
      }));
    }
  }

  var listController = SC.ArrayController.create({
    content: list,
    allowsEmptySelection: false
  });

  listController.selectObject(list[0]);

  // var detail = SC.ContainerSurface.create({
  //   layout: { top: 44, left: 320, right: 0, bottom: 0 },
  //   orderInTransition:  null,
  //   replaceTransition:  null,
  //   orderOutTransition: null
  // });
  // 
  // detail.set('contentSurface', list[1].surface);

  contentArea.set('contentSurface', list[0].surface);


  var listView = Postbooks.MasterListView.create({
    contentBinding: SC.Binding.from('arrangedObjects', listController).multiple().oneWay(),
    selectionBinding: SC.Binding.from('selection', listController),

    action: function(object, index) {
      console.log('do something on index ' + index);
      contentArea.set('contentSurface', list[index].surface);
    }
  });

  submodule.get('subsurfaces').pushObjects([topbar, listView, contentArea]);

  SC.app.get('ui').pushSurface(submodule);
};

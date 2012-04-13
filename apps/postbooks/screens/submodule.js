// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XT XM sc_assert */

sc_require('carousel');

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

var BackButton = SC.ButtonWidget.extend({

  name: "Back",

  cornerRadius: 5,

  dragPoint: null,

  render: function(ctx) {
    console.log('IconLayer.render()', SC.guidFor(this));
    ctx.beginPath();
    this.renderHitTestPath(ctx);
    ctx.fillStyle = base02;
    ctx.fill();

    // Draw some text.
    ctx.fillStyle = base3;
    ctx.font = "13pt Calibri";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.shadowBlur = 0;
    ctx.shadowColor = "rgba(0,0,0,0)";
    ctx.fillText('\u2190 '+this.get('name'), ctx.width/2, ctx.height/2);
  }

});

Postbooks.LoadSubmodule = function(className, backButtonTitle) {
  var name = className.titleize();

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

  var contentArea = SC.LayoutSurface.create({
    layout: { top: 44, left: 0, right: 0, bottom: 0 }
  });
  var editor = Postbooks.PropertiesEditorForClass(baseClass, controller);

  contentArea.get('subsurfaces').pushObject(editor);

  var submodule = SC.LayoutSurface.create();
  
  var topbar = SC.View.create({
    layout: { top: 0, left: 0, right: 0, height: 44 },

    willRenderLayers: function(ctx) {
      ctx.fillStyle = base3;
      ctx.font = "16pt Calibri";
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.shadowBlur = 0;
      ctx.shadowColor = "rgba(0,0,0,0)";
      ctx.fillText(name, ctx.width/2, ctx.height/2);
    }
  });
  topbar.set('backgroundColor', base03);
  topbar.get('layers').pushObject(BackButton.create({
    layout: { left: 20, centerY: 0, width: 120, height: 24 },
    name: backButtonTitle,
    target: 'Postbooks.statechart',
    action: 'showCRM'
  }));

  submodule.get('subsurfaces').pushObjects([topbar, contentArea]);

  SC.app.get('ui').pushSurface(submodule);
};

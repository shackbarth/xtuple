// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT XM Postbooks sc_assert */

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

var IconLayer = SC.ButtonWidget.extend({

  name: "(name)",

  cornerRadius: 15,

  dragPoint: null,

  render: function(ctx) {
    console.log('IconLayer.render()', SC.guidFor(this));
    ctx.beginPath();
    this.renderHitTestPath(ctx);
    ctx.fillStyle = this.get('color');
    ctx.fill();

    // Draw some text.
    var K = Postbooks;
    ctx.fillStyle = base3;
    ctx.font = "14pt "+K.TYPEFACE;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.shadowBlur = 0;
    ctx.shadowColor = "rgba(0,0,0,0)";
    ctx.fillText(this.get('name'), ctx.width/2, ctx.height/2);
  }

});

Postbooks.LoadDashboard = function() {
  var dashboard = SC.LayoutSurface.create();
  
  var topbar = SC.View.create({
    layout: { top: 0, left: 0, right: 0, height: 44 },

    willRenderLayers: function(ctx) {
      var K = Postbooks;
      ctx.fillStyle = base3;
      ctx.font = "16pt "+K.TYPEFACE;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.shadowBlur = 0;
      ctx.shadowColor = "rgba(0,0,0,0)";
      ctx.fillText("_xtuplePostbooks".loc(), ctx.width/2, ctx.height/2);
    }
  });
  topbar.set('backgroundColor', base03);

  var springboard = SC.View.create({
    layout: { top: 44, left: 0, right: 0, bottom: 0 }
  });

  springboard.get('layers').pushObject(IconLayer.create({
    layout: { centerX: -200, centerY: -120, width: 300, height: 200 },
    color: magenta,
    name: "_crm".loc(),
    target: 'Postbooks.statechart',
    action: 'showCRM'
  }));

  springboard.get('layers').pushObject(IconLayer.create({
    layout: { centerX: 200, centerY: -120, width: 300, height: 200 },
    color: violet,
    name: "_billing".loc(),
    target: 'Postbooks.statechart',
    action: 'showBilling'
  }));

  springboard.get('layers').pushObject(IconLayer.create({
    layout: { centerX: -200, centerY: 120, width: 300, height: 200 },
    color: blue,
    name: "_payments".loc(),
    target: 'Postbooks.statechart',
    action: 'showPayments'
  }));

  springboard.get('layers').pushObject(IconLayer.create({
    layout: { centerX: 200, centerY: 120, width: 300, height: 200 },
    color: cyan,
    name: "_ledger".loc(),
    target: 'Postbooks.statechart',
    action: 'showLedger'
  }));

  dashboard.get('subsurfaces').pushObjects([topbar, springboard]);

  var ui = Postbooks.Carousel.create();
  ui.getPath('tray.subsurfaces').pushObject(dashboard);

  SC.app.set('ui', ui);
};
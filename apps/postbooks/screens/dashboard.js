// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT XM Postbooks sc_assert */

sc_require('views/topbar');
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

  icon: null,

  render: function(ctx) {
    console.log('IconLayer.render()', SC.guidFor(this), this.get('name'));
    var bounds = this.get('bounds'),
        w = bounds.width, h = bounds.height,
        isEnabled = this.get('isEnabled');

    var img = Postbooks.createImageForSprite(this.get('icon'));

    console.log(img);
    ctx.drawImage(img, 18, 0);

    if (isEnabled) {
      img = Postbooks.createImageForSprite('dashboard-icon-shadow');
      ctx.globalAlpha = 0.5;
      ctx.drawImage(img, 0, 125);
      ctx.globalAlpha = 1.0;
    }

    // Draw some text.
    var K = Postbooks;
    ctx.font = "14pt "+K.TYPEFACE;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'rgba(0,0,0,0)';
  
    if (isEnabled) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillText(this.get('name'), w/2, 181);
      ctx.fillStyle = 'white';
      ctx.fillText(this.get('name'), w/2, 180);
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillText(this.get('name'), w/2, 180);
    }
  }

});

Postbooks.LoadDashboard = function() {
  var dashboard = SC.LayoutSurface.create();
  
  var topbar = Postbooks.Topbar.create({
    name: "_xtuplePostbooks".loc()
  });

  var springboard = SC.View.create({
    layout: { top: 44, left: 0, right: 0, bottom: 0 },

    didCreateElement: function(el) {
      arguments.callee.base.apply(this, arguments);
      var style = el.style;
      style.backgroundImage =  Postbooks.createDataUrlForSprite('tile-texture');
      style.backgroundPosition = 'left top';
      style.backgroundRepeat = 'repeat';
    },

    clearBackground: true
  });

  springboard.get('layers').pushObject(IconLayer.create({
    layout: { centerX: -350, centerY: -50, width: 150, height: 200 },
    name: "_crm".loc(),
    icon: 'crm-icon',
    target: 'Postbooks.statechart',
    action: 'showCRM'
  }));

  springboard.get('layers').pushObject(IconLayer.create({
    layout: { centerX: -175, centerY: -50, width: 150, height: 200 },
    color: violet,
    name: "_billing".loc(),
    icon: 'billing-icon',
    target: 'Postbooks.statechart',
    action: 'showBilling'
  }));

  springboard.get('layers').pushObject(IconLayer.create({
    layout: { centerX: 0, centerY: -50, width: 150, height: 200 },
    color: cyan,
    name: "_ledger".loc(),
    icon: 'ledger-icon-disabled',
    isEnabled: false,
    target: 'Postbooks.statechart',
    action: 'showLedger'
  }));

  springboard.get('layers').pushObject(IconLayer.create({
    layout: { centerX: 175, centerY: -50, width: 150, height: 200 },
    color: blue,
    name: "_payments".loc(),
    icon: 'payables-icon-disabled',
    isEnabled: false,
    target: 'Postbooks.statechart',
    action: 'showPayments'
  }));

  springboard.get('layers').pushObject(IconLayer.create({
    layout: { centerX: 350, centerY: -50, width: 150, height: 200 },
    color: cyan,
    name: "_time/expense".loc(),
    icon: 'time-expense-icon-disabled',
    isEnabled: false,
    target: 'Postbooks.statechart',
    action: 'showTimeExpense'
  }));

  dashboard.get('subsurfaces').pushObjects([topbar, springboard]);

  var ui = Postbooks.Carousel.create();
  ui.getPath('tray.subsurfaces').pushObject(dashboard);

  SC.app.set('ui', ui);
};
// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XM sc_assert */

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

Postbooks.LoadUserInterface = function() {
  var count = 0;
  for (var key in XM) {
    if (key.slice(0,1) === '_') continue;
    var klass = XM[key];
    if (klass && klass.isClass && klass.subclassOf(XT.Record)) count++;
  }
  console.log('XM has', count, 'non-generated XT.Record subclasses.');

  // var crmClasses = 'Account Address CashReceipt Contact Incident Opportunity Project ToDo'.w();
  var crmClasses = 'Account Address CashReceipt Contact Incident Project'.w();
  console.log("There are", crmClasses.length, "root CRM classes.");

  var crmItems = [];
  crmClasses.forEach(function(className, idx) {
    crmItems.push({
      title: className.titleize().pluralize(),
      value: className + 'Surface',
      enabled: true
    });
  });

  // Individual surfaces are added below.
  var crmTabSurfaces = {
    // layout: { top: 0, left: 0, right: 0, height: 0.5 },
    layout: { top: 14, left: 0, right: 0, bottom: 0 },
    items: crmItems,
    value: 'AccountSurface'
  };

  crmClasses.forEach(function(className, idx) {
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
      layout: { top: 13, left: 0, right: 0, bottom: 0 },
      rowHeight: 60,
      hasHorizontalScroller: false,

      contentBinding: 'Postbooks.'+className+'ListController.arrangedObjects',
      selectionBinding: 'Postbooks.'+className+'ListController.selection',

      baseClass: baseClass,
      browseClass: browseClass,

      action: function(object, index) {
        console.log('do something on index ' + index);
        var tray = this.getPath('supersurface'),
            next = tray.get('subsurfaces')[1],
            carousel = tray.get('carousel');

        controller.set('content', XT.store.find(baseClass, Number(object.get('guid'))));
        if (next) carousel.makeSurfaceVisible(next);
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

    var layout = SC.LayoutSurface.create();
    var carousel = Postbooks.Carousel.create({
      layout: { top: 14, left: 0, right: 0, bottom: 0 }
    });
    carousel.getPath('tray.subsurfaces').pushObject(surface);

    var editor = Postbooks.PropertiesEditorForClass(baseClass, controller);
    carousel.getPath('tray.subsurfaces').pushObject(editor);

    layout.get('subsurfaces').pushObject(carousel);
    crmTabSurfaces[className + 'Surface'] = layout;
  });

  var accountingClasses = ('BankAccount Customer Invoice LedgerAccount '+
                           'Payable Payment Receivable Vendor Voucher').w();
  console.log("There are", accountingClasses.length, "root Accounting classes.");

  var accountingItems = [];
  accountingClasses.forEach(function(className, idx) {
    accountingItems.push({
      title: className.titleize().pluralize(),
      value: className + 'Surface',
      enabled: true
    });
  });

  // Individual surfaces are added below.
  var accountingTabSurfaces = {
    // layout: { bottom: 0, left: 0, right: 0, height: 0.5 },
    layout: { top: 14, left: 0, right: 0, bottom: 0 },
    items: accountingItems,
    value: 'BankAccountSurface'
  };

  accountingClasses.forEach(function(className, idx) {
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
      layout: { top: 13, left: 0, right: 0, bottom: 0 },
      rowHeight: 60,
      hasHorizontalScroller: false,

      contentBinding: 'Postbooks.'+className+'ListController.arrangedObjects',
      selectionBinding: 'Postbooks.'+className+'ListController.selection',

      baseClass: baseClass,
      browseClass: browseClass,

      action: function(object, index) {
        console.log('do something on index ' + index);
        var tray = this.getPath('supersurface'),
            next = tray.get('subsurfaces')[1],
            carousel = tray.get('carousel');

        controller.set('content', XT.store.find(baseClass, Number(object.get('guid'))));
        if (next) carousel.makeSurfaceVisible(next);
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

    var layout = SC.LayoutSurface.create();
    var carousel = Postbooks.Carousel.create({
      layout: { top: 14, left: 0, right: 0, bottom: 0 }
    });
    carousel.getPath('tray.subsurfaces').pushObject(surface);

    var editor = Postbooks.PropertiesEditorForClass(baseClass, controller);
    carousel.getPath('tray.subsurfaces').pushObject(editor);

    layout.get('subsurfaces').pushObject(carousel);
    accountingTabSurfaces[className + 'Surface'] = layout;
  });

  var MyTabSurface = SC.TabSurface.extend({
    theme: 'regular',
    itemTitleKey: 'title',
    itemValueKey: 'value',
    itemIconKey: 'icon',
    itemIsEnabledKey: 'enabled'
  });

  var crmTabs = SC.LayoutSurface.create();
  // var crmCarousel = Postbooks.Carousel.create({
  //   layout: { top: 14, left: 0, right: 0, bottom: 0 }
  // });
  // crmCarousel.getPath('tray.subsurfaces').pushObject(MyTabSurface.create(crmTabSurfaces));
  // crmCarousel.getPath('tray.subsurfaces').pushObject(SC.View.create());
  crmTabs.get('subsurfaces').pushObject(MyTabSurface.create(crmTabSurfaces));

  var accountingTabs = SC.LayoutSurface.create();
  // var accountingCarousel = Postbooks.Carousel.create({
  //   layout: { top: 14, left: 0, right: 0, bottom: 0 }
  // });
  // accountingCarousel.getPath('tray.subsurfaces').pushObject(MyTabSurface.create(accountingTabSurfaces));
  // accountingCarousel.getPath('tray.subsurfaces').pushObject(SC.View.create());
  accountingTabs.get('subsurfaces').pushObject(MyTabSurface.create(accountingTabSurfaces));

  var ui = SC.TabSurface.create({
    value: 'crmTabs',
    items: [{
      title: 'CRM',
      value: 'crmTabs',
      enabled: true
    }, {
      title: 'Accounting',
      value: 'accountingTabs',
      enabled: true
    }],
    theme: 'regular',
    itemTitleKey: 'title',
    itemValueKey: 'value',
    itemIconKey: 'icon',
    itemIsEnabledKey: 'enabled',

    crmTabs: crmTabs,
    accountingTabs: accountingTabs
  });
  SC.app.set('ui', ui);
};

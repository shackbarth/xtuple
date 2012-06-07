// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XT XM sc_assert */

sc_require('views/carousel');

Postbooks.LoadRelationSearch = function(className, backButtonTitle, instance, searchKey, value, callback) {
  console.log('Postbooks.LoadRelationSearch(', className, backButtonTitle, ')');

  var arrayController, controller;

  var baseClass = XM[className];

  sc_assert(baseClass);
  sc_assert(baseClass.isClass);
  sc_assert(baseClass.subclassOf(XT.Record));

  var context = SC.Object.create({
    title: ("_" + className.camelize()).loc(),
    backButtonTitle: backButtonTitle,
    backButtonAction: 'popContext',
    firstButtonIsVisible: false,
    secondButtonIsVisible: false,
    store: XT.store,
    callback: function() {
      if (callback) callback(controller);
    },
    value: value,
    _valueDidChange: function() {
      var value = this.get('value') || '';
      if (value.length > 0) {
        console.log('issuing new query');
        var query = SC.Query.remote(baseClass, {
          conditions: searchKey+" BEGINS_WITH {value}",
          orderBy: searchKey+' ASC',
          parameters: { value: value },
          store: XT.store,
          rowOffset: 0,
          rowLimit: 50
        });
        var content = SC.IRecordArray.create({ fetchAmount: 50, offsetKey: 'rowOffset', limitKey: 'rowLimit', query: query });
        arrayController.set('content', content);
      }
    }.observes('value')
  });

  arrayController = context[className+'ArrayController'] = SC.ArrayController.create();

  controller = context[className+'ObjectController'] = SC.ObjectController.create({
    contentBinding: SC.Binding.from('selection', arrayController).single()
  });
  sc_assert(controller);
  sc_assert(controller.kindOf(SC.ObjectController));

  var modal = SC.LayoutSurface.create({
    viewportSizeDidChange: function(viewport) {
      console.log('viewportSizeDidChange');
      this.set('frame', SC.MakeRect(64, 44, viewport.width-64, viewport.height - 52));
    }
  });

  modal.set('backgroundColor', 'rgb(95,98,96)');

  var options = SC.View.create({
    layout: { top: 0, left: 0, right: 0, height: 320 },
    didCreateElement: function(el) {
      arguments.callee.base.apply(this, arguments);
      var style = el.style;
      style.backgroundImage =  Postbooks.createDataUrlForSprite('tile-texture');
      style.backgroundPosition = 'left top';
      style.backgroundRepeat = 'repeat';
    },

    clearBackground: true
  });
  options.set('backgroundColor', 'rgb(66,66,66)');

  var layers = options.get('layers');

  layers.pushObject(SC.LabelLayer.create({
    layout: { top: 16, left: 36, width: 200, height: 22 },
    backgroundColor: 'transparent',
    color: 'white',
    textAlign: 'right',
    value: "_search".loc() + ':'
  }));

  layers.pushObject(SC.TextFieldWidget.create({
    layout:  { top: 12, left: 248, width: 500, height: 22 },
    valueBinding: SC.Binding.from('value', context)
  }));

  modal.get('subsurfaces').pushObject(options);

  var list = SC.IListView.create({
    layout: { top: 320, left: 0, right: 0, bottom: 0 },
    rowHeight: Postbooks.HEIGHT_2_ROW,
    hasHorizontalScroller: false,

    mouseUp: function(evt) {
      if (evt.clickCount >= 2) {
        Postbooks.statechart.sendAction('popContext');
      }
      return arguments.callee.base.apply(this, arguments);
    },

    contentBinding: SC.Binding.from('arrangedObjects', arrayController),
    selectionBinding: SC.Binding.from('selection', arrayController),
    renderRow: Postbooks[className] && Postbooks[className].RenderRecordListRow? 
               Postbooks[className].RenderRecordListRow : Postbooks.RenderRecordListRow
  });

  modal.get('subsurfaces').pushObject(list);

  context.set('surface', modal);

  var viewport = SC.app.computeViewportSize();
  modal.set('frame', SC.MakeRect(viewport.width, 44, viewport.width-64, viewport.height - 52));

  Postbooks.pushContext(context);
  SC.app.addSurface(modal);
  setTimeout(function() {
    SC.RunLoop.begin();
    modal.set('frame', SC.MakeRect(64, 44, viewport.width-64, viewport.height - 52));
    SC.RunLoop.end();
  },0);
};

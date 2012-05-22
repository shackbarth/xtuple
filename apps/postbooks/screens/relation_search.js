// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals Postbooks XT XM sc_assert */

sc_require('views/carousel');

Postbooks.LoadRelationSearch = function(className, backButtonTitle, instance, callback) {
  console.log('Postbooks.LoadRelationSearch(', className, backButtonTitle, ')');
  var context = SC.Object.create({
    title: ("_" + className.camelize()).loc(),
    backButtonTitle: backButtonTitle,
    backButtonAction: 'popContext',
    cancelIsVisible: false,
    applyIsVisible: false,
    store: XT.store,
    callback: callback
  });

  var baseClass = XM[className];

  sc_assert(baseClass);
  sc_assert(baseClass.isClass);
  sc_assert(baseClass.subclassOf(XT.Record));

  var arrayController;
  arrayController = context[className+'ArrayController'] = SC.ArrayController.create();

  var controller, tiles;
  controller = context[className+'ObjectController'] = SC.ObjectController.create({
    content: SC.Binding.from('selection', arrayController).single()
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

// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals global Postbooks XM XT sc_assert */

Postbooks.MODULE = SC.State.design({

  initialSubstate: 'BROWSE',

  route: null,
  title: null,
  submodules: null,

  enterState: function() {
    if (this.__movingUp__) {
      this.__movingUp__ = false;

      // Clear the selection. This is somewhat tricky to find...
      var listView = this.listContainer.get('contentSurface');
      if (listView) listView.set('selection', SC.IndexSet.create().freeze());
      return;
    }

    var route = this.get('route'),
        title = this.get('title'),
        submodules = this.get('submodules');

    sc_assert(route !== null, "You must set a route property in your Postbooks.MODULE subclass.");
    sc_assert(typeof route === 'string', "route must be a string in your Postbooks.MODULE subclass.");
    sc_assert(title !== null, "You must set a title property in your Postbooks.MODULE subclass.");
    sc_assert(typeof title === 'string', "title must be a string in your Postbooks.MODULE subclass.");
    sc_assert(title[0] === '_', "title must be an unlocalized string (beginning with an underscore) in your Postbooks.MODULE subclass.");
    sc_assert(submodules !== null, "You must set a submodules property in your Postbooks.MODULE subclass.");
    sc_assert(SC.typeOf(submodules) === SC.T_ARRAY, "submodules must be an array in your Postbooks.MODULE subclass.");
    submodules.forEach(function(submodule) { sc_assert(typeof submodule === 'string', 'Submodules must be strings.'); });

    SC.routes.set('location', '/'+route);

    Postbooks.LoadModule(title.loc(), submodules, this);
  },

  exitState: function() {
    if (this.__movingUp__) return;
    SC.app.get('ui').popSurface();
  },

  // ACTIONS

  // SUBSTATES

  "BROWSE": SC.State.design({

    // ACTIONS
    newRecord: function(sender) {
      var firstObject = this.parentState.listController.get('selection').firstObject();
      if (firstObject) {
        var className = firstObject.get('className');
        if (className) {
          var baseClass = XM[className];
          sc_assert(baseClass);
          sc_assert(baseClass.isClass);
          sc_assert(baseClass.subclassOf(XT.Record));

          if (baseClass.canCreate()) {
            var controller = Postbooks[className+'ObjectController'];
            sc_assert(controller);
            sc_assert(controller.kindOf(SC.ObjectController));

            sc_assert(!Postbooks.store.isNested, "Postbooks.store should be the base store.");
            Postbooks.set('store', Postbooks.get('store').chain());
            controller.set('content', Postbooks.get('store').createRecord(baseClass, {}));
            Postbooks.submoduleController = controller;
            Postbooks.statechart.sendAction('show'+className);
          } else {
            alert("You don't have permission to create these objects.");
          }

        }
      }
    }

  })

});

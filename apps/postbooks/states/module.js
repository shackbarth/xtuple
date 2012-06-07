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

    enterState: function() {
      Postbooks.set('topbarBackButtonTitle', "_dashboard".loc());
    },

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
    },

    filterRecords: function(sender) {
      var firstObject = this.parentState.listController.get('selection').firstObject(),
      list = firstObject.list;

      if (firstObject) {
        firstObject.toggleProperty('isFiltered');
        var isFiltered = firstObject.get('isFiltered'),
            detail = this.parentState.listContainer;

        var className = firstObject.get('className');
        sc_assert(className);
        sc_assert(typeof className === 'string');

        var baseClass = XM[className];
        sc_assert(baseClass);
        sc_assert(baseClass.isClass);
        sc_assert(baseClass.subclassOf(XT.Record));

        if (isFiltered) {
          var filteredSurface = firstObject.get('filteredSurface') || null;

          if (!filteredSurface) {
            filteredSurface = SC.LayoutSurface.create({
              didCreateElement: function(el) {
                arguments.callee.base.apply(this, arguments);
                var style = el.style;

                if (document.getCSSCanvasContext) {
                  style.backgroundImage =  '-webkit-canvas(master-list-shading)';
                  style.backgroundPosition = 'left top';
                  style.backgroundSize = '320px 200px';
                  style.backgroundRepeat = 'repeat-x';
                }
              }
            });
            firstObject.set('filteredSurface', filteredSurface);

            var filters = Postbooks[className] && Postbooks[className].CreateFilters ? Postbooks[className].CreateFilters() : [],
                listController;
            
            listController = Postbooks[className+'FilterListController'] = SC.ArrayController.create({
              content: filters,
              allowsEmptySelection: false
            });

            var controller, content, selection;
            content = 'Postbooks.'+className+'FilterListController.arrangedObjects';
            selection = 'Postbooks.'+className+'FilterListController.selection';
            controller = Postbooks[className+'FilterObjectController'] = SC.ObjectController.create({
              contentBinding: selection
            });

            var detailSurface = SC.ContainerSurface.create({
              layout: { top: 30, left: 300, right: 0, height: 170 },
              orderInTransition:  null,
              replaceTransition:  null,
              orderOutTransition: null
            });

            var filterList = SC.ListView.create({
              layout: { top: 0, left: 0, height: 200, width: 300 },
              contentBinding: SC.Binding.from('arrangedObjects', listController).multiple().oneWay(),
              selectionBinding: SC.Binding.from('selection', listController),

              renderRow: function(context, width, height, index, object, isSelected) {
                if (isSelected) {
                  context.fillStyle = '#99CCFF';
                } else {
                  context.fillStyle = 'white';
                }
                context.fillRect(0, 0, width, height);

                context.strokeStyle = 'grey';
                context.lineWidth = 1;

                context.beginPath();
                context.moveTo(0, height - 0.5);
                context.lineTo(width, height - 0.5);
                context.stroke();

                var K = Postbooks;
                context.font = "10pt "+K.TYPEFACE;
                context.fillStyle = 'black';
                context.textAlign = 'left';
                context.textBaseline = 'middle';

                context.fillText(object.get('title'), 48, height/2);

                if (object.get('isEnabled')) {
                  context.beginPath();
                  context.moveTo(22, height/2 - 1);
                  context.lineTo(26, height/2 + 4);
                  context.lineTo(32, height/2 - 7);
                  context.strokeStyle = 'green';
                  context.lineWidth = 3;
                  context.stroke();
                } else {
                  context.beginPath();
                  context.moveTo(22, height/2 - 7);
                  context.lineTo(32, height/2 + 5);
                  context.moveTo(32, height/2 - 7);
                  context.lineTo(22, height/2 + 5);
                  context.strokeStyle = 'red';
                  context.lineWidth = 3;
                  context.stroke();
                }
              },

              action: function(object, index) {
                sc_assert(!Postbooks.store.isNested, "Postbooks.store should be the base store.");
                console.log('clicked on row', index);

                var surface = object.get('surface') || null;
                if (surface) {
                  surface.set('controller', controller);
                }
                detailSurface.set('contentSurface', surface);
              }
            });

            var header = SC.View.create({
              layout: { top: 0, left: 300, height: 30, right: 0 },
              backgroundColor: 'transparent',
              clearBackground: true
            });

            var enabledCheckBox = SC.CheckboxWidget.create({
              layout: { top: 3, left: 20, height: 24, right: 120 },
              title: "_enabled".loc(),
              valueBinding: SC.Binding.from('isEnabled', controller),
              isEnabledBinding: 'Postbooks.'+className+'FilterListController.hasSelection'
            });

            var queryButton = Postbooks.Button.create({
              layout: { top: 3, width: 100, height: 24, right: 20 },
              name: "_query".loc(),
              valueBinding: SC.Binding.from('isEnabled', controller),
              isEnabledBinding: 'Postbooks.'+className+'FilterListController.hasSelection',
              action: function() {
                var f = Postbooks[className].CreateQueryFromFiltersForStore;
                if (!f) alert("Please implement Postbooks."+className+".CreateQueryFromFiltersForStore()");
                else {
                  var query = f(filters, XT.store);
                  sc_assert(query, "Postbooks."+className+".CreateQueryFromFiltersForStore() should return a remote SC.Query object.");
                  sc_assert(query.kindOf(SC.Query));
                  sc_assert(query.get('isRemote'));
                  var content = SC.IRecordArray.create({ fetchAmount: 50, offsetKey: 'rowOffset', limitKey: 'rowLimit', query: query });

                  var aryController = Postbooks[className+'ListController'];

                  sc_assert(aryController);
                  sc_assert(aryController.kindOf(SC.ArrayController));
                  aryController.set('content', content);
                }
              }
            });

            header.get('layers').pushObjects([enabledCheckBox, queryButton]);

            list.set('layout', { top: 200, left: 0, bottom: 0, right: 0 });

            filteredSurface.get('subsurfaces').pushObjects([filterList, header, detailSurface, list]);

            // Set up the initial detail surface.
            var filter = filters[0];
            if (filter) {
              var surface = filter.get('surface') || null;
              if (surface) {
                surface.set('controller', controller);
              }
              detailSurface.set('contentSurface', surface);
            }
          }

          detail.set('contentSurface', filteredSurface);
        } else {
          var aryController = Postbooks[className+'ListController'];

          sc_assert(aryController);
          sc_assert(aryController.kindOf(SC.ArrayController));
          aryController.set('content', firstObject.allRecords);

          detail.set('contentSurface', firstObject.list);
        }
      }
    }

  })

});

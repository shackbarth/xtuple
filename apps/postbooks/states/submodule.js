// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals global Postbooks XM XT sc_assert */

Postbooks.SUBMODULE = SC.State.design({

  className: null,
  title: null,

  didCommit: false,

  enterState: function() {
    sc_assert(Postbooks.store.isNested, "Postbooks.store should be nested before entering a submodule.");
    sc_assert(Postbooks.submoduleController, "Postbooks.submoduleController should be set before entering a submodule.");

    var className = this.get('className'),
        title = this.get('title');

    sc_assert(className !== null, "You must set a className property in your Postbooks.SUBMODULE subclass.");
    sc_assert(typeof className === 'string', "className must be a string in your Postbooks.SUBMODULE subclass.");
    sc_assert(title !== null, "You must set a title property in your Postbooks.SUBMODULE subclass.");
    sc_assert(typeof title === 'string', "title must be a string in your Postbooks.SUBMODULE subclass.");
    sc_assert(title[0] === '_', "title must be an unlocalized string (beginning with an underscore) in your Postbooks.SUBMODULE subclass.");

    this.didCommit = false;
    Postbooks.LoadSubmodule(className, title.loc());
  },

  exitState: function() {
    sc_assert(!Postbooks.store.isNested, "Postbooks.store should NOT be nested when exiting a submodule.");

    Postbooks.submoduleController = null;
    SC.app.get('ui').popSurface();
  },

  // ACTIONS

  showDashboard: function() {
    if (Postbooks.statechart.stateIsEntered(Postbooks.statechart.rootState.APPLICATION.DASHBOARD)) return;
    else this.back('DASHBOARD');
  },

  showCRM: function() {
    if (Postbooks.statechart.stateIsEntered(Postbooks.statechart.rootState.APPLICATION.CRM)) return;
    else this.back('CRM');
  },

  showBilling: function() {
    if (Postbooks.statechart.stateIsEntered(Postbooks.statechart.rootState.APPLICATION.BILLING)) return;
    else this.back('BILLING');
  },

  showPayments: function() {
    if (Postbooks.statechart.stateIsEntered(Postbooks.statechart.rootState.APPLICATION.PAYMENTS)) return;
    else this.back('PAYMENTS');
  },

  showLedger: function() {
    if (Postbooks.statechart.stateIsEntered(Postbooks.statechart.rootState.APPLICATION.LEDGER)) return;
    else this.back('LEDGER');
  },

  back: function(stateName) {
    var store = Postbooks.getPath('activeContext.store');

    SC.CloseFieldEditor();
    if (Postbooks.getPath('store.hasChanges')) {
      var save;
      if (Postbooks.submoduleController.get('status') === SC.Record.READY_NEW) {
        save = window.confirm("_unsavedRecord".loc());
      } else {
        save = window.confirm("_unsavedChanges".loc());
      }
      if (!save) {
        // Subtle: We may need to re-establish our module's route.
        SC.routes.set('location', '/'+this.parentState.get('route'));
        return;
      } else {
        store.commitChanges(true); // force
        this.didCommit = true;
      }
    }

    store.destroy();
    Postbooks.set('store', XT.store); // Required before we exit.

    // Push our changes to the server.
    if (this.didCommit) {
      console.log('Committing changes to the server.');
      XT.store.commitRecords();
    }

    if (typeof stateName === 'string') {
      this.gotoState(stateName);
    } else {
      // HACK: SC.Statechart will exit/enter our parent state!
      this.parentState.__movingUp__ = true;

      this.gotoState(this.parentState);
    }
  },

  apply: function() {
    SC.CloseFieldEditor();
    Postbooks.getPath('activeContext.store').commitChanges(true); // force
    XT.store.commitRecords();
  },

  cancel: function() {
    SC.CloseFieldEditor();

    // If we're working on a new record, just clean up and exit.
    if (Postbooks.submoduleController.get('status') === SC.Record.READY_NEW) {
      Postbooks.getPath('activeContext.store').destroy();
      Postbooks.set('store', XT.store); // Required before we exit.

      // HACK: SC.Statechart will exit/enter our parent state!
      this.parentState.__movingUp__ = true;

      this.gotoState(this.parentState);
    } else {
      debugger;
      Postbooks.getPath('activeContext.store').discardChanges();
    }
  },

  newRecord: function(sender) {
    var listController = sender.listController,
        firstObject = listController.get('selection').firstObject(),
        klass = firstObject? firstObject.klass : null;

    if (klass) {
      alert('wrong!');
      var instance = Postbooks.get('store').createRecord(klass, {});
      Postbooks.submoduleController.get(firstObject.attribute).pushObject(instance);
      Postbooks.LoadModal(klass.prototype.className.slice(3), "_back".loc(), instance);
    }
  },

  deleteRecord: function() {
    var store = Postbooks.getPath('activeContext.store');

    SC.CloseFieldEditor();

    if (window.confirm("_deleteRecord".loc())) {

      // If we're working on a new record, just clean up and exit.
      if (Postbooks.submoduleController.get('status') === SC.Record.READY_NEW) {
        store.destroy();
        Postbooks.set('store', XT.store); // Required before we exit.

      } else {
        Postbooks.submoduleController.get('content').destroy();
        store.commitChanges(true); // force
        this.didCommit = true;

        store.destroy();
        Postbooks.set('store', XT.store); // Required before we exit.
      }
      
      // Push our changes to the server.
      if (this.didCommit) {
        console.log('Committing changes to the server.');
        XT.store.commitRecords();
      }

      // HACK: SC.Statechart will exit/enter our parent state!
      this.parentState.__movingUp__ = true;
      this.gotoState(this.parentState);
    }
  }

  // SUBSTATES

});

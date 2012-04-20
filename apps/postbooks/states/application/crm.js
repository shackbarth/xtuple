// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals global Postbooks XM XT sc_assert */

Postbooks.CRM = SC.State.design({

  initialSubstate: 'DUMMY',

  enterState: function() {
    if (this.__movingUp__) {
      this.__movingUp__ = false;

      // Clear the selection. This is somewhat tricky to find...
      var listView = this.listContainer.get('contentSurface');
      if (listView) listView.set('selection', SC.IndexSet.create().freeze());
      return;
    }

    SC.routes.set('location', 'crm');

    Postbooks.LoadModule("_crm".loc(), 'Contact Account Opportunity Incident Project'.w(), this);
  },

  exitState: function() {
    if (this.__movingUp__) return;
    SC.app.get('ui').popSurface();
  },

  // ACTIONS

  showCRM: function() {
    // Do nothing.
  },

  showDashboard: function() {
    this.gotoState('DASHBOARD');
  },

  showContact: function() {
    this.gotoState('CONTACT');
  },

  showAccount: function() {
    this.gotoState('ACCOUNT');
  },

  showOpportunity: function() {
    this.gotoState('OPPORTUNITY');
  },

  showIncident: function() {
    this.gotoState('INCIDENT');
  },

  showProject: function() {
    this.gotoState('PROJECT');
  },

  // SUBSTATES

  "DUMMY":    SC.State, // HACK: Prevent "missing initial state" error message from SC.
  "CONTACT":  SC.State.plugin('Postbooks.CONTACT'),
  "ACCOUNT":  SC.State.plugin('Postbooks.ACCOUNT'),
  "OPPORTUNITY": SC.State.plugin('Postbooks.OPPORTUNITY'),
  "INCIDENT": SC.State.plugin('Postbooks.INCIDENT'),
  "PROJECT":  SC.State.plugin('Postbooks.PROJECT')

});

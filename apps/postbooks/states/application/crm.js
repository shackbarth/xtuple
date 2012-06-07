// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals global Postbooks XM XT sc_assert */

sc_require('states/module');

Postbooks.CRM = Postbooks.MODULE.design({

  route: 'crm',
  title: "_crm",
  submodules: 'Contact Account ToDo Opportunity Incident Project'.w(),

  enterState: function() {
    arguments.callee.base.apply(this, arguments);

    // Load any lists used in popups
    XT.store.find(XM.IncidentCategory);
    XT.store.find(XM.Priority);
    XT.store.find(XM.IncidentResolution);
    XT.store.find(XM.IncidentSeverity);
    XT.store.find(XM.Honorific);
    XT.store.find(XM.Priority);
    XT.store.find(XM.OpportunitySource);
    XT.store.find(XM.OpportunityStage);
    XT.store.find(XM.OpportunityType);     
  },

  // ACTIONS

  showContact: function() {
    this.gotoState('CONTACT');
  },

  showAccount: function() {
    this.gotoState('ACCOUNT');
  },

  showToDo: function() {
    this.gotoState('TO_DO');
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

  "CONTACT":     SC.State.plugin('Postbooks.CONTACT'),
  "ACCOUNT":     SC.State.plugin('Postbooks.ACCOUNT'),
  "TO_DO":       SC.State.plugin('Postbooks.TO_DO'),
  "OPPORTUNITY": SC.State.plugin('Postbooks.OPPORTUNITY'),
  "INCIDENT":    SC.State.plugin('Postbooks.INCIDENT'),
  "PROJECT":     SC.State.plugin('Postbooks.PROJECT')

});

Postbooks.CRM.createIncidentCategoryRecordArray = function() {
  // We don't need to find, because we do this once, in CRM#enterState.
  return SC.RecordArray.create({
    store: Postbooks.store,
    query: SC.Query.create({ recordType: XM.IncidentCategory, orderBy: 'order ASC' })
  });
};

Postbooks.CRM.createPriorityRecordArray = function() {
  // We don't need to find, because we do this once, in CRM#enterState.
  return SC.RecordArray.create({
    store: Postbooks.store,
    query: SC.Query.create({ recordType: XM.Priority, orderBy: 'order ASC' })
  });
};

Postbooks.CRM.createIncidentResolutionRecordArray = function() {
  // We don't need to find, because we do this once, in CRM#enterState.
  return SC.RecordArray.create({
    store: Postbooks.store,
    query: SC.Query.create({ recordType: XM.IncidentResolution, orderBy: 'order ASC' })
  });
};

Postbooks.CRM.createIncidentSeverityRecordArray = function() {
  // We don't need to find, because we do this once, in CRM#enterState.
  return SC.RecordArray.create({
    store: Postbooks.store,
    query: SC.Query.create({ recordType: XM.IncidentSeverity, orderBy: 'order ASC' })
  });
};

Postbooks.CRM.createOpportunitySourceRecordArray = function() {
  // We don't need to find, because we do this once, in CRM#enterState.
  return SC.RecordArray.create({
    store: Postbooks.store,
    query: SC.Query.create({ recordType: XM.OpportunitySource, orderBy: 'name ASC' })
  });
};

Postbooks.CRM.createOpportunityStageRecordArray = function() {
  // We don't need to find, because we do this once, in CRM#enterState.
  return SC.RecordArray.create({
    store: Postbooks.store,
    query: SC.Query.create({ recordType: XM.OpportunityStage, orderBy: 'name ASC' })
  });
};

Postbooks.CRM.createOpportunityTypeRecordArray = function() {
  // We don't need to find, because we do this once, in CRM#enterState.
  return SC.RecordArray.create({
    store: Postbooks.store,
    query: SC.Query.create({ recordType: XM.OpportunityType, orderBy: 'name ASC' })
  });
};

Postbooks.CRM.createPriorityRecordArray = function() {
  // We don't need to find, because we do this once, in CRM#enterState.
  return SC.RecordArray.create({
    store: Postbooks.store,
    query: SC.Query.create({ recordType: XM.Priority, orderBy: 'order ASC' })
  });
};

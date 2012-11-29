
// minifier: path aliases

enyo.path.addPaths({project: "source/project/"});

// core.js

(function() {
"use strict";
XT.extensions.project = {};
})();

// account.js

(function() {
"use strict";
XT.extensions.project.initListAccountModels = function() {
XM.AccountProject = XM.Model.extend({
recordType: "XM.AccountProject",
isDocumentAssignment: !0
});
};
})();

// contact.js

(function() {
"use strict";
XT.extensions.project.initContactModels = function() {
XM.ContactProject = XM.Model.extend({
recordType: "XM.ContactProject",
isDocumentAssignment: !0
});
};
})();

// incident.js

(function() {
"use strict";
XT.extensions.project.initIncidentModels = function() {
XM.IncidentProject = XM.Model.extend({
recordType: "XM.IncidentProject",
isDocumentAssignment: !0
});
};
})();

// opportunity.js

(function() {
"use strict";
XT.extensions.project.initOpportunityModels = function() {
XM.OpportunityProject = XM.Model.extend({
recordType: "XM.OpportunityProject",
isDocumentAssignment: !0
});
};
})();

// project.js

(function() {
"use strict";
XT.extensions.project.initProjectModels = function() {
XM.ProjectIncident = XM.Model.extend({
recordType: "XM.ProjectIncident",
isDocumentAssignment: !0
}), XM.ProjectOpportunity = XM.Model.extend({
recordType: "XM.ProjectOpportunity",
isDocumentAssignment: !0
}), XM.ProjectToDo = XM.Model.extend({
recordType: "XM.ProjectToDo",
isDocumentAssignment: !0
});
};
})();

// to_do.js

(function() {
"use strict";
XT.extensions.project.toDoModels = function() {
XM.ToDoProject = XM.Model.extend({
recordType: "XM.ToDoProject",
isDocumentAssignment: !0
});
};
})();

// parameter.js

(function() {
XT.extensions.project.initParameters = function() {
var e;
e = [ {
kind: "onyx.GroupboxHeader",
content: "_project".loc()
}, {
name: "project",
label: "_project".loc(),
attr: "project",
defaultKind: "XV.ProjectWidget"
} ], XV.appendExtension("XV.IncidentListParameters", e);
};
})();

// list_relations.js

(function() {
XT.extensions.project.initListRelations = function() {
enyo.kind({
name: "XV.AccountProjectListRelations",
kind: "XV.ListRelations",
orderBy: [ {
attribute: "dueDate",
descending: !0
}, {
attribute: "number"
} ],
parentKey: "account",
workspace: "XV.ProjectWorkspace",
components: [ {
kind: "XV.ListItem",
components: [ {
kind: "FittableColumns",
components: [ {
kind: "XV.ListColumn",
classes: "first",
components: [ {
kind: "FittableColumns",
components: [ {
kind: "XV.ListAttr",
attr: "number",
classes: "bold"
}, {
kind: "XV.ListAttr",
attr: "getProjectStatusString",
fit: !0
}, {
kind: "XV.ListAttr",
attr: "dueDate",
formatter: "formatDueDate",
placeholder: "_noCloseTarget".loc(),
classes: "right"
} ]
}, {
kind: "XV.ListAttr",
attr: "name"
} ]
} ]
} ]
} ],
formatDueDate: XV.ProjectList.prototype.formatDueDate
}), enyo.kind({
name: "XV.ContactProjectListRelations",
kind: "XV.AccountProjectListRelations",
parentKey: "contact"
}), enyo.kind({
name: "XV.ProjectIncidentListRelations",
kind: "XV.AccountIncidentListRelations",
parentKey: "project"
});
};
})();

// list_relations_box.js

(function() {
XT.extensions.project.initListRelationsBox = function() {
enyo.kind({
name: "XV.AccountProjectsBox",
kind: "XV.ListRelationsBox",
title: "_projects".loc(),
parentKey: "account",
listRelations: "XV.AccountProjectListRelations",
searchList: "XV.ProjectList"
}), enyo.kind({
name: "XV.ContactProjectsBox",
kind: "XV.ListRelationsBox",
title: "_projects".loc(),
parentKey: "contact",
listRelations: "XV.ContactProjectListRelations",
searchList: "XV.ProjectList"
}), enyo.kind({
name: "XV.ProjectIncidentsBox",
kind: "XV.AccountIncidentsBox",
parentKey: "project",
listRelations: "XV.ProjectIncidentListRelations"
});
};
})();

// workspace.js

(function() {
XT.extensions.project.initWorkspaces = function() {
var e;
e = [ {
kind: "XV.AccountProjectsBox",
container: "panels",
attr: "projectRelations"
} ], XV.appendExtension("XV.AccountWorkspace", e), e = [ {
kind: "XV.ContactProjectsBox",
container: "panels",
attr: "projectRelations"
} ], XV.appendExtension("XV.ContactWorkspace", e), e = [ {
kind: "XV.ProjectWidget",
container: "mainGroup",
attr: "project"
} ], XV.appendExtension("XV.IncidentWorkspace", e), e = [ {
kind: "XV.ProjectIncidentsBox",
container: "panels",
attr: "incidentRelations"
} ], XV.appendExtension("XV.ProjectWorkspace", e);
};
})();

// postbooks.js

(function() {
XT.extensions.project.initPostbooks = function() {
var e, t;
t = [ {
name: "honorificList",
kind: "XV.HonorificList"
}, {
name: "accountList",
kind: "XV.AccountList"
}, {
name: "contactList",
kind: "XV.ContactList"
}, {
name: "itemList",
kind: "XV.ItemList"
}, {
name: "classCodeList",
kind: "XV.ClassCodeList"
}, {
name: "unitList",
kind: "XV.UnitList"
}, {
name: "stateList",
kind: "XV.StateList"
}, {
name: "countryList",
kind: "XV.CountryList"
} ], XT.app.$.postbooks.appendPanels("setup", t), e = {
name: "project",
label: "_project".loc(),
panels: [ {
name: "projectList",
kind: "XV.ProjectList"
}, {
name: "projectTaskList",
kind: "XV.ProjectTaskList"
} ],
privileges: [ "MaintainAddresses", "MaintainAllContacts", "MaintainAllCRMAccounts", "MaintainAllIncidents", "MaintainAllProjects", "MaintainPersonalContacts", "MaintainPersonalCRMAccounts", "MaintainPersonalIncidents", "MaintainPersonalProjects", "MaintainPersonalToDoItems", "MaintainTitles", "ViewAllContacts", "ViewAllCRMAccounts", "ViewAllIncidentHistory", "ViewAllIncidents", "ViewAllProjects", "ViewPersonalContacts", "ViewPersonalCRMAccounts", "ViewPersonalIncidents", "ViewPersonalProjects", "ViewTitles", "DeleteItemMasters", "MaintainItemMasters", "MaintainUOMs", "ViewClassCodes", "ViewItemMasters", "ViewUOMs", "ConfigurePM", "EditOthersComments", "EditOwnComments", "MaintainCommentTypes", "MaintainCountries", "MaintainStates", "MaintainUsers" ]
}, XT.app.$.postbooks.insertModule(e, 2);
};
})();

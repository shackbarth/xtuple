
// minifier: path aliases

enyo.path.addPaths({admin: "source/admin/"});

// strings.js

var lang = XT.stringsFor("en_US", {
_admin: "Admin",
_databaseServer: "Database Server",
_databaseServers: "Database Servers",
_organizations: "Organizations",
_port: "Port",
_hostname: "Hostname",
_dateAdded: "Date Added",
_location: "Location",
_user: "User",
_users: "Users",
_id: "ID",
_resetPassword: "Reset Password",
_resetPasswordConfirmation: "Are you sure you want to reset this password?"
});

// core.js

(function() {
"use strict";
XT.extensions.admin = {};
})();

// models.js

(function() {
"use strict";
XM.DatabaseServer = XM.Model.extend({
recordType: "XM.DatabaseServer",
idAttribute: "name",
databaseType: "global",
autoFetchId: !1,
initialize: function(e, t) {
XM.Model.prototype.initialize.apply(this, arguments), this.on("statusChange", this.statusChanged), this.statusChanged();
},
statusChanged: function() {
this.getStatus() === XM.Model.READY_NEW && this.setReadOnly("name", !1);
}
}), XM.Datasource = XM.Model.extend({
recordType: "XM.Datasource",
idAttribute: "name",
databaseType: "global",
autoFetchId: !1
}), XM.Organization = XM.Model.extend({
recordType: "XM.Organization",
idAttribute: "name",
databaseType: "global",
autoFetchId: !1,
initialize: function(e, t) {
XM.Model.prototype.initialize.apply(this, arguments), this.on("statusChange", this.statusChanged), this.statusChanged();
},
statusChanged: function() {
this.getStatus() === XM.Model.READY_NEW && this.setReadOnly("name", !1);
}
}), XM.Session = XM.Model.extend({
recordType: "XM.Session",
idAttribute: "sid",
databaseType: "global",
autoFetchId: !1
}), XM.SessionOrganization = XM.Model.extend({
recordType: "XM.SessionOrganization",
databaseType: "global"
}), XM.User = XM.Model.extend({
recordType: "XM.User",
autoFetchId: !1,
nameAttribute: "id",
databaseType: "global",
initialize: function(e, t) {
XM.Model.prototype.initialize.apply(this, arguments), this.on("statusChange", this.statusChanged), this.statusChanged();
},
statusChanged: function() {
this.getStatus() === XM.Model.READY_NEW && this.setReadOnly("id", !1);
}
}), XM.UserOrganization = XM.Model.extend({
recordType: "XM.UserOrganization",
databaseType: "global"
}), XM.DatabaseServerCollection = XM.Collection.extend({
model: XM.DatabaseServer
}), XM.DatasourceCollection = XM.Collection.extend({
model: XM.DatabaseServer
}), XM.OrganizationCollection = XM.Collection.extend({
model: XM.Organization
}), XM.SessionCollection = XM.Collection.extend({
model: XM.Session
}), XM.UserCollection = XM.Collection.extend({
model: XM.User
}), XM.UserOrganizationCollection = XM.Collection.extend({
model: XM.UserOrganization
});
})();

// startup.js

(function() {
"use strict";
XT.extensions.admin.initStartup = function() {
XT.StartupTasks.push({
taskName: "loadDatabaseServers",
task: function() {
var e = {
success: _.bind(this.didComplete, this)
};
XM.databaseServers = new XM.DatabaseServerCollection, XM.databaseServers.fetch(e);
}
}), XT.StartupTasks.push({
taskName: "loadOrganizations",
task: function() {
var e = {
success: _.bind(this.didComplete, this)
};
XM.organizations = new XM.OrganizationCollection, XM.organizations.fetch(e);
}
});
};
})();

// picker.js

(function() {
enyo.kind({
name: "XV.DatabaseServerWidget",
kind: "XV.PickerWidget",
collection: "XM.databaseServers",
idAttribute: "name",
orderBy: [ {
attribute: "name"
} ]
}), enyo.kind({
name: "XV.OrganizationWidget",
kind: "XV.PickerWidget",
collection: "XM.organizations",
idAttribute: "name",
orderBy: [ {
attribute: "name"
} ]
});
})();

// list.js

(function() {
enyo.kind({
name: "XV.UserList",
kind: "XV.List",
label: "_users".loc(),
collection: "XM.UserCollection",
query: {
orderBy: [ {
attribute: "id"
} ]
},
components: [ {
kind: "XV.ListItem",
components: [ {
kind: "FittableColumns",
components: [ {
kind: "XV.ListColumn",
classes: "short",
components: [ {
kind: "XV.ListAttr",
attr: "id",
classes: "bold"
} ]
} ]
} ]
} ]
}), enyo.kind({
name: "XV.DatabaseServerList",
kind: "XV.NameDescriptionList"
}), enyo.kind({
name: "XV.OrganizationList",
kind: "XV.NameDescriptionList"
});
})();

// list_relations.js

(function() {
enyo.kind({
name: "XV.UserOrganizationListRelations",
kind: "XV.ListRelations",
orderBy: [ {
attribute: "number"
} ],
parentKey: "project",
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
attr: "name",
classes: "bold"
}, {
kind: "XV.ListAttr",
attr: "username",
fit: !0,
classes: "right"
} ]
} ]
} ]
} ]
} ]
});
})();

// list_relations_editor_box.js

(function() {
enyo.kind({
name: "XV.UserOrganizationsEditor",
kind: "XV.RelationsEditor",
components: [ {
kind: "XV.ScrollableGroupbox",
name: "mainGroup",
fit: !0,
classes: "in-panel",
components: [ {
kind: "XV.OrganizationWidget",
name: "organizationPicker",
attr: "name",
label: "_organization".loc()
}, {
kind: "XV.InputWidget",
attr: "username"
} ]
} ]
}), enyo.kind({
name: "XV.UserOrganizationsBox",
kind: "XV.ListRelationsEditorBox",
classes: "xv-user-organizations-box",
title: "_organizations".loc(),
editor: "XV.UserOrganizationsEditor",
parentKey: "user",
listRelations: "XV.UserOrganizationListRelations",
fitButtons: !1
});
})();

// workspace.js

(function() {
enyo.kind({
name: "XV.UserWorkspace",
kind: "XV.Workspace",
title: "_user".loc(),
components: [ {
kind: "Panels",
arrangerKind: "CarouselArranger",
fit: !0,
components: [ {
kind: "XV.Groupbox",
name: "mainPanel",
components: [ {
kind: "onyx.GroupboxHeader",
content: "_overview".loc()
}, {
kind: "XV.ScrollableGroupbox",
name: "mainGroup",
fit: !0,
classes: "in-panel",
components: [ {
kind: "XV.InputWidget",
attr: "id"
}, {
kind: "onyx.Popup",
name: "resetPasswordPopup",
centered: !0,
modal: !0,
floating: !0,
scrim: !0,
components: [ {
content: "_resetPasswordConfirmation".loc()
}, {
tag: "br"
}, {
kind: "onyx.Button",
content: "_ok".loc(),
ontap: "resetPassword",
classes: "xv-popup-button"
}, {
kind: "onyx.Button",
content: "_cancel".loc(),
ontap: "closeResetPasswordPopup",
classes: "onyx-blue xv-popup-button"
} ]
}, {
kind: "onyx.Button",
name: "resetPasswordButton",
content: "_resetPassword".loc(),
ontap: "warnResetPassword",
showing: !1
} ]
} ]
}, {
kind: "XV.UserOrganizationsBox",
attr: "organizations"
} ]
} ],
closeResetPasswordPopup: function() {
this.$.resetPasswordPopup.hide();
},
model: "XM.User",
resetPassword: function(e, t) {
var n = this, r = {
success: function(e) {
alert("The password for " + n.getValue().id + " has been set to " + e.password);
},
error: function(e) {
alert("Password reset fail");
},
databaseType: "global"
};
this.$.resetPasswordPopup && this.$.resetPasswordPopup.hide(), XT.dataSource.resetPassword(this.getValue().id, r);
},
save: function(e) {
var t = this, n = this.getValue().getStatus() === XM.Model.READY_NEW, r = e ? e.success : undefined;
n && (e = e || {}, e.success = function(e, n, i) {
r && r(e, n, i), t.setValue(e), t.resetPassword();
}), this.inherited(arguments);
},
statusChanged: function(e, t, n) {
this.inherited(arguments), t === XM.Model.READY_CLEAN && this.$.resetPasswordButton.setShowing(!0);
},
warnResetPassword: function() {
this.$.resetPasswordPopup.show();
}
}), XV.registerModelWorkspace("XM.User", "XV.UserWorkspace"), enyo.kind({
name: "XV.DatabaseServerWorkspace",
kind: "XV.Workspace",
title: "_databaseServer".loc(),
components: [ {
kind: "Panels",
arrangerKind: "CarouselArranger",
fit: !0,
components: [ {
kind: "XV.Groupbox",
name: "mainPanel",
components: [ {
kind: "onyx.GroupboxHeader",
content: "_overview".loc()
}, {
kind: "XV.ScrollableGroupbox",
name: "mainGroup",
fit: !0,
classes: "in-panel",
components: [ {
kind: "XV.InputWidget",
attr: "name"
}, {
kind: "XV.InputWidget",
attr: "description"
}, {
kind: "XV.InputWidget",
attr: "hostname"
}, {
kind: "XV.NumberWidget",
attr: "port"
}, {
kind: "XV.InputWidget",
attr: "location"
}, {
kind: "XV.DateWidget",
attr: "dateAdded"
}, {
kind: "XV.InputWidget",
attr: "user"
}, {
kind: "XV.InputWidget",
attr: "password",
type: "password"
} ]
} ]
} ]
} ],
model: "XM.DatabaseServer"
}), XV.registerModelWorkspace("XM.DatabaseServer", "XV.DatabaseServerWorkspace"), enyo.kind({
name: "XV.OrganizationWorkspace",
kind: "XV.Workspace",
title: "_organization".loc(),
components: [ {
kind: "Panels",
arrangerKind: "CarouselArranger",
fit: !0,
components: [ {
kind: "XV.Groupbox",
name: "mainPanel",
components: [ {
kind: "onyx.GroupboxHeader",
content: "_overview".loc()
}, {
kind: "XV.ScrollableGroupbox",
name: "mainGroup",
fit: !0,
classes: "in-panel",
components: [ {
kind: "XV.InputWidget",
attr: "name"
}, {
kind: "XV.InputWidget",
attr: "description"
}, {
kind: "XV.DatabaseServerWidget",
attr: "databaseServer"
} ]
} ]
} ]
} ],
model: "XM.Organization"
}), XV.registerModelWorkspace("XM.Organization", "XV.OrganizationWorkspace");
})();

// postbooks.js

(function() {
XT.extensions.admin.initPostbooks = function() {
var e = {
name: "admin",
label: "_admin".loc(),
panels: [ {
name: "userList",
kind: "XV.UserList"
}, {
name: "databaseServerList",
kind: "XV.DatabaseServerList"
}, {
name: "organizationList",
kind: "XV.OrganizationList"
} ]
};
XT.app.$.postbooks.insertModule(e, 2);
};
})();

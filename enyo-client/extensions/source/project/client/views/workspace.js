/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

  XT.extensions.project.initWorkspaces = function () {
    var extensions;

    // ..........................................................
    // ACCOUNT
    //

    extensions = [
      {kind: "XV.AccountProjectsBox", container: "panels",
        attr: "projectRelations"}
    ];

    XV.appendExtension("XV.AccountWorkspace", extensions);

    // ..........................................................
    // CHARACTERISTIC
    //

    extensions = [
      {kind: "XV.ToggleButtonWidget", attr: "isProjects",
        label: "_projects".loc(), container: "rolesGroup"},
    ];

    XV.appendExtension("XV.CharacteristicWorkspace", extensions);

    // ..........................................................
    // CONFIGURE
    //

    enyo.kind({
      name: "XV.ProjectManagementWorkspace",
      kind: "XV.Workspace",
      title: "_configure".loc() + " " + "_project".loc(),
      model: "XM.ProjectManagement",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger", fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "XV.ScrollableGroupbox", name: "mainGroup",
              classes: "in-panel", components: [
              {kind: "onyx.GroupboxHeader", content: "_setup".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "UseProjects",
                label: "_useProjects".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "RequireProjectAssignment",
                label: "_requireProjectAssignment".loc()}
            ]}
          ]}
        ]}
      ]
    });

    // ..........................................................
    // CONTACT
    //

    extensions = [
      {kind: "XV.ContactProjectsBox", container: "panels",
        attr: "projectRelations"}
    ];

    XV.appendExtension("XV.ContactWorkspace", extensions);

    // ..........................................................
    // INCIDENT
    //

    extensions = [
      {kind: "XV.ProjectWidget", container: "mainGroup", attr: "project"}
    ];

    XV.appendExtension("XV.IncidentWorkspace", extensions);

    // ..........................................................
    // INVOICE
    //

    // ugly that this is a string that looks like a boolean
    if (XT.session.settings.get("UseProjects") === 'true') {
      extensions = [
        {kind: "XV.ProjectWidget", container: "mainGroup", attr: "project"}
      ];

      XV.appendExtension("XV.InvoiceWorkspace", extensions);
    }

    // ..........................................................
    // PROJECT
    //

    var projectHash = {
      name: "XV.ProjectWorkspace",
      kind: "XV.Workspace",
      title: "_project".loc(),
      headerAttrs: ["number", "-", "name"],
      model: "XM.Project",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "XV.InputWidget", attr: "number"},
              {kind: "XV.InputWidget", attr: "name"},
              {kind: "XV.DepartmentWidget", attr: "department"},
              {kind: "XV.ProjectTypePicker", attr: "projectType"},
              {kind: "XV.ProjectStatusPicker", attr: "status"},
              {kind: "XV.PriorityPicker", attr: "priority"},
              {kind: "XV.PercentWidget", attr: "percentComplete"},
              {kind: "onyx.GroupboxHeader", content: "_schedule".loc()},
              {kind: "XV.DateWidget", attr: "dueDate"},
              {kind: "XV.DateWidget", attr: "startDate"},
              {kind: "XV.DateWidget", attr: "assignDate"},
              {kind: "XV.DateWidget", attr: "completeDate"},
              {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
              {kind: "XV.UserAccountWidget", attr: "owner"},
              {kind: "XV.UserAccountWidget", attr: "assignedTo"},
              {kind: "XV.ProjectCharacteristicsWidget", attr: "characteristics"},
              {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
              {kind: "XV.TextArea", attr: "notes", fit: true},
              {kind: "onyx.GroupboxHeader", content: "_relationships".loc()},
              {kind: "XV.AccountWidget", attr: "account"},
              {kind: "XV.ContactWidget", attr: "contact"}
            ]}
          ]},
          {kind: "XV.ProjectCommentBox", attr: "comments"},
          {kind: "XV.ContactDocumentsBox", attr: "documents"}
        ]}
      ],
      create: function () {
        this.inherited(arguments);
        var panels = this.$.panels;
        if (enyo.platform.touch) {
          panels.createComponents([
            {kind: "XV.ProjectTasksBox", attr: "tasks",
              addBefore: this.$.projectCommentBox, classes: "medium-panel"},
            {kind: "XV.ProjectWorkflowBox", attr: "workflow",
              addBefore: this.$.projectCommentBox, classes: "medium-panel"}
          ], {owner: this});
        } else {
          panels.createComponents([
            {kind: "XV.ProjectTasksGridBox", attr: "tasks",
              addBefore: this.$.projectCommentBox},
            {kind: "XV.ProjectWorkflowGridBox", attr: "workflow",
              addBefore: this.$.projectCommentBox}
          ], {owner: this});
        }
      }
    };

    projectHash = enyo.mixin(projectHash, XV.accountNotifyContactMixin);
    enyo.kind(projectHash);

    XV.registerModelWorkspace("XM.Project", "XV.ProjectWorkspace");
    XV.registerModelWorkspace("XM.ProjectRelation", "XV.ProjectWorkspace");
    XV.registerModelWorkspace("XM.ProjectListItem", "XV.ProjectWorkspace");
    XV.registerModelWorkspace("XM.ProjectTask", "XV.ProjectWorkspace");
    XV.registerModelWorkspace("XM.ProjectWorkflow", "XV.ProjectWorkspace");

    enyo.kind({
      name: "XV.ProjectTaskWorkspace",
      kind: "XV.ChildWorkspace",
      title: "_projectTask".loc(),
      model: "XM.ProjectTask",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          classes: "xv-top-panel", fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "XV.InputWidget", attr: "number"},
              {kind: "XV.InputWidget", attr: "name"},
              {kind: "XV.ProjectStatusPicker", attr: "status"},
              {kind: "XV.PriorityPicker", attr: "priority"},
              {kind: "XV.PercentWidget", attr: "percentComplete"},
              {kind: "onyx.GroupboxHeader", content: "_schedule".loc()},
              {kind: "XV.DateWidget", attr: "dueDate"},
              {kind: "XV.DateWidget", attr: "startDate"},
              {kind: "XV.DateWidget", attr: "assignDate"},
              {kind: "XV.DateWidget", attr: "completeDate"},
              {kind: "onyx.GroupboxHeader", content: "_hours".loc()},
              {kind: "XV.HoursWidget", attr: "budgetedHours",
               label: "_budgeted".loc()},
              {kind: "XV.HoursWidget", attr: "actualHours",
               label: "_actual".loc()},
              {kind: "onyx.GroupboxHeader", content: "_expenses".loc()},
              {kind: "XV.MoneyWidget", attr: {localValue: "budgetedExpenses"},
               label: "_budgeted".loc(), currencyShowing: false},
              {kind: "XV.MoneyWidget", attr: {localValue: "actualExpenses"},
               label: "_actual".loc(), currencyShowing: false},
              {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
              {kind: "XV.UserAccountWidget", attr: "owner"},
              {kind: "XV.UserAccountWidget", attr: "assignedTo"},
              {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
              {kind: "XV.TextArea", attr: "notes", fit: true}
            ]}
          ]},
          {kind: "XV.TaskResourcesBox", attr: "resources"},
          {kind: "XV.TaskCommentBox", attr: "comments"}
        ]}
      ]
    });

    enyo.kind({
      name: "XV.ProjectWorkflowWorkspace",
      kind: "XV.ChildWorkspace",
      title: "_projectWorkflow".loc(),
      model: "XM.ProjectWorkflow",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          classes: "xv-top-panel", fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "XV.InputWidget", attr: "name"},
              {kind: "XV.InputWidget", attr: "description"},
              {kind: "XV.WorkflowStatusPicker", attr: "status"},
              {kind: "XV.PriorityPicker", attr: "priority", showNone: false},
              {kind: "XV.NumberSpinnerWidget", attr: "sequence"},
              {kind: "onyx.GroupboxHeader", content: "_schedule".loc()},
              {kind: "XV.DateWidget", attr: "dueDate"},
              {kind: "XV.DateWidget", attr: "startDate"},
              {kind: "XV.DateWidget", attr: "assignDate"},
              {kind: "XV.DateWidget", attr: "completeDate"},
              {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
              {kind: "XV.UserAccountWidget", attr: "owner"},
              {kind: "XV.UserAccountWidget", attr: "assignedTo"},
              {kind: "onyx.GroupboxHeader", content: "_notes".loc()},
              {kind: "XV.TextArea", attr: "notes", fit: true}
            ]}
          ]},
          {kind: "XV.Groupbox", name: "onCompletedPanel", title: "_completionActions".loc(),
            components: [
            {kind: "onyx.GroupboxHeader", content: "_onCompletion".loc()},
            {kind: "XV.ScrollableGroupbox", name: "completionGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "XV.ProjectStatusPicker", attr: "completedParentStatus",
                noneText: "_noChange".loc(), label: "_nextProjectStatus".loc()},
              {kind: "XV.ProjectWorkflowSuccessorsWidget",
                attr: {workflow: "parent.workflow", successors: "completedSuccessors"}}
            ]}
          ]},
          {kind: "XV.Groupbox", name: "onDeferredPanel", title: "_deferredActions".loc(),
            components: [
            {kind: "onyx.GroupboxHeader", content: "_onDeferred".loc()},
            {kind: "XV.ScrollableGroupbox", name: "deferredGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "XV.ProjectStatusPicker", attr: "deferredParentStatus",
                noneText: "_noChange".loc(), label: "_nextProjectStatus".loc()},
              {kind: "XV.ProjectWorkflowSuccessorsWidget",
                attr: {workflow: "parent.workflow", successors: "deferredSuccessors"}}
            ]}
          ]}
        ]}
      ]
    });

    // ..........................................................
    // PROJECT EMAIL PROFILE
    //

    enyo.kind({
      name: "XV.ProjectEmailProfileWorkspace",
      kind: "XV.EmailProfileWorkspace",
      title: "_projectEmailProfile".loc(),
      model: "XM.ProjectEmailProfile",
    });

    XV.registerModelWorkspace("XM.ProjectEmailProfile", "XV.ProjectEmailProfileWorkspace");

    // ..........................................................
    // PROJECT TYPE
    //

    enyo.kind({
      name: "XV.ProjectTypeWorkspace",
      kind: "XV.Workspace",
      title: "_projectType".loc(),
      model: "XM.ProjectType",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup",
              classes: "in-panel", fit: true, components: [
              {kind: "XV.InputWidget", attr: "code"},
              {kind: "XV.CheckboxWidget", attr: "isActive"},
              {kind: "XV.InputWidget", attr: "description"},
              {kind: "XV.ProjectEmailProfilePicker", attr: "emailProfile"},
              {kind: "XV.ProjectCharacteristicsWidget", attr: "characteristics"}
            ]}
          ]},
          {kind: "XV.ProjectTypeWorkflowBox", attr: "workflow"}
        ]}
      ]
    });

    XV.registerModelWorkspace("XM.ProjectType", "XV.ProjectTypeWorkspace");


    // ..........................................................
    // QUOTE
    //

    extensions = [
      {kind: "XV.ProjectWidget", container: "settingsGroup", attr: "project"}
    ];

    XV.appendExtension("XV.QuoteWorkspace", extensions);

    // ..........................................................
    // SALES ORDER
    //

    extensions = [
      {kind: "XV.ProjectWidget", container: "settingsGroup", attr: "project"}
    ];

    XV.appendExtension("XV.SalesOrderWorkspace", extensions);

  };

}());

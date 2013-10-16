/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
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
    // PROJECT
    //
  
    extensions = [
      {kind: "XV.ProjectTypePicker", container: "mainGroup",
        attr: "projectType", addBefore: "projectStatusPicker"},
      {kind: "XV.ProjectCharacteristicsWidget", container: "mainGroup",
        attr: "characteristics"}
    ];

    XV.appendExtension("XV.ProjectWorkspace", extensions);

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
            classes: "in-panel", components: [
            {kind: "XV.InputWidget", attr: "code"},
            {kind: "XV.CheckboxWidget", attr: "isActive"},
            {kind: "XV.InputWidget", attr: "description"}
          ]}
        ]}
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

    // ..........................................................
    // TASK
    //
  
    extensions = [
      {kind: "XV.TaskCharacteristicsWidget", container: "mainGroup",
        attr: "characteristics"}
    ];

    XV.appendExtension("XV.TaskWorkspace", extensions);

  };

}());

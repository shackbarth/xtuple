/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

  XT.extensions.connect.initWorkspaces = function () {
    // ..........................................................
    // INCIDENT EMAIL PROFILE
    //

    enyo.kind({
      name: "XV.IncidentEmailProfileWorkspace",
      kind: "XV.Workspace",
      title: "_incidentEmailProfile".loc(),
      headerAttrs: ["name", "-", "description"],
      model: "XM.IncidentEmailProfile",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel",
            style: "width: 480px;", components: [
            {kind: "onyx.GroupboxHeader", content: "_overview".loc()},
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "XV.InputWidget", attr: "name"},
              {kind: "XV.InputWidget", attr: "description"},
              {kind: "onyx.GroupboxHeader", content: "_header".loc()},
              {kind: "XV.InputWidget", attr: "from"},
              {kind: "XV.InputWidget", attr: "replyTo"},
              {kind: "XV.InputWidget", attr: "to"},
              {kind: "XV.InputWidget", attr: "cc"},
              {kind: "XV.InputWidget", attr: "bcc"},
              {kind: "XV.InputWidget", attr: "subject"},
              {kind: "onyx.GroupboxHeader", content: "_body".loc()},
              {kind: "XV.TextArea", attr: "body", classes: "max-height"}
            ]}
          ]}
        ]}
      ]
    });
  
    XV.registerModelWorkspace("XM.IncidentEmailProfile", "XV.IncidentEmailProfileWorkspace");
  
    // ..........................................................
    // INCIDENT CATEGORY
    //
  
    var extensions = [
      {kind: "XV.IncidentEmailProfilePicker", container: "mainGroup",
        attr: "emailProfile"}
    ];

    XV.appendExtension("XV.IncidentCategoryWorkspace", extensions);
  };

}());

/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XV:true, XM:true, enyo:true*/

(function () {

  XT.extensions.manufacturing.initPostbooks = function () {
    var module,
      panels,
      relevantPrivileges,
			configurationJson,
			configuration;

    // ..........................................................
    // APPLICATION
    //

    panels = [
    ];
    XT.app.$.postbooks.appendPanels("setup", panels);


    configurationJson = {
      model: "XM.manufacturing",
      name: "_manufacturing".loc(),
      description: "_manufacturingDescription".loc(),
      workspace: "XV.ManufacturingWorkspace"
    };
    configuration = new XM.ConfigurationModel(configurationJson);
    XM.configurations.add(configuration);

    module = {
      name: "manufacturing",
      label: "_manufacturing".loc(),
      panels: [
        {name: "workOrderList", kind: "XV.WorkOrderList"}
      ],
      actions: [
        {name: "issueWoMaterial", privilege: "issueWoMaterials", method: "issueWoMaterial", notify: false}
      ],
      issueWoMaterial: function (inSender, inEvent) {
        inSender.bubbleUp("onIssueWoMaterial", inEvent, inSender);
      }

    };
    XT.app.$.postbooks.insertModule(module, 0);

    relevantPrivileges = [
      "IssueWoMaterials",
      "ReturnWoMaterials"
    ];
    XT.session.addRelevantPrivileges(module.name, relevantPrivileges);

    // Postbooks level handler for the thing that is neither fish nor fowl
    XT.app.$.postbooks.handlers.onIssueWoMaterial = "issueWoMaterial";
    XT.app.$.postbooks.issueWoMaterial = function (inSender, inEvent) {
      var panel = this.createComponent({kind: "XV.IssueWoMaterials"});

      panel.render();
      this.reflow();
      this.setIndex(this.getPanels().length - 1);

      return true;
    };

  };
}());

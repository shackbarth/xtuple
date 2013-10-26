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
    /*
    panels = [
      //Bill of Materials
    ];
    XT.app.$.postbooks.appendPanels("setup", panels);
    */

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
        {name: "issueMaterial", privilege: "issueWoMaterials", method: "issueMaterial", notify: false}
      ],
      issueMaterial: function (inSender, inEvent) {
        inSender.bubbleUp("onIssueMaterial", inEvent, inSender);
      }

    };
    XT.app.$.postbooks.insertModule(module, 90);

    relevantPrivileges = [
      "IssueWoMaterials",
      "PostProduction",
      "ReturnWoMaterials"
    ];
    XT.session.addRelevantPrivileges(module.name, relevantPrivileges);

    // Postbooks level handler for the thing that is neither fish nor fowl
    XT.app.$.postbooks.handlers.onIssueMaterial = "issueMaterial";
    XT.app.$.postbooks.issueMaterial = function (inSender, inEvent) {
      var panel = this.createComponent({kind: "XV.IssueMaterial"});

      panel.render();
      this.reflow();
      this.setIndex(this.getPanels().length - 1);

      return true;
    };

  };
}());

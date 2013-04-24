var getReleaseNotes = function (projectId, versionName) {
  var project = new XM.Project();
  project.fetch({id: projectId, success: function () {
    var version = _.find(project.get("versions").models, function (model) {
      return model.get("version") === versionName;
    });
    var incidents = new XM.IncidentListItemCollection();
    incidents.fetch({
      showMore: false,
      query: {
        recordType: "XM.IncidentListItem",
        parameters: [
          {attribute: "project", operator:"", isCharacteristic: false, value: project},
          {attribute: "fixedIn", operator:"", isCharacteristic: false, value: version}
        ]
      },
      success: function (results) {
        _.each(results.models, function (incident) {
          var verb = incident.getValue("category.name") === "Bugs" ? "Fixed" : "Implemented";
          var incidentNumber = incident.get("number");
          var link = "http://www.xtuple.org/xtincident/view/bugs/" + incidentNumber;
          console.log("- " + verb)
          console.log("  issue #[" + incidentNumber + "](" + link + ")");
          console.log("  _" + incident.get("description") + "_");
        });
      }
    });
  }});
}

/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, XV:true, enyo:true, _:true*/

(function () {

  XT.extensions.incidentPlus.initPickers = function () {

    // ..........................................................
    // PROJECT VERSION
    //

    enyo.kind({
      name: "XV.ProjectVersionPicker",
      kind: "XV.PickerWidget",
      collection: "XM.projectVersions",
      nameAttribute: "version",
      published: {
        project: null
      },
      orderBy: [
        {attribute: 'version', descending: true}
      ],
      create: function () {
        this.inherited(arguments);
        this.projectChanged();
      },
      projectChanged: function () {
        var project = this.getProject();
        if (project) {
          this.filter = function (models) {
            return _.filter(models, function (model) {
              var prj = model.get('project'),
                id = _.isNumber(prj) ? prj : prj.id;
              return id === project.id;
            });
          };
        } else {
          this.filter = function (models) { return []; };
        }
        this.buildList();
      }
    });
  };

}());

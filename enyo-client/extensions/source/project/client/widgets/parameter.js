/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

  XT.extensions.project.initParameters = function () {
    var extensions;
 
    // ..........................................................
    // INCIDENT
    //
  
    extensions = [
      {kind: "onyx.GroupboxHeader", content: "_project".loc()},
      {name: "project", label: "_project".loc(), attr: "project", defaultKind: "XV.ProjectWidget"}
    ];

    XV.appendExtension("XV.IncidentListParameters", extensions);

    // ..........................................................
    // PROJECT
    //

    enyo.kind({
      name: "XV.ProjectListParameters",
      kind: "XV.ParameterWidget",
      characteristicsRole: 'isProjects',
      defaultParameters: function () {
        return {
          user: XM.currentUser
        };
      },
      components: [
        {kind: "onyx.GroupboxHeader", content: "_project".loc()},
        {name: "showCompleted", label: "_showCompleted".loc(), attr: "status", defaultKind: "XV.CheckboxWidget",
          getParameter: function () {
            var param;
            if (!this.getValue()) {
              param = {
                attribute: this.getAttr(),
                operator: '!=',
                value: 'C'
              };
            }
            return param;
          }
        },
        {name: "number", label: "_number".loc(), attr: "number"},
        {name: "name", label: "_name".loc(), attr: "name"},
        {name: "account", label: "_account".loc(), attr: "account", defaultKind: "XV.AccountWidget"},
        {name: "contact", label: "_contact".loc(), attr: "contact", defaultKind: "XV.ContactWidget"},
        {name: "statusHeader", kind: "onyx.GroupboxHeader", content: "_status".loc()},
        {name: "status", label: "_status".loc(), attr: "status",
          defaultKind: "XV.ProjectStatusPicker"},
        {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
        {name: "owner", label: "_owner".loc(), attr: "owner", defaultKind: "XV.UserAccountWidget"},
        {name: "assignedTo", label: "_assignedTo".loc(), attr: "assignedTo", defaultKind: "XV.UserAccountWidget"},
        {name: "user", label: "_user".loc(), attr: ["owner.username", "assignedTo.username"], defaultKind: "XV.UserAccountWidget"},
        {kind: "onyx.GroupboxHeader", content: "_dueDate".loc()},
        {name: "fromDueDate", label: "_fromDate".loc(), attr: "dueDate", operator: ">=",
          filterLabel: "_from".loc() + " " + "_dueDate".loc() + " " + "_date".loc(),
          defaultKind: "XV.DateWidget"},
        {name: "toDueDate", label: "_toDate".loc(), attr: "dueDate", operator: "<=",
          filterLabel: "_to".loc() + " " + "_dueDate".loc() + " " + "_date".loc(),
          defaultKind: "XV.DateWidget"}
      ],
      /**
        Special handling for status.
      */
      setParameterItemValues: function (items) {
        this.inherited(arguments);
        var i;
        for (i = 0; i < items.length; i++) {
          if (items[i].name === "status" &&
              items[i].showing === false) {
            this.$.showCompleted.hide();
            this.$.statusHeader.hide();
          }
        }

      }
    });

    enyo.kind({
      name: "XV.ProjectTaskListParameters",
      kind: "XV.ParameterWidget",
      characteristicsRole: 'isTasks',
      defaultParameters: function () {
        return {
          user: XM.currentUser
        };
      },
      components: [
        {kind: "onyx.GroupboxHeader", content: "_project".loc()},
        {name: "showCompleted", label: "_showCompleted".loc(), attr: "status", defaultKind: "XV.CheckboxWidget",
          getParameter: function () {
            var param;
            if (!this.getValue()) {
              param = {
                attribute: this.getAttr(),
                operator: '!=',
                value: 'C'
              };
            }
            return param;
          }
        },
        {name: "project", label: "_project".loc(), attr: "project", defaultKind: "XV.ProjectWidget"},
        {name: "number", label: "_number".loc(), attr: "number"},
        {name: "name", label: "_name".loc(), attr: "name"},
        {kind: "onyx.GroupboxHeader", content: "_status".loc()},
        {name: "status", label: "_status".loc(), attr: "status",
          defaultKind: "XV.ProjectStatusPicker"},
        {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
        {name: "owner", label: "_owner".loc(), attr: "owner", defaultKind: "XV.UserAccountWidget"},
        {name: "assignedTo", label: "_assignedTo".loc(), attr: "assignedTo", defaultKind: "XV.UserAccountWidget"},
        {name: "user", label: "_user".loc(), attr: ["owner.username", "assignedTo.username"], defaultKind: "XV.UserAccountWidget"},
        {kind: "onyx.GroupboxHeader", content: "_dueDate".loc()},
        {name: "fromDueDate", label: "_fromDate".loc(), attr: "dueDate", operator: ">=",
          filterLabel: "_from".loc() + " " + "_dueDate".loc() + " " + "_date".loc(),
          defaultKind: "XV.DateWidget"},
        {name: "toDueDate", label: "_toDate".loc(), attr: "dueDate", operator: "<=",
          filterLabel: "_to".loc() + " " + "_dueDate".loc() + " " + "_date".loc(),
          defaultKind: "XV.DateWidget"}
      ]
    });
  };

}());

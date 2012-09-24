/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, _:true, enyo:true, Globalize:true*/

(function () {

  // ..........................................................
  // ACCOUNT
  //

  enyo.kind({
    name: "XV.AccountListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_account".loc()},
      {attr: "isActive", label: "_showInactive".loc(), defaultKind: "XV.CheckboxWidget",
        getParameter: function () {
          var param;
          if (!this.getValue()) {
            param = {
              attribute: this.getAttr(),
              operator: '=',
              value: true
            };
          }
          return param;
        }
      },
      {label: "_number".loc(), attr: "number"},
      {label: "_name".loc(), attr: "name"},
      {kind: "onyx.GroupboxHeader", content: "_contact".loc()},
      {label: "_primaryContact".loc(), attr: "primaryContact.name"},
      {label: "_primaryEmail".loc(), attr: "primaryContact.primaryEmail"},
      {kind: "onyx.GroupboxHeader", content: "_address".loc()},
      {label: "_phone".loc(), attr: ["primaryContact.phone", "primaryContact.alternate", "primaryContact.fax"]},
      {label: "_street".loc(), attr: ["primaryContact.address.line1", "primaryContact.address.line2", "primaryContact.address.line3"]},
      {label: "_city".loc(), attr: "primaryContact.address.city"},
      {label: "_postalCode".loc(), attr: "primaryContact.address.postalCode"},
      {label: "_state".loc(), attr: "primaryContact.address.state"},
      {label: "_country".loc(), attr: "primaryContact.address.country"},
      {kind: "onyx.GroupboxHeader", content: "_userAccount".loc()},
      {label: "_owner".loc(), attr: "owner", defaultKind: "XV.UserAccountWidget"}
    ]
  });
  
  // ..........................................................
  // ADDRESS
  //

  enyo.kind({
    name: "XV.AddressListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_address".loc()},
      {attr: "isActive", label: "_showInactive".loc(), defaultKind: "XV.CheckboxWidget",
        getParameter: function () {
          var param;
          if (!this.getValue()) {
            param = {
              attribute: this.getAttr(),
              operator: '=',
              value: true
            };
          }
          return param;
        }
      },
      {label: "_street".loc(), attr: ["line1", "line2", "line3"]},
      {label: "_city".loc(), attr: "city"},
      {label: "_postalCode".loc(), attr: "postalCode"},
      {label: "_state".loc(), attr: "state"},
      {label: "_country".loc(), attr: "country"}
    ]
  });

  // ..........................................................
  // CONTACT
  //

  enyo.kind({
    name: "XV.ContactListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_contact".loc()},
      {attr: "isActive", label: "_showInactive".loc(), defaultKind: "XV.CheckboxWidget",
        getParameter: function () {
          var param;
          if (!this.getValue()) {
            param = {
              attribute: this.getAttr(),
              operator: '=',
              value: true
            };
          }
          return param;
        }
      },
      {label: "_name".loc(), attr: "name"},
      {label: "_primaryEmail".loc(), attr: "primaryEmail"},
      {label: "_phone".loc(), attr: ["phone", "alternate", "fax"]},
      {kind: "onyx.GroupboxHeader", content: "_address".loc()},
      {label: "_street".loc(), attr: ["address.line1", "address.line2", "address.line3"]},
      {label: "_city".loc(), attr: "address.city"},
      {label: "_state".loc(), attr: "address.state"},
      {label: "_postalCode".loc(), attr: "address.postalCode"},
      {label: "_country".loc(), attr: "address.country"},
      {kind: "onyx.GroupboxHeader", content: "_relationships".loc()},
      {label: "_account".loc(), attr: "account", defaultKind: "XV.AccountWidget"},
      {kind: "onyx.GroupboxHeader", content: "_userAccount".loc()},
      {label: "_owner".loc(), attr: "owner", defaultKind: "XV.UserAccountWidget"}
    ]
  });
  
  // ..........................................................
  // FILE
  //

  enyo.kind({
    name: "XV.FileParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_file".loc()},
      {label: "_name".loc(), attr: "name"},
      {label: "_description".loc(), attr: "description"}
    ]
  });

  // ..........................................................
  // INCIDENT
  //

  enyo.kind({
    name: "XV.IncidentListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_incident".loc()},
      {label: "_number".loc(), attr: "number",
        getParameter: function () {
          var param,
            value = this.getValue() - 0;
          if (value && _.isNumber(value)) {
            param = {
              attribute: this.getAttr(),
              operator: '=',
              value: value
            };
          }
          return param;
        }
      },
      {label: "_description".loc(), attr: "description"},
      {label: "_category".loc(), attr: "category",
        defaultKind: "XV.IncidentCategoryPicker"},
      {label: "_severity".loc(), attr: "severity",
        defaultKind: "XV.IncidentSeverityPicker"},
      {label: "_resolution".loc(), attr: "resolution",
          defaultKind: "XV.IncidentResolutionPicker"},
      {kind: "onyx.GroupboxHeader", content: "_priority".loc()},
      {label: "_equals".loc(), attr: "priority",
        defaultKind: "XV.PriorityPicker"},
      {label: "_above".loc(), attr: "priority",
          filterLabel: "_priority" + " " + "_above".loc(),
          defaultKind: "XV.PriorityPicker",
          getParameter: function () {
            var value = this.getValue(),
              param;
            if (value) {
              param = {
                attribute: "priorityOrder",
                operator: '<',
                value: value.get('order')
              };
            }
            return param;
          }},
      {kind: "onyx.GroupboxHeader", content: "_status".loc()},
      {label: "_equals".loc(), attr: "status",
        filterLabel: "_status" + " " + "_equals".loc(),
        defaultKind: "XV.IncidentStatusPicker"},
      {label: "_above".loc(), attr: "status",
        filterLabel: "_status" + " " + "_above".loc(),
        defaultKind: "XV.IncidentStatusPicker",
        getParameter: function () {
          var value = this.getValue(),
            param;
          switch (value)
          {
          case 'N':
            value = 0;
            break;
          case 'F':
            value = 1;
            break;
          case 'C':
            value = 2;
            break;
          case 'A':
            value = 3;
            break;
          case 'R':
            value = 4;
            break;
          case 'L':
            value = 5;
            break;
          }
          if (value) {
            param = {
              attribute: "statusOrder",
              operator: '<',
              value: value
            };
          }
          return param;
        }},
      {kind: "onyx.GroupboxHeader", content: "_relationships".loc()},
      {label: "_account".loc(), attr: "account", defaultKind: "XV.AccountWidget"},
      {label: "_contact".loc(), attr: "contact", defaultKind: "XV.ContactWidget"},
      {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
      {label: "_owner".loc(), attr: "owner", defaultKind: "XV.UserAccountWidget"},
      {label: "_assignedTo".loc(), attr: "assignedTo", defaultKind: "XV.UserAccountWidget"},
      {kind: "onyx.GroupboxHeader", content: "_created".loc()},
      {label: "_fromDate".loc(), attr: "created", operator: ">=",
        defaultKind: "XV.DateWidget"},
      {label: "_toDate".loc(), attr: "created", operator: "<=",
        defaultKind: "XV.DateWidget"}
    ]
  });
  
  // ..........................................................
  // CONTACT
  //

  enyo.kind({
    name: "XV.ItemListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_item".loc()},
      {attr: "isActive", label: "_showInactive".loc(), defaultKind: "XV.CheckboxWidget",
        getParameter: function () {
          var param;
          if (!this.getValue()) {
            param = {
              attribute: this.getAttr(),
              operator: '=',
              value: true
            };
          }
          return param;
        }
      },
      {label: "_number".loc(), attr: "number"},
      {label: "_description".loc(), attr: ["description1", "description2"]},
      {label: "_classCode".loc(), attr: "classCode",
        defaultKind: "XV.ClassCodePicker"},
      {label: "_category".loc(), attr: "productCategory",
        defaultKind: "XV.ProductCategoryPicker"}
    ]
  });

  // ..........................................................
  // OPPORTUNITY
  //

  enyo.kind({
    name: "XV.OpportunityListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_opportunity".loc()},
      {label: "_showInactive".loc(), attr: "isActive",
        defaultKind: "XV.CheckboxWidget",
        getParameter: function () {
          var param;
          if (!this.getValue()) {
            param = {
              attribute: this.getAttr(),
              operator: '=',
              value: true
            };
          }
          return param;
        }
      },
      {label: "_name".loc(), attr: "name"},
      {label: "_account".loc(), attr: "account", defaultKind: "XV.AccountWidget"},
      {label: "_contact".loc(), attr: "contact", defaultKind: "XV.ContactWidget"},
      {kind: "onyx.GroupboxHeader", content: "_status".loc()},
      {label: "_stage".loc(), attr: "opportunityStage",
        defaultKind: "XV.OpportunityStagePicker"},
      {label: "_priority".loc(), attr: "priority",
        defaultKind: "XV.PriorityPicker"},
      {label: "_type".loc(), attr: "opportunityType",
        defaultKind: "XV.OpportunityTypePicker"},
      {label: "_source".loc(), attr: "opportunitySource",
        defaultKind: "XV.OpportunitySourcePicker"},
      {kind: "onyx.GroupboxHeader", content: "_relationships".loc()},
      {label: "_account".loc(), attr: "account", defaultKind: "XV.AccountWidget"},
      {label: "_contact".loc(), attr: "contact", defaultKind: "XV.ContactWidget"},
      {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
      {label: "_owner".loc(), attr: "owner", defaultKind: "XV.UserAccountWidget"},
      {label: "_assignedTo".loc(), attr: "assignedTo", defaultKind: "XV.UserAccountWidget"},
      {kind: "onyx.GroupboxHeader", content: "_targetClose".loc()},
      {label: "_fromDate".loc(), attr: "targetClose", operator: ">=",
        filterLabel: "_from".loc() + " " + "_targetClose".loc() + " " + "_date".loc(),
        defaultKind: "XV.DateWidget"},
      {label: "_toDate".loc(), attr: "targetClose", operator: "<=",
        filterLabel: "_to".loc() + " " + "_targetClose".loc() + " " + "_date".loc(),
        defaultKind: "XV.DateWidget"}
    ]
  });

  // ..........................................................
  // PROJECT
  //

  enyo.kind({
    name: "XV.ProjectListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_project".loc()},
      {label: "_showCompleted".loc(), attr: "status", defaultKind: "XV.CheckboxWidget",
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
      {label: "_number".loc(), attr: "number"},
      {label: "_name".loc(), attr: "name"},
      {label: "_account".loc(), attr: "account", defaultKind: "XV.AccountWidget"},
      {label: "_contact".loc(), attr: "contact", defaultKind: "XV.ContactWidget"},
      {kind: "onyx.GroupboxHeader", content: "_status".loc()},
      {label: "_status".loc(), attr: "status",
        defaultKind: "XV.ProjectStatusPicker"},
      {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
      {label: "_owner".loc(), attr: "owner", defaultKind: "XV.UserAccountWidget"},
      {label: "_assignedTo".loc(), attr: "assignedTo", defaultKind: "XV.UserAccountWidget"},
      {kind: "onyx.GroupboxHeader", content: "_dueDate".loc()},
      {label: "_fromDate".loc(), attr: "dueDate", operator: ">=",
        filterLabel: "_from".loc() + " " + "_dueDate".loc() + " " + "_date".loc(),
        defaultKind: "XV.DateWidget"},
      {label: "_toDate".loc(), attr: "dueDate", operator: "<=",
        filterLabel: "_to".loc() + " " + "_dueDate".loc() + " " + "_date".loc(),
        defaultKind: "XV.DateWidget"}
    ]
  });
  
  enyo.kind({
    name: "XV.ProjectTaskListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_project".loc()},
      {label: "_showCompleted".loc(), attr: "status", defaultKind: "XV.CheckboxWidget",
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
      {label: "_project".loc(), attr: "project", defaultKind: "XV.ProjectWidget"},
      {label: "_number".loc(), attr: "number"},
      {label: "_name".loc(), attr: "name"},
      {kind: "onyx.GroupboxHeader", content: "_status".loc()},
      {label: "_status".loc(), attr: "status",
        defaultKind: "XV.ProjectStatusPicker"},
      {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
      {label: "_owner".loc(), attr: "owner", defaultKind: "XV.UserAccountWidget"},
      {label: "_assignedTo".loc(), attr: "assignedTo", defaultKind: "XV.UserAccountWidget"},
      {kind: "onyx.GroupboxHeader", content: "_dueDate".loc()},
      {label: "_fromDate".loc(), attr: "dueDate", operator: ">=",
        filterLabel: "_from".loc() + " " + "_dueDate".loc() + " " + "_date".loc(),
        defaultKind: "XV.DateWidget"},
      {label: "_toDate".loc(), attr: "dueDate", operator: "<=",
        filterLabel: "_to".loc() + " " + "_dueDate".loc() + " " + "_date".loc(),
        defaultKind: "XV.DateWidget"}
    ]
  });

  // ..........................................................
  // TO DO
  //

  enyo.kind({
    name: "XV.ToDoListParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_toDo".loc()},
      {label: "_showInactive".loc(), attr: "isActive", defaultKind: "XV.CheckboxWidget",
        getParameter: function () {
          var param;
          if (!this.getValue()) {
            param = {
              attribute: this.getAttr(),
              operator: '!=',
              value: true
            };
          }
          return param;
        }
      },
      {label: "_name".loc(), attr: "name"},
      {label: "_description".loc(), attr: "description"},
      {kind: "onyx.GroupboxHeader", content: "_relationships".loc()},
      {label: "_account".loc(), attr: "account", defaultKind: "XV.AccountWidget"},
      {label: "_contact".loc(), attr: "contact", defaultKind: "XV.ContactWidget"},
      {kind: "onyx.GroupboxHeader", content: "_userAccounts".loc()},
      {label: "_owner".loc(), attr: "owner", defaultKind: "XV.UserAccountWidget"},
      {label: "_assignedTo".loc(), attr: "assignedTo", defaultKind: "XV.UserAccountWidget"},
      {kind: "onyx.GroupboxHeader", content: "_dueDate".loc()},
      {label: "_fromDate".loc(), attr: "dueDate", operator: ">=",
        filterLabel: "_from".loc() + " " + "_dueDate".loc() + " " + "_date".loc(),
        defaultKind: "XV.DateWidget"},
      {label: "_toDate".loc(), attr: "dueDate", operator: "<=",
        filterLabel: "_to".loc() + " " + "_dueDate".loc() + " " + "_date".loc(),
        defaultKind: "XV.DateWidget"}
    ]
  });
  
  // ..........................................................
  // URL
  //

  enyo.kind({
    name: "XV.UrlParameters",
    kind: "XV.ParameterWidget",
    components: [
      {kind: "onyx.GroupboxHeader", content: "_url".loc()},
      {label: "_name".loc(), attr: "name"},
      {label: "_path".loc(), attr: "path"}
    ]
  });

}());

/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, XV:true, enyo:true, _:true */
(function () {
  //"use strict";

  enyo.kind({
    name: "XV.Util",
    kind: enyo.Component,
    published: {
      workspacePanelDescriptor: null,
      relationTitleFields: {},
      history: []
    },
    create: function () {
      this.inherited(arguments);

      /**
       * This JSON descriptor can easily be stored somewhere else. It doesn't need
       * to be enyo-dependent.
       */
      /**
       * I've thought about getting the workspace code to figure out the
       * appropriate fieldType dynamically (if it's a date object, use DateWidget,
       * etc. But I think this would fail if the field happens to be null.
       */
      this.setWorkspacePanelDescriptor({
        "XM.Account": [
          {
            title: "Account Info",
            fields: [
              { fieldName: "number" },
              { fieldName: "name" },
              { fieldName: "accountType", kind: "XV.AccountTypeDropdown" }
            ]
          },
          {
            title: "Contact",
            fields: [
              // TODO: we can avoid having to specify the model by looking in the
              // *relations* of the model, which will work even if the submodel is null
  //            { fieldName: "primaryContact", fieldType: "relation", modelType: "XM.ContactInfo" }
            ]
          },
          {
            title: "Comments",
            location: "bottom",
            boxType: "grid",
            objectName: "comments",
            customization: {
              disallowEdit: true,
              stampUser: true,
              stampDate: true
            },
            fields: [
              { fieldName: "createdBy" },
              { fieldName: "created", label: "date", kind: "XV.DateWidget" },
              { fieldName: "commentType", label: "type", kind: "XV.CommentTypeDropdown" },
              { fieldName: "text", label: "text" }
            ]
          }
        ],
        "XM.UserAccount": [
          {
            title: "User Account Info",
            fields: [
              { fieldName: "properName" }
            ]
          }
        ],

        "XM.Contact": [
          {
            title: "Contact Info",
            fields: [
              { fieldName: "firstName" },
              { fieldName: "lastName" },
              { fieldName: "jobTitle" },
              { fieldName: "address", fieldType: "address" },
              { fieldName: "phone" },
              { fieldName: "primaryEmail" }
            ]
          },
          {
            title: "Account Info",
            fields: [
              { fieldName: "account", kind: "XV.AccountRelation" }
            ]
          },
          {
            title: "Comments",
            location: "bottom",
            boxType: "grid",
            objectName: "comments",
            modelType: "XM.ContactComment",
            customization: {
              disallowEdit: true,
              stampUser: true,
              stampDate: true
            },
            fields: [
              { fieldName: "createdBy" },
              { fieldName: "created", label: "date", kind: "XV.DateWidget" },
              { fieldName: "commentType", label: "type", kind: "XV.CommentTypeDropdown" },
              { fieldName: "text", label: "text" }
            ]
          }
        ],

        "XM.ToDo": [
          {
            title: "ToDo Info",
            fields: [
              { fieldName: "name" },
              { fieldName: "description" },
              { fieldName: "priority", kind: "XV.PriorityDropdown" },
   //           { fieldName: "incident", fieldType: "relation", modelType: "XM.IncidentInfo" }
            ]
          },
          {
            title: "Schedule",
            fields: [
              { fieldName: "startDate", kind: "XV.DateWidget" },
              { fieldName: "dueDate", kind: "XV.DateWidget" },
              { fieldName: "assignDate", kind: "XV.DateWidget" },
              { fieldName: "completeDate", kind: "XV.DateWidget" }
            ]
          },
          {
            title: "Comments",
            location: "bottom",
            boxType: "grid",
            objectName: "comments",
            modelType: "XM.ToDoComment",
            customization: {
              disallowEdit: true,
              stampUser: true,
              stampDate: true
            },
            fields: [
              { fieldName: "createdBy" },
              { fieldName: "created", label: "date", kind: "XV.DateWidget" },
              { fieldName: "commentType", label: "type", kind: "XV.CommentTypeDropdown" },
              { fieldName: "text", label: "text" }
            ]
          }
        ],

        "XM.Opportunity": [
          {
            title: "Opportunity Info",
            fields: [
              { fieldName: "number" },
              { fieldName: "name" },
              { fieldName: "account", kind: "XV.AccountRelation" },
              { fieldName: "opportunityStage", kind: "XV.OpportunityStageDropdown" },
              { fieldName: "opportunityType", kind: "XV.OpportunityTypeDropdown" },
              { fieldName: "opportunitySource", kind: "XV.OpportunitySourceDropdown" }
            ]
          },
          {
            title: "Schedule",
            fields: [
              { fieldName: "startDate", kind: "XV.DateWidget" },
              { fieldName: "assignDate", kind: "XV.DateWidget" },
              { fieldName: "targetClose", kind: "XV.DateWidget" },
              { fieldName: "actualClose", kind: "XV.DateWidget" }
            ]
          },
          {
            title: "Notes",
            location: "bottom",
            fields: [
              { fieldName: "amount", fieldType: "number" },
              { fieldName: "probability", fieldType: "number" },
              { fieldName: "notes" }
            ]
          },
          {
            title: "Comments",
            location: "bottom",
            boxType: "grid",
            objectName: "comments",
            modelType: "XM.OpportunityComment",
            customization: {
              disallowEdit: true,
              stampUser: true,
              stampDate: true
            },
            fields: [
              { fieldName: "createdBy" },
              { fieldName: "created", label: "date", kind: "XV.DateWidget" },
              { fieldName: "commentType", label: "type", kind: "XV.CommentTypeDropdown" },
              { fieldName: "text", label: "text" }
            ]
          }
        ],

        "XM.Incident": [
          {
            title: "Incident Info",
            fields: [
              { fieldName: "number" },
              { fieldName: "description" },
              { fieldName: "notes" }
            ]
          },
          {
            title: "Relationships",
            fields: [
              { fieldName: "owner", kind: "XV.UserAccountRelation" },
  //            { fieldName: "contact", fieldType: "relation", modelType: "XM.ContactInfo" },
              { fieldName: "account", kind: "XV.AccountRelation" },
              { fieldName: "item", kind: "XV.ItemRelation" }
            ]
          },
          {
            title: "Status",
            fields: [
              { fieldName: "priority", kind: "XV.PriorityDropdown" }
            ]
          },
          {
            title: "History",
            boxType: "grid",
            objectName: "history",
            modelType: "XM.IncidentHistory", // XXX I could do without these if I could find where to introspect
            location: "bottom",
            customization: {
              disallowEdit: true,
              stampUser: true,
              stampDate: true
            },
            fields: [
              { fieldName: "createdBy" },
              { fieldName: "created", kind: "XV.DateWidget" },
              { fieldName: "description" }
            ]
          },

          {
            title: "Comments",
            location: "bottom",
            boxType: "grid",
            objectName: "comments",
            modelType: "XM.IncidentComment",
            customization: {
              disallowEdit: true,
              stampUser: true,
              stampDate: true
            },
            fields: [
              { fieldName: "createdBy" },
              { fieldName: "created", label: "date", kind: "XV.DateWidget" },
              { fieldName: "commentType", label: "type", kind: "XV.CommentTypeDropdown" },
              { fieldName: "text", label: "text" }
            ]
          }
        ],

        "XM.Project": [
          {
            title: "Project Info",
            fields: [
              { fieldName: "number", placeholder: "Enter the project number" },
              { fieldName: "name" },
              { fieldName: "notes" },
              { fieldName: "status", fieldType: "dropdown", collection: "XM.projectStatuses" }
            ]
          },
          {
            title: "Summary",
            location: "bottom",
            fields: [
              { fieldName: "budgetedHoursTotal", fieldType: "readonly" },
              { fieldName: "actualHoursTotal", fieldType: "readonly" },
              { fieldName: "actualHoursBalance", fieldType: "readonly" },
              { fieldName: "budgetedExpensesTotal", fieldType: "readonly" },
              { fieldName: "actualExpensesTotal", fieldType: "readonly" },
              { fieldName: "balanceExpensesTotal", fieldType: "readonly" }

            ]
          },
          {
            title: "Schedule",
            fields: [
              { fieldName: "owner", kind: "XV.UserAccountRelation" },
              { fieldName: "assignedTo", kind: "XV.UserAccountRelation" },
              { fieldName: "dueDate", kind: "XV.DateWidget" },
              { fieldName: "assignDate", kind: "XV.DateWidget" },
              { fieldName: "startDate", kind: "XV.DateWidget" },
              { fieldName: "completeDate", kind: "XV.DateWidget" }
            ]
          },
          {
            title: "Tasks",
            location: "bottom",
            boxType: "grid",
            objectName: "tasks",
            modelType: "XM.ProjectTask",
            fields: [
              { label: "number", fieldName: "number", width: "120" },
              { label: "name", fieldName: "name", width: "120" },
              { label: "notes", fieldName: "notes", width: "220" },
              { fieldName: "dueDate", kind: "XV.DateWidget", width: "100" },
              { label: "actualHours", fieldName: "actualHours", fieldType: "number", width: "40" },
              { label: "actualExpenses", fieldName: "actualExpenses", fieldType: "number", width: "40" }
            ]
          },
          {
            title: "Comments",
            location: "bottom",
            boxType: "grid",
            objectName: "comments",
            modelType: "XM.ProjectComment",
            customization: {
              disallowEdit: true,
              stampUser: true,
              stampDate: true
            },
            fields: [
              { fieldName: "createdBy" },
              { fieldName: "created", label: "date", kind: "XV.DateWidget" },
              { fieldName: "commentType", label: "type", kind: "XV.CommentTypeDropdown" },
              { fieldName: "text", label: "text" }
            ]
          }
        ]
      });

    },
    getFieldType: function (value) {
      if (!value) {
        return "onyx.Input";
      } else if (value === 'number') {
        return "XV.NumberWidget";
      } else if (value === 'dropdown') {
        return "XV.DropdownWidget";
      } else if (value === 'grid') {
        return "XV.GridWidget";
      } else if (value === 'readonly') {
        return "XV.ReadOnlyWidget";
      } else if (value === 'comments') {
        return "XV.CommentsWidget";
      } else if (value === 'address') {
        return "XV.AddressWidget";
      }
    },
    /**
     * Removes all the children from a parent object. This is a simple utility function.
     */
    removeAllChildren: function (parent) {
      // It's necessary to save the length into a variable or else the loop ends
      // prematurely. It's also necessary to delete the children always from the
      // 0 spot and not the i spot, because the target moves as you delete.
      var childrenCount = parent.children.length;
      for (var i = 0; i < childrenCount; i++) {
        parent.removeChild(parent.children[0]);
      }
    },
    /**
     * Removes all the components, controls, and children from a parent object.
     * This is a simple utility function.
     */
    removeAll: function (parent) {
      // It's necessary to save the length into a variable or else the loop ends
      // prematurely. It's also necessary to delete the children always from the
      // 0 spot and not the i spot, because the target moves as you delete.
      var controlCount = parent.controls.length,
        i;
      for (i = 0; i < controlCount; i++) {
        parent.removeControl(parent.controls[0]);
      }
      var childrenCount = parent.children.length;
      for (i = 0; i < childrenCount; i++) {
        parent.removeChild(parent.children[0]);
      }
    },

    // XXX this is all very magical
    // TODO: this doesn't need to be in XV, as it's not enyo-specific
    formatModelName: function (modelType) {
      return this.infoToMasterModelName(this.stripModelNamePrefix(modelType));
    },
    infoToMasterModelName: function (model) {
      if (model && model.indexOf("Info") >= 0) {
        model = model.substring(0, model.length - 4);
      }
      return model;
    },
    stripModelNamePrefix: function (model) {
      if (model && model.indexOf("XM") >= 0) {
        model = model.substring(3);
      }
      return model;
    }

  });

  XV.util = new XV.Util();

}());


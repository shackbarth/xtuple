/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true, enyo:true, _:true */
(function () {
  //"use strict";

  enyo.kind({
    name: "XV",
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
        // the key is uppercase because the model name is uppercase
        Account: [
          {
            title: "Account Info",
            fields: [
              { fieldName: "name" },
              { fieldName: "number" }
            ]
          },
          {
            title: "Contact", // I know this doesn't really merit its own box
            fields: [
              { fieldName: "primaryContact", fieldType: "relation" }
            ]
          }
        ],

        Contact: [
          {
            title: "Contact Info",
            fields: [
              { fieldName: "firstName" },
              { fieldName: "lastName" },
              { fieldName: "jobTitle" },
              { fieldName: "phone" },
              { fieldName: "primaryEmail" }
            ]
          },
          {
            title: "Account Info",
            fields: [
              { fieldName: "account", fieldType: "relation" }
            ]
          }
        ],

        ToDo: [
          {
            title: "ToDo Info",
            fields: [
              { fieldName: "name" },
              { fieldName: "description" },
              { fieldName: "status", fieldType: "dropdown", modelType: "XM.projectStatuses" },
              { fieldName: "priority", fieldType: "dropdown", modelType: "XM.priorities" },
              { fieldName: "incident", fieldType: "relation" }
            ]
          },
          {
            title: "Schedule",
            fields: [
              { fieldName: "startDate", fieldType: "date" },
              { fieldName: "dueDate", fieldType: "date" },
              { fieldName: "assignDate", fieldType: "date" },
              { fieldName: "completeDate", fieldType: "date" }
            ]
          }
        ],

        Opportunity: [
          {
            title: "Opportunity Info",
            fields: [
              { fieldName: "number" },
              { fieldName: "name" },
              { fieldName: "account", fieldType: "relation" },
              { fieldName: "amount", fieldType: "number" },
              { fieldName: "probability", fieldType: "number" }
            ]
          },
          {
            title: "Schedule",
            fields: [
              { fieldName: "startDate", fieldType: "date" },
              { fieldName: "assignDate", fieldType: "date" },
              { fieldName: "targetClose", fieldType: "date" },
              { fieldName: "actualClose", fieldType: "date" }
            ]
          },
          {
            title: "Notes",
            location: "bottom",
            fields: [
              { fieldName: "notes" }
            ]
          }
        ],

        Incident: [
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
              { fieldName: "owner", fieldType: "relation" },
              { fieldName: "contact", fieldType: "relation" },
              { fieldName: "account", fieldType: "relation" },
              { fieldName: "item", fieldType: "relation" }
            ]
          },
          {
            title: "History",
            boxType: "grid",
            location: "bottom",
            fields: [
              { fieldName: "description" },
              { fieldName: "created", fieldType: "readonly" },
              { fieldName: "createdBy", fieldType: "readonly" }
            ]
          }
        ],

        Project: [
          {
            title: "Project Info",
            fields: [
              { fieldName: "number", placeholder: "Enter the project number" },
              { fieldName: "name" },
              { fieldName: "notes" },
              { fieldName: "status", fieldType: "dropdown", modelType: "XM.projectStatuses" }
            ]
          },
          {
            title: "Summary",
            fields: [
              // FIXME: we can grab the field names but they eval to 0 wrongly
              { fieldName: "budgetedHoursTotal", fieldType: "number" },
              { fieldName: "actualHoursTotal", fieldType: "readonly" },
              { fieldName: "balanceHoursTotal", fieldType: "readonly" },
              { fieldName: "budgetedExpensesTotal", fieldType: "number" },
              { fieldName: "actualExpensesTotal", fieldType: "readonly" },
              { fieldName: "balanceExpensesTotal", fieldType: "readonly" }

            ]
          },

          {
            title: "Schedule",
            fields: [
              { fieldName: "owner", fieldType: "relation" },
              { fieldName: "assignedTo", fieldType: "relation" },
              { fieldName: "dueDate", fieldType: "date" },
              { fieldName: "assignDate", fieldType: "date" },
              { fieldName: "startDate", fieldType: "date" },
              { fieldName: "completeDate", fieldType: "date" }
            ]
          },
          {
            title: "Tasks",
            location: "bottom",
            boxType: "grid",
            fields: [
              { label: "number", fieldName: "number", width: "120" },
              { label: "name", fieldName: "name", width: "120" },
              { label: "notes", fieldName: "notes", width: "220" },
              { label: "actualHours", fieldName: "actualHours", fieldType: "number", width: "40" },
              { label: "actualExpenses", fieldName: "actualExpenses", fieldType: "number", width: "40" }
            ]
          }
        ]
      });


      this.getRelationalTitleFields = {};
      this.getRelationalTitleFields["XM.UserAccountInfo"] = "username";
      this.getRelationalTitleFields["XM.ContactInfo"] = "lastName";
      this.getRelationalTitleFields["XM.IncidentInfo"] = "number";
      this.getRelationalTitleFields["XM.AccountInfo"] = "name";
      this.getRelationalTitleFields["XM.ItemInfo"] = "number";

    },
    getFieldType: function (value) {
      if (!value) {
        return "onyx.Input";
      } else if (value === 'number') {
        return "XV.NumberWidget";
      } else if (value === 'date') {
        return "XV.DateWidget";
      } else if (value === 'relation') {
        return "XV.RelationalWidget";
      } else if (value === 'dropdown') {
        return "XV.DropdownWidget";
      } else if (value === 'grid') {
        return "XV.GridWidget";
      } else if (value === 'readonly') {
        return "XV.ReadOnlyWidget";
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
      }
  });
}());


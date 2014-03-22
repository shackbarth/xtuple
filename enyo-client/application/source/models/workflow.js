/*jshint indent:2, curly:true, eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, strict:true, trailing:true,
white:true*/
/*global XT:true, XM:true, _:true */

(function () {

  "use strict";
  XM.WorkflowMixin = {
    inheritWorkflowSource: function (sourceModel, characteristicClass, workflowClass) {
      var charProfile = sourceModel ? sourceModel.get("characteristics") : false,
        wfProfile = sourceModel ? sourceModel.get("workflow") : false,
        chars = this.get("characteristics"),
        workflow = this.get("workflow"),
        that = this,
        CharacteristicClass = XT.getObjectByName(characteristicClass),
        WorkflowClass = XT.getObjectByName(workflowClass),

        // Copies characteristics from project type to project
        copyCharProfile = function () {
          chars.reset();
          _.each(charProfile.models, function (model) {
            var assignment = new CharacteristicClass(null, {isNew: true});
            assignment.set("characteristic", model.get("characteristic"));
            assignment.set("value", model.get("value"));
            chars.add(assignment);
          });
        },

        // Copies workflow from project type to project
        copyWfProfile = function () {
          var map = {};
          workflow.reset();
          _.each(wfProfile.models, function (model) {
            var item = new WorkflowClass(null, {isNew: true}),
              id = XT.generateUUID(),
              dueOffset = model.get("dueOffset"),
              startOffset = model.get("startOffset"),
              dueDate,
              startDate;

            map[model.id] = id;

            if (model.get("dueSet")) {
              dueDate = XT.date.today();
              dueDate.setDate(dueDate.getDate() + model.get("dueOffset"));
            }

            if (model.get("startSet")) {
              startDate = XT.date.today();
              startDate.setDate(startDate.getDate() + model.get("startOffset"));
            }

            item.set({
              uuid: id,
              name: model.get("name"),
              description: model.get("description"),
              status: model.get("status"),
              workflowType: model.get("workflowType"),
              priority: model.get("priority"),
              startDate: startDate,
              dueDate: dueDate,
              owner: model.get("owner") || item.get("owner"),
              assignedTo: model.get("assignedTo") || item.get("assignedTo"),
              sequence: model.get("sequence"),
              notes: model.get("notes"),
              completedParentStatus : model.get("completedParentStatus"),
              deferredParentStatus : model.get("deferredParentStatus"),
              completedSuccessors: model.get("completedSuccessors"),
              deferredSuccessors: model.get("deferredSuccessors")
            });
            workflow.add(item);
          });

          // Reiterate through new collection and fix successor mappings
          _.each(_.keys(map), function (uuid) {
            _.each(workflow.models, function (model) {
              var successors = model.get("completedSuccessors");
              if (_.isString(successors)) {
                model.set("completedSuccessors", successors.replace(uuid, map[uuid]));
              }
              successors = model.get("deferredSuccessors");
              if (_.isString(successors)) {
                model.set("deferredSuccessors", successors.replace(uuid, map[uuid]));
              }
            });
          });
        },
        handleWfProfile = function () {
          // Handle copying workflow
          if (wfProfile && wfProfile.length) {
            if (!workflow.length) {
              copyWfProfile();
            } else {
              that.notify("_copyWorkflow?".loc(), {
                type: XM.Model.QUESTION,
                callback: function (response) {
                  if (response.answer) {
                    copyWfProfile();
                  }
                }
              });
            }
          }
        };

      // Handle copying characteristics
      if (charProfile && charProfile.length) {
        if (!chars.length) {
          copyCharProfile();
        } else {
          this.notify("_copyCharacteristics?".loc(), {
            type: XM.Model.QUESTION,
            callback: function (response) {
              if (response.answer) {
                copyCharProfile();
              }
              handleWfProfile();
            }
          });
          return;
        }
      }
      handleWfProfile();
    }
  };

}());

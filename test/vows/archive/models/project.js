/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XM:true, XV:true, module:true, require:true, assert: true, _:true, clearTimeout:true, setTimeout:true */

(function () {
  "use strict";

  var vows = require("vows"),
    assert = require("assert"),
    _ = require("underscore"),
    zombieAuth = require("../../mocha/lib/zombie_auth"),
    crud = require('../lib/crud'),
    dueDate = new Date(),
    commentType;

  dueDate.setDate(dueDate.getDate() + 30);

  var data = {};

  data.createHash = {
    number: 'crud_project',
    name: 'Test CRUD Project operations',
    dueDate: dueDate
  };

  data.updateHash = {
    name: 'Test Update Project operation'
  };

  vows.describe('XM.Project CRUD test').addBatch({
    'We can INITIALIZE a Project Model ': {
      topic: function () {
        var that = this,
          callback = function () {
            data.model = new XM.Project();
            that.callback(null, data);
          };
        zombieAuth.loadApp(callback);
      },
      'Verify the record type is XM.Project': function (data) {
        assert.equal(data.model.recordType, "XM.Project");
      }
    }
  }).addBatch({
    'We can CREATE a Project Model ': crud.create(data, {
      '-> Set values of a Project': {
        topic: function (data) {
          data.model.set(data.createHash);
          return data;
        },
        'Verify the Last Error is null': function (data) {
          assert.isNull(data.model.lastError);
        },
        '-> Save the Project': crud.save(data)
      }
    })
  }).addBatch({
    'We can CHECK PARAMETERS of a Project Model ': {
      topic: function () {
        return data;
      },
      'Verify the Last Error is null': function (model) {
        assert.isTrue(_.isEmpty(model.lastError));
      },
      '-> `requiredAttributes of a Project': {
        topic: function () {
          return data;
        },
        'Name is required in a Project': function (data) {
          assert.isTrue(_.contains(data.model.requiredAttributes, "name"));
        },
        'Due date is required in a Project': function (data) {
          assert.isTrue(_.contains(data.model.requiredAttributes, "dueDate"));
        }
      }
    }
  }).addBatch({
    'We can READ a Project Model': {
      topic: function () {
        return data;
      },
      'Project Number is `CRUD_TEST`': function (data) {
        assert.equal(data.model.get('number'), data.createHash.number.toUpperCase()); // Was capitalized!
      },
      'Project Name is `Test CRUD operations`': function (data) {
        assert.equal(data.model.get('name'), data.createHash.name);
      }
    }
  }).addBatch({
    'We can UPDATE a Project Model ': crud.update(data, {
      '-> Set values of a Project': {
        topic: function () {
          data.model.set(data.updateHash);
          return data;
        },
        'Verify the Last Error is null': function (data) {
          assert.isNull(data.model.lastError);
        },
        'Project Name is "Test Update operation"': function (data) {
          assert.equal(data.model.get('name'), data.updateHash.name);
        },
        'Project Status is `READY_DIRTY`': function (data) {
          assert.equal(data.model.getStatusString(), 'READY_DIRTY');
        },
        '-> Commit a Project': crud.save(data)
      }
    })
  }).addBatch({
    'We can COMMENT to a Project ': {
      topic: function () {
        return data;
      },
      'Verify the Last Error is null': function (data) {
        assert.isNull(data.model.lastError);
      },
      '-> add comment to a Project': {
        topic: function (data) {
          var comment = new XM.ProjectComment();

          // Must add comment to the project first then initialize
          data.model.get('comments').add(comment);
          comment.initialize(null, {isNew: true});
          this.callback(null, comment);
        },
        'Verify the Project Comment Status is READY_NEW': function (comment) {
          assert.equal(comment.getStatusString(), 'READY_NEW');
        },
        'Verify the Project Comment id is valid': function (comment) {
          assert.isString(comment.id);
        },
        '-> Set and Save comment to a Project': {
          topic: function (comment) {
            var that = this,
              timeoutId,
              model = comment.getParent(), // Model is now Project
              callback = function () {
                var status = model.getStatus(),
                  K = XM.Model;
                if (status === K.READY_CLEAN) {
                  clearTimeout(timeoutId);
                  model.off('statusChange', callback);
                  that.callback(null, model);
                }
              };

            // Get the comment type id from it's name.
            commentType = _.find(XM.commentTypes.models, function (item) {
              return item.get('name') === 'General';
            });

            comment.set({
              commentType: commentType,
              text: 'My first comment'
            });
            model.on('statusChange', callback);
            model.save();

            // If we don't hear back, keep going
            timeoutId = setTimeout(function () {
              that.callback(null, model);
            }, crud.waitTime);
          },
          'Verify Project Status is READY_CLEAN': function (model) {
            assert.equal(model.getStatusString(), 'READY_CLEAN');
          },
          'Verify the Last Error is null': function (model) {
            assert.isNull(model.lastError);
          }
        }
      }
    }
  })
  .addBatch({
    'We can have a TASK to a Project Model': {
      topic: function () {
        return data;
      },
      'Verify the Last Error is null': function (data) {
        assert.isNull(data.model.lastError);
      },
      '-> add task to Project Model': {
        topic: function (data) {
          var task = new XM.ProjectTask();

          // Must add task to the project first then initialize
          data.model.get('tasks').add(task);
          task.initialize(null, {isNew: true});
          this.callback(null, task);
        },
        'Verify the Project Task Status is READY_NEW': function (task) {
          assert.equal(task.getStatusString(), 'READY_NEW');
        },
        'Verify the Project Task id is valid': function (task) {
          assert.isString(task.id);
        },
        '-> Set and Save task to Project': {
          topic: function (task) {
            var that = this,
              timeoutId,
              model = task.getParent(), // Model is now Project
              callback = function () {
                var status = model.getStatus(),
                  K = XM.Model;
                if (status === K.READY_CLEAN) {
                  clearTimeout(timeoutId);
                  data.model.off('statusChange', callback);
                  that.callback(null, model);
                }
              };
            task.set({
              number: '01',
              name: 'Test Task',
              dueDate: dueDate
            });
            model.on('statusChange', callback);
            model.save();

            // If we don't hear back, keep going
            timeoutId = setTimeout(function () {
              that.callback(null, model);
            }, crud.waitTime);
          },
          'Verify the Project Status is READY_CLEAN': function (model) {
            assert.equal(model.getStatusString(), 'READY_CLEAN');
          },
          'Verify the Project Last Error is null': function (model) {
            assert.isNull(model.lastError);
          }
        }
      }
    }
  }).addBatch({
    'We can DESTROY a Project Model': crud.destroy(data)
  }).export(module);

}());

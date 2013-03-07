/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XM:true, XV:true, module:true, require:true, assert: true, _:true, clearTimeout:true, setTimeout:true */

(function () {
  "use strict";

  var vows = require("vows"),
    assert = require("assert"),
    _ = require("underscore"),
    zombieAuth = require("../lib/zombie_auth"),
    crud = require('../lib/crud'),
    dueDate = new Date(),
    commentType;

  dueDate.setDate(dueDate.getDate() + 30);

  var data = {};
  
  data.createHash = {
    number: 'crud_test',
    name: 'Test CRUD operations',
    dueDate: dueDate
  };

  data.updateHash = {
    name: 'Test Update operation'
  };

  vows.describe('XM.Project CRUD test').addBatch({
    'INITIALIZE ': {
      topic: function () {
        var that = this,
          callback = function () {
            data.model = new XM.Project();
            that.callback(null, data);
          };
        zombieAuth.loadApp(callback);
      },
      'The record type is XM.Project': function (data) {
        assert.equal(data.model.recordType, "XM.Project");
      }
    }
  }).addBatch({
    'CREATE ': crud.create(data, {
      '-> Set values': {
        topic: function (data) {
          data.model.set(data.createHash);
          return data;
        },
        'Last Error is null': function (data) {
          assert.isNull(data.model.lastError);
        },
        '-> Save': crud.save(data)
      }
    })
  }).addBatch({
    'CHECKS PARAMETERS ': {
      topic: function () {
        return data;
      },
      'Last Error is null': function (model) {
        assert.isTrue(_.isEmpty(model.lastError));
      },
      '-> `requiredAttributes`': {
        topic: function () {
          return data;
        },
        'Name is required': function (data) {
          assert.isTrue(_.contains(data.model.requiredAttributes, "name"));
        },
        'Due date is required': function (data) {
          assert.isTrue(_.contains(data.model.requiredAttributes, "dueDate"));
        }
      }
    }
  }).addBatch({
    'READ': {
      topic: function () {
        return data;
      },
      'Number is `CRUD_TEST`': function (data) {
        assert.equal(data.model.get('number'), 'CRUD_TEST'); // Was capitalized!
      },
      'Name is `Test CRUD operations`': function (data) {
        assert.equal(data.model.get('name'), 'Test CRUD operations');
      }
    }
  }).addBatch({
    'UPDATE ': crud.update(data, {
      '-> Set values': {
        topic: function () {
          data.model.set(data.updateHash);
          return data;
        },
        'Last Error is null': function (data) {
          assert.isNull(data.model.lastError);
        },
        'Name is "Test Update operation"': function (data) {
          assert.equal(data.model.get('name'), 'Test Update operation');
        },
        'Status is `READY_DIRTY`': function (data) {
          assert.equal(data.model.getStatusString(), 'READY_DIRTY');
        },
        '-> Commit': crud.save(data)
      }
    })
  }).addBatch({
    'COMMENT ': {
      topic: function () {
        return data;
      },
      'Last Error is null': function (data) {
        assert.isNull(data.model.lastError);
      },
      '-> add comment': {
        topic: function (data) {
          var that = this,
            timeoutId,
            comment = new XM.ProjectComment(),
            callback = function () {
              clearTimeout(timeoutId);
              comment.off('change:id', callback);
              that.callback(null, comment);
            };

          // Must add comment to the project first then initialize
          data.model.get('comments').add(comment);
          comment.on('change:id', callback);
          comment.initialize(null, {isNew: true});

          // If we don't hear back, keep going
          timeoutId = setTimeout(function () {
            that.callback(null, comment);
          }, 5000); // five seconds
        },
        'Comment Status is READY_NEW': function (comment) {
          assert.equal(comment.getStatusString(), 'READY_NEW');
        },
        'Comment id is valid': function (comment) {
          assert.isNumber(comment.id);
        },
        '-> Set and Save comment': {
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
          'Status is READY_CLEAN': function (model) {
            assert.equal(model.getStatusString(), 'READY_CLEAN');
          },
          'Last Error is null': function (model) {
            assert.isNull(model.lastError);
          }
        }
      }
    }
  })
  .addBatch({
    'TASK': {
      topic: function () {
        return data;
      },
      'Last Error is null': function (data) {
        assert.isNull(data.model.lastError);
      },
      '-> add task': {
        topic: function (data) {
          var that = this,
            timeoutId,
            task = new XM.ProjectTask(),
            callback = function () {
              clearTimeout(timeoutId);
              task.off('change:id', callback);
              that.callback(null, task);
            };

          // Must add task to the project first then initialize
          data.model.get('tasks').add(task);
          task.on('change:id', callback);
          task.initialize(null, {isNew: true});

          // If we don't hear back, keep going
          timeoutId = setTimeout(function () {
            that.callback(null, task);
          }, 5000); // five seconds
        },
        'Task Status is READY_NEW': function (task) {
          assert.equal(task.getStatusString(), 'READY_NEW');
        },
        'Task id is valid': function (task) {
          assert.isNumber(task.id);
        },
        '-> Set and Save task': {
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
          'Status is READY_CLEAN': function (model) {
            assert.equal(model.getStatusString(), 'READY_CLEAN');
          },
          'Last Error is null': function (model) {
            assert.isNull(model.lastError);
          }
        }
      }
    }
  }).addBatch({
    'DESTROY': crud.destroy(data)
  }).export(module);
  
}());

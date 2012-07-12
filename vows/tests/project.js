/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XVOWS:true, XT:true, XM:true, _:true, setTimeout:true,
  clearTimeout:true, vows:true, module:true, assert:true, console:true */

(function () {
  "use strict";

  var createHash,
    updateHash,
    dueDate = new Date(),
    model = new XM.Project();

  dueDate.setDate(dueDate.getDate() + 30);

  createHash = {
    number: 'crud_test',
    name: 'Test CRUD operations',
    dueDate: dueDate
  };

  updateHash = {
    name: 'Test Update operation'
  };

  vows.describe('XM.Project CRUD test').addBatch({
    'CREATE ': XVOWS.create(model, {
      '-> Set values': {
        topic: function (model) {
          model.set(createHash);
          return model;
        },
        'Last Error is null': function (model) {
          assert.isNull(model.lastError);
        },
        '-> Save': XVOWS.save(model)
      }
    })
  }).addBatch({
    'CHECKS PARAMETERS ': {
      topic: function () {
        return model;
      },
      'Last Error is null': function (model) {
        assert.isNull(model.lastError);
      },
      '-> `requiredAttributes`': {
        topic: function () {
          return model;
        },
        'Name is required': function (model) {
          assert.isTrue(_.contains(model.requiredAttributes, "name"));
        },
        'Due date is required': function (model) {
          assert.isTrue(_.contains(model.requiredAttributes, "dueDate"));
        }
      }
    }
  }).addBatch({
    'READ': {
      topic: function () {
        return model;
      },
      'Number is `CRUD_TEST`': function (model) {
        assert.equal(model.get('number'), 'CRUD_TEST'); // Was capitalized!
      },
      'Name is `Test CRUD operations`': function (model) {
        assert.equal(model.get('name'), 'Test CRUD operations');
      }
    }
  }).addBatch({
    'UPDATE ': XVOWS.update(model, {
      '-> Set values': {
        topic: function () {
          model.set(updateHash);
          return model;
        },
        'Last Error is null': function (model) {
          assert.isNull(model.lastError);
        },
        'Name is "Test Update operation"': function (model) {
          assert.equal(model.get('name'), 'Test Update operation');
        },
        'Status is `READY_DIRTY`': function (model) {
          assert.equal(model.getStatusString(), 'READY_DIRTY');
        },
        '-> Commit': XVOWS.save(model)
      }
    })
  }).addBatch({
    'CHILDREN ': {
      topic: function () {
        return model;
      },
      'Last Error is null': function (model) {
        assert.isNull(model.lastError);
      },
      '-> add task': {
        topic: function (model) {
          var that = this,
            timeoutId,
            task = new XM.ProjectTask(),
            callback = function () {
              clearTimeout(timeoutId);
              task.off('change:guid', callback);
              that.callback(null, task);
            };

          // Must add task to the project first then initialize
          model.get('tasks').add(task);
          task.on('change:guid', callback);
          task.initialize(null, {isNew: true});

          // If we don't hear back, keep going
          timeoutId = setTimeout(function () {
            that.callback(null, model);
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
                  K = XT.Model;
                if (status === K.READY_CLEAN) {
                  clearTimeout(timeoutId);
                  model.off('statusChange', callback);
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
            }, XVOWS.wait);
          },
          'Status is READY_CLEAN': function (model) {
            assert.equal(model.getStatusString(), 'READY_CLEAN');
          }
        }
      }
    }
  }).addBatch({
    'DESTROY': XVOWS.destroy(model, {
      'FINISH XM.Address': function () {
        XVOWS.next();
      }
    })
  }).run();
}());

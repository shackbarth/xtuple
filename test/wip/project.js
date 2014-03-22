/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, exports:true, describe:true, it:true, require:true */

(function () {
  "use strict";

  var crud = require('../lib/crud'),
    assert = require('chai').assert,
    expect = require('chai').expect,
    _ = require("underscore"),
    dueDate = new Date(),
    commentType,
    model,
    comment,
    task;

  dueDate.setDate(dueDate.getDate() + 30);

  var data = {
    recordType: "XM.Project",
    autoTestAttributes: true,
    createHash : {
      number: 'crud_project' + Math.random(),
      name: 'Test CRUD Project operations',
      dueDate: dueDate
    },
    updateHash: {
      name: 'Test Update Project operation'
    }
  },
    timeout = 120 * 1000;

  describe('Project CRUD Test', function () {
    this.timeout(20 * 1000);
    it('should perform all the crud operations', function (done) {
      crud.runAllCrud(data, done);
    });
  });
// TODO: reimplement:
/*
    describe('When adding a comment to a project', function () {
      it('should initialize a comment', function () {
        comment = new XM.ProjectComment();
      // Must add comment to the project first then initialize
        data.model.get('comments').add(comment);
        comment.initialize(null, {isNew: true});
        expect(comment).to.exist;
        assert.equal(comment.recordType, 'XM.ProjectComment', 'INIT Value should be XM.ProjectComment');
        assert.equal(comment.getStatusString(), 'READY_NEW', 'Project Comment Status is READY_NEW');
      });
      it('should Set and Save comment to a Project', function () {
        var that = this,
          timeoutId;
        model = comment.getParent(); // Model is now Project
        var callback = function () {
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
      });
    });
    describe('When adding a Task to a Project', function () {
      it('Should initialize a task', function () {
        task = new XM.ProjectTask();
        // Must add task to the project first then initialize
        data.model.get('tasks').add(task);
        task.initialize(null, {isNew: true});
        expect(task).to.exist;
        assert.equal(task.recordType, 'XM.ProjectTask', 'INIT Value should be XM.ProjectTask');
        assert.equal(comment.getStatusString(), 'READY_NEW', 'Project Task Status is READY_NEW');
      });
      it('Should set and save a task', function () {
        var that = this,
          timeoutId;
        model = task.getParent(); // Model is now Project
        var callback = function () {
          var status = model.getStatus(),
          K = XM.Model;
          if (status === K.READY_CLEAN) {
            clearTimeout(timeoutId);
            data.model.off('statusChange', callback);
            that.callback(null, model);
          }
        };
        assert.equal(model.recordType, 'XM.Project', 'model is of type XM.Project');
        task.set({
          number: '01',
          name: 'Test Task',
          dueDate: dueDate
        });
        model.on('statusChange', callback);
        model.save();
      });
    });
  */
}());

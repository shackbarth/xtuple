/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, process:true, module:true, require:true */

var crud = require('../lib/crud'),
  assert = require('chai').assert,
  expect = require('chai').expect,
  _ = require("underscore"),
  zombieAuth = require('../lib/zombie_auth'),
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
    number: 'crud_project',
    name: 'Test CRUD Project operations',
    dueDate: dueDate
  },
  updateHash: {
    name: 'Test Update Project operation'
  }
},
  timeout = 120 * 1000;

describe('Project CRUD Test', function () {
  before(function (done) {
    this.timeout(timeout);
    zombieAuth.loadApp(done);
  });
  it('Should be able to initialize XM.Project Model', function () {
    data.model = new XM.Project();
    expect(data.model).to.exist;
    assert.equal(data.model.recordType, 'XM.Project', 'INIT Value should be XM.Project');
  });

  it('should create an XM.Project Model', function (done) {
    data.model.set(data.createHash);
    crud.save(data);
    done();
  });

  it('should have required Attributes', function () {
    expect(data.model.requiredAttributes).to.contain('name');
    expect(data.model.requiredAttributes).to.contain('dueDate');
  });
  
  it('should read an XM.Project Model', function () {
    assert.equal(data.model.get('number'), data.createHash.number, 'Project number is equal');
    assert.equal(data.model.get('name'), data.createHash.name, 'Project name is equal');
    assert.equal(data.model.get('dueDate'), data.createHash.dueDate, 'Project Due date is equal');
  });

  it('should update an XM.Project Model', function (done) {
    data.model.set(data.updateHash);
    crud.save(data);
    assert.equal(data.model.get('name'), data.updateHash.name, 'Model Code UPDATE Value is equal');
    done();
  });
  
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
  it('should delete an XM.Project Model', function (done) {
    crud.destroy(data);
    done();
  });
});
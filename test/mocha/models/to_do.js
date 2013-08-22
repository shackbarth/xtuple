/*jshint trailing:true, white:true, indent:2, strict:true, curly:true,
  immed:true, eqeqeq:true, forin:true, latedef:true,
  newcap:true, noarg:true, undef:true */
/*global XT:true, XM:true, XV:true, exports:true, describe:true, it:true, require:true */

(function () {
  "use strict";

  var crud = require('../lib/crud'),
    assert = require("chai").assert,
    data = {
      recordType: "XM.ToDo",
      autoTestAttributes: true,
      verbose: true,
      createHash: {
        name: "ToDo Name" + Math.random(),
        dueDate: new Date()
      },
      beforeSaveActions: [{
        it: 'adds a comment',
        action: function (data, next) {
          var comment = new XM.ToDoComment(),
            comments = [];

          console.log("preparing to add a comment");

          comment.on('change:' + comment.idAttribute, function () {
            // callback to verify uuid
            comment.set("commentType", "General");
            comments.push(comment);
            data.model.on('change:comments', function () {
              // callback to verify comments changed
              next();
            })
            data.model.set({comments: comments});
          });
          comment.initialize(null, {isNew: true});
        }
      }],
      beforeDeleteActions: [{
        it: 'checks that comments was added',
        action: function (data, next) {
          var comments = data.model.get("comments") || [];
          // verify that there is a comment
          assert.isTrue(comments.length > 0);
          next();
        }
      }],
      updateHash: {
        name: "Updated"
      }
    };

  describe('ToDo CRUD Test', function () {
    crud.runAllCrud(data);
  });
}());

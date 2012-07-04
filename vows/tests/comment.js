/*jshint trailing:true, white:true, indent:2, strict:true, curly:true, plusplus:true
  immed:true, eqeqeq:true, forin:true, latedef:true, newcap:true, noarg:true, undef:true */
/*jslint bitwise: true, nomen: true, indent:2 */
/*global XVOWS:true, XT:true, XM:true, _:true, setTimeout:true, clearTimeout:true, vows:true, assert:true */


(function () {
  "use strict";
	var createHash, updateHash;

	createHash = {
		name: 'comment test',
      	commentsEditable: true,
      	order: 1
	};
	updateHash = {
		name: 'comment updated',
		commentsEditable: false,
		order: 2
	};
  /**
    @class

    @extends XT.Model
  */
  
  vows.describe('XM.Comment CRUD test').addBatch({
  	'CREATE': XVOWS.create('XM.CommentType', {
      '-> Set values': {
        topic: function (model) {
          model.set(createHash);
          return model;
        },
        'Last Error is null': function (model) {
          assert.isNull(model.lastError);
        },
        'Name is required': function (model) {
          assert.isTrue(_.contains(model.requiredAttributes, "name"));
        },
        'CommentsEditable is required': function(model) {
        	assert.isTrue(_.contains(model.requiredAttributes, "commentsEditable"));
        },
        'Order is required': function( model ) {
        	assert.isTrue(_.contains(model.requiredAttributes, "order"));
        },
        '-> Save and Read': XVOWS.save({
        	'Name is comment test': function(model) {
        		assert.equal(model.get('name'), createHash.name);
        	},
        	'Comment is Editable ': function( model ) {
        		assert.equal(model.get('commentsEditable'), createHash.commentsEditable );        		
        	},
        	'Order is 1 ': function(model) {
        		assert.equal(model.get('order'), createHash.order);
        	},
        	'-> UPDATE': {
        		topic: function(model) {
        			model.set(updateHash);
        			return model;
        		},
        		'Last Error is null': function( model ){
        			assert.isNull(model.lastError);
        		},
        		'Name is "comment updated" ': function( model ){
        			assert.equal(model.get('name'), updateHash.name);

        		},
        		'Status is READ_DIRTY': function( model ) {
        			assert.equal( model.getStatusString(), 'READ_DIRTY');
        		},
        		'Commit':XVOWS.save({
        			'Name is "comment updated"': function(model){
        				assert.equal(model.get('name'), updateHash.name);
        			},
        		
        		'-> DESTROY': XVOWS.destroy({
        			'FINISH XM.CommentType': function() {
        				XVOWS.next();
        			}
        		})
        		})
        	}

        })

	  }    		
	})
  }).run();

}());
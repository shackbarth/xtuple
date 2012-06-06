// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ¬©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_project');
sc_require('mixins/project_mixin');


/**
  @class

  @extends XM.Document
  @extends XM.Documents
*/
XM.Project = XM.Document.extend(XM._Project, XM.Documents, XM.ProjectMixin,
/** @scope XM.Project.prototype */ {	

  // .................................................
  // CALCULATED PROPERTIES
  //

  number: SC.Record.attr(Number, {
    toType: function(record, key, value) {
      if(value) return value.toUpperCase();
    }
  }),

  //..................................................
  // METHODS
  //
  
  copy: function() { 
    return XM.Project.copy(this,number,offset); 
  },

  //..................................................
  // OBSERVERS
  //

  projectStatusDidChange: function() {
    var status = this.get('status'),
        K = XM.Project,
        projectStatus = this.get('projectStatus');
    if (this.isDirty()) {
      if (projectStatus === K.IN_PROCESS &&
          !this.get('assignDate')) {
        this.set('assignDate', XT.DateTime.create());
      } else if (projectStatus === K.COMPLETED &&
                 !this.get('completeDate')) {
        this.set('completeDate', XT.DateTime.create());
      }
    }
  }.observes('projectStatus')

});

/**
A utility function to copy an project.

@param {XM.Project} project
@return {XM.Project} copy of the project
*/
XM.Project.copy = function(project,number,offset) {
  if (!SC.kindOf(project, XM.Project)) return NO;

  var store = project.get('store'),
  hash = project.get('attributes');

  for (var i = 0; i < hash.tasks.length; i++) { 
    if (offset > 0) {
      hash.tasks[i].dueDate = hash.tasks[i].dueDate.advance({day: + offset});
    }
    hash.tasks[i].projectTaskStatus = 'P';
    delete hash.tasks[i].assignDate;
  } 
  hash.projectStatus = 'P';
  hash.number = number;
  if (offset > 0) {
    hash.dueDate = hash.dueDate.advance({day: + offset});
  }
  delete hash.startDate;
  delete hash.guid;
  return store.createRecord(XM.Project, hash).normalize();
};

XM.Project.mixin( /** @scope XM.Project */ {

/**
  Concept status for project.
  
  @static
  @constant
  @type String
  @default P
*/
  CONCEPT: 'P',

/**
  In-Process status for project.
  
  @static
  @constant
  @type String
  @default O
*/
  IN_PROCESS: 'O',

/**
  Completed status for project.
  @static
  @constant
  @type String
  @default C
*/
  COMPLETED: 'C'
  
});

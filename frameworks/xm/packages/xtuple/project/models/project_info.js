// ==========================================================================
// Project:   xTuple Postbooks - Business Management System Framework        
// Copyright: ©2012 OpenMFG LLC, d/b/a xTuple                             
// ==========================================================================

/*globals XM */

sc_require('mixins/_project_info');
sc_require('mixins/project_mixin');

/**
  @class

  @extends XT.Record
*/
XM.ProjectInfo = XT.Record.extend(XM._ProjectInfo, XM.ProjectMixin,
  /** @scope XM.ProjectInfo.prototype */ {

  // .................................................
  // CALCULATED PROPERTIES
  //
  
  /**
    Returns the status as a localized string.
    
    @type String
  */
  projectStatusString: function() {
    var projectStatus = this.get('projectStatus'),
        K = XM.Project, ret;
    switch (projectStatus) {
      case K.CONCEPT:
        ret = "_concept".loc();
        break;
      case K.IN_PROCESS:
        ret = "_inProcess".loc();
        break;
      case K.COMPLETED:
        ret = "_completed".loc();
        break;
      default:
        ret = "_error".loc();
    }
    return ret;
  }.property('projectStatus').cacheable()

  //..................................................
  // METHODS
  //

  //..................................................
  // OBSERVERS
  //

});


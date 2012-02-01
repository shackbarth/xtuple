// ==========================================================================
// Project:   xTuple PostBooks - xTuple Business Management Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XM */

sc_require('xbos/comment/models/comment');

/** @class

  Comment for Incident.

  @extends XM.Comment
*/
XM.IncidentComment = XM.Comment.extend(
/** @scope XM.IncidentComment.prototype */ {

  className: 'XM.IncidentComment',

  /** 
  @type XM.Incident
  */
  incident: SC.Record.toOne('XM.Incident', {
    inverse:  'comments',
    isMaster: NO,
  }),

});


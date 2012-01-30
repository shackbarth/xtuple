// ==========================================================================
// Project:   xTuple PostBooks - xTuple Business Management Framework
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

/** @class

  Comment for Site.

  @extends XM.Comment
*/
XM.SiteComment = XM.Comment.extend(
/** @scope XM.SiteComment.prototype */ {

  className: 'XM.SiteComment',

  /**
  @type XM.Site
  */
  site: SC.Record.toOne('XM.Site', {
    inverse:  'comments',
    isMaster: NO,
  }),
  
});


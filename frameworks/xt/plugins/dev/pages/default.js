
/*globals Plugin */

/** @class

*/
Plugin.pages.dev = Plugin.Page.create(
  /** @scope Plugin.pages.dev.prototype */ {

  /** @property
    Every Plugin has a Page and each of those pages
    has some type of default view (as set in the core
    object for the Plugin). All subsequent views are
    implemented as part of this default view. This 
    default view is the only view that should extend
    Plugin.View as this is designed to be a base view
    and automatically handles appropriate append/remove
    animations and other efficiency issues.
  */
  defaultView: Plugin.View.design({
  
    classNames: "dev".w(),
    childViews: "devLabel".w(),

    devLabel: SC.LabelView.design({
      layout: { height: 30, width: 200, centerX: 0, centerY: 0 },
      value: "SOME DEV VALUE?"
      }) // devLabel
        
  })

}) ;

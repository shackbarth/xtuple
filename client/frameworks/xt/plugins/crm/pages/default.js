
/*globals Crm */

/** @namespace

*/
Plugin.pages.crm = Plugin.Page.create(
  /** @scope Plugin.pages.crm.prototype */ {

  defaultView: Plugin.View.design({
    classNames: "crm-container".w(),
    childViews: "crmLabel".w(),
    crmLabel: SC.LabelView.design({
      layout: { height: 30, width: 200, centerX: 0, centerY: 0 },
      value: "SOME CRM VALUE!?!??!" 

      }) // crmLabel
      }) // defaultView

}) ;

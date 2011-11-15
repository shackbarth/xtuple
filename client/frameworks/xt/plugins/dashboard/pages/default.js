
/*globals Plugin */

/** @class
  
*/
Plugin.pages.dashboard = Plugin.Page.create(
  /** @scope Plugin.pages.dashboard.prototype */ {

  defaultView: Plugin.View.design({

    // let it be known that this is merely a testing ground
    // for a few various things that would need to be dynamic
    // in terms of the content and their availability
    // they are fixed here because those mechanisms are
    // not currently available to use
    classNames: "dashboard".w(),
    childViews: "pluginMenu ".w(),
    
    pluginMenu: XT.AnimationView.design({
      layout: { height: 50, width: 240, top: 50, centerX: 0 },
      classNames: "plugin-menu".w(),
      childViews: "crm accounting sales".w(),

    crm: XT.NavOption.design({
      layout: { left: 0, top: 0, bottom: 0, width: 80 },
      classNames: "inset-rounded-border left".w(),
      value: "CRM",
      icon: "crm-icon"
      }), // crm

    accounting: XT.NavOption.design({
      layout: { left: 80, top: 0, bottom: 0, width: 80 },
      value: "Accounting",
      icon: "accounting-icon"
      }), // accounting

    sales: XT.NavOption.design({
      layout: { left: 160, top: 0, bottom: 0, width: 80 },
      classNames: "inset-rounded-border right".w(),
      value: "Sales",
      icon: "sales-icon"
      }) // sales
      }), // pluginMenu


    // bottomMenu: XT.View.design()
  })

}) ;


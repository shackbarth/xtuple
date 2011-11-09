
/*globals Login */

/** @class


*/
Dashboard.DefaultPane = XT.MainPane.extend(
  /** @scope Dashboard.DefaultPane.prototype */ {


  // let it be known that this is merely a testing ground
  // for a few various things that would need to be dynamic
  // in terms of the content and their availability
  // they are fixed here because those mechanisms are
  // not currently available to use
  classNames: "dashboard".w(),
  // childViews: "topMenu widgets bottomMenu".w(), 
  childViews: "topMenu".w(),
  
  topMenu: XT.View.design({
    layout: { height: 50, width: 280, top: 150, right: 150 }, 
    classNames: "top-menu".w(),
    childViews: "container".w(),

  container: XT.View.design({
    classNames: "container".w(),
    childViews: "crm accounting sales".w(),

  crm: XT.NavOption.design({
    classNames: "inset-rounded-border left".w(),
    value: "CRM",
    icon: "crm-icon"
    }), // crm

  accounting: XT.NavOption.design({
    value: "Accounting",
    icon: "accounting-icon"
    }), // accounting

  sales: XT.NavOption.design({
    classNames: "inset-rounded-border right".w(),
    value: "Sales",
    icon: "sales-icon"
    }) // sales
    }) // container
    }), // topMenu

  // widgets: XT.View.design({
  //   childViews: "crmWidget salesWidget accountingWidget".w(),
  //   layout: { left: 100, right: 100, height: 500, centerY: 0 },
  //   classNames: "dash-widgets-container".w(),

  // crmWidget: XT.Widget.design({
  //   layout: { height: 300, width: 200, centerX: -200, top: 0 },
  //   classNames: "inset-rounded-border left".w()
  //   }), // crmWidget

  // salesWidget: XT.Widget.design({
  //   layout: { height: 300, width: 200, centerX: 0, top: 0 }
  //   }), // salesWidget

  // accountingWidget: XT.Widget.design({
  //   layout: { height: 300, width: 200, centerX: 200, top: 0 },
  //   classNames: "inset-rounded-border right".w()
  //   }), // accountingWidget

  //   }), // widgets

  // bottomMenu: XT.View.design()

}) ;


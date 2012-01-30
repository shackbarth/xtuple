
/*globals Crm */

/** @namespace

*/
Plugin.pages.crm = Plugin.Page.create(
  /** @scope Plugin.pages.crm.prototype */ {

  defaultView: Plugin.View.design({
    classNames: "crm-container".w(),
    childViews: "contacts".w(),
      
      contacts: XT.Table.design({
        query: XM.Contact,
        rowTemplate: Contact.TableRow,
      })


      }) // defaultView

}) ;

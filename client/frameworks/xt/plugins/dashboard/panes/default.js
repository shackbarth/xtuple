
/*globals Login */

/** @class


*/
Dashboard.DefaultPane = XT.MainPane.extend(
  /** @scope Dashboard.DefaultPane.prototype */ {

  childViews: "pluginList".w(), 

  pluginList: SC.ListView.design({
    layout: { width: 200, height: 200, centerY: 0, centerX: 0 },
    classNames: "dash-plugin-list-container".w(),
    exampleView: SC.ListItemView.extend({
      classNames: "dash-plugin-list-item-view".w(),
      doubleClick: function() {
        XT.PluginManager.fetch(this.get("content"));
        return YES;
      }
    }),
    content: [
      "crm"
    ]
    }) // pluginList

}) ;


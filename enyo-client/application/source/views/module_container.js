/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XV:true, XM:true, _:true, enyo:true*/

(function () {

  enyo.kind({
    name: "XV.Postbooks",
    kind: "XV.ModuleContainer",
    modules: [
      {name: "welcome", label: "_welcome".loc(), hasSubmenu: false,
        panels: [
        {name: "welcomePage",
          tag: "iframe",
          style: "border: none;"}
      ]},
      {name: "setup", label: "_setup".loc(), sortAlpha: true, panels: [
        {name: "configureList", kind: "XV.ConfigurationsList", toggleSelected: false},
        {name: "userAccountList", kind: "XV.UserAccountList", toggleSelected: false},
        {name: "userAccountRoleList", kind: "XV.UserAccountRoleList"}
      ]}
    ],
    activate: function () {
      // Look for welcome page and set to what settings say to
      var children = this.$.navigator.$.contentPanels.children,
        welcome = _.findWhere(children, {name: "welcomePage"}),
        url = XT.session.settings.get("WelcomePage");
      if (welcome && url) {
        welcome.setAttributes({src: url});
      }
      this.inherited(arguments);
    }

  });

}());

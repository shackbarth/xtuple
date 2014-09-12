/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XV:true, XM:true, _:true, enyo:true, window:true */

(function () {

  enyo.kind({
    name: "XV.Postbooks",
    kind: "XV.ModuleContainer",
    handlers: {
      onNoBaseCurr: "handleNoBaseCurr"
    },
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
        url = XT.session.settings.get("MobileWelcomePage"),
        params = "?client=mobileweb" +
          //"&username=" + XT.session.details.id +
          "&hostname=" + window.location.hostname +
          "&organization=" + XT.session.details.organization +
          "&version=" + XT.session.config.version;

      if (welcome && url) {
        welcome.setAttributes({src: url + params});
      }
      this.inherited(arguments);
    },
    handleNoBaseCurr: function () {
      var that = this,
        wsCallback = function (model) {
          // If workspace was not saved, prompt again.
          if (model) {
            return;
          } else {
            that.handleNoBaseCurr();
          }
        };

      this.notify(this, {
        type: XM.Model.QUESTION,
        message: "_selectBaseCurrency".loc(),
        yesLabel: "_setBaseCurrToUSD".loc(),
        noLabel: "_createBaseCurr".loc(),
        callback: function (response) {
          if (!response.answer) {
            // User doesn't want to use USD, open Currency workspace
            that.addWorkspace(null, {
              workspace: "XV.CurrencyWorkspace",
              attributes: {
                isBase: true
              },
              callback: wsCallback
            });

          // User confirms that they want to use USD, open USD workspace, set isBase
          } else if (response.answer) {
            that.addWorkspace(null, {
              workspace: "XV.CurrencyWorkspace",
              id: "USD",
              attributes: {
                isBase: true
              },
              callback: wsCallback,
              success: function () {
                this.$.isBase.setValue(true);
              }
            });
          }
        }
      });
    }
  });
}());

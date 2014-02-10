/*jshint node:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, Globalize:true, enyo:true, _:true */

(function () {
	/**
   @class Use to create an IconButton decorated with a Tooltip.
   @name XV.IconButton
   */
  enyo.kind(
    /** @lends XV.IconButton# */ {
    name: "XV.IconButton",
    kind: "onyx.TooltipDecorator",
    published: {
      src: "",
      content: ""
    },
    style: "margin: 0;",
    handlers: {
      ontap: "tapped"
    },
    autoDismiss: true, // when true, tooltip is automatically dismissed when user stops hovering
    components: [
      {name: "iconButton", kind: "onyx.IconButton", showing: true}
      // This is causing problems in lists where tooltip shows up as the originator all the time
      // So you can't click on any row. Being able to use the app. is more important that tooltips
      // for now.
      //{name: "toolTip", kind: "onyx.Tooltip"}
    ],

    create: function () {
      this.inherited(arguments);
      this.srcChanged();
      this.contentChanged();
    },

    srcChanged: function () {
      this.$.iconButton.setSrc(this.src);
    },

    contentChanged: function () {
      //this.$.toolTip.setContent(this.content);
    },

    tapped: function (inSender, inEvent) {
      // Prevent sending event twice
      if (inSender.name === 'toolTip') { return true; }
    },

    setActive: function () {
      this.$.iconButton.setActive(this.active);
    },

    setDisabled: function () {
      this.$.iconButton.setDisabled(this.disabled);
    }
  });

}());

/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, Globalize:true, enyo:true, _:true */

(function() {
	/**
	 @class Use to create an IconButton decorated with a Tooltip.
	 @name XV.IconButton
	 */
	enyo.kind( /** @lends XV.IconButton# */ {
		name: "XV.IconButton",
		kind: "onyx.TooltipDecorator",
		published: {
			src: "",
			content: ""
		},
		style: "margin: 0;",
		components: [
			{name: "iconButton", kind: "onyx.IconButton", 
				showing: true},
			{name: "toolTip", kind: "onyx.Tooltip"}
		],

		create: function() {
			this.inherited(arguments);
			this.srcChanged();
			this.contentChanged();
		},

		srcChanged: function() {
			this.$.iconButton.setSrc(this.src);
		},

		contentChanged: function() {
			this.$.toolTip.setContent(this.content);
		},

		setActive: function() {
			this.$.iconButton.setActive(this.active);
		},

		setDisabled: function() {
			this.$.iconButton.setDisabled(this.disabled);
		}
	});
	
}());

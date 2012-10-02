/*
Copyright © 2011-2012, GlitchTech Science
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * @name GTS.DividerDrawer
 * @author Matthew Schott <glitchtechscience@gmail.com>
 *
 * Mimics Enyo 1.0 DividerDrawer functionality.
 *
 * @class
 * @version 2.0 (2012/07/12)
 * @requires onyx 2.0-beta5
 * @see http://enyojs.com
 */
enyo.kind({
	name: "GTS.DividerDrawer",
	classes: "gts-DividerDrawer",

	published: {
		/** @lends GTS.LazyList# */

		/**
		 * caption of bar
		 * @type string
		 * @default ""
		 */
		caption: "",

		/**
		 * initial state of toggle
		 * @type boolean
		 * @default true
		 */
		open: true
	},

	/**
	 * @public
	 * Events sent by control
	 */
	events: {
		/** @lends GTS.DividerDrawer# */

		/**
		 * Selected item changed
		 * @event
		 * @param {Object} inSender	Event's sender
		 * @param {Object} inEvent	Event parameters
		 */
		onChange: ""
	},

	/**
	 * @private
	 * @type Array
	 * Components of the control
	 */
	components: [
		{
			name: "base",
			kind: "enyo.FittableColumns",
			noStretch: true,
			ontap: "toggleOpen",
			components: [
				{
					classes: "end-cap"
				}, {
					name: "caption",
					classes: "caption"
				}, {
					classes: "bar",
					fit: true
				}, {
					name: "switch",
					kind: "onyx.Checkbox",

					onchange: "toggleOpen",
					classes: "toggle"
				}, {
					classes: "end-cap bar"
				}
			]
		}, {
			name: "client",
			kind: "onyx.Drawer"
		}
	],

	/**
	 * @private
	 * List of events to handle
	 */
	handlers: {
		onEnd: "animatorEnd"
	},

	/**
	 * @protected
	 * @function
	 * @name GTS.DividerDrawer#rendered
	 *
	 * Called by Enyo when UI is rendered.
	 */
	rendered: function() {

		this.inherited( arguments );

		this.captionChanged();
		this.openChanged();
	},

	/**
	 * @protected
	 * @function
	 * @name GTS.DividerDrawer#reflow
	 *
	 * Updates spacing on bar without resize event.
	 */
	reflow: function() {

		this.$['base'].reflow();
	},

	/**
	 * @private
	 * @function
	 * @name GTS.DividerDrawer#openChanged
	 *
	 * Called by Enyo when this.open is changed by host.
	 * Opens/Closes the drawer and updates UI.
	 */
	openChanged: function() {

		this.$['switch'].setValue( this.open );
		this.$['client'].setOpen( this.$['switch'].getValue() );

		this.reflow();
	},

	/**
	 * @private
	 * @function
	 * @name GTS.DividerDrawer#captionChanged
	 *
	 * Called by Enyo when this.open is changed by host.
	 * Updates UI for caption.
	 */
	captionChanged: function() {

		this.$['caption'].setContent( this.caption );
		this.$['caption'].applyStyle("display", this.caption ? "" : "none");
	},

	/**
	 * @private
	 * @function
	 * @name GTS.DividerDrawer#toggleOpen
	 *
	 * Handles toggling event.
	 *
	 * @param {Object} inSender	Event's sender
	 * @param {Object} inEvent	Event parameters
	 */
	toggleOpen: function( inSender, inEvent ) {

		if( inSender.name === "switch" ) {

			this.open = this.$['switch'].getValue();
		} else {

			this.open = !this.$['switch'].getValue();
		}

		this.$['switch'].setValue( this.open );

		this.openChanged();

		return true;
	},

	animatorEnd: function() {

		if( this.open ) {

			this.$['client'].applyStyle( "height", null );
		}
	}
});

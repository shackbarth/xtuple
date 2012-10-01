/*
Copyright © 2011-2012, GlitchTech Science
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * @name GTS.ToggleBar
 * @author Matthew Schott <glitchtechscience@gmail.com>
 *
 * Standardized ToggleButton kind. Displays ToggleButton in an Item row kind. Text is on the left, toggle is on the right.
 *
 * @class
 * @version 2.0 (2012/07/12)
 * @requires onyx 2.0-beta5
 * @see http://enyojs.com
 */
enyo.kind({
	name: "GTS.ToggleBar",
	kind: "onyx.Item",

	classes: "gts-ToggleBar",

	published: {
		/** @lends GTS.LazyList# */

		/**
		 * label of toggle
		 * @type string
		 * @default "Toggle Button"
		 */
		label: "Toggle Button",

		/**
		 * secondary label of toggle
		 * @type string
		 * @default ""
		 */
		sublabel: "",

		/**
		 * text for true label
		 * @type string
		 * @default ""
		 */
		onContent: "On",

		/**
		 * text for false label
		 * @type string
		 * @default ""
		 */
		offContent: "Off",

		/**
		 * initial state of toggle
		 * @type boolean
		 * @default ""
		 */
		value: false
	},

	/**
	 * @public
	 * Events sent by control
	 */
	events: {
		/** @lends GTS.ToggleBar# */

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
			components: [
				{
					fit: true,
					components: [
						{
							name: "label"
						}, {
							name: "sublabel",
							style: "font-size: 75%;"
						}
					]
				}, {
					name: "switch",
					kind: "onyx.ToggleButton",
					ontap: "switchToggled",
					onChange: "doChange"
				}
			]
		}
	],

	/**
	 * @private
	 * List of events to handle
	 */
	handlers: {
		ontap: "barTapped"
	},

	/**
	 * @protected
	 * @function
	 * @name GTS.ToggleBar#rendered
	 *
	 * Called by Enyo when UI is rendered.
	 */
	rendered: function() {

		this.inherited( arguments );

		this.labelChanged();
		this.sublabelChanged();

		this.onContentChanged();
		this.offContentChanged();

		this.valueChanged();
	},

	/**
	 * @protected
	 * @function
	 * @name GTS.ToggleBar#reflow
	 *
	 * Updates spacing on bar without resize event.
	 */
	reflow: function() {

		this.$['base'].reflow();
	},

	barTapped: function() {

		this.$['switch'].setValue( !this.getValue() );
		this.doChange( this.$['switch'] );
	},

	/**
	 * @private
	 * @function
	 * @name GTS.ToggleBar#switchToggled
	 *
	 * Called by Enyo when the toggle button is tapped.
	 * return true prevents event from chaining
	 *
	 * @return boolean true
	 */
	switchToggled: function( inSender, inEvent ) {

		return true;
	},

	/**
	 * @private
	 * @function
	 * @name GTS.ToggleBar#labelChanged
	 *
	 * Called by Enyo when this.label is changed by host.
	 * Updates the label display.
	 */
	labelChanged: function() {

		this.$['label'].setContent( this.label );
	},

	/**
	 * @private
	 * @function
	 * @name GTS.ToggleBar#sublabelChanged
	 *
	 * Called by Enyo when this.sublabel is changed by host.
	 * Updates the sublabel display.
	 */
	sublabelChanged: function() {

		this.$['sublabel'].setContent( this.sublabel );
	},

	/**
	 * @private
	 * @function
	 * @name GTS.ToggleBar#onContentChanged
	 *
	 * Called by Enyo when this.onContent is changed by host.
	 * Updates the togglebutt onContent.
	 */
	onContentChanged: function() {

		this.$['switch'].setOnContent( this.onContent );
	},

	/**
	 * @private
	 * @function
	 * @name GTS.ToggleBar#offContentChanged
	 *
	 * Called by Enyo when this.offContent is changed by host.
	 * Updates the togglebutt offContent.
	 */
	offContentChanged: function() {

		this.$['switch'].setOffContent( this.offContent );
	},

	/**
	 * @private
	 * @function
	 * @name GTS.ToggleBar#valueChanged
	 *
	 * Called by Enyo when this.value is changed by host.
	 * Updates the togglebutt value. Resizes bar.
	 */
	valueChanged: function() {

		this.$['switch'].setValue( this.value );
		this.reflow();
	},

	/**
	 * @private
	 * @function
	 * @name GTS.ToggleBar#getValue
	 *
	 * Returns value of toggle button
	 *
	 * @returns {boolean}
	 */
	getValue: function() {

		return this.$['switch'].getValue();
	}
});

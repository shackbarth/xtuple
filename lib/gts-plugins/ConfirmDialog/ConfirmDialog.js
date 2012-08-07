/*
Copyright © 2012, GlitchTech Science
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

	Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION ) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE ) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * GTS.ConfirmDialog
 *
 * Enyo style confirmation dialog
 *
 * @author Matthew Schott <glitchtechscience@gmail.com>
 *
 * @requies Enyo (https://github.com/enyojs/enyo )
 * @requires Onyx
 * @extends onyx.Popup
 */
enyo.kind({
	name: "gts.ConfirmDialog",
	kind: "onyx.Popup",

	classes: "gts-confirm-dialog",

	baseButtonClasses: "",

	/** @public */
	published: {
		/** @lends GTS.ConfirmDialog# */

		/**
		 * Dialog title to display
		 * @type string
		 * @default ""
		 */
		title: "",

		/**
		 * Dialog message to display
		 * @type string
		 * @default ""
		 */
		message: "",

		/**
		 * Confirmation text
		 * @type string
		 * @default "confirm"
		 */
		confirmText: "confirm",

		/**
		 * Confirmation button class
		 * @type string
		 * @default "confirm"
		 */
		confirmClass: "onyx-affirmative",

		/**
		 * Abort text. Set blank to not display
		 * @type string
		 * @default "cancel"
		 */
		cancelText: "cancel",

		/**
		 * Abort button class
		 * @type string
		 * @default "confirm"
		 */
		cancelClass: "onyx-negative",

		/**
		 * Set to true to automatically center the popup in the middle of the viewport.
		 * @type boolean
		 * @default true
		 * @see http://enyojs.com/api/#enyo.Popup::published
		 */
		centered: true,

		/**
		 * Set to true to render the popup in a floating layer outside of other controls. This can be used to guarantee that the popup will be shown on top of other controls.
		 * @type boolean
		 * @default true
		 * @see http://enyojs.com/api/#enyo.Popup::published
		 */
		floating: true,

		/**
		 * Set to true to prevent controls outside the popup from receiving events while the popup is showing.
		 * @type boolean
		 * @default true
		 * @see http://enyojs.com/api/#enyo.Popup::published
		 */
		modal: true,

		/**
		 * Determines whether or not to display a scrim. Only displays scrims when floating.
		 * @type boolean
		 * @default true
		 * @see http://enyojs.com/api/#enyo.Popup::published
		 */
		scrim: true,

		/**
		 * Class name to apply to the scrim. Be aware that the scrim is a singleton and you will be modifying the scrim instance used for other popups.
		 * @type string
		 * @default "onyx-scrim-translucent"
		 * @see http://enyojs.com/api/#enyo.Popup::published
		 */
		scrimclasses: "onyx-scrim-translucent",

		/**
		 * By default, the popup will hide when the user taps outside it or presses ESC. Set to false to prevent this behavior.
		 * @type boolean
		 * @default false
		 * @see http://enyojs.com/api/#enyo.Popup::published
		 */
		autoDismiss: false
	},

	/**
	 * @public
	 * Events sent by control
	 */
	events: {
		/** @lends GTS.ConfirmDialog# */

		/**
		 * Cancel button pressed
		 * @event
		 * @param {Object} inSender	Event's sender
		 * @param {Object} inEvent	{}
		 */
		onCancel: "",

		/**
		 * Confirm button pressed
		 * @event
		 * @param {Object} inSender	Event's sender
		 * @param {Object} inEvent	{}
		 */
		onConfirm: ""
	},

	components: [
		{
			name: "title",
			classes: "title-wrapper"
		},
		{
			name: "message",
			classes: "message-wrapper"
		}, {
			classes: "button-wrapper",
			components: [
				{
					name: "cancelButton",
					kind: "onyx.Button",

					ontap: "cancel",
					showing: false
				}, {
					name: "confirmButton",
					kind: "onyx.Button",

					ontap: "confirm"
				}
			]
		}
	],

	/**
	 * @protected
	 * @function
	 * @name GTS.ConfirmDialog#rendered
	 *
	 * Called by Enyo when UI is rendered.
	 */
	rendered: function() {

		this.inherited( arguments );

		this.baseButtonClasses = this.$['confirmButton'].getClassAttribute();

		this.titleChanged();
		this.messageChanged();
		this.confirmTextChanged();
		this.cancelTextChanged();

		this.confirmClassChanged();
		this.cancelClassChanged();
	},

	/**
	 * @private
	 * @function
	 * @name GTS.ConfirmDialog#titleChanged
	 *
	 * Called by Enyo when this.title is changed by host.
	 */
	titleChanged: function() {

		this.$['title'].setContent( this.title );
	},

	/**
	 * @private
	 * @function
	 * @name GTS.ConfirmDialog#messageChanged
	 *
	 * Called by Enyo when this.message is changed by host.
	 */
	messageChanged: function() {

		this.$['message'].setContent( this.message );
	},

	/**
	 * @private
	 * @function
	 * @name GTS.ConfirmDialog#confirmTextChanged
	 *
	 * Called by Enyo when this.confirmText is changed by host.
	 */
	confirmTextChanged: function() {

		this.$['confirmButton'].setContent( this.confirmText );
	},

	/**
	 * @private
	 * @function
	 * @name GTS.ConfirmDialog#confirmClassChanged
	 *
	 * Called by Enyo when this.confirmClass is changed by host.
	 */
	confirmClassChanged: function() {

		this.$['confirmButton'].setClassAttribute( this.baseButtonClasses + " " + this.confirmClass );
	},

	/**
	 * @private
	 * @function
	 * @name GTS.ConfirmDialog#cancelTextChanged
	 *
	 * Called by Enyo when this.cancelText is changed by host.
	 */
	cancelTextChanged: function() {

		this.$['cancelButton'].setContent( this.cancelText );

		if( this.cancelText.length === 0 ) {

			this.$['cancelButton'].hide();
		} else {

			this.$['cancelButton'].show();
		}
	},

	/**
	 * @private
	 * @function
	 * @name GTS.ConfirmDialog#cancelClassChanged
	 *
	 * Called by Enyo when this.confirmText is changed by host.
	 */
	cancelClassChanged: function() {

		this.$['cancelButton'].setClassAttribute( this.baseButtonClasses + " " + this.cancelClass );
	},

	/**
	 * @private
	 * @function
	 * @name GTS.ConfirmDialog#cancel
	 *
	 * Cancel button tapped. Hides dialog and notifies host.
	 *
	 * @param {object} inSender	The event sender
	 * @param {object} inEvent	Event object
	 */
	cancel: function( inSender, inEvent ) {

		this.doCancel( inEvent );
		this.hide();
	},

	/**
	 * @private
	 * @function
	 * @name GTS.ConfirmDialog#confirm
	 *
	 * Confirm button tapped. Hides dialog and notifies host.
	 *
	 * @param {object} inSender	The event sender
	 * @param {object} inEvent	Event object
	 */
	confirm: function( inSender, inEvent ) {

		this.doConfirm( inEvent );
		this.hide();
	}
});

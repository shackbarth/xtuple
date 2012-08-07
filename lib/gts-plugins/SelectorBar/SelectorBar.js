/*
Copyright © 2011-2012, GlitchTech Science
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * @name GTS.SelectorBar
 * @author Matthew Schott <glitchtechscience@gmail.com>
 *
 * Selector that takes up an entire row. Does not look like a giant button.
 *
 * @class
 * @version 2.0 (2012/07/12)
 * @requires onyx 2.0-beta5
 * @see http://enyojs.com
 */
enyo.kind({
	name: "GTS.SelectorBar",
	kind: "onyx.Item",

	classes: "gts-selectorBar",

	published: {
		/** @lends GTS.SelectorBar# */

		/**
		 * label of drop down
		 * @type string
		 * @default "Select One"
		 */
		label: "Select One",

		/**
		 * Note about dropdown, sits under it
		 * @type string
		 * @default ""
		 */
		sublabel: "",

		/**
		 * Choices for drop down. Must be in component format
		 * @type object[]
		 * @default "Select One"
		 */
		choices: [],

		/**
		 * Currently selected item in drop down
		 * @type string,int
		 * @default First item in choices list
		 */
		value: "",

		/**
		 * Is user input disabled?
		 * @type boolean
		 * @default false
		 */
		disabled: false
	},

	/**
	 * @public
	 * Events sent by control
	 */
	events: {
		/** @lends GTS.SelectorBar# */

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
					name: "valueIcon",
					kind: "enyo.Image",
					style: "margin-right: 1em;"
				}, {
					name: "valueDisplay",
					fit: true
				}, {
					kind: "onyx.MenuDecorator",
					components: [
						{
							name: "labelButton",
							kind: "onyx.Button",
							classes: "label arrow"
						}, {
							name: "menu",
							kind: "onyx.Menu",
							floating: true,

							onSelect: "selectionChanged",

							components: []
						}
					]
				}
			]
		}, {
			name: "sublabel",
			classes: "sub-label"
		}
	],

	/**
	 * @protected
	 * @function
	 * @name GTS.SelectorBar#rendered
	 *
	 * Called by Enyo when UI is rendered.
	 */
	rendered: function() {

		this.inherited( arguments );

		this.labelChanged();
		this.sublabelChanged();
		this.choicesChanged();
		this.valueChanged();
		this.disabledChanged();
	},

	/**
	 * @protected
	 * @function
	 * @name GTS.SelectorBar#reflow
	 *
	 * Updates spacing on bar without resize event.
	 */
	reflow: function() {

		this.$['base'].reflow();
	},

	/**
	 * @private
	 * @function
	 * @name GTS.SelectorBar#labelChanged
	 *
	 * Called by Enyo when this.label is changed by host.
	 * Updates the label display.
	 */
	labelChanged: function() {

		this.$['labelButton'].setContent( this.label );
	},

	/**
	 * @private
	 * @function
	 * @name GTS.SelectorBar#sublabelChanged
	 *
	 * Called by Enyo when this.sublabel is changed by host.
	 * Updates the sublabel display.
	 */
	sublabelChanged: function() {

		this.$['sublabel'].setContent( this.sublabel );

		if( this.sublabel === "" ) {

			this.$['sublabel'].hide();
		} else {

			this.$['sublabel'].show();
		}
	},

	/**
	 * @private
	 * @function
	 * @name GTS.SelectorBar#choicesChanged
	 *
	 * Called by Enyo when this.choices is changed by host.
	 * Updates menu choices; Calls UI updater.
	 */
	choicesChanged: function() {

		this.$['menu'].destroyClientControls();
		this.$['menu'].createComponents( this.choices );
		this.valueChanged();
	},

	/**
	 * @private
	 * @function
	 * @name GTS.SelectorBar#disabledChanged
	 *
	 * Called by Enyo when this.disabled is changed by host.
	 * Disables button when this.disabled is true
	 */
	disabledChanged: function() {

		this.$['labelButton'].setDisabled( this.disabled );
	},

	/**
	 * @private
	 * @function
	 * @name GTS.SelectorBar#setValue
	 *
	 * Updates value. Calls UI updater.
	 *
	 * @param {string,int} newValue	New value to be set
	 */
	setValue: function( newValue ) {

		this.value = newValue;

		this.valueChanged();
	},

	/**
	 * @private
	 * @function
	 * @name GTS.SelectorBar#valueChanged
	 *
	 * Updates UI
	 */
	valueChanged: function() {

		if( this.choices.length === 0 ) {

			return;
		}

		if( this.value === null ) {

			this.value = this._getValue( this.choices[0] );
		}

		for( var i = 0; i < this.choices.length; i++ ) {

			if( this.value === this._getValue( this.choices[i] ) ) {

				this.$['valueDisplay'].setContent( this.choices[i]['content'] );

				if( this.choices[i]['icon'] ) {

					this.$['valueIcon'].setSrc( this.choices[i]['icon'] );
					this.$['valueIcon'].show();
				} else {

					this.$['valueIcon'].hide();
				}

				break;
			}
		}

		this.reflow();
	},

	/**
	 * @private
	 * @function
	 * @name GTS.SelectorBar#_getValue
	 *
	 * Helper function for valueChanged. Determines if choice has a value property.
	 * Returns string of value or content
	 *
	 * @param {object} ojb	object from this.choices array
	 * @returns {string}
	 */
	_getValue: function( obj ) {

		return obj.hasOwnProperty( "value" ) ? obj['value'] : obj['content'];
	},

	/**
	 * @private
	 * @function
	 * @name GTS.SelectorBar#selectionChanged
	 *
	 * Handles menu selection; Calls host function for onChange
	 *
	 * @param {object} inSender	The event sender
	 * @param {object} inEvent	Event object
	 */
	selectionChanged: function( inSender, inEvent ) {

		this.value = inEvent.selected.hasOwnProperty( "value" ) ? inEvent.selected.value : inEvent.content;

		this.valueChanged();

		this.doChange( inEvent );

		return true;
	}
});

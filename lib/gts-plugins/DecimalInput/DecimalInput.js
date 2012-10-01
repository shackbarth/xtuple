/*
Copyright © 2012, GlitchTech Science
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

	Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * GTS.DecimalInput
 *
 * Input specifically for currency or other decimal number formats.
 *
 * @author Matthew Schott <glitchtechscience@gmail.com>
 *
 * @requies Enyo (https://github.com/enyojs/enyo)
 * @extends Input
 */
enyo.kind({
	name: "GTS.DecimalInput",
	kind: "Input",

	classes: "gts-decimal-input",

	deleteAction: false,
	oldType: "",

	/** @public */
	published: {
		/** @lends GTS.DecimalInput# */

		/**
		 * Input type. This should be number unless issues with browser occur.
		 * Browsers that put a pair of toggle buttons should not be set to "number"
		 * and use the atm function. They might will fail when using the button.
		 * This is due to coding limitations involving the step attribute.
		 * @type string
		 * @default "number"
		 */
		type: "number",

		/**
		 * Hint text for input
		 * @type string
		 * @default "0.00"
		 */
		placeholder: "0.00",

		/**
		 * Minimum numerical value for the input
		 * @type number
		 * @default 0
		 */
		min: 0,

		/**
		 * Maximum numerical value for the input. False for no limit
		 * @type number|boolean
		 * @default false
		 */
		max: false,

		/**
		 * Set the HTML5 input attribute step (using the precision parameter).
		 * Should be set to true when this.type === "number"
		 * @type boolean
		 * @default true
		 */
		step: true,

		/**
		 * Number of decimal points to format to. Adjusts the step option.
		 * @type integer
		 * @default 2
		 */
		precision: 2,

		/**
		 * ATM Mode. Auto formats the number as if one is typing on an atm keypad.
		 * Relies on precision.
		 * @type boolean
		 * @default false
		 */
		atm: false,

		/**
		 * Select all of the content on focus.
		 * @type boolean
		 * @default false
		 */
		selectAllOnFocus: false
	},

	/**
	 * @private
	 * List of events to handle
	 */
	handlers: {
		onkeypress: "filterInput",

		oninput: "inputValueUpdated",
		onchange: "inputValueChanged",

		onfocus: "inputFocused",
		onblur: "inputBlurred"
	},

	/**
	 * @protected
	 * @function
	 * @name GTS.DecimalInput#rendered
	 *
	 * Called by Enyo when UI is rendered.
	 */
	rendered: function() {

		this.inherited( arguments );

		this.minChanged();
		this.maxChanged();
		this.precisionChanged();
		this.inputBlurred();
	},

	/**
	 * @private
	 * @function
	 * @name GTS.DecimalInput#minChanged
	 *
	 * Called by Enyo when this.min is changed by host.
	 */
	minChanged: function() {

		this.setAttribute( "min", this.min );
	},

	/**
	 * @private
	 * @function
	 * @name GTS.DecimalInput#maxChanged
	 *
	 * Called by Enyo when this.max is changed by host.
	 */
	maxChanged: function() {

		if( this.max !== false ) {

			this.setAttribute( "max", this.max );
		}
	},

	/**
	 * @private
	 * @function
	 * @name GTS.DecimalInput#stepChanged
	 *
	 * Called by Enyo when this.step is changed by host.
	 */
	stepChanged: function() {

		this.precisionChanged();
	},

	/**
	 * @private
	 * @function
	 * @name GTS.DecimalInput#precisionChanged
	 *
	 * Called by Enyo when this.precision is changed by host.
	 */
	precisionChanged: function() {

		if( !this.step ) {

			this.setAttribute( "step", null );
			return;
		}

		var step = "0.";

		if( this.precision <= 0 ) {

			step = "1";
		} else {

			for( var i = 0; i < this.precision - 1; i++ ) {

				step += "0";
			}

			step += "1";
		}

		this.setAttribute( "step", step );
	},

	/**
	 * @private
	 * @function
	 * @name GTS.DecimalInput#filterInput
	 *
	 * Backup for the HTML5 type=number filter.
	 * Restricts allowed characters to 0-9 and decimal point.
	 *
	 * @param {object} inSender	The event sender
	 * @param {object} inEvent	Event object
	 */
	filterInput: function( inSender, inEvent ) {

		if( !( inEvent.keyCode >= 48 && inEvent.keyCode <= 57 ) && inEvent.keyCode !== 46 ) {

			inEvent.preventDefault();
		}
	},

	/**
	 * @private
	 * @function
	 * @name GTS.DecimalInput#inputValueUpdated
	 *
	 * Handles input being typed in.
	 * If this.atm is true, will format number
	 *
	 * @param {object} inSender	The event sender
	 * @param {object} inEvent	Event object
	 */
	inputValueUpdated: function( inSender, inEvent ) {

		if( this.atm ) {

			var amount = this.getValue();

			//Remove non-ints & leading zeroes
			amount = amount.replace( /[^0-9]/g, "" );
			amount = amount.replace( /^0*/, "" );

			//Set to this.precision
			amount = ( parseInt( amount ) / Math.pow( 10, this.precision ) );

			if( isNaN( amount ) ) {

				amount = 0;
			}

			amount = amount.toFixed( this.precision );

			this.setValue( amount );

			var node = this.hasNode();

			//Cursor must be at end for ATM mode
			if( node ) {

				var len = amount.length;

				enyo.asyncMethod( node, node.setSelectionRange, len, len );
			}
		}
	},

	/**
	 * @private
	 * @function
	 * @name GTS.DecimalInput#inputValueChanged
	 *
	 * Handles input onChange event. Backup validation for max and min.
	 *
	 * @param {object} inSender	The event sender
	 * @param {object} inEvent	Event object
	 */
	inputValueChanged: function( inSender, inEvent ) {

		var amount = this.getValueAsNumber();

		if( this.max !== false && amount > this.max ) {

			amount = this.max;
		} else if( amount < this.min ) {

			amount = this.min;
		}

		this.setValue( amount );
	},

	/**
	 * @private
	 * @function
	 * @name GTS.DecimalInput#inputFocused
	 *
	 * Handles input onfocus event. Sets type to number if that is what it was.
	 * Also selects all content of input if this.selectAllOnFocus is true.
	 *
	 * @param {object} inSender	The event sender
	 * @param {object} inEvent	Event object
	 */
	inputFocused: function( inSender, inEvent ) {

		if( this.oldType === "number" ) {

			this.setType( this.oldType );
		}

		if( this.selectAllOnFocus && this.hasNode() ) {

			this.hasNode().setSelectionRange( 0, this.getValue().length );
		}
	},

	/**
	 * @private
	 * @function
	 * @name GTS.DecimalInput#inputBlurred
	 *
	 * Handles input onblur event. Sets type to text if it was number.
	 *
	 * @param {object} inSender	The event sender
	 * @param {object} inEvent	Event object
	 */
	inputBlurred: function( inSender, inEvent ) {

		this.oldType = this.type;

		if( this.oldType === "number" ) {

			this.setType( "text" );
		}
	},

	/**
	 * @public
	 * @function
	 * @name GTS.DecimalInput#getValueAsNumber
	 *
	 * Returns the current value as a number. If NaN, returns zero.
	 *
	 * @return number
	 */
	getValueAsNumber: function() {

		//Strip out non-numeric characters and trim the string
		var val = this.getValue().replace( /^\s\s*/, "" ).replace( /\s\s*$/, "" ).replace( /[^0-9\.]/g, "" );

		//Convert to a float
		val = parseFloat( val, 10 ).toFixed( this.precision );

		//Confirm it is a number
		if( isNaN( val ) ) {

			val = 0;
		}

		return val;
	}
});

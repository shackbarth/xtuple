/*
Copyright © 2012, GlitchTech Science
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * GTS.TimePicker
 *
 * Time picker for EnyoJS.
 * When the selected date changes, the onChange event is called with the current values as a date object.
 * Using getValue or setValue will get or set the datetime with a Date object.
 *
 * @author Matthew Schott <glitchtechscience@gmail.com>
 *
 * @requies Enyo (https://github.com/enyojs/enyo)
 * @requies Onyx (https://github.com/enyojs/onyx)
 *
 * @param {date}	[dateObj]	Initial date object set; defaults to current date
 */
enyo.kind({
	name: "GTS.TimePicker",

	classes: "gts-timepicker",

	loaded: false,

	/** @public */
	published: {
		/** @lends GTS.SelectorBar# */

		/**
		 * Currently selected time
		 * @type datetime
		 * @default NOW()
		 */
		value: null,

		/**
		 * Intervals between minute options
		 * @type int
		 * @default 5
		 */
		minuteInterval: 5,

		/**
		 * 24 hour mode (true) or 12 hour mode (false)
		 * @type boolean
		 * @default false
		 */
		is24HrMode: false,

		/**
		 * label of picker set
		 * @type string
		 * @default "Time"
		 */
		label: "Time"
	},

	/**
	 * @public
	 * Events sent by control
	 */
	events: {
		/** @lends GTS.SelectorBar# */

		/**
		 * Selected time changed
		 * @event
		 * @param {Object} inSender	Event's sender
		 * @param {Object} inEvent	{ value: Date() }
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
			name: "label",
			classes: "label"
		}, {
			kind: "onyx.PickerDecorator",
			onChange: "pickerChanged",
			components: [
				{}, {
					name: "hourPicker",
					kind: "onyx.Picker",

					components: [
						{ content: "Loading" }
					]
				}
			]
		}, {
			kind: "onyx.PickerDecorator",
			onChange: "pickerChanged",
			components: [
				{}, {
					name: "minutePicker",
					kind: "onyx.Picker",

					components: [
						{ content: "Loading" }
					]
				}
			]
		}, {
			name: "segmentWrapper",
			kind: "onyx.PickerDecorator",
			onChange: "pickerChanged",
			components: [
				{}, {
					name: "segmentPicker",
					kind: "onyx.Picker",

					components: [
						{
							content: "AM",
							value: 0
						}, {
							content: "PM",
							value: 12
						}
					]
				}
			]
		}
	],

	/**
	 * @protected
	 * @constructs
	 */
	constructor: function() {

		this.inherited( arguments );

		this.value = this.value || new Date();
	},

	/**
	 * @protected
	 * @function
	 * @name GTS.SelectorBar#rendered
	 *
	 * Called by Enyo when UI is rendered.
	 */
	rendered: function() {

		this.inherited( arguments );

		this.minuteIntervalChanged();
		this.is24HrModeChanged();
		this.labelChanged();

		this.loaded = true;
	},

	/**
	 * @private
	 * @function
	 * @name GTS.SelectorBar#minuteIntervalChanged
	 *
	 * Called by Enyo when this.minuteInterval is changed by host.
	 * Updates options for minutePicker.
	 */
	minuteIntervalChanged: function() {

		this.$['minutePicker'].destroyClientControls();

		var items = [];

		for( var i = 0; i < 60; i += this.minuteInterval ) {

			items.push( { content: ( ( i > 9 ) ? i : ( "0" + i ) ), value: i } );
		}

		this.$['minutePicker'].createComponents( items );
	},

	/**
	 * @private
	 * @function
	 * @name GTS.SelectorBar#is24HrModeChanged
	 *
	 * Called by Enyo when this.is24HrMode is changed by host.
	 * Shows/Hides AM/PM selector. Updates hour options.
	 */
	is24HrModeChanged: function() {

		this.$['segmentWrapper'].setShowing( !this.is24HrMode );

		this.setupHour();
		this.valueChanged();
	},

	/**
	 * @private
	 * @function
	 * @name GTS.SelectorBar#setupHour
	 *
	 * Generates options for hour picker
	 */
	setupHour: function( inSender, inEvent ) {

		var items = [];

		this.$['hourPicker'].destroyClientControls();

		for (var i = ( this.is24HrMode ? 0 : 1 ); i <= ( this.is24HrMode ? 23 : 12 ); i++ ) {

			items.push( { content: ( ( i > 9 ) ? i : ( "0" + i ) ), value: i } );
		}

		this.$['hourPicker'].createComponents( items );
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

		this.$['label'].setContent( this.label );

		//Force label to render proper size
		this.$['label'].applyStyle( "width", "100%" );
		enyo.asyncMethod( this.$['label'], this.$['label'].applyStyle, "width", null );
	},

	/**
	 * @private
	 * @function
	 * @name GTS.SelectorBar#valueChanged
	 *
	 * Updates UI
	 */
	valueChanged: function() {

		if( Object.prototype.toString.call( this.value ) !== "[object Date]" || isNaN( this.value.getTime() ) ) {
			//Not actually a date object

			this.value = new Date();
		}

		var hours = this.value.getHours();
		var mins = Math.floor( this.value.getMinutes() / this.minuteInterval ) * this.minuteInterval;
		var partOfDay = ( hours >= 12 ) * 12;

		this.setItemSelected( this.$['hourPicker'], ( this.is24HrMode ? hours : hours - partOfDay || 12 ) );
		this.setItemSelected( this.$['minutePicker'], mins );
		this.setItemSelected( this.$['segmentPicker'], partOfDay );
	},

	/**
	 * @private
	 * @function
	 * @name GTS.SelectorBar#setItemSelected
	 *
	 * Helper function to select an item in onyx.Picker
	 */
	setItemSelected: function( comp, value ) {

		var children = comp.getClientControls();
		var childValue;

		for( var i = 0; i < children.length; i++ ) {

			childValue = ( typeof( children[i].value ) !== "undefined" ) ? children[i].value : children[i].content

			if( childValue == value ) {

				comp.setSelected( children[i] );
				break;
			}
		}
	},

	/**
	 * @private
	 * @function
	 * @name GTS.SelectorBar#getItemSelected
	 *
	 * Helper function to get value of selected items
	 */
	getItemSelected: function( comp ) {

		var selected = comp.getSelected();

		return( ( typeof( selected.value ) !== "undefined" ) ? selected.value : selected.content );
	},

	/**
	 * @private
	 * @function
	 * @name GTS.SelectorBar#pickerChanged
	 *
	 * Update local value from current picker values
	 */
	pickerChanged: function() {

		if( !this.loaded ) {

			return;
		}

		var hours = parseInt( this.getItemSelected( this.$['hourPicker'] ) );
		var mins = parseInt( this.getItemSelected( this.$['minutePicker'] ), 10 );
		var partOfDay = this.getItemSelected( this.$['segmentPicker'] );

		hours = ( this.is24HrMode ) ? hours : hours + ( hours == 12 ? ( -!partOfDay * 12 ) : partOfDay );

		this.setValue(
				new Date(
						this.value.getFullYear(),
						this.value.getMonth(),
						this.value.getDate(),
						hours,
						mins,
						this.value.getSeconds(),
						this.value.getMilliseconds()
					)
			);

		this.doChange( { value: this.value } );

		return true;
	}
});

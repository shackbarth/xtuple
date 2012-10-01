/* Copyright © 2011-2012, GlitchTech Science */

/**
 * @name GTS.selectedMenu
 * @author Matthew Schott <glitchtechscience@gmail.com>
 *
 * Extends the Onyx Menu to indicate which item is selected.
 *
 * @class
 * @version 2.0 (2012/07/12)
 * @requires onyx 2.0-beta5
 * @extends onyx.Menu
 * @see http://enyojs.com
 */
enyo.kind({
	name: "GTS.SelectedMenu",
	kind: "onyx.Menu",

	classes: "gts-selectedMenu",

	published: {
		/** @lends GTS.SelectedMenu# */

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
		value: ""
	},

	/**
	 * @public
	 * Events sent by control
	 */
	events: {
		/** @lends GTS.SelectedMenu# */

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
	components: [],

	/**
	 * @private
	 * List of events to handle
	 */
	handlers: {
		onSelect: "selectionChanged"
	},

	/**
	 * @private
	 * @function
	 * @name GTS.SelectedMenu#choicesChanged
	 *
	 * Called by Enyo when this.choices is changed by host.
	 * Updates menu choices; Calls UI updater.
	 */
	choicesChanged: function() {

		this.destroyClientControls();

		if( enyo.isArray( this.choices ) ) {

			this.createComponents( this.choices );
		}

		this.valueChanged();

		this.reflow();
	},

	/**
	 * @private
	 * @function
	 * @name GTS.SelectedMenu#valueChanged
	 *
	 * Updates UI
	 */
	valueChanged: function() {

		var components = this.getClientControls();

		var test;

		for( var i = 0; i < components.length; i++ ) {

			test = components[i].value === this.value;

			components[i].addRemoveClass( "selected", test );
			components[i].addRemoveClass( "normal", !test );
		}
	},

	/**
	 * @private
	 * @function
	 * @name GTS.SelectedMenu#selectionChanged
	 *
	 * Handles menu selection; Calls host function for onChange
	 *
	 * @param {object} inSender	The event sender
	 * @param {object} inEvent	Event object
	 */
	selectionChanged: function( inSender, inEvent ) {

		this.setValue( inEvent.selected.value );

		this.doChange( inEvent.selected );
	}
});

/*
Copyright © 2012, GlitchTech Science
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * @name GTS.DatePicker
 * @author Matthew Schott <glitchtechscience@gmail.com>
 *
 * Calendar date picker for EnyoJS. Shows a calendar.
 * When the selected date changes, the onChange event is called with the current values as a date object.
 * Using getValue or setValue will get or set the datetime with a Date object. Setting a new value will change the view date.
 * Using getViewDate or setViewDate will get or set the display datetime with a Date object.
 *
 * @param {date}	[dateObj]	Initial date object set; defaults to current date
 * @param {viewDate}	[dateObj]	Initial viewing date; defaults to current date
 *
 * @class
 * @version 2.1 (2012/07/18)
 *
 * @requies Enyo (https://github.com/enyojs/enyo)
 * @requies Onyx (https://github.com/enyojs/onyx)
 * @requies Layout/Fittable (https://github.com/enyojs/layout)
 * @see http://enyojs.com
 *
 * @requies http://blog.stevenlevithan.com/archives/date-time-format
 */
enyo.kind({
	name: "GTS.DatePicker",
	kind: "enyo.Control",

	classes: "gts-calendar",

	/** @public */
	published: {
		value: null,
		viewDate: null,

		dowFormat: "ddd",
		monthFormat: "mmmm yyyy"
	},

	events: {
		onChange: ""
	},

	/** @private */
	components: [
		{
			kind: "FittableColumns",
			components: [
				{
					kind: "onyx.Button",
					content: "<<",

					ontap: "monthBack"
				}, {
					name: "monthLabel",
					tag: "strong",

					classes: "month-label",
					fit: true
				}, {
					kind: "onyx.Button",
					content: ">>",

					ontap: "monthForward"
				}
			]
		},

		//Calendar week header
		{
			kind: "FittableColumns",
			components: [
				{
					name: "sunday",

					content: "Sun",
					classes: "week-label"
				}, {
					name: "monday",
					content: "Mon",
					classes: "week-label"
				}, {
					name: "tuesday",
					content: "Tue",
					classes: "week-label"
				}, {
					name: "wednesday",
					content: "Wed",
					classes: "week-label"
				}, {
					name: "thursday",
					content: "Thu",
					classes: "week-label"
				}, {
					name: "friday",
					content: "Fri",
					classes: "week-label"
				}, {
					name: "saturday",
					content: "Sat",
					classes: "week-label"
				}
			]
		},

		//Calendar dates (6 rows of 7 cols)
		{
			kind: "FittableColumns",
			components: [
				{
					name: "row0col0",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row0col1",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row0col2",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row0col3",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row0col4",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row0col5",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row0col6",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}
			]
		}, {
			kind: "FittableColumns",
			components: [
				{
					name: "row1col0",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row1col1",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row1col2",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row1col3",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row1col4",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row1col5",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row1col6",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}
			]
		}, {
			kind: "FittableColumns",
			components: [
				{
					name: "row2col0",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row2col1",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row2col2",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row2col3",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row2col4",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row2col5",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row2col6",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}
			]
		}, {
			kind: "FittableColumns",
			components: [
				{
					name: "row3col0",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row3col1",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row3col2",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row3col3",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row3col4",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row3col5",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row3col6",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}
			]
		}, {
			kind: "FittableColumns",
			components: [
				{
					name: "row4col0",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row4col1",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row4col2",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row4col3",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row4col4",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row4col5",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row4col6",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}
			]
		}, {
			kind: "FittableColumns",
			components: [
				{
					name: "row5col0",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row5col1",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row5col2",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row5col3",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row5col4",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row5col5",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}, {
					name: "row5col6",
					kind: "onyx.Button",
					ontap: "dateHandler"
				}
			]
		},

		{
			kind: "FittableColumns",
			style: "margin-top: 1em;",

			components: [
				{
					name: "client",
					fit: true
				}, {
					kind: "onyx.Button",
					content: "Today",
					ontap: "resetDate"
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

		this.viewDate = this.viewDate || new Date();
		this.value = this.value || new Date();
	},

	/** @protected */
	rendered: function() {

		this.inherited( arguments );

		if( dateFormat ) {

			//Build Day Of Week items
			var dowDate = new Date( 2011, 4, 1 );//Sunday, May 1, 2011

			this.$['sunday'].setContent( dateFormat( dowDate, this.dowFormat ) );

			dowDate.setDate( dowDate.getDate() + 1 );
			this.$['monday'].setContent( dateFormat( dowDate, this.dowFormat ) );

			dowDate.setDate( dowDate.getDate() + 1 );
			this.$['tuesday'].setContent( dateFormat( dowDate, this.dowFormat ) );

			dowDate.setDate( dowDate.getDate() + 1 );
			this.$['wednesday'].setContent( dateFormat( dowDate, this.dowFormat ) );

			dowDate.setDate( dowDate.getDate() + 1 );
			this.$['thursday'].setContent( dateFormat( dowDate, this.dowFormat ) );

			dowDate.setDate( dowDate.getDate() + 1 );
			this.$['friday'].setContent( dateFormat( dowDate, this.dowFormat ) );

			dowDate.setDate( dowDate.getDate() + 1 );
			this.$['saturday'].setContent( dateFormat( dowDate, this.dowFormat ) );
		}

		var cellWidth = Math.round( 10 * this.getBounds()['width'] / 7 ) / 10;

		this.$['sunday'].applyStyle( "width", cellWidth + "px" );
		this.$['monday'].applyStyle( "width", cellWidth + "px" );
		this.$['tuesday'].applyStyle( "width", cellWidth + "px" );
		this.$['wednesday'].applyStyle( "width", cellWidth + "px" );
		this.$['thursday'].applyStyle( "width", cellWidth + "px" );
		this.$['friday'].applyStyle( "width", cellWidth + "px" );
		this.$['saturday'].applyStyle( "width", cellWidth + "px" );

		//Build everything else
		this.valueChanged();
	},

	/** @protected */
	valueChanged: function() {

		if( Object.prototype.toString.call( this.value ) !== "[object Date]" || isNaN( this.value.getTime() ) ) {
			//Not actually a date object

			this.value = new Date();
		}

		this.viewDate.setTime( this.value.getTime() );

		this.renderCalendar();
	},

	/** @protected */
	viewDateChanged: function() {

		this.renderCalendar();
	},

	/** @protected */
	renderCalendar: function() {

		var cellWidth = Math.round( 10 * this.getBounds()['width'] / 7 ) / 10;
		var today = new Date();

		//Reset viewDate to first day of the month to prevent issues when changing months
		this.viewDate = new Date( this.viewDate.getFullYear(), this.viewDate.getMonth(), 1 );

		var dispMonth = new Date( this.viewDate.getFullYear(), this.viewDate.getMonth(), 0 );//Prev month, last day of month; Cycled object for diplay data
		var currMonth = new Date( this.viewDate.getFullYear(), this.viewDate.getMonth(), 1 );//Current month, first day of month

		dispMonth.setDate( dispMonth.getDate() - currMonth.getDay() + 1 );

		if( dispMonth.getTime() === currMonth.getTime() ) {
			//Curr starts on a Sunday; shift back

			dispMonth.setDate( dispMonth.getDate() - 7 );
		}

		var rowCount = 0;

		var buttonType;

		while( rowCount < 6  ) {
			//Always display 6 rows of date information

			if( dispMonth.getDate() === this.value.getDate() &&
				dispMonth.getMonth() === this.value.getMonth() &&
				dispMonth.getFullYear() === this.value.getFullYear() ) {
				//Currently selected date

				buttonType = "onyx-blue";
			} else if( dispMonth.getDate() === today.getDate() &&
				dispMonth.getMonth() === today.getMonth() &&
				dispMonth.getFullYear() === today.getFullYear() ) {

				buttonType = "onyx-affirmative";
			} else if( dispMonth.getMonth() !== currMonth.getMonth() ) {
				//Month before or after focused one

				buttonType = "onyx-dark";
			} else {

				buttonType = "";
			}

			this.$['row' + rowCount + 'col' + dispMonth.getDay()].applyStyle( "width", cellWidth + "px" );

			//Remove added classes
			this.$['row' + rowCount + 'col' + dispMonth.getDay()].removeClass( "onyx-affirmative" );
			this.$['row' + rowCount + 'col' + dispMonth.getDay()].removeClass( "onyx-blue" );
			this.$['row' + rowCount + 'col' + dispMonth.getDay()].removeClass( "onyx-dark" );

			//Add proper class
			this.$['row' + rowCount + 'col' + dispMonth.getDay()].addClass( buttonType );

			this.$['row' + rowCount + 'col' + dispMonth.getDay()].setContent( dispMonth.getDate() );
			this.$['row' + rowCount + 'col' + dispMonth.getDay()].ts = dispMonth.getTime();//Used by ontap

			dispMonth.setDate( dispMonth.getDate() + 1 );

			if( dispMonth.getDay() === 0 && rowCount < 6 ) {

				rowCount++;
			}
		}

		if( dateFormat ) {

			this.$['monthLabel'].setContent( dateFormat( currMonth, this.monthFormat ) );
		} else {

			this.$['monthLabel'].setContent( this.getMonthString( currMonth.getMonth() ) );
		}
	},

	/** @protected */
	monthBack: function() {

		this.viewDate.setMonth( this.viewDate.getMonth() - 1 );

		this.renderCalendar();
	},

	/** @protected */
	monthForward: function() {

		this.viewDate.setMonth( this.viewDate.getMonth() + 1 );

		this.renderCalendar();
	},

	/** @protected */
	resetDate: function() {
		//Reset button pressed

		this.viewDate = new Date();
		this.value = new Date();

		this.renderCalendar();

		this.doChange( this.value );
	},

	/** @protected */
	dateHandler: function( inSender, inEvent ) {
		//Date button pressed

		var newDate = new Date();
		newDate.setTime( inSender.ts );

		this.value.setDate( newDate.getDate() );
		this.value.setMonth( newDate.getMonth() );
		this.value.setFullYear( newDate.getFullYear() );

		if( this.value.getMonth() != this.viewDate.getMonth() ) {

			this.viewDate = new Date( this.value.getFullYear(), this.value.getMonth(), 1 );
		}

		this.doChange( this.value );
		this.renderCalendar();
	},

	/** @public */
	getMonthString: function( jsIndex ) {

		return(
				[
					"January",
					"February",
					"March",
					"April",
					"May",
					"June",
					"July",
					"August",
					"September",
					"October",
					"November",
					"December"
				][jsIndex]
			);
	},

	/** @public */
	getDayString: function( jsIndex ) {

		return(
				[
					"Sunday",
					"Monday",
					"Tuesday",
					"Wednesday",
					"Thursday",
					"Friday",
					"Saturday"
				][jsIndex]
			);
	}
});

/*
Copyright © 2012, GlitchTech Science
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

	Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * Self check: is this object a number
 * @augments Number.prototype
 *
 * @return {boolean}
 */
Number.prototype.isNaN = function() {

	return isNaN( this );
}

/**
 * Self check: is this object equal to 0
 * @augments Number.prototype
 *
 * @return {boolean}
 */
Number.prototype.isNull = function() {

	return this == 0;
}

/**
 * Self check: is object even value integer
 * @augments Number.prototype
 *
 * @return {boolean}
 */
Number.prototype.isEven = function() {

	if( !this.isInteger() ) {

		return false;
	}

	return( ( ( this % 2 ) === 0 ) ? false : true );
}

/**
 * Self check: is object odd value integer
 * @augments Number.prototype
 *
 * @return {boolean}
 */
Number.prototype.isOdd = function() {

	if( !this.isInteger() ) {

		return false;
	}

	return( ( ( this % 2 ) === 0 ) ? true : false );
}

/**
 * Self check: is object integer
 * @augments Number.prototype
 *
 * @param {boolean} [excludeZero] true if 0 doesn't count as an integer
 * @return {boolean}
 */
Number.prototype.isInteger = function( excludeZero ) {

	// if this == NaN ...
	if( this.isNaN() ) {

		return false;
	}

	if( excludeZero && this.isNull() ) {

		return false;
	}

	return( ( ( this - this.floor() ) === 0 ) ? false : true );
}

/**
 * Self check: is object a natural number
 * @augments Number.prototype
 *
 * @param {boolean} [excludeZero] true if 0 doesn't count as an integer
 * @return {boolean}
 */
Number.prototype.isNatural = function( excludeZero ) {

	return( this.isInteger( excludeZero ) && this >= 0 );
}

/*
 * Converts a number to a currency formatted string
 * @augments Number.prototype
 *
 * @param {int} [precision=2] number of decimal places to display
 * @param {string} [currency="$"] Currency symbol
 * @param {string} [decimalSeparator="."] Divider between whole numbers and decimals
 * @param {string} [thousandsSeparator="."] Divider at thousands mark
 *
 * @return {string}
*/
Number.prototype.formatCurrency = function( precision, currency, decimalSeparator, thousandsSeparator ) {

	precision = isNaN( precision ) ? 2 : Math.abs( precision );
	currency = currency || "$";
	decimalSeparator = decimalSeparator || ".";
	thousandsSeparator = ( typeof thousandsSeparator === "undefined" ) ? "," : thousandsSeparator;

	var sign = ( this < 0 ) ? "-" : "";

	var n = Math.abs( this ).toFixed( precision );
	var i = parseInt( n ) + "";

	var j = ( ( j = i.length ) > 3 ) ? j % 3 : 0;

	return sign +
			currency +
			( j ? i.substr( 0, j ) + thousandsSeparator : "" ) +
			i.substr( j ).replace( /(\d{3})(?=\d)/g, "$1" + thousandsSeparator ) +
			( precision ? decimalSeparator + Math.abs( n - i ).toFixed( precision ).slice( 2 ) : "" );
}

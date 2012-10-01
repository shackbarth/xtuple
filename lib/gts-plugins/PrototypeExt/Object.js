/*
Copyright © 2012, GlitchTech Science
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

	Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * Returns numbers from obj
 * @augments Object
 *
 * @param {object} obj
 */
Object.numericValues = function( obj ) {

	return Object.values( obj ).select( Object.isNumber );
}

/**
 * More extensive number check on obj
 * @augments Object
 *
 * @param {object} obj
 */
Object.validNumber = function( obj ) {

	return this.isNumber( obj ) && !isNaN( parseFloat( obj ) ) && isFinite( obj );
}

/**
 * Exchanges the values between the two indexes
 * @augments Object
 *
 * @param {object} obj
 * @param {string} index1
 * @param {string} index2
 * @return {object}
 */
Object.swap = function( obj, index1, index2 ) {

	var swap = obj[index1];

	obj[index1] = obj[index2];
	obj[index2] = swap;

	return obj;
}

/**
 * Is the object a function
 * @augments Object
 *
 * @param {object} obj
 * @return boolean
 */
Object.isFunction = function( obj ) {

	if( enyo.isFunction ) {

		return enyo.isFunction( obj );
	}

	return Object.prototype.toString.call( obj ) === "[object Function]";
}

/**
 * Is the object a string
 * @augments Object
 *
 * @param {object} obj
 * @return boolean
 */
Object.isString = function( obj ) {

	if( enyo.isString ) {

		return enyo.isString( obj );
	}

	return Object.prototype.toString.call( obj ) === "[object String]";
}

/**
 * Is the object a number
 * @augments Object
 *
 * @param {object} obj
 * @return boolean
 */
Object.isNumber = function( obj ) {

	return Object.prototype.toString.call( obj ) === "[object Number]";
}

/**
 * Is the object a date
 * @augments Object
 *
 * @param {object} obj
 * @return boolean
 */
Object.isDate = function( obj ) {

	return Object.prototype.toString.call( obj ) === "[object Date]";
}

/**
 * Is the object undefined
 * @augments Object
 *
 * @param {object} obj
 * @return boolean
 */
Object.isUndefined = function( obj ) {

	return typeof object === "undefined";
}

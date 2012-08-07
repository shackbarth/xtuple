/*
Copyright © 2012, GlitchTech Science
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

	Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * Calculates the sum of the array
 * @augments Math
 *
 * @param {Number[]}
 * @return {Number}
 */
Math.sum = function( inArray ) {

	var sum = 0;

	for( var i = 0; i < inArray.length; i++ ) {

		sum += inArray[i];
	}

	return sum;
},

/**
 * Calculates the average of the array
 * @augments Math
 *
 * @param {Number[]}
 * @return {Number}
 */
Math.mean = function( inArray ) {

	return ( inArray.length > 0 ) ? ( this.sum( inArray ) / inArray.length ) : false;
},

/**
 * Calculates the median of the array
 * @see <a href="http://en.wikipedia.org/wiki/Median">Median - Wikipedia</a>.
 * @augments Math
 *
 * @param {Number[]}
 * @return {Number}
 */
Math.median = function( inArray ) {

	if( inArray.length <= 0 ) {

		return false;
	}

	inArray = this.sort( inArray );

	if( inArray.length.isEven() ) {

		return this.mean( [inArray[inArray.length / 2 - 1], inArray[inArray.length / 2]] );
	} else {

		return inArray[( inArray.length / 2 ).floor()];
	}
},

/**
 * Calculates the measure of how far a set of numbers are spread out from each other
 * @see <a href="http://en.wikipedia.org/wiki/Variance">Variance - Wikipedia</a>.
 * @augments Math
 *
 * @param {Number[]}
 * @return {Number}
 */
Math.variance = function( inArray ) {

	if( inArray.length <= 0 ) return false;

	var mean = this.mean( inArray );
	var dev = [];

	for( var i = 0; i < inArray.length; i++ ) {

		dev.push( this.pow( ( inArray[i] - mean ), 2 ) );
	}

	return this.mean( dev );
},

/**
 * Calculates how much variation there is from the average
 * @see <a href="http://en.wikipedia.org/wiki/Std_dev">Standard Deviation - Wikipedia</a>.
 * @augments Math
 *
 * @param {Number[]}
 * @return {Number}
 */
Math.stdDev = function( inArray ) {

	return this.sqrt( this.variance( inArray ) );
},

/**
 * Hyperbolic sine
 * @see <a href="http://en.wikipedia.org/wiki/Hyperbolic_function">Hyperbolic Function - Wikipedia</a>.
 * @augments Math
 *
 * @param {Number}
 * @return {Number}
 */
Math.sinh = function( n ) {

	return ( this.exp( n ) - this.exp( -n ) ) / 2;
},

/**
 * Hyperbolic cosine
 * @see <a href="http://en.wikipedia.org/wiki/Hyperbolic_function">Hyperbolic Function - Wikipedia</a>.
 * @augments Math
 *
 * @param {Number}
 * @return {Number}
 */
Math.cosh = function( n ) {

	return ( this.exp( n ) + this.exp( -n ) ) / 2;
},

/**
 * Hyperbolic tangent
 * @see <a href="http://en.wikipedia.org/wiki/Hyperbolic_function">Hyperbolic Function - Wikipedia</a>.
 * @augments Math
 *
 * @param {Number}
 * @return {Number}
 */
Math.tanh = function( n ) {

	return this.sinh( n ) / this.cosh( n );
},

/**
 * Hyperbolic cotangent
 * @see <a href="http://en.wikipedia.org/wiki/Hyperbolic_function">Hyperbolic Function - Wikipedia</a>.
 * @augments Math
 *
 * @param {Number}
 * @return {Number}
 */
Math.coth = function( n ) {

	return this.cosh( n ) / this.sinh( n );
},

/**
 * Hyperbolic secant
 * @see <a href="http://en.wikipedia.org/wiki/Hyperbolic_function">Hyperbolic Function - Wikipedia</a>.
 * @augments Math
 *
 * @param {Number}
 * @return {Number}
 */
Math.sech = function( n ) {

	return 2 / ( this.exp( n ) + this.exp( -n ) );
},

/**
 * Hyperbolic cosecant
 * @see <a href="http://en.wikipedia.org/wiki/Hyperbolic_function">Hyperbolic Function - Wikipedia</a>.
 * @augments Math
 *
 * @param {Number}
 * @return {Number}
 */
Math.csch = function( n ) {

	return 2 / ( this.exp( n ) - this.exp( -n ) );
},

/**
 * Sorts the array numerically
 * @augments Math
 *
 * @param {Number[]}
 * @param {boolean} [desc] True for descending numerical order
 * @return {Number[]}
 */
Math.sort = function( inArray, desc ) {

	return inArray.clone().sort(
			function( a, b ) {

				return desc ? b - a : a - b
			}
		);
}

/*
Copyright © 2012, GlitchTech Science
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * Removes HTML tags and content between them from string
 * @augments String.prototype
 *
 * @return {String}
 */
String.prototype.stripHTML = function() {

	return this.replace( /<\S[^><]*>/g, "" );
}

/**
 * Replaces common 'bad' characters with safe equivalents
 * @augments String.prototype
 *
 * @return {String}
 */
String.prototype.cleanString = function() {

	var dirtyItem = [ /&/g, /"/g, /</g, />/g, /`/g, /'/g, /\n/g ];//"
	var cleanItem = [ "&amp;", "&quot;", "$lt;", "&gt;", "'", "'", " " ];

	var string = this;

	for( var i = 0; i < dirtyItem.length; i++ ) {

		string = string.replace( dirtyItem[i], cleanItem[i] );
	}

	return string;
}

/**
 * Replaces safe equivalents with common 'bad' characters
 * @augments String.prototype
 *
 * @return {String}
 */
String.prototype.dirtyString = function() {

	var cleanItem = [ /&amp;/g, /&quot;/g, /$lt;/g, /&gt;/g, /&rsquo;/g, /&nbsp;/g ];
	var dirtyItem = [ "&", '"', "<", ">", "'", " " ];

	var string = this;

	for( var i = 0; i < dirtyItem.length; i++ ) {

		string = string.replace( cleanItem[i], dirtyItem[i] );
	}

	return string;
}

/**
 * Removes all whitespace from start and end of string
 * @augments String.prototype
 *
 * @return {String}
 */
String.prototype.trim = function() {

	return this.replace( /^\s\s*/, "" ).replace( /\s\s*$/, "" );
}

/**
 * Makes a string's first character uppercase
 * @augments String.prototype
 *
 * @return {String}
 */
String.prototype.ucfirst = function() {

	var c = this.charAt( 0 ).toUpperCase();
	return( c + this.substr( 1 ) );
}

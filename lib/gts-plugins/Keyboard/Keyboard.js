/*
Copyright © 2012, GlitchTech Science
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

	Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * GTS.Keyboard
 *
 * On screen keyboard for EnyoJS.
 * The keyboard acts as an on screen keyboard for the set component.
 *
 * @author Matthew Schott <glitchtechscience@gmail.com>
 *
 * @requies Enyo (https://github.com/enyojs/enyo)
 * @requies Onyx (https://github.com/enyojs/onyx)
 *
 * @param component	[write]	Component to be interacted with by the keyboard
 */
enyo.kind({
	name: "GTS.Keyboard",
	kind: enyo.Control,

	/** @private variables */
	keyboardJSON: [
			[
				{
					type: "symbol",
					on: "~",
					off: "`"
				}, {
					type: "symbol",
					on: "!",
					off: "1"
				}, {
					type: "symbol",
					on: "@",
					off: "2"
				}, {
					type: "symbol",
					on: "#",
					off: "3"
				}, {
					type: "symbol",
					on: "$",
					off: "4"
				}, {
					type: "symbol",
					on: "%",
					off: "5"
				}, {
					type: "symbol",
					on: "^",
					off: "6"
				}, {
					type: "symbol",
					on: "&amp;",
					off: "7"
				}, {
					type: "symbol",
					on: "*",
					off: "8"
				}, {
					type: "symbol",
					on: "(",
					off: "9"
				}, {
					type: "symbol",
					on: ")",
					off: "0"
				}, {
					type: "symbol",
					on: "_",
					off: "-"
				}, {
					type: "symbol",
					on: "+",
					off: "="
				}, {
					type: "delete",
					value: "del"
				}
			], [
				{
					type: "tab",
					value: "tab"
				}, {
					type: "letter",
					value: "q"
				}, {
					type: "letter",
					value: "w"
				}, {
					type: "letter",
					value: "e"
				}, {
					type: "letter",
					value: "r"
				}, {
					type: "letter",
					value: "t"
				}, {
					type: "letter",
					value: "y"
				}, {
					type: "letter",
					value: "u"
				}, {
					type: "letter",
					value: "i"
				}, {
					type: "letter",
					value: "o"
				}, {
					type: "letter",
					value: "p"
				}, {
					type: "symbol",
					on: "{",
					off: "["
				}, {
					type: "symbol",
					on: "}",
					off: "]"
				}, {
					type: "symbol",
					on: "|",
					off: "\\"
				}
			], [
				{
					type: "capslock",
					value: "caps"
				}, {
					type: "letter",
					value: "a"
				}, {
					type: "letter",
					value: "s"
				}, {
					type: "letter",
					value: "d"
				}, {
					type: "letter",
					value: "f"
				}, {
					type: "letter",
					value: "g"
				}, {
					type: "letter",
					value: "h"
				}, {
					type: "letter",
					value: "j"
				}, {
					type: "letter",
					value: "k"
				}, {
					type: "letter",
					value: "l"
				}, {
					type: "symbol",
					on: ":",
					off: ";"
				}, {
					type: "symbol",
					on: "\"",
					off: "'"
				}, {
					type: "return",
					value: "enter"
				}
			], [
				{
					type: "left-shift",
					value: "shift"
				}, {
					type: "letter",
					value: "z"
				}, {
					type: "letter",
					value: "x"
				}, {
					type: "letter",
					value: "c"
				}, {
					type: "letter",
					value: "v"
				}, {
					type: "letter",
					value: "b"
				}, {
					type: "letter",
					value: "n"
				}, {
					type: "letter",
					value: "m"
				}, {
					type: "symbol",
					on: "&lt;",
					off: ","
				}, {
					type: "symbol",
					on: "&gt;",
					off: "."
				}, {
					type: "symbol",
					on: "?",
					off: "/"
				}, {
					type: "right-shift",
					value: "shift"
				}
			], [
				{
					type: "space",
					value: "space"
				}
			]
		],

	symbolIds: [],
	letterIds: [],
	shift: false,
	capslock: false,

	/** @public events */
	published: {
		write: ""
	},

	components: [
		{
			name: "keyboardWrapper",
			classes: "gts-keyboard"
		}
	],

	/**
	 * @protected
	 * Builds UI. Called once on system load
	 */
	rendered: function() {

		this.inherited( arguments );

		this.buildKeyBoardUI();
	},

	/**
	 * @private
	 * Build keyboard UI && set bindings
	 */
	buildKeyBoardUI: function() {

		//Initialize variables
		this.symbolIds = [];
		this.letterIds = [];

		this.shift = false;
		this.capslock = false;

		//Generate Keyboard
		var keyboardComponents = [];

		for( var i = 0; i < this.keyboardJSON.length; i++ ) {

			var rowComponents = [];

			for( var j = 0; j < this.keyboardJSON[i].length; j++ ) {

				var keyName = "-" + i + "-" + j + "-";

				if( this.keyboardJSON[i][j]['type'] === "symbol" ) {
					//Special case buttons, two display states

					this.symbolIds.push( keyName );
					rowComponents.push(
							{
								name: keyName,
								classes: "key symbol",
								allowHtml: true,
								content: this.keyboardJSON[i][j]['off'],

								offKey: this.keyboardJSON[i][j]['off'],
								onKey: this.keyboardJSON[i][j]['on'],

								ontap: "keyTapped"
							}
						);
				} else if( this.keyboardJSON[i][j]['type'] === "letter" ) {
					//Letter buttons

					this.letterIds.push( keyName );
					rowComponents.push(
							{
								name: keyName,
								classes: "key letter",
								content: this.keyboardJSON[i][j]['value'],

								ontap: "keyTapped"
							}
						);
				} else {
					//Everything else

					rowComponents.push(
							{
								name: keyName,
								classes: "key " + this.keyboardJSON[i][j]['type'],
								content: this.keyboardJSON[i][j]['value'],

								ontap: "keyTapped"
							}
						);
				}
			}

			keyboardComponents.push(
					{
						classes: "keyboard-row",
						defaultKind: "onyx.Button",
						components: rowComponents
					}
				);
		}

		this.$['keyboardWrapper'].destroyClientControls();
		this.$['keyboardWrapper'].createComponents( keyboardComponents, { owner: this } );
		this.$['keyboardWrapper'].render();
	},

	/**
	 * @private
	 * Keyboard button handling
	 *
	 * @param object	[inSender]	Source object
	 * @param object	[inEvent]	Event object
	 */
	keyTapped: function( inSender, inEvent ) {

		var eventObj = {};

		if( inSender.hasClass( 'left-shift' ) || inSender.hasClass( 'right-shift' ) ) {
			//shift keys

			this.shift = !this.shift;

			this.adjustLetters();
			this.adjustSymbols();

			eventObj['which'] = 16;
		} else if( inSender.hasClass( 'capslock' ) ) {
			//caps lock

			this.capslock = !this.capslock;

			this.adjustLetters();

			eventObj['which'] = 20;
		} else {

			var character = inSender.getContent();

			//uppercase, symbol, or special character
			character = inSender.hasClass( 'symbol' ) ? character.replace( "&amp;", "&" ).replace( "&lt;", "<" ).replace( "&gt;", ">" ) : character;
			character = inSender.hasClass( 'space' ) ? " " : character;
			character = inSender.hasClass( 'tab' ) ? "\t" : character;
			character = inSender.hasClass( 'return' ) ? "\r" : character;
			character = inSender.hasClass( 'uppercase' ) ? character.toUpperCase() : character.toLowerCase();

			//this.shift key handler
			if( this.shift === true ) {

				this.shift = false;

				this.adjustSymbols();
				this.adjustLetters();
			}

			if( typeof( this.write ) !== 'undefined' && this.write !== "" ) {

				if( inSender.hasClass( 'delete' ) ) {
					//delete

					if( this.write['kind'].match( /input/gi ) ) {

						var val = this.write.getValue();

						this.write.setValue( val.substr( 0, val.length - 1 ) );
					} else {

						var content = this.write.getContent();

						this.write.setContent( content.substr( 0, content.length - 1 ) );
					}

					eventObj['which'] = 8;
				} else {

					//Send character to event
					if( this.write['kind'].match( /input/gi ) ) {

						this.write.setValue( this.write.getValue() + character );
					} else {

						this.write.setContent( this.write.getContent() + character );
					}

					eventObj['which'] = character.charCodeAt( 0 );
				}
			}
		}

		//Send events
		this.write.bubble( "oninput", eventObj );
		this.write.bubble( "onkeyup", eventObj );
		this.write.bubble( "onkeydown", eventObj );
	},

	/**
	 * @private
	 * Toggles symbol characters
	 */
	adjustSymbols: function() {

		for( var i = 0; i < this.symbolIds.length; i++ ) {

			this.$[this.symbolIds[i]].setContent( this.$[this.symbolIds[i]][( this.shift ? 'onKey' : 'offKey' )] );
		}
	},

	/**
	 * @private
	 * Toggles capital letters
	 */
	adjustLetters: function() {

		for( var i = 0; i < this.letterIds.length; i++ ) {

			//XOR this.shift, this.capslock
			this.$[this.letterIds[i]].addRemoveClass( "uppercase", ( ( this.shift && !this.capslock ) || ( !this.shift && this.capslock ) ) );
		}
	}
});

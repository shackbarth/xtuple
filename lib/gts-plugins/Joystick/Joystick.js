/*
Copyright © 2012, GlitchTech Science
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

	Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * GTS.Joystick
 *
 * Digital joystick for touch interfaces.
 *
 * @author Matthew Schott <glitchtechscience@gmail.com>
 *
 * @requies Enyo (https://github.com/enyojs/enyo)
 * @requies EnyoJS Canvas (https://github.com/enyojs/canvas)
 *
 * @param {boolean}     [absolutelyPositioned]  Is the joystick inline or absolutely positioned (assumed)
 * @param {int}         [padHeight]             Height of joystick area *must be defined here, not in CSS*
 * @param {int}         [padWidth]              Width of joystick area *must be defined here, not in CSS*
 * @param {int}         [stickRadius]           Radius of joystick handle
 * @param {string}      [stickColor]            Color of joystick handle/current contact point
 * @param {string}      [baseColor]             Color of joystick base/initial contact point
 * @param {int}         [jitter]                Distance from center before joystick is in a 'digital' position
 * @param {string}      [debug]                 Color of debug message; disabled if blank
 *
 * @param {function}    [onStickMove]      Called when joystick is moved at all
 * @param {function}    [onStickUp]        Called when joystick enters up space
 * @param {function}    [onStickDown]      Called when joystick enters down space
 * @param {function}    [onStickLeft]      Called when joystick enters left space
 * @param {function}    [onStickRight]     Called when joystick enters right space
 * @param {function}    [onStickCentered]  Called when joystick is released
 */
var GTS_Joystick_Touch_List = [];

enyo.kind({
	name: "GTS.Joystick",
	kind: "enyo.Canvas",

	classes: "gts-joystick",

	/** @private variables */
	baseX: 0,
	baseY: 0,

	stickX: 0,
	stickY: 0,

	top: 0,
	left: 0,
	height: 0,
	width: 0,

	pressed: false,
	touchId: -1,

	wasUp: false,
	wasDown: false,
	wasLeft: false,
	wasRight: false,
	wasPressed: false,

	/** @public variables */
	published: {
		//absolutely positioned
		absolutelyPositioned: true,

		//area for joystick to appear in
		padHeight: 300,
		padWidth: 300,

		//initial display of joystick
		baseColor: "#272D70",

		//current position of joystick
		stickRadius: 25,
		stickColor: "#333333",

		jitter: 12.5,

		debug: ""
	},

	/** @public events */
	events: {
		onStickMove: "",

		onStickUp: "",
		onStickDown: "",
		onStickLeft: "",
		onStickRight: "",
		onStickCentered: ""
	},

	components:[
		{
			name: "baseOuter",
			kind: "enyo.canvas.Circle",
			bounds: {}
		}, {
			name: "baseInner",
			kind: "enyo.canvas.Circle",
			bounds: {}
		}, {
			name: "stick",
			kind: "enyo.canvas.Circle",
			bounds: {}
		}, {
			name:"debug",
			kind: "canvas.Text",
			bounds: {
				l: 0,
				t: 15
			},
			color: "black"
		}
	],

	handlers: {
		ontouchstart: "eventTouchStart",
		ontouchend: "eventTouchEnd",
		ontouchmove: "eventTouchMove",
		onmousedown: "eventMouseDown",
		onmouseup: "eventMouseUp",
		onmousemove: "eventMouseMove"
	},

	/**
	 * @protected
	 * Called by system when rendered
	 */
	rendered: function() {

		this.inherited( arguments );

		this.padHeightChanged();
		this.padWidthChanged();

		this.absolutelyPositionedChanged();

		this.stickRadiusChanged();
		this.baseColorChanged();
		this.stickColorChanged();

		this.debugChanged();
	},

	/**
	 * @protected
	 * Called by system when this.padHeight is changed.
	 * Adjusts height for Joystick area
	 */
	padHeightChanged: function() {

		this.setAttribute( "height", this.padHeight );
	},

	/**
	 * @protected
	 * Called by system when this.padWidth is changed.
	 * Adjusts width for Joystick area
	 */
	padWidthChanged: function() {

		this.setAttribute( "width", this.padWidth );
	},

	/**
	 * @protected
	 * Called by system when this.absolutelyPositioned is changed.
	 * Adjusts calculations for tap location
	 */
	absolutelyPositionedChanged: function() {

		this.height = this.getAttribute( "height" );
		this.width = this.getAttribute( "width" );

		if( this.absolutelyPositioned ) {

			var top = left = 0;

			var obj = this;

			do {

				var n = obj.node || obj.hasNode() || 0;

				top += n.offsetTop;
				left += n.offsetLeft;

			} while( obj = obj.parent );

			this.top = top;
			this.left = left;
		} else {

			var bounds = this.getBounds();

			this.top = bounds['top'];
			this.left = bounds['left'];
		}
	},

	/**
	 * @protected
	 * Called by system when this.stickRadius is changed.
	 * Adjusts radius of Joystick
	 */
	stickRadiusChanged: function() {

		this.$['stick']['bounds']['h'] = this.stickRadius;
		this.$['stick']['bounds']['w'] = this.stickRadius;

		this.$['baseOuter']['bounds']['h'] = this.stickRadius * 3 / 2;
		this.$['baseOuter']['bounds']['w'] = this.stickRadius * 3 / 2;

		this.$['baseInner']['bounds']['w'] = this.stickRadius * 3 / 4;
		this.$['baseInner']['bounds']['h'] = this.stickRadius * 3 / 4;

		this.draw();
	},

	/**
	 * @protected
	 * Called by system when this.baseColor is changed.
	 * Adjusts color of joystick base
	 */
	baseColorChanged: function() {

		this.$['baseOuter'].setColor( "" );
		this.$['baseOuter'].setOutlineColor( this.baseColor );

		this.$['baseInner'].setColor( this.baseColor );
		this.$['baseInner'].setOutlineColor( "" );

		this.draw();
	},

	/**
	 * @protected
	 * Called by system when this.stickColor is changed.
	 * Adjusts color of joystick nob
	 */
	stickColorChanged: function() {

		this.$['stick'].setColor( this.stickColor );

		this.draw();
	},

	/**
	 * @protected
	 * Called by system when this.debug is changed.
	 * Adjusts color of debug string
	 */
	debugChanged: function() {

		this.$['debug'].setColor( this.debug );

		this.draw();
	},

	/**
	 * @public
	 * Test for touchscreen. Returns true is available
	 *
	 * @returns {boolean}
	 */
	touchscreenDevice: function() {

		return( 'createTouch' in document ? true : false );
	},

	/**
	 * @public
	 * X position of joystick relative to base.
	 *
	 * @returns {int}
	 */
	getX: function() {

		return( this.pressed ? ( this.stickX - this.baseX ) : 0 );
	},

	/**
	 * @public
	 * Y position of joystick relative to base.
	 *
	 * @returns {int}
	 */
	getY: function() {

		return( this.pressed ? -( this.stickY - this.baseY ) : 0 );
	},

	/**
	 * @public
	 * Position of joystick relative to base.
	 *
	 * @returns {obj}
	 * @returns {int}	obj.x
	 * @returns {int}	obj.y
	 */
	getPosition: function() {

		return {
				"x": this.getX(),
				"y": this.getY()
			};
	},

	/**
	 * @public
	 * Returns true if digital position of joystick is up
	 *
	 * @returns {boolean}
	 */
	isUp: function() {

		if( !this.pressed ) {

			return false;
		}

		var x = this.getX();
		var y = this.getY();

		if( y >= 0 ) {
			//Stick is in quadrant 3 or 4

			return false;
		}

		if( Math.abs( y ) < this.jitter || Math.abs( y ) < Math.abs( x ) ) {
			//Stick is within jitter range OR x change is larger

			return false;
		}

		return true;
	},

	/**
	 * @public
	 * Returns true if digital position of joystick is down
	 *
	 * @returns {boolean}
	 */
	isDown: function() {

		if( !this.pressed ) {

			return false;
		}

		var x = this.getX();
		var y = this.getY();

		if( y <= 0 ) {
			//Stick is in quadrant 1 or 2

			return false;
		}

		if( Math.abs( y ) < this.jitter || Math.abs( y ) < Math.abs( x ) ) {
			//Stick is within jitter range OR x change is larger

			return false;
		}

		return true;
	},

	/**
	 * @public
	 * Returns true if digital position of joystick is left
	 *
	 * @returns {boolean}
	 */
	isLeft: function() {

		if( !this.pressed ) {

			return false;
		}

		var x = this.getX();
		var y = this.getY();

		if( x >= 0 ) {
			//Stick is in quadrant 1 or 4

			return false;
		}

		if( Math.abs( x ) < this.jitter || Math.abs( x ) < Math.abs( y ) ) {
			//Stick is within jitter range OR y change is larger

			return false;
		}

		return true;
	},

	/**
	 * @public
	 * Returns true if digital position of joystick is right
	 *
	 * @returns {boolean}
	 */
	isRight: function() {

		if( !this.pressed ) {

			return false;
		}

		var x = this.getX();
		var y = this.getY();

		if( x <= 0 ) {
			//Stick is in quadrant 2 or 3

			return false;
		}

		if( Math.abs( x ) < this.jitter || Math.abs( x ) < Math.abs( y ) ) {
			//Stick is within jitter range OR y change is larger

			return false;
		}

		return true;
	},

	/**
	 * @private
	 * Mouse button held
	 *
	 * @param {object}	inSender	Source object
	 * @param {object}	inEvent	Mouse event object
	 */
	eventMouseDown: function( inSender, inEvent ) {

		var x = 0;
		var y = 0;

		if( inEvent.pageX || inEvent.pageY ) {

			x = inEvent.pageX;
			y = inEvent.pageY;
		} else if( inEvent.clientX || inEvent.clientY ) {

			posx = inEvent.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posy = inEvent.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}

		this.touchDown( x, y );

		return true;
	},

	/**
	 * @private
	 * Touch event started
	 *
	 * @param {object}	inSender	Source object
	 * @param {object}	inEvent	Touch event object
	 */
	eventTouchStart: function( inSender, inEvent ) {

		if( inEvent.changedTouches.length < 1 ) {
			//false positive

			return;
		}

		for( var i = 0; i < inEvent.changedTouches.length; i++ ) {

			if( this.touchId < 0 && enyo.indexOf( inEvent.changedTouches[i]['identifier'], GTS_Joystick_Touch_List ) < 0 ) {
				//fresh touch to joystick system

				this.touchId = inEvent.changedTouches[i]['identifier'];
				GTS_Joystick_Touch_List.push( this.touchId );

				this.touchDown( inEvent.changedTouches[i].pageX, inEvent.changedTouches[i].pageY );

				break;
			}
		}

		inEvent.preventDefault();
		return true;
	},

	/**
	 * @private
	 * Sets base and joystick positions for initial contact point
	 */
	touchDown: function( x, y ) {

		this.pressed = true;

		this.baseX = this.stickX = x;
		this.baseY = this.stickY = y;

		this.sendEvents();
		this.draw();
	},

	/**
	 * @private
	 * Mouse moved
	 *
	 * @param {object}	inSender	Source object
	 * @param {object}	inEvent	Mouse event object
	 */
	eventMouseMove: function( inSender, inEvent ) {

		var x = 0;
		var y = 0;

		if( inEvent.pageX || inEvent.pageY ) {

			x = inEvent.pageX;
			y = inEvent.pageY;
		} else if( inEvent.clientX || inEvent.clientY ) {

			posx = inEvent.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posy = inEvent.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}

		this.touchMoved( x, y );

		return true;
	},

	/**
	 * @private
	 * Touch point moved
	 *
	 * @param {object}	inSender	Source object
	 * @param {object}	inEvent	Touch event object
	 */
	eventTouchMove: function( inSender, inEvent ) {

		if( inEvent.changedTouches.length < 1 ) {
			//false positive

			return;
		}

		for( var i = 0; i < inEvent.changedTouches.length; i++ ) {

			if( this.touchId === inEvent.changedTouches[i]['identifier'] ) {
				//Current touch, move

				this.touchMoved( inEvent.changedTouches[i].pageX, inEvent.changedTouches[i].pageY );

				break;
			}
		}

		inEvent.preventDefault();
		return true;
	},

	/**
	 * @private
	 * Moves joystick position
	 */
	touchMoved: function( x, y ) {

		if( this.pressed ) {

			this.stickX = x;
			this.stickY = y;

			this.sendEvents();
			this.draw();
		}
	},

	/**
	 * @private
	 * Mouse button no longer held
	 *
	 * @param {object}	[inSender]	Source object
	 * @param {object}	[inEvent]	Mouse event object
	 */
	eventMouseUp: function( inSender, inEvent ) {

		this.touchUp();

		return true;
	},

	/**
	 * @private
	 * Touch event ended
	 *
	 * @param {object}	[inSender]	Source object
	 * @param {object}	[inEvent]	Touch event object
	 */
	eventTouchEnd: function( inSender, inEvent ) {

		if( inEvent.changedTouches.length < 1 ) {
			//false positive

			return;
		}

		for( var i = 0; i < inEvent.changedTouches.length; i++ ) {

			if( this.touchId === inEvent.changedTouches[i]['identifier'] ) {
				//Touch contact ended

				var index = enyo.indexOf( this.touchId, GTS_Joystick_Touch_List );

				if( index >= 0 ) {
					//Remove identifier if found

					GTS_Joystick_Touch_List.splice( index, 1 );
				}

				this.touchId = -1;
				this.touchUp();

				break;
			}
		}

		inEvent.preventDefault();
		return true;
	},

	/**
	 * @private
	 * Resets joystick to home
	 */
	touchUp: function() {

		this.pressed = false;

		this.stickX = this.baseX = 0;
		this.stickY = this.baseY = 0;

		this.sendEvents();
		this.draw();
	},

	/**
	 * @private
	 * Determines which events to send to owner
	 */
	sendEvents: function() {

		var outEvent = {
				"pressed": this.pressed,

				"x": this.getX(),
				"y": this.getY(),

				"up": this.isUp(),
				"down": this.isDown(),
				"left": this.isLeft(),
				"right": this.isRight()
			};

		/* Standard stick move event for every action */

		this.doStickMove( outEvent );

		/* Digital events */

		if( !this.wasUp && outEvent['up'] ) {

			this.wasUp = true;

			this.doStickUp( outEvent );
		} else if( !outEvent['up'] ) {

			this.wasUp = false;
		}

		if( !this.wasDown && outEvent['down'] ) {

			this.wasDown = true;

			this.doStickDown( outEvent );
		} else if( !outEvent['down'] ) {

			this.wasDown = false;
		}

		if( !this.wasLeft && outEvent['left'] ) {

			this.wasLeft = true;

			this.doStickLeft( outEvent );
		} else if( !outEvent['left'] ) {

			this.wasLeft = false;
		}

		if( !this.wasRight && outEvent['right'] ) {

			this.wasRight = true;

			this.doStickRight( outEvent );
		} else if( !outEvent['right'] ) {

			this.wasRight = false;
		}

		if( this.wasPressed && !outEvent['pressed'] ) {

			this.wasPressed = false;

			this.doStickCentered( outEvent );
		} else if( outEvent['pressed'] ) {

			this.wasPressed = true;
		}
	},

	/**
	 * @private
	 * Sets joystick and base positions on canvas. Sends to draw system.
	 */
	draw: function() {

		if( this.pressed ) {

			this.$['stick']['bounds']['l'] = this.stickX - this.left;
			this.$['stick']['bounds']['t'] = this.stickY - this.top;

			this.$['baseOuter']['bounds']['l'] = this.baseX - this.left;
			this.$['baseOuter']['bounds']['t'] = this.baseY - this.top;

			this.$['baseInner']['bounds']['l'] = this.baseX - this.left;
			this.$['baseInner']['bounds']['t'] = this.baseY - this.top;
		} else {

			this.$['stick']['bounds']['l'] = -this.$['stick']['bounds']['w'];
			this.$['stick']['bounds']['t'] = -this.$['stick']['bounds']['h'];

			this.$['baseOuter']['bounds']['l'] = -this.$['baseOuter']['bounds']['w'];
			this.$['baseOuter']['bounds']['t'] = -this.$['baseOuter']['bounds']['h'];

			this.$['baseInner']['bounds']['l'] = -this.$['baseInner']['bounds']['w'];
			this.$['baseInner']['bounds']['t'] = -this.$['baseInner']['bounds']['h'];
		}

		if( this.debug.length > 0 ) {

			this.$['debug'].setText( "X: " + this.getX() + " Y: " + this.getY() + " | " + this.touchId + " | " + this.name );
		}

		this.update();
	}
});

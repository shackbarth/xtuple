/**
	A List that loads its items lazily. When the user scroll to the end of the list, it asks for more items to add, and shows feedback accordingly.

	## Basic Use

	Same as standard list component, but you can use lazyLoad() method to load the first set of data.

	The onAcquirePage event enabled lazy data retrieval. It gets fired each time the user reachs the end of the list. Return true if there are more items to add, false otherwise:

		components: [
			{kind: "LazyList", fit: true, onSetupItem: "setupItem", onAcquirePage: "lazyLoad", components: [
				{classes: "item", ontap: "itemTap", components: [
					{name: "name"},
					{name: "index", style: "float: right;"}
				]}
			]}
		],
		lazyLoad: function( inSender, inEvent ) {
			var page = inEvent.page;

			if(this.itemsCount > this.$.lazyList.getCount() ) {
				this.askForData(inPage );
				return true;
			} else {
				return false;
			}
		},
		gotData: function( inRequest, inResponse ) {
			this.results = this.results.concat( inResponse.results );
			this.$.list.setCount( this.results.length );
		}

*/

/**
 * @name GTS.LazyList
 * @author Newness (Rafa Bernad)
 * @author Matthew Schott <glitchtechscience@gmail.com>
 *
 * Lazy loading list. Found in a merge request on the official enyo github.
 * Included in here to make use of it until an official solution is released.
 * Released under the gts namespace to prevent future conflicts. Code cleaned
 * up some and changed to my needs.
 *
 * @class
 * @extends enyo.List
 * @see http://enyojs.com
 */
enyo.kind({
	name: "GTS.LazyList",
	kind: "enyo.List",

	lastLazyLoad: 0,

	/**
	 * @public
	 * Events sent by control
	 */
	events: {
		/** @lends GTS.LazyList# */

		/**
		 * Aquire new pages of data
		 * @event
		 * @param {Object} inSender	Event's sender
		 * @param {Object} inEvent	Event parameters
		 */
		onAcquirePage: ""
	},

	listTools: [
		{
			name: "port",
			classes: "enyo-list-port enyo-border-box",
			components: [
				{
					name: "generator",
					kind: "FlyweightRepeater",
					canGenerate: false,
					components: [
						{
							tag: null,
							name: "client"
						}
					]
				}, {
					name: "page0",
					allowHtml: true,
					classes: "enyo-list-page"
				}, {
					name: "page1",
					allowHtml: true,
					classes: "enyo-list-page"
				}
			]
		}, {
			name: "lazyFeedback",
			classes: "enyo-lazy-feedback"
		}
	],

	/**
	 * @private
	 * @function
	 * @name GTS.LazyList#scroll
	 * @extends enyo.List#scroll
	 *
	 * Overrides scroll to check for & request new data
	 *
	 * @param {object} inSender	The event sender
	 * @param {object} inEvent	Event object
	 */
	scroll: function( inSender, inEvent ) {

		var s = this.getStrategy().$.scrollMath;

		if( ( s.isInOverScroll() && s.y < 0 ) || ( s.y <( s.bottomBoundary + this.$['lazyFeedback'].hasNode().offsetHeight ) ) ) {

			if( this.lastLazyLoad < this.pageCount ) {

				this.lastLazyLoad = this.pageCount;

				var bMore = this.doAcquirePage({
						page: this.lastLazyLoad
					});

				this.$['lazyFeedback'].addRemoveClass( "enyo-loading", bMore );
				this.$['lazyFeedback'].addRemoveClass( "enyo-eol", !bMore );
			}
		}

		return this.inherited( arguments );
	},

	/**
	 * @public
	 * @function
	 * @name GTS.LazyList#lazyLoad
	 *
	 * Resets list position and fetches new data
	 */
	lazyLoad: function() {

		this.lastLazyLoad = 0;

		this.doAcquirePage({
				page: this.lastLazyLoad
			});
	},

	/**
	 * @public
	 * @function
	 * @name GTS.LazyList#refresh
	 * @extends enyo.List#refresh
	 */
	refresh: function() {

		this.$['lazyFeedback'].removeClass( "enyo-loading" );
		this.$['lazyFeedback'].addRemoveClass( "enyo-eol", this.$['lazyFeedback'].hasClass( "enyo-eol" ) );

		this.inherited( arguments );
	},

	/**
	 * @public
	 * @function
	 * @name GTS.LazyList#reset
	 * @extends enyo.List#reset
	 */
	reset: function() {

		this.$['lazyFeedback'].removeClass( "enyo-loading" );
		this.$['lazyFeedback'].removeClass( "enyo-eol" );

		this.inherited( arguments );

	}
});

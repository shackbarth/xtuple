(function () {
  "use strict";

  /**
   * MVP-E.
   * @author travis@xtuple.com
   *
   * Separate the concerns of the presenter from those of the view.
   */
  XM.View = Backbone.View.extend();

  /**
   * @author travis@xtuple.com
   */
  XM.EnyoView = Backbone.View.extend({

    item: {
      /**
       * Layout DSL for List Item.
       *
       * @desc
       * A matrix that represents the template of the list item attributes.
       */
      template: { /** @example
        [
          // COLUMN 1          COLUMN 2
          [{ attr: 'name' }, { attr: 'description' }],  // ROW 1
          [{ attr: 'notes', colspan: 2             }]   // ROW 2
        ]
      **/ },

      /**
       * @member
       * Decorations DSL for List Item. Used by Decorators; feel free to
       * override or extend. If empty, the default is used as defined by the
       * optional Decorator which wraps this List Item, if present.
       *
       * @desc
       * Each key represents a style directive, which maps to a list of model
       * attributes, on each of which we apply the style if it exists in the
       * model.
       */
      decorations: { /** @example
        active:   [ 'isActive' ],
        italic:   [ 'name' ],
        hyperlink:[ 'primaryEmail', 'phone', 'webAddress' ],
      **/ },

      /**
       * @member
       * Describe which actions this list item supports.
       * TODO implement
       */
      actions: {

      }
    },

    list: {
      // TODO
    },

    workspace: {
      // TODO
    },

    /**
     * @member
     * @summary Map model events to Enyo events.
     * @desc The events block is employed slightly differently and more powerfully
     * in our XM.EnyoView than in a traditional Backbone.View.
     *
     * @example
     *  XM.FooView = XM.View.extends({
     *    events: {
     *      'change:bar': 'handleBarChange'
     *    }
     *  })
     *  enyo.kind({
     *    name: 'XV.FooWidget',
     *    handlers: {
     *      'onBarChange' : 'handleBarChange'
     *    },
     *    handleBarChange: function (inSender, inEvent) {
     *      ...
     *    }
     *  })
     *  // this will invoke presenter.handleBarChange
     *  model.set({ bar: 'MyBar' });
     */
    events: {/**
      @example
      'prefix:modelEvent': 'onPresenterEvent',
      'lock:acquire': 'onLockAcquire'
    */},

    /**
     * @override
     *
     */
    render: function () {
      this.el.render();
      return this;
    },

    /**
     * @override
     */
    remove: function () {
      this.el.destroy();
      return this;
    },

    /**
     * @override
     * @summary Intercept events traveling between the enyo layer and the
     * model layer.
     *
     * @desc
     * The default implementation is logically congruent with this method, but
     * it is tailored for views built using jQuery. Specifically, it assumes our
     * UI components sport an .on() method, which they do not, and it is less
     * intrusive and truer to Backbone's design philosophy to override this
     * method than to sully the enyo event handler naming convention.
     *
     * @see http://backbonejs.org/docs/backbone.html#section-127
     * @see Backbone.Model#listenTo
     */
    delegateEvents: function () {
      if (!this.model) return;

      _(this.events).each(function (presenterEvent, modelEvent) {

        // catch the event from the model
        this.listenTo(this.model, modelEvent, _(function (model, value) {
          var event = {
            originator: this,
            value: value,
            model: model
          };

          // re-package and send the event to the enyo component
          this.el.bubble(presenterEvent, event);

        }).bind(this));
      }, this);
    },

    /**
     * @member
     * jQuery? More like nullQuery! So, a foo walks into a bar...
     */
    $: null,

    /**
     * @override
     * @summary Alter semantics slightly to make this API believable in the
     * context of enyo. 
     *
     * @param {enyo.Component}  enyo component to bind
     * @param {Boolean} verb form; whether to delegate events to the element
     *
     * @desc I diminish fidelity to the Backbone API on 'element' parameter;
     * for our purposes, it makes more sense for 'element' to be an enyo
     * component, and not a DOM element. This is because enyo generates a
     * DOM element, whereas jQuery wraps an existing one.
     */
    setElement: function (element, delegate) {
      this.el = element;
    },

    /**
     * @override
     * Re-implemented for Enyo.
     */
    _ensureElement: function () {
      return !!this.el;
    },

    /**
     * @override
     * Unbind presenter event handlers.
     */
    undelegateEvents: function () {
      _(this.events).each(function (presenterEvent, modelEvent) {
        this.stopListening(this[this.backing], modelEvent);
      });
    }
  });
})();

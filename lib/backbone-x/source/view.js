(function () {
  "use strict";

  /**
   * MVP-E.
   * @author Travis Webb
   */
  XM.View = Backbone.View.extend({

    defaults: {
      backing: null
    },

    initialize: function () {

      if (this.model) {
        this.backing = 'model';
      }
      if (this.collection) {
        this.backing = 'collection';
      }

      this._super.initialize();
    }
  });

  XM.View.prototype._super = XM.Model.prototype._super;

  XM.EnyoView = Backbone.View.extend({

    /**
     * @member
     * @summary Map source events to Enyo events.
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
      this.$el.render();
      return this;
    },

    /**
     * @override
     */
    remove: function () {
      this.$el.destroy();
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
      _(this.events).each(function (presenterEvent, modelEvent) {

        // catch the event from the model
        this.listenTo(this[this.type], modelEvent, _(function (source, value) {
          var event = {
            originator: this,
            value: value
          };
          event[this.backing] = source;

          // re-package and send the event to the enyo component
          this.$el.bubble(presenterEvent, event);

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
      this.$el = element;
    },

    /**
     * @override
     * Re-implement for Enyo.
     */
    _ensureElement: function () {
      return this.$el.hasNode();
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

  /**
   * A view that binds automatically to a XM.Model's events.
   */
  XM.ModelView = XM.EnyoView.extend(/** @lends XM.EnyoView **/ {
    type: 'model'
  });

  /**
   * A view that binds automatically to a XM.Collection's events.
   */
  XM.CollectionView = XM.EnyoView.extend(/** @lends XM.EnyoView **/ {
    type: 'collection'
  });

})();

/*jshint unused:false, bitwise:false */

(function () {
  'use strict';

  /**
   * MVP-E.
   * @author travis@xtuple.com
   *
   * Separate the concerns of the presenter from those of the view.
   */
  XM.View = Backbone.View.extend();

  /**
   * @static
   *
   * Presenters call this method to bind to a View. The Presenter must have a
   * property called 'view' that defines the name of the View to bind to.
   * @example
   * enyo.kind({
   *    name: 'XV.MyWorkspace',
   *    kind: 'XV.Workspace',
   *    view: 'XM.MyWorkspaceView'
   *    ...
   * });
   */
  XM.View.setPresenter = function (presenter, type) {
    if (!presenter.view) {
      //console.warn('No view defined for presenter: ' + presenter.kind + '#' + type);
      return;
    }
    return new XM[presenter.view.suffix()]({
      presenter: presenter,
      type: type
    });
  };

  XM.EnyoView = XM.View.extend(/** @lends XM.EnyoView# */{

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
      **/
      },

      /**
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
        XXX TODO
        active:   [ 'isActive' ],
        italic:   [ 'name' ],
        hyperlink:[ 'primaryEmail', 'phone', 'webAddress' ],
      **/
      },

    },

    list: {
      /**
       * List which actions this list supports. 'method' and 'prerequisite'
       * are invoked on the model by default, unless 'isViewMethod' is set to
       * true.
       */
      actions: [ /** @example
        {name: 'deactivate'},
        {prerequisite: 'canDeactivate'},
        {method: 'deactivate'}
      **/
      ],

      /**
       * Describe the query used to populate/sort the list.
       */
      query: { /** @example
        orderBy: [
          {attribute: 'isActive', descending: true},
          {attribute: 'name}
        ]
      **/
      }
    },

    workspace: {

      template: {

      }

    },

    /**
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
    */
    },

    /**
     * This view prefers no knowledge of any jquery-ness, and since
     * implemented an MVP-like design, will refer to its 'el' as 'presenter'
     * instead.
     */
    $:   undefined,
    $el: undefined,
    el:  undefined,

    /**
     * Initialize this View by binding bi-directionally to the Presenter. The
     * Presenter should rarely/never invoke any view methods or properties
     * directly.
     *
     *
     * @param {enyo.Component}
     */
    initialize: function (properties) {
      this.presenter = properties.presenter;
      this.type = properties.type;
      this.presenter.viewInstance = this;
      this.model = this.presenter.value;

      this._mixin();
    },

    /**
     * @override
     */
    render: function () {
      this.presenter.render();
      return this;
    },

    /**
     * @override
     */
    remove: function () {
      this.presenter.destroy();
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
      if (!this.model) {
        return;
      }

      var that = this;

      _.each(this.events, function (presenterEvent, modelEvent) {

        // catch the event from the model
        that.listenTo(that.model, modelEvent, function (originator, params, options) {
          if (!that.presenter.value) {
            return;
          }

          // re-package and send the event to the enyo component
          that.presenter.bubble(presenterEvent, {
            model: originator,
            params: params,
            options: options
          });
        });
      });
    },

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
      this.presenter = element;
    },

    /**
     * @override
     * Re-implemented for Enyo.
     */
    _ensureElement: function () {
      return !!this.presenter;
    },

    /**
     * @override
     * Unbind presenter event handlers.
     */
    undelegateEvents: function () {
      _(this.events).each(function (presenterEvent, modelEvent) {
        this.stopListening(this[this.backing], modelEvent);
      });
    },

    /**
     * Mix some additional binding functionality into the Presenter, and
     * populate any published properties defined statically in the View.
     *
     * @param {String}  the type of Presenter
     */
    _mixin: function () {
      var view = this,
        presenter = view.presenter,
        _valueChanged = presenter.valueChanged;

      /**
       * Populate the Presenter with any statically-defined published fields
       * from the View. Bascally, a less forceful version of 'extend()'
       */
      _.each(view[view.type], function (value, key) {
        if (_.isObject(presenter[key]) && _.isObject(value)) {
          _.extend(presenter[key], value);
        }
        else if (_.isArray(presenter[key]) && _.isArray(value)) {
          _.union(presenter[key], value);
        }
        else {
          if (key === 'model') {
            // XXX can't setProperty on 'model' because we've broken the enyo API
            // by wrongly defining our own getFoo methods
            presenter[key] = value;
          }
          else {
            presenter.setProperty(key, value);
          }
        }
      });

      /**
        * @override
        * We want to know when the Presenter's backing model is changed
        * so we can bind to its events. The existing XV.Workspace, XV.List,
        * and XV.ListItem components all refer to the backing model using a
        * property called 'value'.
        */
      presenter.valueChanged = function () {
        view.model = presenter.value;
        view.delegateEvents();
        if (_.isFunction(_valueChanged)) {
          _valueChanged.call(presenter);
        }
      };
    }
  });
})();

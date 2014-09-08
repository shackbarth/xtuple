/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XV:true, XM:true, _:true, enyo:true*/

(function () {

  /**
    @name XV.SearchContainer
    @class High-level container showing a list of searchable items available to the advanced
    search widget.<br />
    Used for attaching documents, searching for relational widget values, etc.<br />
    Derived from <a href="http://enyojs.com/api/#enyo.Panels">enyo.Panels</a>.
    @extends enyo.Panels
   */
  enyo.kind(
    /** @lends XV.SearchContainer# */{
    name: "XV.SearchContainer",
    kind: "XV.SearchPanels",
    classes: 'xv-search',
    /**
     * Published fields
     * @type {Object}
     * @property {} callback
     *   Function to call when selection is made that passes back the selected model.
     * @property {} conditions
     *   Filter parameters that are not editable by the user.
     * @property {} defaultParameterItemValues
     *   Filter parameters applied to the parameter widget and that are editable by the user.
     * @todo What is the type for each of these properties?
     */
    published: {
      callback: null,
      conditions: null,
      defaultParameterItemValues: null,
      query: null
    },
    events: {
      onPrevious: ""
    },
    handlers: {
      onItemTap: "itemTap",
      onParameterChange: "requery"
    },
    components: [
      {kind: "FittableRows", name: "parameterPanel", components: [
        {kind: "onyx.Toolbar", components: [
          {kind: "font.TextIcon", name: "backButton", content: "_back".loc(),
            ontap: "close", icon: "chevron-left"}
        ]},
        {classes: "xv-header", content: "_search".loc()},
        {kind: "XV.ScrollableGroupbox", name: "parameterScroller", classes: "xv-search-container", fit: true}
      ]},
      {name: "listPanel", kind: "FittableRows", components: [
        // the onyx-menu-toolbar class keeps the popups from being hidden
        {kind: "onyx.MoreToolbar", name: "contentToolbar",
          classes: "onyx-menu-toolbar", movedClass: "xv-toolbar-moved", components: [
          {name: "rightLabel", content: "_search".loc(), classes: "xv-toolbar-label"},
          // The MoreToolbar is a FittableColumnsLayout, so this spacer takes up all available space
          {name: "spacer", classes: "spacer", fit: true},
          {kind: "font.TextIcon", name: "refreshButton",
              icon: "rotate-right", content: "_refresh".loc(), ontap: "requery"},
          {name: "search", kind: "onyx.InputDecorator",
            classes: "xv-search", components: [
            {name: 'searchInput', kind: "onyx.Input",
              placeholder: "_search".loc(), onchange: "requery"},
            {tag: "i", classes: "icon-search", name: "searchJump", ontap: "jump"}
          ]}
        ]},
        {name: "messageHeader", content: "", classes: ""},
        {name: "header", classes: "xv-header", showing: false},
        {name: "contentHeader"},
        {name: "contentPanels", kind: "Panels", margin: 0, fit: true,
          draggable: false, panelCount: 0, classes: "scroll-ios xv-content-panel"}
      ]}
    ],
    init: false,
    queryChanged: function (inSender, inEvent) {
      this.$.list.getValue().query = this.getQuery();
    },
    /**
    @todo Document the close method.
    */
    close: function (options) {
      this.doPrevious();
    },
    /**
     * @see XV.List#itemTap
     */
    itemTap: function (inSender, inEvent) {
      if (!inEvent.model) {
        return;
      }
      this.close();
      if (_.isFunction(this.callback)) {
        this.callback(inEvent.model);
      }
    },
    /**
    @todo Document the fetch method.
    */
    fetch: function (options) {
      if (!this.init) { return; }
      options = options ? _.clone(options) : {};
      var list = this.$.list,
        conditions = this.getConditions(),
        query,
        input,
        parameterWidget,
        parameters;
      if (!list) { return; }
      query = list.getQuery() || {};
      input = this.$.searchInput.getValue();
      parameterWidget = this.$.parameterWidget;
      parameters = parameterWidget && parameterWidget.getParameters ?
        parameterWidget.getParameters() : [];
      options.showMore = _.isBoolean(options.showMore) ?
        options.showMore : false;

      // Build conditions
      if (conditions || input || parameters.length) {

        // Fixed conditions
        query.parameters = conditions || [];

        // Input search parameters
        if (input && list.getSearchableAttributes().length === 0) {
          XT.log("Error: this model has no searchable attributes by default. You have to override " +
            "the getSearchableAttribute class method for this model if you want the simple search to work.");
        } else if (input) {
          query.parameters = query.parameters.concat([{
            attribute: list.getSearchableAttributes(),
            operator: 'MATCHES',
            value: this.$.searchInput.getValue()
          }]);
        }

        // Advanced parameters
        if (parameters) {
          query.parameters = query.parameters.concat(parameters);
        }
      } else {
        delete query.parameters;
      }
      list.setQuery(query);
      list.fetch(options);
    },
    /**
    @todo Document the defaultParameterItemValuesChanged method.
    */
    defaultParameterItemValuesChanged: function () {
      var parameterWidget = this.$.parameterWidget,
        items = this.getDefaultParameterItemValues() || [];
      if (parameterWidget && items.length) {
        parameterWidget.setParameterItemValues(items);
      }
    },
    /**
    @todo Document the requery method.
    */
    requery: function (inSender, inEvent) {
      this.fetch();
      return true;
    },
    /**
      @param {Object} Options
      @param {String} [options.list] Class name
      @param {Function} [options.callback] Function to call when selection is made. Passes back the selected model
      @param {Array} [options.conditions] Array of filter criteria not editable by the user
      @param {Array} [options.parameterItemValues] Array of default values

      @see {XM.ParameterWidget}
    */
    setList: function (options) {
      var component,
        list = options.list,
        callback = options.callback,
        searchText = options.searchText,
        conditions = options.conditions,
        params = options.parameterItemValues;

      component = this.createComponent({
        name: "list",
        container: this.$.contentPanels,
        kind: list,
        fit: true
      });
      this.$.rightLabel.setContent(component.label);
      this.setCallback(callback);
      this.setConditions(conditions);
      if (options.query && options.query !== {}) {
        this.setQuery(options.query);
      }
      if (component && component.getParameterWidget()) {
        this.createComponent({
          name: "parameterWidget",
          kind: component.getParameterWidget(),
          classes: "xv-parameter",
          showSaveFilter: false,
          showLayout: false,
          defaultParameters: null,
          container: this.$.parameterScroller,
          memoizeEnabled: false,
          fit: true
        });
      }
      this.setDefaultParameterItemValues(params);
      this.init = true;
      this.render();
      this.$.searchInput.setValue(searchText || "");
    }
  });

}());

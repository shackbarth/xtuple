/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
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
  enyo.kind(/** @lends XV.SearchContainer# */{
    name: "XV.SearchContainer",
    kind: "Panels",
    classes: "app enyo-unselectable",
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
    arrangerKind: "CollapsingArranger",
    components: [
      {name: "parameterPanel", kind: "FittableRows", classes: "left",
        components: [
        {kind: "onyx.Toolbar", classes: "onyx-menu-toolbar", components: [
          {kind: "onyx.Button", name: "backButton", content: "_back".loc(),
            ontap: "close"}
        ]},
        {name: "leftTitle", content: "_advancedSearch".loc(), classes: "xv-parameter-title"},
        {kind: "Scroller", name: "parameterScroller", fit: true}
      ]},

      {kind: "FittableRows", components: [
				// the onyx-menu-toolbar class keeps the popups from being hidden
        {kind: "onyx.MoreToolbar", name: "contentToolbar",
          classes: "onyx-menu-toolbar", movedClass: "xv-toolbar-moved", components: [
          {kind: "onyx.Grabber"},
          {name: "rightLabel", style: "width: 180px"},
          // The MoreToolbar is a FittableColumnsLayout, so this spacer takes up all available space
          {name: "spacer", content: "", fit: true},
          {name: "newButton", kind: "XV.IconButton",
            src: "/client/lib/enyo-x/assets/menu-icon-new.png", content: "_new".loc(),
            ontap: "newRecord", showing: false},
          {name: "refreshButton", kind: "XV.IconButton",
            src: "/client/lib/enyo-x/assets/menu-icon-refresh.png", content: "_refresh".loc(),
            ontap: "requery", showing: false},
          {name: "search", kind: "onyx.InputDecorator",
            showing: false, components: [
            {name: 'searchInput', kind: "onyx.Input", style: "width: 200px;",
              placeholder: "_search".loc(), onchange: "inputChanged"},
            {kind: "Image", src: "/client/lib/enyo-x/assets/search-input-search.png",
              name: "searchJump", ontap: "jump"}
          ]}
        ]},
        {name: "header", content: "", classes: ""},
        {name: "contentPanels", kind: "Panels", margin: 0, fit: true,
          draggable: false, panelCount: 0},
        {kind: "onyx.Popup", name: "errorPopup", centered: true,
          modal: true, floating: true, scrim: true, components: [
          {name: "errorMessage", content: "_error".loc()},
          {tag: "br"},
          {kind: "onyx.Button", content: "_ok".loc(), ontap: "errorOk",
            classes: "onyx-blue xv-popup-button"}
        ]},
        {name: "myAccountPopup", kind: "XV.MyAccountPopup"},
        {name: "deletePopup", kind: "onyx.Popup", centered: true, modal: true,
          floating: true, scrim: true, onHide: "popupHidden", components: [
          {content: "_confirmDelete".loc()},
          {content: "_confirmAction".loc()},
          {tag: "br"},
          {kind: "onyx.Button", content: "_cancel".loc(), ontap: "closeDeletePopup",
            classes: "xv-popup-button"},
          {kind: "onyx.Button", content: "_ok".loc(), ontap: "deleteOk",
            classes: "onyx-blue xv-popup-button"}
        ]
        }
      ]}
      /*
      {name: "listPanel", kind: "FittableRows", components: [
        {kind: "onyx.Toolbar", name: "contentToolbar", components: [
          {kind: "onyx.Grabber", classes: "left-float"},
          {name: "rightLabel", content: "_search".loc(), classes: "left-float"},
          {name: "search", kind: "onyx.InputDecorator", classes: "right-float",
            components: [
            {name: 'searchInput', kind: "onyx.Input", style: "width: 200px;",
              placeholder: "_search".loc(), onchange: "requery"},
            {kind: "Image", src: "/client/lib/enyo-x/assets/search-input-search.png"}
          ]}
        ]}
      ]}
      */
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
    @todo Document the itemTap method.
    */
    itemTap: function (inSender, inEvent) {
      var list = inEvent.list,
        value = list ? list.getModel(inEvent.index) : null;

      if (value) {
        if (this.callback) { this.callback(value); }
        this.close();
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
        container: this.$.contentPanel,
        kind: list,
        fit: true
      });
      this.$.rightLabel.setContent(component.label);
      this.setCallback(callback);
      this.setConditions(conditions);
      if (options.query && options.query !== {}) {
        this.setQuery(options.query);
      }
      if (component) {
        this.createComponent({
          name: "parameterWidget",
          container: this.$.parameterScroller,
          kind: component.getParameterWidget(),
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

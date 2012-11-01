/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XV:true, XM:true, _:true, enyo:true*/

(function () {

  /**
    High-level container showing a list of searchable items with the advanced
    search widget available. Used for attaching documents, searching for
    relational widget values, etc.

    @class
    @name XV.SearchContainer
  */
  enyo.kind(/** @lends XV.SearchContainer */{
    name: "XV.SearchContainer",
    kind: "Panels",
    classes: "app enyo-unselectable",
    published: {
      callback: null,
      conditions: null
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
        {name: "leftTitle", content: "_advancedSearch".loc(), classes: "xv-parameter-title"}
      ]},
      {name: "listPanel", kind: "FittableRows", components: [
        {kind: "onyx.Toolbar", name: "contentToolbar", components: [
          {kind: "onyx.Grabber"},
          {name: "rightLabel", content: "_search".loc(), style: "text-align: center"},
          {name: "search", kind: "onyx.InputDecorator", style: "float: right;",
            components: [
            {name: 'searchInput', kind: "onyx.Input", style: "width: 200px;",
              placeholder: "_search".loc(), onchange: "requery"},
            {kind: "Image", src: "lib/enyo-x/assets/search-input-search.png"}
          ]}
        ]}
      ]}
    ],
    init: false,
    close: function (options) {
      this.doPrevious();
    },
    itemTap: function (inSender, inEvent) {
      var list = inEvent.list,
        value = list ? list.getModel(inEvent.index) : null;

      if (value) {
        if (this.callback) { this.callback(value); }
        this.close();
      }
    },
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
        if (input) {
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
    requery: function (inSender, inEvent) {
      this.fetch();
      return true;
    },
    /**
      Set the search list. Options are
        * list: class name
        * searchText: initial text to search on
        * callback: function to call when selection is made
          that passes back the selected model.
    */
    setList: function (options) {
      var component,
        list = options.list,
        callback = options.callback,
        searchText = options.searchText,
        conditions = options.conditions;
      component = this.createComponent({
        name: "list",
        container: this.$.listPanel,
        kind: list,
        fit: true
      });
      this.$.rightLabel.setContent(component.label);
      this.setCallback(callback);
      this.setConditions(conditions);
      if (component) {
        this.createComponent({
          name: "parameterWidget",
          container: this.$.parameterPanel,
          kind: component.getParameterWidget(),
          fit: true
        });
      }
      this.init = true;
      this.render();
      this.$.searchInput.setValue(searchText || "");
    }
  });

}());

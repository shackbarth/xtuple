/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XV:true, XM:true, _:true, enyo:true*/

(function () {

  enyo.kind(
    /** @lends XV.SortPopup# */{
    name: "XV.SortPopup",
    kind: "onyx.Popup",
    classes: "xv-sort-popup",
    centered: true,
    floating: true,
    modal: true,
    autoDismiss: false,
    scrim: true,
    published: {
      list: null,
      nav: null
    },
    components: [
      {kind: "FittableRows", components: [
        {kind: "XV.Groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_sortBy".loc()},
          {kind: "FittableColumns", components: [
            {kind: "XV.AttributePicker", name: "sortPicker1"},
            {kind: "XV.SortTypePicker", name: "sortTypePicker1"}
          ]},
        ]},
        {kind: "XV.Groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_then".loc()},
          {kind: "FittableColumns", components: [
            {kind: "XV.AttributePicker", name: "sortPicker2"},
            {kind: "XV.SortTypePicker", name: "sortTypePicker2"}
          ]},
        ]},
        {kind: "XV.Groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_then".loc()},
          {kind: "FittableColumns", components: [
            {kind: "XV.AttributePicker", name: "sortPicker3"},
            {kind: "XV.SortTypePicker", name: "sortTypePicker3"}
          ]},
        ]},
        {classes: "xv-button-bar", components: [
          {kind: "onyx.Button", name: "sortListButton", ontap: "sortList",
            content: "_sort".loc()},
          {kind: "onyx.Button", name: "cancelButton", ontap: "closePopup",
            content: "_cancel".loc()}
        ]}
      ]}
    ],
    closePopup: function (inSender, inEvent) {
      this.hide();
    },
    /**
      Get previous sort information from the User Preference table
      and set this information and set the picker selections.
    */
    getSort: function (inSender, inEvent) {
      var params = {},
        lastSort;

      lastSort = XT.DataSource.getUserPreference(this.list.kind);
      if (lastSort && lastSort !== "null") {
        params = JSON.parse(lastSort);
      }
      this.setPickerSelections(params);
    },
    /**
      Set sort and type pickers with values in params object.
      The attribute and type values are separated into arrays
      of values in the parameter object.
    */
    setPickerSelections: function (params) {
      var picker, param,
        sortPickers, typePickers,
        sortPicker, typePicker,
        sort, type;

      // Create arrays of sort and type pickers
      sortPickers = _.filter(_.values(this.$), function (widget) {
        return widget.kind === "XV.AttributePicker";
      });
      typePickers = _.filter(_.values(this.$), function (widget) {
        return widget.kind === "XV.SortTypePicker";
      });

      // Each sort picker will always have a corresponding type
      // picker so they can be taken care of in the same loop.
      for (var i = 0; i < sortPickers.length; i++) {
        sortPicker = sortPickers[i];
        typePicker = typePickers[i];
        sort = params.attrs ? params.attrs[i] : null;
        type = params.types ? params.types[i] : null;
        sortPicker.setValue(sort);
        typePicker.setValue(type);
      }
    },
    /**
      Gets the list of sortable attributes from the list, filters by the
      fields that are currently seen and sets the component list in the pickers.
    */
    setPickerStrings: function (inSender, inEvent) {
      var attrs = [],
        allAttributes = [],
        currentAttributes = [];

      // Get the full list of sortable attribute names from the list
      allAttributes = this.list.getDisplayAttributes();
      // Get the array of list attribute kinds currently being displayed
      currentAttributes = this.list.getCurrentListAttributes();

      // filter the list of attributes to only inlude those viewable in the current list
      attrs = _.intersection(allAttributes, currentAttributes);

      // Set the list of attribute values for the pickers
      _.each(this.$, function (widget) {
        if (widget.kind === "XV.AttributePicker") {
          widget.setComponentsList(attrs);
        }
      });

      // fix for enyo popup + picker rendering issue, may affect scrolling
      this.render();
      // get existing sort values
      this.getSort();
    },
    /**
      Gets the sort parameters from the pickers and applies the sort to the list
      query. Saves the selected sort parameters as a user preference.
    */
    sortList: function (inSender, inEvent) {
      var attrs = [],
        types = [],
        list = this.getList(),
        query = list.getQuery(),
        orderBy = [],
        options,
        params = {},
        operation,
        payload;

      _.each(this.$, function (widget) {
        if (widget.kind === "XV.AttributePicker") {
          if (widget.value) {
            attrs.push(widget.getValue().id);
          }
        } else if (widget.kind === "XV.SortTypePicker") {
          if (widget.value) {
            types.push(widget.getValue().id);
          }
        }
      });

      // Add these selections to the params object
      params.attrs = attrs;
      params.types = types;

      for (var i = 0; i < attrs.length; i++) {
        orderBy.push({attribute: attrs[i], descending: types[i] === "descending"});
      }
      // ***this id attribute must always be added to the end of all sorts
      orderBy.push({attribute: "id"});

      // Do a dispatch to save the params as a User Preference
      payload = JSON.stringify(params);
      operation = XT.DataSource.getUserPreference(this.list.kind) ? "replace" : "add";
      XT.DataSource.saveUserPreference(this.list.kind, payload, operation);
      XT.session.preferences.set(this.list.kind, payload);

      //refresh list and close popup
      query.orderBy = orderBy;
      list.queryChanged(); // Using "Set" wouldn't help here because query is a pointer
      this.getNav().requery();
      this.closePopup();
    }
  });

}());

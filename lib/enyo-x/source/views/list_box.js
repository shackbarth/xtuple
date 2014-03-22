/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, bitwise:false*/
/*global XT:true, XM:true, XV:true, enyo:true, Globalize:true, _:true */

(function () {

  // ..........................................................
  // LIST BOX
  //

  /**
    @name XV.ListBox
    @class Provides a container for lists in which its components are a vertically stacked group
    of horizontal rows.<br />
    Made up of a header, scroller (with a list of related data).

    When `filterComponents` are present a filter icon will appear in the header that when
    tapped will slide open a drawer containing the contents of `filterComponents`. It is
    the responsibility of the developer to implement interactive behavior between those
    components and the list.

    @extends XV.Groupbox
  */
  enyo.kind(
    /** @lends XV.ListBox# */{
    name: "XV.ListBox",
    kind: "XV.Groupbox",
    classes: "panel",
    published: {
      attr: null,
      value: null,
      title: "",
      list: "",
      filterComponents: null
    },
    events: {
      onNotify: "",
      onSearch: "",
      onWorkspace: ""
    },
    /**
     Builds the box that contains the list of relationships: a group box comprised of a header, a scrollable list.
     */
    create: function () {
      this.inherited(arguments);
      var filterComponents = this.getFilterComponents(),
        list,
        header;

      // Header
      header = {
        kind: "onyx.GroupboxHeader",
        style: "display: flex;",
        components: [{content: this.getTitle()}]
      };
      if (filterComponents) {
        header.components.push({
          name: "filterIcon",
          classes: "icon-filter",
          ontap: "filterTapped",
          style: "position: absolute; right: 25px;"
        });
      }
      this.createComponent(header);

      if (filterComponents) {
        this.createComponent(
          {name: "filterDrawer", kind: "onyx.Drawer", open: false,
            components: filterComponents}
        );
      }

      // List
      list = this.createComponent({
        kind: this.getList(),
        name: "list",
        attr: this.getAttr(),
        fit: true
      });

      // List Header
      if (list.headerComponents) {
        this.createComponent({
          name: "listHeader",
          components: list.headerComponents,
          addBefore: list
        });
      }
    },
    filterTapped: function () {
      this.$.filterDrawer.setOpen(!this.$.filterDrawer.open);
    }
  });

}());

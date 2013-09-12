/*jshint node:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, Globalize:true, enyo:true, _:true */

(function () {

  /**
    @name XV.LayoutTree
    @class Tree widget for the layout
    @extends XV.Tree
   */
  enyo.kind({
    name: "XV.LayoutTree",
    kind: "XV.Tree",
    content: "_currentLayout".loc(),
    published: {
      listAttrs: null,
      fieldCount: 0
    },
    /**
      Resets the field count each time the tree is re-built without
      messing with the recursive nature of the function.
    */
    createTree: function (source, tree) {
      this.setFieldCount(0);
      this.buildTree(source, tree);
    },
    /**
      Recursively builds tree based on the source (List component). The Row and
      Column nodes just have a text + incremented number content. The List Attribute nodes
      accept the current attribute, the current list of available attribute choices, and the
      allowLayout boolean from the XV.ListAttr control for creation of its picker widget.
      This will be overriden by children of this widget to fit their individual needs.
    */
    buildTree: function (source, tree) {
      if (!source) { return; }
      var node = tree ? tree : this.$.tree,
        controls = source.getControls(),
        rowCount = 0,
        columnCount = 0;
      for (var i = 0; i < controls.length; i++) {
        var c, newComponent;
        if (controls[i].kind === "XV.ListItem") {
          rowCount++;
          c = {kind: "XV.TreeNode", content: "_row".loc() + " " + rowCount, owner: this};
        } else if (controls[i].kind === "XV.ListColumn") {
          columnCount++;
          c = {kind: "XV.TreeNode", content: "_column".loc() + " " + columnCount, owner: this};
        } else if (controls[i].kind === "XV.ListAttr") {
          this.fieldCount++;
          c = {kind: "XV.ListAttrNode", attr: controls[i].attr, order: this.fieldCount,
            currentList: this.getListAttrs(), disabled: !controls[i].allowLayout, owner: this};
        } else {
          // this isn't the node that we're looking for
          c = null;
        }
        // if this isn't a valid node, just sent the current node
        // as the parent back into the function
        newComponent = c ? node.createComponent(c) : node;

        // recurse back into this function with the new component
        this.buildTree(controls[i], newComponent);
      }
    }
  });

  /**
    @name XV.ListAttrNode
    @class This is a TreeNode widget that is meant to serve as a leaf
    in a tree with a picker widget. This picker holds a list of readable
    attribute names for selection.
    @extends Node
   */
  enyo.kind({
    name: "XV.ListAttrNode",
    kind: "XV.TreeNode",
    expandable: false,
    expanded: false,
    published: {
      attr: null, // this is the current attribute
      currentList: null, // this is the list of available attributes
      order: null, // this is the number of the field

    },
    handlers: {
      onValueChange: "valueChanged"
    },
    components: [
      {name: "icon", kind: "Image", showing: false},
      // we're naming this "caption" because we're stomping on the Node's component array
      {kind: "XV.AttributePicker", showLabel: true, name: "caption", label: "_field".loc()}
    ],
    attrChanged: function () {
      this.$.caption.setValue(this.getAttr(), {silent: true});
    },
    create: function () {
      this.inherited(arguments);
      this.currentListChanged();
      this.$.caption.setDisabled(this.disabled);
    },
    currentListChanged: function () {
      this.inherited(arguments);
      // this takes the current list of attributes and formats
      //  them for use in this picker
      this.$.caption.setComponentsList(this.getCurrentList());
      // set the value of this picker silently
      this.$.caption.setValue(this.getAttr(), {silent: true});
    },
    valueChanged: function (inSender, inEvent) {
      this.setAttr(inEvent.value);
    }
  });

}());

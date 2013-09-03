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
    /**
      Recursively builds tree based on source. This will be overriden by
      children of this widget to fit their individual needs.
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
          c = {kind: "XV.TreeNode", content: "_row".loc() + " " + rowCount};
        } else if (controls[i].kind === "XV.ListColumn") {
          columnCount++;
          c = {kind: "XV.TreeNode", content: "_column".loc() + " " + columnCount};
        } else if (controls[i].kind === "XV.ListAttr") {
          c = {kind: "XV.ListAttrNode", attr: controls[i].attr};
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
    @class This is a Tree Node widge that is meant to server as a leaf
    with a picker widget.
    @extends Node
   */
  enyo.kind({
    name: "XV.ListAttrNode",
    kind: "XV.TreeNode",
    expandable: false,
    expanded: false,
    published: {
      attr: null
    },
    components: [
      {name: "icon", kind: "Image", showing: false},
      // we're naming this "caption" because we're stomping on the Node's component array
      {kind: "XV.PickerWidget", name: "caption", label: "_attr".loc()}
    ],
  });

}());

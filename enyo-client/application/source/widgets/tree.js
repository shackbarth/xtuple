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
    content: "_layout".loc(),
    /**
      Recursively builds tree based on source. This will be overriden by
      children of this widget to fit their individual needs.
    */
    buildTree: function (source, tree) {
      if (!source) { return; }
      var node = tree ? tree : this.$.tree,
        controls = source.getControls();
      for (var i = 0; i < controls.length; i++) {
        var c, newComponent;
        if (controls[i].kind === "XV.ListItem") {
          c = {kind: "XV.TreeNode", content: "_row".loc()};
        } else if (controls[i].kind === "XV.ListColumn") {
          c = {kind: "XV.TreeNode", content: "_column".loc()};
        } else if (controls[i].kind === "XV.ListAttr") {
          c = {kind: "XV.ListAttrNode"};
        } else {
          c = {kind: "XV.TreeNode", content: controls[i].kind}; // this isn't a node we recognize
        }
        newComponent = node.createComponent(c, {owner: node});
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
    content: "I am a picker widget",
    expandable: false,
    expanded: false
  });

}());

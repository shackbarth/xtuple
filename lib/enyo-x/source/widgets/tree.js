/*jshint node:true, indent:2, curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, trailing:true, white:true */
/*global XT:true, Globalize:true, enyo:true, _:true */

(function () {

  /**
    @name XV.Tree
    @class A control that allows for building a hierarchial view
    @extends FittableRows
   */
  enyo.kind(
    /** @lends XV.Tree# */{
    name: "XV.Tree",
    kind: "FittableRows",
    fit: true,
    classes: "xv-tree",
    components: [
      {kind: "Node", name: "tree", content: "", expandable: true, expanded: true}
    ],
    /**
      Recursively builds tree based on source. This will be overriden by
      children of this widget to fit their individual needs.
    */
    buildTree: function (source, tree) { return true; },
    /**
      Set the text of the top tree node based on content
      passed in by the widget.
    */
    contentChanged: function () {
      this.$.tree.setContent(this.getContent());
    },
    create: function () {
      this.inherited(arguments);
      this.contentChanged();
    }
  });

  /**
    @name XV.TreeNode
    @class This serves as a generic node in a Tree Widget
    @extends Node
   */
  enyo.kind(/** @lends XV.TreeNode# */{
    name: "XV.TreeNode",
    kind: "Node",
    expandable: true,
    expanded: true,
    classes: "xv-tree-node"
  });

}());

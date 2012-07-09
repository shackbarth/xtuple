/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true white:true*/
/*global XT:true, enyo:true, Globalize:true */

(function () {
  "use strict";

  enyo.kind({
    name: "XT.Workspace",
    kind: "Control",
    published: {
      model: null
    },
    components: [
      { kind: "onyx.Groupbox", components: [
        //{ kind: "onyx.GroupboxHeader", content: "Workspace" },
        { content: "", name: "firstContent", style: "padding: 8px; margin: 20px; width: 400px; background-color: white;" },
        { content: "", name: "secondContent", style: "padding: 8px; margin: 20px; width: 400px; background-color: white;" },
        {
          content: "",
          name: "sandboxHaha",
          components: [
            { kind: "DateWidget" }
          ],
          style: "padding: 8px; margin: 20px; width: 400px; background-color: white;"
        }
      ]}
    ],
    style: "background-color: blue",
    modelChanged: function () {
      this.$.firstContent.setContent(this.getModel().get("name"));
      this.$.secondContent.setContent(JSON.stringify(this.getModel().toJSON()));
    }

  });

}());


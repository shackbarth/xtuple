/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {
 
  XT.extensions.incidentPlus.initListRelationsBox = function () {
    
    // ..........................................................
    // PROJECT
    //
    
    enyo.kind({
      name: "XV.ProjectVersionEditor",
      kind: "XV.RelationsEditor",
      components: [
        {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
          classes: "in-panel", components: [
          {kind: "XV.InputWidget", attr: "version"}
        ]}
      ]
    });
    
    enyo.kind({
      name: "XV.ProjectVersionBox",
      kind: "XV.ListRelationsEditorBox",
      title: "_versions".loc(),
      editor: "XV.ProjectVersionEditor",
      parentKey: "project",
      listRelations: "XV.ProjectVersionListRelations"
    });
    
  };

}());

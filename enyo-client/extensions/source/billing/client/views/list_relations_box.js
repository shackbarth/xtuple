/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

  XT.extensions.billing.initListRelationsBox = function () {

    // ..........................................................
    // RECEIVABLE TAXES
    //
    enyo.kind({
      name: "XV.ReceivableTaxEditor",
      kind: "XV.RelationsEditor",
      components: [
        {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
          classes: "in-panel", components: [
          {kind: "XV.InputWidget", attr: "taxCode"},
          {kind: "XV.NumberWidget", attr: "amount"},
        ]}
      ]
    });

    enyo.kind({
      name: "XV.ReceivableTaxBox",
      kind: "XV.ListRelationsEditorBox",
      title: "_tax".loc(),
      editor: "XV.ReceivableTaxEditor",
      parentKey: "receivable",
      listRelations: "XV.ReceivableTaxListRelations"
    });

    // ..........................................................
    // RECEIVABLE APPLICATIONS
    //

    enyo.kind({
      name: "XV.ReceivableApplicationsListRelationsBox",
      kind: "XV.ListRelationsBox",
      title: "_applications".loc(),
      parentKey: "receivable",
      listRelations: "XV.ReceivableApplicationListRelations"
    });

  };

}());

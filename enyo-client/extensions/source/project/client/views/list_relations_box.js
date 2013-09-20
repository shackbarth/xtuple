/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

  XT.extensions.project.initListRelationsBox = function () {
    // ..........................................................
    // ACCOUNT
    //

    enyo.kind({
      name: "XV.AccountProjectsBox",
      kind: "XV.ListRelationsBox",
      title: "_projects".loc(),
      parentKey: "account",
      listRelations: "XV.AccountProjectListRelations",
      searchList: "XV.ProjectList"
    });

    // ..........................................................
    // CONTACT
    //

    enyo.kind({
      name: "XV.ContactProjectsBox",
      kind: "XV.ListRelationsBox",
      title: "_projects".loc(),
      parentKey: "contact",
      listRelations: "XV.ContactProjectListRelations",
      searchList: "XV.ProjectList"
    });
    
  };

}());

/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XV:true, enyo:true*/

(function () {
  
  XT.extensions.incidentPlus.initListRelations = function () {
    
    // ..........................................................
    // ACCOUNT
    //

    enyo.kind({
      name: "XV.ProjectVersionListRelations",
      kind: "XV.ListRelations",
      orderBy: [
        {attribute: 'version', descending: true}
      ],
      parentKey: "project",
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "first", components: [
              {kind: "FittableColumns", components: [
                {kind: "XV.ListAttr", attr: "version", classes: "bold"}
              ]}
            ]}
          ]}
        ]}
      ]
    });
    
  };

}());

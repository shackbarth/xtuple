/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true, strict:false*/
/*global XT:true, XV:true, XM:true, Globalize:true, enyo:true*/

(function () {

  XT.extensions.project.initLists = function () {

    // ..........................................................
    // PROJECT EMAIL PROFILE
    //

    enyo.kind({
      name: "XV.ProjectEmailProfileList",
      kind: "XV.EmailProfileList",
      label: "_projectEmailProfiles".loc(),
      collection: "XM.ProjectEmailProfileCollection"
    });

    // ..........................................................
    // PROJECT TYPE
    //

    enyo.kind({
      name: "XV.ProjectTypeList",
      kind: "XV.List",
      label: "_projectTypes".loc(),
      collection: "XM.ProjectTypeCollection",
      query: {orderBy: [
        {attribute: "code"}
      ]},
      components: [
        {kind: "XV.ListItem", components: [
          {kind: "FittableColumns", components: [
            {kind: "XV.ListColumn", classes: "short",
              components: [
              {kind: "XV.ListAttr", attr: "code", isKey: true}
            ]},
            {kind: "XV.ListColumn", classes: "last", fit: true, components: [
              {kind: "XV.ListAttr", attr: "description"}
            ]}
          ]}
        ]}
      ]
    });

  };

}());

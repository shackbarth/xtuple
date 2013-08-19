/*jshint bitwise:true, indent:2, curly:true, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true, white:true*/
/*global XT:true, XV:true, XM:true, _:true, enyo:true*/

(function () {

  enyo.kind({
    name: "XV.SortPopup",
    kind: "onyx.Popup",
    classes: "xv-sort-popup",
    centered: true,
    floating: true,
    modal: true,
    autoDismiss: false,
    scrim: true,
    published: {
      list: null,
      nav: null
    },
    components: [
      {kind: "FittableRows", components: [
        {kind: "XV.Groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_sortBy".loc()},
          {kind: "FittableColumns", components: [
            {kind: "XV.SortPicker", name: "sortPicker1"},
            {kind: "XV.SortTypePicker", name: "sortTypePicker1"}
          ]},
        ]},
        {kind: "XV.Groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_then".loc()},
          {kind: "FittableColumns", components: [
            {kind: "XV.SortPicker", name: "sortPicker2"},
            {kind: "XV.SortTypePicker", name: "sortTypePicker2"}
          ]},
        ]},
        {kind: "XV.Groupbox", components: [
          {kind: "onyx.GroupboxHeader", content: "_then".loc()},
          {kind: "FittableColumns", components: [
            {kind: "XV.SortPicker", name: "sortPicker3"},
            {kind: "XV.SortTypePicker", name: "sortTypePicker3"}
          ]},
        ]},
        {classes: "xv-button-bar", components: [
          {kind: "onyx.Button", name: "sortListButton", ontap: "sortList",
            content: "_sort".loc()},
          {kind: "onyx.Button", name: "cancelButton", ontap: "closePopup",
            content: "_cancel".loc()}
        ]}
      ]}
    ],
    closePopup: function (inSender, inEvent) {
      this.hide();
    },
    getSort: function (inSender, inEvent) {
      var params,
        lastSort,
        kindAndList = this.kind + "_" + this.list.name;

      lastSort = XT.DataSource.getUserPreference(kindAndList);

      if (lastSort && lastSort !== "null") {
        params = JSON.parse(lastSort);
      }
      else {
        params = {listName: this.list.name};
      }

      this.setPickerSelections(params);
    },
    setPickerSelections: function (params) {
      var picker1 = this.$.sortPicker1.$.picker,
        picker2 = this.$.sortPicker2.$.picker,
        picker3 = this.$.sortPicker3.$.picker,
        type1 = this.$.sortTypePicker1.$.picker,
        type2 = this.$.sortTypePicker2.$.picker,
        type3 = this.$.sortTypePicker3.$.picker,
        param1 = params.attr1 ? params.attr1 : picker1.getComponents()[2].attr,
        param2 = params.attr2 ? params.attr2 : picker2.getComponents()[1].attr,
        param3 = params.attr3 ? params.attr3 : picker3.getComponents()[1].attr,
        param4 = params.type1 ? params.type1 : type1.getComponents()[1].attr,
        param5 = params.type2 ? params.type2 : type2.getComponents()[1].attr,
        param6 = params.type3 ? params.type3 : type3.getComponents()[1].attr;


      picker1.setSelected(this.$.sortPicker1.findItemByAttr(param1));
      picker2.setSelected(this.$.sortPicker2.findItemByAttr(param2));
      picker3.setSelected(this.$.sortPicker3.findItemByAttr(param3));
      type1.setSelected(this.$.sortTypePicker1.findItemByAttr(param4));
      type2.setSelected(this.$.sortTypePicker2.findItemByAttr(param5));
      type3.setSelected(this.$.sortTypePicker3.findItemByAttr(param6));
    },
    setPickerStrings: function (inSender, inEvent) {
      var attrs = [],
        attrsToCompare = this.list.getModel(0).getAttributeNames(),
        activePanel = this.nav.$.contentPanels.getActive(),
        baseModel = XT.getObjectByName(activePanel.collection).prototype.model.prototype.editableModel,
        baseModelAttrs = XT.getObjectByName(baseModel).getAttributeNames(),
        relations = XT.getObjectByName(activePanel.collection).prototype.model.prototype.relations,
        modelsOfThoseRelations =
          _.map(_.filter(relations, function (rel) { 
            return _.contains(baseModelAttrs, rel.key);  
          }), function (rel) {
            var proto = XT.getObjectByName(rel.relatedModel).prototype;
            return proto.editableModel || proto.recordType;
          }),
        splitString,
        allRelationAttributes = [" "];

      for (var i = 0; i < modelsOfThoseRelations.length; i++) {
                allRelationAttributes = XT.getObjectByName(modelsOfThoseRelations[i]).getAttributeNames().concat(allRelationAttributes);
      }

      _.each(this.list.$, function(enyoObj) {
        if (enyoObj.attr) {
          //attrs.push(enyoObj.attr);
          if (enyoObj.attr.indexOf('.') !== -1) {
            sliced = enyoObj.attr.split('.');
            if (allRelationAttributes.indexOf(sliced[sliced.length - 1]) !== -1) {
              attrs.push(enyoObj.attr);
            }
          }
          else {
            attrs.push(enyoObj.attr)
          }
        }
      });

      this.$.sortPicker1.setComponentsList(attrs);
      this.$.sortPicker2.setComponentsList(attrs);
      this.$.sortPicker3.setComponentsList(attrs);

      this.getSort();
    },
    sortList: function (inSender, inEvent) {
    //calling getSelected on this.$.sortPicker1.$.picker returns undefined
    // our itemSelected function on this.$.sortPicker1 doesn't work either
      var attr1 = this.$.sortPicker1.attr,
        attr2 = this.$.sortPicker2.attr,
        attr3 = this.$.sortPicker3.attr,
        attr1type = this.$.sortTypePicker1.getValueToString().toLowerCase(),
        attr2type = this.$.sortTypePicker2.getValueToString().toLowerCase(),
        attr3type = this.$.sortTypePicker3.getValueToString().toLowerCase(),
        query = [];

      if (attr1 !== "none" && attr1) {
        query.push({attribute: attr1, descending: attr1type === "descending"});
      }
      if (attr2 !== "none" && attr2) {
        query.push({attribute: attr2, descending: attr2type === "descending"});
      }
      if (attr3 !== "none" && attr3) {
        query.push({attribute: attr3, descending: attr3type === "descending"});
      }

      if ((attr1 === "none" || !attr1) &&
          (attr2 === "none" || !attr2) &&
          (attr3 === "none" || !attr3)) {
        query.push({attribute: "id"});
      }

      //handle sort user pref saving
      var options,
        params = {},
        kindAndList = this.kind + "_" + this.list.name,
        operation,
        payload;
      params.listName = this.list.name;
      params.attr1 = this.$.sortPicker1.$.picker.getSelected().attr;
      params.attr2 = this.$.sortPicker2.$.picker.getSelected().attr;
      params.attr3 = this.$.sortPicker3.$.picker.getSelected().attr;
      params.type1 = this.$.sortTypePicker1.$.picker.getSelected().attr;
      params.type2 = this.$.sortTypePicker2.$.picker.getSelected().attr;
      params.type3 = this.$.sortTypePicker3.$.picker.getSelected().attr;

      payload = JSON.stringify(params);

      operation = XT.DataSource.getUserPreference(kindAndList) ? "replace" : "add";
      XT.DataSource.saveUserPreference(kindAndList, payload, operation);

      XT.session.preferences.set(kindAndList, payload);

      //refresh list and close popup
      this.getList().getQuery().orderBy = query;
      this.getNav().requery();
      this.closePopup();
    }
  });

}());

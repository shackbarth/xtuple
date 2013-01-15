// ..........................................................
// HONORIFIC
//

/**
  @class A combobox backed by the XM.honorifics collection.
  @name XV.HonorificCombobox
  @extends XV.Combobox
 */
enyo.kind(/** @lends XV.HonorificCombobox# */{
  name: "XV.HonorificCombobox",
  kind: "XV.ComboboxWidget",
  keyAttribute: "code",
  label: "_honorific".loc(),
  collection: "XM.honorifics"
});
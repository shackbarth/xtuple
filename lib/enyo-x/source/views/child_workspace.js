/*jshint bitwise:false, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XV:true, XM:true, _:true, onyx:true, enyo:true, XT:true */

(function () {

  enyo.kind({
    name: "XV.ChildWorkspaceContainer",
    kind: "XV.WorkspaceContainer",
    components: [
      {kind: "FittableRows", name: "navigationPanel", classes: "left", components: [
        {kind: "onyx.Toolbar", name: "menuToolbar", components: [
          {kind: "onyx.Button", name: "backButton",
            content: "_back".loc(), onclick: "close"}
        ]},
        {name: "loginInfo", content: "", classes: "xv-navigator-header"},
        {name: "menu", kind: "List", fit: true, touch: true,
           onSetupItem: "setupItem", components: [
          {name: "item", classes: "item enyo-border-box", ontap: "itemTap"}
        ]}
      ]},
      {kind: "FittableRows", name: "contentPanel", components: [
        {kind: "onyx.MoreToolbar", name: "contentToolbar", components: [
          {kind: "onyx.Grabber"},
          {name: "title", style: "width: 200px"},
					// The MoreToolbar is a FittableColumnsLayout, so this spacer takes up all available space
          {name: "space", fit: true},
          {kind: "Image", showing: false, name: "lockImage", ontap: "lockTapped",
            src: "/client/lib/enyo-x/assets/menu-icon-lock.png"},
          {kind: "onyx.Button", name: "refreshButton", disabled: true,
            content: "_previous".loc(), onclick: "previous"},
          {kind: "onyx.Button", name: "applyButton", disabled: true,
            content: "_next".loc(), onclick: "next"},
          {kind: "onyx.Button", name: "saveAndNewButton", disabled: true,
            content: "_back".loc(), onclick: "back"},
          {kind: "onyx.Button", name: "saveAndNewButton", disabled: true,
            content: "_new".loc(), onclick: "new"}
        ]},
        {name: "header", content: "_loading".loc(), classes: "xv-workspace-header"},
        {kind: "onyx.Popup", name: "spinnerPopup", centered: true,
          modal: true, floating: true, scrim: true,
          onHide: "popupHidden", components: [
          {kind: "onyx.Spinner"},
          {name: "spinnerMessage", content: "_loading".loc() + "..."}
        ]},
        {kind: "onyx.Popup", name: "unsavedPopup", centered: true,
          modal: true, floating: true, scrim: true,
          onHide: "popupHidden", components: [
          {content: "_unsavedChanges".loc() },
          {content: "_saveYourWork?".loc() },
          {tag: "br"},
          {kind: "onyx.Button", content: "_discard".loc(), ontap: "unsavedDiscard",
            classes: "xv-popup-button"},
          {kind: "onyx.Button", content: "_cancel".loc(), ontap: "unsavedCancel",
            classes: "xv-popup-button"},
          {kind: "onyx.Button", content: "_save".loc(), ontap: "unsavedSave",
            classes: "onyx-blue xv-popup-button"}
        ]},
        // This is used by notify and could be used by other things as well.
        // We just don't want to break the api by re-naming it
        {kind: "onyx.Popup", name: "errorPopup", centered: true,
          modal: true, floating: true, scrim: true, components: [
          {name: "errorMessage", content: "_error".loc()},
          {tag: "br"},
          {kind: "onyx.Button", content: "_ok".loc(), ontap: "errorOk",
            classes: "onyx-blue xv-popup-button"}
        ]},
        {kind: "onyx.Popup", name: "lockPopup", centered: true,
          modal: true, floating: true, components: [
          {name: "lockMessage", content: ""},
          {tag: "br"},
          {kind: "onyx.Button", content: "_ok".loc(), ontap: "lockOk",
            classes: "onyx-blue xv-popup-button"}
        ]}
      ]}
    ],
    statusChanged: function (inSender, inEvent) {
      var model = inEvent.model,
        K = XM.Model,
        status = inEvent.status,
        isNotReady = status !== K.READY_CLEAN && status !== K.READY_DIRTY,
        canCreate = model.getClass().canCreate(),
        canUpdate = model.canUpdate() || status === K.READY_NEW,
        isEditable = canUpdate && !model.isReadOnly(),
        canNotSave = !model.isDirty() || !isEditable,
        message;

      // Status dictates whether buttons are actionable
      /*
      if (canCreate && this.getAllowNew()) {
        this.$.saveAndNewButton.show();
      } else {
        this.$.saveAndNewButton.hide();
      }
      this.$.refreshButton.setDisabled(isNotReady);
      this.$.applyButton.setDisabled(canNotSave);
      this.$.saveAndNewButton.setDisabled(canNotSave);
      this.$.saveButton.setDisabled(canNotSave);
      */

      // Toggle spinner popup
      if (status & K.BUSY) {
        if (status === K.BUSY_COMMITTING) {
          message = "_saving".loc() + "...";
        }
        this.spinnerShow(message);
      } else {
        this.spinnerHide();
      }
    },
  });



}());

/*jshint bitwise:true, indent:2, curly:true eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
trailing:true white:true*/
/*global XT:true, XM:true, XV:true, enyo:true*/

(function () {

  XT.extensions.sales.initWorkspaces = function () {

    // ..........................................................
    // ACCOUNT
    //

    // Intercept calls to create customers and make sure prospects get properly"converted" to customers.
    var proto = XV.AccountWorkspace.prototype;
    proto.kindHandlers.onWorkspace = "workspace";
    proto.workspace = function (inSender, inEvent) {
      var model = this.getValue(),
        prospect = model ? model.get("prospect") : false;
      if (inEvent.workspace === "XV.CustomerWorkspace" &&
          prospect &&
          !this._passThrough) {
        inEvent.success = function () {
          this.getValue().convertFromProspect(prospect.id);
        };
        this._passThrough = true;
        this.bubble("onWorkspace", inEvent, this);
        return true;
      }
      this._passThrough = false;
    };

    // ..........................................................
    // CONFIGURE
    //
    /*
    enyo.kind({
      name: "XV.CrmWorkspace",
      kind: "XV.Workspace",
      title: "_configure".loc() + " " + "_crm".loc(),
      model: "XM.Crm",
      components: [
        {kind: "Panels", arrangerKind: "CarouselArranger",
          fit: true, components: [
          {kind: "XV.Groupbox", name: "mainPanel", components: [
            {kind: "XV.ScrollableGroupbox", name: "mainGroup", fit: true,
              classes: "in-panel", components: [
              {kind: "onyx.GroupboxHeader",
                content: "_account".loc()},
              {kind: "XV.NumberPolicyPicker",
                attr: "CRMAccountNumberGeneration",
                label: "_number".loc() + " " + "_policy".loc()},
              {kind: "XV.InputWidget", attr: "NextCRMAccountNumber",
                label: "_nextNumber".loc()},
              {kind: "onyx.GroupboxHeader",
                content: "_country".loc()},
              {kind: "XV.CountryPicker", attr: "DefaultAddressCountry",
                label: "_default".loc(), idAttribute: "name"},
              {kind: "XV.ToggleButtonWidget", attr: "StrictAddressCountry",
                label: "_limitToList".loc()},
              {kind: "onyx.GroupboxHeader", content: "_incident".loc()},
              {kind: "XV.InputWidget", attr: "NextIncidentNumber",
                label: "_nextNumber".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "IncidentsPublicPrivate",
                label: "_public".loc() + " " + "_flag".loc()},
              {kind: "XV.CheckboxWidget", attr: "IncidentPublicDefault",
                label: "_default".loc() + " " + "_public".loc()},
              {kind: "onyx.GroupboxHeader",
                content: "_incidentStatusColors".loc()},
              {kind: "XV.InputWidget", attr: "IncidentNewColor",
                label: "_new".loc()},
              {kind: "XV.InputWidget", attr: "IncidentFeedbackColor",
                label: "_feedback".loc()},
              {kind: "XV.InputWidget", attr: "IncidentConfirmedColor",
                label: "_confirmed".loc()},
              {kind: "XV.InputWidget", attr: "IncidentAssignedColor",
                label: "_assigned".loc()},
              {kind: "XV.InputWidget", attr: "IncidentResolvedColor",
                label: "_resolved".loc()},
              {kind: "XV.InputWidget", attr: "IncidentClosedColor",
                label: "_closed".loc()},
              {kind: "onyx.GroupboxHeader", content: "_opportunity".loc()},
              {kind: "XV.ToggleButtonWidget", attr: "OpportunityChangeLog",
                label: "_changeLog".loc()}
            ]}
          ]}
        ]}
      ]
    });
*/


  };

}());

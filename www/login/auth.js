
enyo.kind({
  name: "App",
  classes: "xv-login onyx",
  kind: "XV.ScreenCarousel",
  fit: true,
  published: {
    session: null
  },
  carouselEvents: {
    organizations: "organizationWrapper"
  },
  start: function () {
    this.renderInto(document.body);
  },
  setCookie: function (response) {
    enyo.setCookie("xtsessioncookie", JSON.stringify(response), {
      secure: true,
      path: "/",
      // for development -- but should be changed prior to production
      domain: document.location.hostname === "localhost"? "": "." + document.location.hostname
    });
  },
  components: [
    {name: "formWrapper", components: [
      {name: "form", kind: "XV.LoginForm"}]},
    {name: "organizationWrapper", components: [
      {name: "organizations", kind: "XV.OrganizationSelection"}]}
  ]
});
select xt.install_guiscript('user',  $$

//This script disallows the editing of passwords and the enhanced auth.
//checkbox in the desktop client.

var _controls = [
  "_save",
  "_active",
  "_properName",
  "_initials",
  "_email",
  "_passwd",
  "_verify",
  "_locale",
  "_employee",
  "_add",
  "_addAll",
  "_revoke",
  "_revokeAll",
  "_addGroup",
  "_revokeGroup",
  "_addSite",
  "_revokeSite",
  "_agent",
  "_createUsers",
  "_enhancedAuth",
  "_exportContents",
  "_woTimeClockOnly"
];

function showEvent(e) {
  var control;
  for (i = 0; i < _controls.length; i++) {
    control = mywindow.findChild(_controls[i]);
    if (control) {control.setEnabled(false)};
  }
}


$$ );
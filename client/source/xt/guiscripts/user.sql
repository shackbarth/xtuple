select xt.install_guiscript('user',  $$

//This script disallows the editing of passwords and the enhanced auth.
//checkbox in the desktop client.

var _controls = [
  "_passwd",
  "_verify",
  "_createUsers",
  "_enhancedAuth"
];

function showEvent(e) {
  var control;
  for (i = 0; i < _controls.length; i++) {
    control = mywindow.findChild(_controls[i]);
    if (control) {control.setEnabled(false)};
  }
}

$$ );
select xt.install_guiscript('userPreferences',  $$

// Remove the password tab. Must be updated on the browser client

var _password = mywindow.findChild("_password");
var _tab = mywindow.findChild("_tab");
var idx = _tab.indexOf(_password);
_tab.removeTab(idx);

$$ );
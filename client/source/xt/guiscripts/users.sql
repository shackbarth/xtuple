select xt.install_guiscript('users',  $$

// Users must be created from global cloud administration

var _new = mywindow.findChild("_new");
var xt = { users: {}};

xt.users.sNew = function()
{
  var msg = qsTr("Please contact xTuple to create new users.")
  QMessageBox.information(mywindow, qsTr("Information"), msg);
}

toolbox.coreDisconnect(_new, "clicked()", mywindow, "sNew()");
_new.clicked.connect(xt.users.sNew);

$$ );
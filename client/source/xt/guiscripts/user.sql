select xt.install_guiscript('user',  $$

//This script disallows the editing of mobile users in the desktop client.

var userResult;
var params = new Object();
var _userTextField = mywindow.findChild("_username");
var _enhancedAuth = mywindow.findChild('_enhancedAuth');
var _setParams = { mode: "view" };
var _canEdit = true;
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

//the text changes when the screen gets loaded.
_userTextField.textChanged.connect(checkMobile);
toolbox.coreDisconnect(_userTextField, "editingFinished()", mywindow, "sCheck()"); 
_userTextField.editingFinished.connect(checkExisting);

function showEvent(e) {
  var control;
  if (_canEdit) {
    _enhancedAuth.setChecked(true);
    _enhancedAuth.setEnabled(false); 
  } else {
    for (i = 0; i < _controls.length; i++) {
      control = mywindow.findChild(_controls[i]);
      if (control) {control.setEnabled(false)};
    }
  }
}

function checkMobile()
{
  params.name = _userTextField.text;
  
  var qry = toolbox.executeQuery("SELECT usr_db_user FROM xt.usr WHERE usr_username = <? value('name') ?>;", params);
  var msg = qsTr("This user is a mobile user.  You can not make any changes to this user's information from the desktop application.");
  var i;
  var setParams = { mode: "view" };

  if(qry.first()) {
    userResult = qry.value("usr_db_user");
  }

  if(userResult == false) {
    QMessageBox.critical(mywindow, qsTr("Unable To Save"), msg);
    _canEdit = false;
  }
  _userTextField.textChanged.disconnect(checkMobile);
}

function checkExisting()
{
  var sql = "select count(*) as result from pg_user where usename = <? value('username') ?>";
  var params = { username: _userTextField.text };
  var qry = toolbox.executeQuery(sql, params);
  var msg = qsTr("Username is taken. Please enter another username.");
  if (qry.first()) {
    if (qry.value('result')) {
      QMessageBox.critical(mywindow, qsTr("Unable To Save"), msg);
      _userTextField.clear();
      _userTextField.setFocus();
      return;
    }
  }
  mywindow.sCheck();
}

$$ );
select xt.install_guiscript('users',  $$

//This adds a "mobile user" column to the maintain users list

var _new = mywindow.findChild("_new");
var _edit = mywindow.findChild("_edit");
var _usr = mywindow.findChild("_usr");
var _showInactive = mywindow.findChild("_showInactive");
var omfgThis = mainwindow;

var params = new Object();

omfgThis.userUpdated.connect(sFillListTwo);

_new.clicked.connect(sNewTwo);
_edit.clicked.connect(sEditTwo);
_showInactive.toggled.connect(sFillListTwo);

_usr.addColumn("Desktop Client User", -1, 1, true, "usr_db_user");

sFillListTwo();

function sFillListTwo()
{
  params.active = qsTr("Active");
  params.inactive = qsTr("Inactive");

  if(_showInactive.checked) {
    var qry = toolbox.executeQuery("SELECT usr_id, usr_username, usr_propername, CASE WHEN (usr_active) THEN <? value('active') ?> ELSE <? value('inactive') ?> END AS status, usr_db_user FROM usr ORDER BY usr_username;", params);
  }
  else {
    var qry = toolbox.executeQuery("SELECT usr_id, usr_username, usr_propername, CASE WHEN (usr_active) THEN <? value('active') ?> ELSE <? value('inactive') ?> END AS status, usr_db_user FROM usr WHERE usr_active ORDER BY usr_username;", params);
  }

  _usr.populate(qry);
}

function sNewTwo()
{

  sFillListTwo();
}

function sEditTwo()
{

  sFillListTwo();
}

$$ );
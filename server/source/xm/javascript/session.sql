select xt.install_guiscript('mobile-web', $$

  XM.Session = {};

  XM.Session.isDispatchable = true;

  XM.Session.checkLicenseCount = function (organization) {
    var sql1 = "select count(*) as online from xt.session where session_org_name = $1",
      sql2 = "select org_licenses from xt.org where org_name = $1",
      online = plv8.execute(sql1, [organization])[0].online,
      licenses = plv8.execute(sql2, [organization])[0].org_liceneses;
    return online <= licenses;
  }

$$ );

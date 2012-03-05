select xt.install_js('XM','crm','crm', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */
  
  XM.Crm = {};

  XM.Crm.isDispatchable = true,

  XM.Crm.options = [
    "NextCRMAccountNumber",
    "NextIncidentNumber",
    "CRMAccountNumberGeneration",
    "UseProjects",
    "AutoCreateProjectsForOrders",
    "OpportunityChangeLog",
    "DefaultAddressCountry",
    "StrictAddressCountry",
    "IncidentsPublicPrivate",
    "IncidentPublicDefault",
    "IncidentNewColor",
    "IncidentFeedbackColor",
    "IncidentConfirmedColor",
    "IncidentAssignedColor",
    "IncidentResolvedColor",
    "IncidentClosedColor"
  ]

  /* 
  Return Crm configuration settings.

  @returns {Object}
  */
  XM.Crm.settings = function() {
    var keys = XM.Crm.options,
        data = Object.create(XT.Data),
        colors = [
          "IncidentNewColor",
          "IncidentFeedbackColor",
          "IncidentConfirmedColor",
          "IncidentAssignedColor",
          "IncidentResolvedColor",
          "IncidentClosedColor"
        ],
        sql = "select orderseq_number as value "
            + "from orderseq"
            + " where (orderseq_name=$1)",
        cnum = {}, inum = {}, ret = [], qry;

    cnum.setting = 'NextCRMAccountNumber';
    cnum.value = executeSql(sql, ['CRMAccountNumber'])[0].value;
    ret.push(cnum);

    inum.setting = 'NextIncidentNumber';
    inum.value = executeSql(sql, ['IncidentNumber'])[0].value;
    ret.push(inum);

    sql = "select status_color as color "
        + "from status "
        + " where (status_type='INCDT') "
        + "order by status_seq";
    qry = executeSql(sql);

    while(colors.length) {
      var col = {};
      col.setting = colors.pop(),
      col.value = qry.pop().color;        
      ret.push(col);
    }

    ret = ret.concat(data.retrieveMetrics(keys));
    
    return ret;
  }

  /* 
  Update CRM configuration settings. Only valid options as defined in the array
  XM.Crm.options will be processed.

   @param {Object} settings
   @returns {Boolean}
  */
  XM.Crm.commitSettings = function(settings) {
    var sql, options = XM.Crm.options.slice(0),
        data = Object.create(XT.Data), metrics = {};

    /* check privileges */
    if(!data.checkPrivilege('ConfigureCRM')) throw new Error('Access Denied');

    /* update numbers */
    if(settings['NextCRMAccountNumber']) {
      executeSql('select setNextCRMAccountNumber($1)', [settings['NextCRMAccountNumber']]);
    }
    options.remove('NextCRMAccountNumber');

    if(settings['NextIncidentNumber']) {
      executeSql('select setNextIncidentNumber($1)', [settings['NextIncidentNumber']]);
    }
    options.remove('NextIncidentNumber');

    /* update incident colors */
    sql = "update status set status_color = $1 "
        + "where status_type='INCDT' "
        + " and status_code=$2";

    if(settings['IncidentNewColor']) {
      executeSql(sql, [settings['IncidentNewColor'], 'N'])
    }
    options.remove('IncidentNewColor');

    if(settings['IncidentFeedbackColor']) {
      executeSql(sql, [settings['IncidentFeedbackColor'], 'F'])
    }
    options.remove('IncidentFeedbackColor');

    if(settings['IncidentConfirmedColor']) {
      executeSql(sql, [settings['IncidentConfirmedColor'], 'C'])
    }
    options.remove('IncidentConfirmedColor');

    if(settings['IncidentAssignedColor']) {
      executeSql(sql, [settings['IncidentAssignedColor'], 'A'])
    }
    options.remove('IncidentAssignedColor');

    if(settings['IncidentResolvedColor']) {
      executeSql(sql, [settings['IncidentResolvedColor'], 'R'])
    }
    options.remove('IncidentResolvedColor');

    if(settings['IncidentClosedColor']) {
      executeSql(sql, [settings['IncidentNewColor'], 'L'])
    }
    options.remove('IncidentClosedColor');

    /* update remaining options as metrics
       first make sure we pass an object that only has valid metric options for this type */
    for(var i = 0; i < options.length; i++) {
      var prop = options[i];
      if(settings[prop] !== undefined) metrics[prop] = settings[prop];
    }
 
    return data.commitMetrics(metrics);
  }

  XT.registerSettings('XM','Crm','settings');

$$ );


select xt.install_js('XM','crm','crm', $$
  /* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
     See www.xm.ple.com/CPAL for the full text of the software license. */

  XM.Crm = {};

  XM.Crm.isDispatchable = true,

  XM.Crm.options = [
    "NextCRMAccountNumber",
    "NextIncidentNumber",
    "CRMAccountNumberGeneration",
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
    var keys = XM.Crm.options.slice(0),
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
        inum = {},
        ret = {},
        qry;

    ret.NextCRMAccountNumber = plv8.execute(sql, ['CRMAccountNumber'])[0].value;
    ret.NextIncidentNumber = plv8.execute(sql, ['IncidentNumber'])[0].value;

    sql = "select status_color as color "
        + "from status "
        + " where (status_type='INCDT') "
        + "order by status_seq";
    qry = plv8.execute(sql);

    while(colors.length) {
      ret[colors.pop()] = qry.pop().color;
    }

    ret = XT.extend(data.retrieveMetrics(keys), ret);

    return ret;
  }

  /*
  Update CRM configuration settings. Only valid options as defined in the array
  XM.Crm.options will be processed.

   @param {Object} settings
   @returns {Boolean}
  */
  XM.Crm.commitSettings = function(patches) {
    var sql, settings, options = XM.Crm.options.slice(0),
        data = Object.create(XT.Data), metrics = {};

    /* check privileges */
    if(!data.checkPrivilege('ConfigureCRM')) throw new Error('Access Denied');

    /* Compose our commit settings by applying the patch to what we already have */
    settings = XM.Crm.settings();
    if (!XT.jsonpatch.apply(settings, patches)) {
      plv8.elog(NOTICE, 'Malformed patch document');
    }

    /* update numbers */
    if(settings['NextCRMAccountNumber']) {
      plv8.execute('select setNextCRMAccountNumber($1)', [settings['NextCRMAccountNumber'] - 0]);
    }
    options.remove('NextCRMAccountNumber');

    if(settings['NextIncidentNumber']) {
      plv8.execute('select setNextIncidentNumber($1)', [settings['NextIncidentNumber'] - 0]);
    }
    options.remove('NextIncidentNumber');

    /* update incident colors */
    sql = "update status set status_color = $1 "
        + "where status_type='INCDT' "
        + " and status_code=$2";

    if(settings['IncidentNewColor']) {
      plv8.execute(sql, [settings['IncidentNewColor'], 'N'])
    }
    options.remove('IncidentNewColor');

    if(settings['IncidentFeedbackColor']) {
      plv8.execute(sql, [settings['IncidentFeedbackColor'], 'F'])
    }
    options.remove('IncidentFeedbackColor');

    if(settings['IncidentConfirmedColor']) {
      plv8.execute(sql, [settings['IncidentConfirmedColor'], 'C'])
    }
    options.remove('IncidentConfirmedColor');

    if(settings['IncidentAssignedColor']) {
      plv8.execute(sql, [settings['IncidentAssignedColor'], 'A'])
    }
    options.remove('IncidentAssignedColor');

    if(settings['IncidentResolvedColor']) {
      plv8.execute(sql, [settings['IncidentResolvedColor'], 'R'])
    }
    options.remove('IncidentResolvedColor');

    if(settings['IncidentClosedColor']) {
      plv8.execute(sql, [settings['IncidentNewColor'], 'L'])
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

$$ );


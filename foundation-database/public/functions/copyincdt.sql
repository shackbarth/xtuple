CREATE OR REPLACE FUNCTION copyIncdt(INTEGER, TIMESTAMP WITH TIME ZONE) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pparentid   ALIAS FOR $1;
  ptimestamp  TIMESTAMP WITH TIME ZONE := COALESCE($2, CURRENT_TIMESTAMP);

  _alarmid    INTEGER;
  _incdtid    INTEGER;
  _todoitemid INTEGER;

BEGIN
  INSERT INTO incdt(incdt_number,          incdt_crmacct_id,
                    incdt_cntct_id,        incdt_summary,
                    incdt_descrip,         incdt_item_id,
                    incdt_timestamp,       incdt_incdtcat_id,
                    incdt_incdtseverity_id,incdt_incdtpriority_id,
                    incdt_owner_username,  incdt_recurring_incdt_id
           ) SELECT fetchIncidentNumber(), incdt_crmacct_id,
                    incdt_cntct_id,        incdt_summary,
                    incdt_descrip,         incdt_item_id,
                    ptimestamp,            incdt_incdtcat_id,
                    incdt_incdtseverity_id,incdt_incdtpriority_id,
                    incdt_owner_username,  incdt_recurring_incdt_id
               FROM incdt
              WHERE (incdt_id=pparentid)
  RETURNING incdt_id INTO _incdtid;

  IF (_incdtid IS NULL) THEN
    RETURN -10;
  END IF;

  SELECT MIN(copyTodoitem(todoitem_id, CAST(ptimestamp AS DATE), _incdtid))
            INTO _todoitemid
    FROM todoitem
   WHERE (todoitem_incdt_id=pparentid);

  IF (_todoitemid < 0) THEN
    RETURN _todoitemid;
  END IF;

  SELECT saveAlarm(NULL, NULL, CAST(ptimestamp AS DATE),
                   CAST(alarm_time - DATE_TRUNC('day',alarm_time) AS TIME),
                   alarm_time_offset,
                   alarm_time_qualifier,
                   alarm_event_recipient  IS NOT NULL, alarm_event_recipient,
                   alarm_email_recipient  IS NOT NULL, alarm_email_recipient,
                   alarm_sysmsg_recipient IS NOT NULL, alarm_sysmsg_recipient,
                   'INCDT', _incdtid, 'CHANGEONE')
    INTO _alarmid
    FROM alarm
   WHERE ((alarm_source='INCDT')
      AND (alarm_source_id=pparentid));

   IF (_alarmid < 0) THEN
     RETURN _alarmid;
   END IF;

   INSERT INTO docass (docass_source_id, docass_source_type,
                       docass_target_id, docass_target_type, docass_purpose
              ) SELECT _incdtid,       'INCDT',
                       docass_target_id, docass_target_type, docass_purpose
                  FROM docass
                 WHERE ((docass_source_id=pparentid)
                    AND (docass_source_type='INCDT'));

  RETURN _incdtid;
END;
$$ LANGUAGE 'plpgsql';

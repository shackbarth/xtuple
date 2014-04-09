CREATE OR REPLACE FUNCTION copyTodoitem(INTEGER, DATE, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pparentid   ALIAS FOR $1;
  _duedate    DATE := COALESCE($2, CURRENT_DATE);
  pincdtid    ALIAS FOR $3;
  _alarmid    INTEGER;
  _todoitemid INTEGER;

BEGIN
  INSERT INTO todoitem(
            todoitem_name,      todoitem_description,
            todoitem_incdt_id,
            todoitem_creator_username,                  todoitem_status,
            todoitem_active,    todoitem_due_date,
            todoitem_assigned_date,
            todoitem_seq,       todoitem_notes,         todoitem_crmacct_id,
            todoitem_ophead_id, todoitem_owner_username,todoitem_priority_id,
            todoitem_username,  todoitem_recurring_todoitem_id
  ) SELECT  todoitem_name,      todoitem_description,
            CASE WHEN pincdtid IS NULL THEN todoitem_incdt_id ELSE pincdtid END,
            getEffectiveXtUser(),                               'N',
            TRUE,               _duedate,
            CASE WHEN (todoitem_username IS NOT NULL) THEN CURRENT_DATE
                 ELSE NULL
            END,
            todoitem_seq,       todoitem_notes,         todoitem_crmacct_id,
            todoitem_ophead_id, todoitem_owner_username,todoitem_priority_id,
            todoitem_username,  todoitem_recurring_todoitem_id
      FROM todoitem
     WHERE (todoitem_id=pparentid)
  RETURNING todoitem_id INTO _todoitemid;

  IF (_todoitemid IS NULL) THEN
    RETURN -10;
  END IF;

  SELECT saveAlarm(NULL, NULL, _duedate,
                   CAST(alarm_time - DATE_TRUNC('day',alarm_time) AS TIME),
                   alarm_time_offset,
                   alarm_time_qualifier,
                   (alarm_event_recipient IS NOT NULL), alarm_event_recipient,
                   (alarm_email_recipient IS NOT NULL AND fetchMetricBool('EnableBatchManager')), alarm_email_recipient,
                   (alarm_sysmsg_recipient IS NOT NULL), alarm_sysmsg_recipient,
                   'TODO', _todoitemid, 'CHANGEONE')
    INTO _alarmid
    FROM alarm
   WHERE ((alarm_source='TODO')
      AND (alarm_source_id=pparentid));

   IF (_alarmid < 0) THEN
     RETURN _alarmid;
   END IF;

  RETURN _todoitemid;
END;
$$ LANGUAGE 'plpgsql';

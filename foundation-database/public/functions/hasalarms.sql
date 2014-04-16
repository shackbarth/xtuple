
CREATE OR REPLACE FUNCTION hasAlarms() RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _alarm          RECORD;
  _batchId        INTEGER;
  _evntlogordtype TEXT;
  _evnttypeid     INTEGER;
  _evnttypename   TEXT;
  _fromEmail      TEXT;
  _itemid         INTEGER;
  _longsource     TEXT;
  _msgId          INTEGER;
  _recipient      TEXT;
  _recipientPart  INTEGER;
  _returnVal      BOOLEAN := FALSE;
  _summary        TEXT;
  _whsId          INTEGER := -1;

BEGIN
  FOR _alarm IN SELECT *
                FROM alarm
                WHERE ((alarm_creator=getEffectiveXtUser())
                   AND (CURRENT_TIMESTAMP > alarm_trigger)) LOOP
    _returnVal := TRUE;

    IF (_alarm.alarm_source = 'TODO') THEN
      SELECT (todoitem_name || '-' || todoitem_description),
             'T', 'TodoAlarm', 'To-Do Item'
      INTO _summary, _evntlogordtype, _evnttypename, _longsource
      FROM todoitem
      WHERE (todoitem_id = _alarm.alarm_source_id);

    ELSIF (_alarm.alarm_source = 'INCDT') THEN
      SELECT (incdt_number || '-' || incdt_summary),
             'I', 'IncidentAlarm', 'Incident'
      INTO _summary, _evntlogordtype, _evnttypename, _longsource
      FROM incdt
      WHERE (incdt_id = _alarm.alarm_source_id);

    ELSIF (_alarm.alarm_source = 'J') THEN
      SELECT (prj_number || ' ' || prj_name || '-' || prjtask_name),
              'J', 'TaskAlarm', 'Project Task'
      INTO _summary, _evntlogordtype, _evnttypename, _longsource
      FROM prjtask JOIN prj ON (prj_id=prjtask_prj_id)
      WHERE (prjtask_id = _alarm.alarm_source_id);

    ELSE
      CONTINUE; -- there's nothing to do for this iteration of the loop
    END IF;

    -- if event alarm
    IF (_alarm.alarm_event) THEN
      SELECT evnttype_id INTO _evnttypeid
      FROM evnttype
      WHERE (evnttype_name=_evnttypename);

      _recipientPart := 1;
      LOOP
        _recipient := SPLIT_PART(_alarm.alarm_event_recipient, ',', _recipientPart);
        EXIT WHEN (LENGTH(_recipient) = 0);

        SELECT usrpref_value INTO _whsId
        FROM usrpref
        WHERE ( (usrpref_username = _recipient)
          AND   (usrpref_name = 'PreferredWarehouse') );

        INSERT INTO evntlog (evntlog_evnttime, evntlog_username,
                             evntlog_evnttype_id, evntlog_ordtype,
                             evntlog_ord_id, evntlog_warehous_id, evntlog_number
                   ) VALUES (CURRENT_TIMESTAMP, _recipient,
                             _evnttypeid, _evntlogordtype,
                             _alarm.alarm_source_id, _whsId, _summary);

        _recipientPart := _recipientPart + 1;
      END LOOP;
    END IF;

    IF (_alarm.alarm_email) THEN
      SELECT usr_email INTO _fromEmail
      FROM usr
      WHERE (usr_username = _alarm.alarm_creator);

      _recipientPart := 1;
      LOOP
        _recipient := SPLIT_PART(_alarm.alarm_email_recipient, ',', _recipientPart);
        EXIT WHEN (LENGTH(_recipient) <= 0);
        _batchId := xtbatch.submitEmailToBatch(_fromEmail, _recipient, '',
                                               _summary,
                                               'Alarm reminder for '
                                               || _longsource || '.',
                                               NULL, CURRENT_TIMESTAMP,
                                               FALSE, NULL, NULL);
        _recipientPart := _recipientPart + 1;
      END LOOP;
    END IF;

    IF (_alarm.alarm_sysmsg) THEN
      _recipientPart := 1;
      LOOP
        _recipient := SPLIT_PART(_alarm.alarm_sysmsg_recipient, ',', _recipientPart);
        EXIT WHEN (LENGTH(_recipient) <= 0);
        _msgId := postMessage(_recipient, (_longsource || ' - ' || _summary));
        _recipientPart := _recipientPart + 1;
      END LOOP;
    END IF;

    DELETE FROM alarm WHERE alarm_id=_alarm.alarm_id;
  END LOOP;
  RETURN _returnVal;

END;
$$ LANGUAGE 'plpgsql';

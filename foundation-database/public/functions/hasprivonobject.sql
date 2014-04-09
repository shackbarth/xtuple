CREATE OR REPLACE FUNCTION hasPrivOnObject(pPrivType   TEXT,
                                           pObjectType TEXT,
                                           pObjectId   INTEGER = NULL,
                                           pUser       TEXT    = NULL) RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _haspriv   BOOLEAN := FALSE;
  _privfound BOOLEAN := FALSE;
  _pkey      TEXT[];
  _privdesc  RECORD;
  _qstr      TEXT;

BEGIN
  IF UPPER(pPrivType) NOT IN ('CREATE', 'EDIT', 'VIEW', 'DELETE') THEN
    RAISE EXCEPTION 'Cannot check if user has % on % [xtuple: hasPrivOnObject, -1, %, %]',
                     pPrivType, pObjectType, pPrivType, pObjectType;
  END IF;

  /* TODO: create privdesc table? can't do it yet because this is a fix for a minor release
     NOTE: only include tables that have a single integer column as pkey
     NOTE: some of these are part of proprietary extensions. how do we make them part of the extension?
  */
  FOR _privdesc IN
  WITH privdesc AS (
    SELECT 'ADDR' AS otype,    'public' AS masterschema,
                                         'addr' AS mastertable,
                                                     'MaintainAddressMasters' AS editall,
                                                                                     'ViewAddressMasters' AS viewall,
                                                                                                               NULL AS ownerfield,        NULL AS editmine,                NULL AS viewmine
     UNION ALL SELECT 'BBH',   'xtmfg',  'bbom',     'MaintainBBOMs',                'ViewBBOMs',              NULL,                      NULL,                            NULL
     UNION ALL SELECT 'BBI',   'xtmfg',  'bbom',     'MaintainBBOMs',                'ViewBBOMs',              NULL,                      NULL,                            NULL
     UNION ALL SELECT 'BMH',   'public', 'bom',      'MaintainBOMs',                 'ViewBOMs',               NULL,                      NULL,                            NULL
     UNION ALL SELECT 'BMI',   'public', 'bom',      'MaintainBOMs',                 'ViewBOMs',               NULL,                      NULL,                            NULL
     UNION ALL SELECT 'BOH',   'xtmfg',  'boo',      'MaintainBOOs',                 'ViewBOOs',               NULL,                      NULL,                            NULL
     UNION ALL SELECT 'BOI',   'xtmfg',  'boo',      'MaintainBOOs',                 'ViewBOOs',               NULL,                      NULL,                            NULL
     UNION ALL SELECT 'C',     'public', 'custinfo', 'MaintainCustomerMasters',      'ViewCustomerMasters',    NULL,                      NULL,                            NULL
     UNION ALL SELECT 'CRMA',  'public', 'crmacct',  'MaintainAllCRMAccounts',       'ViewAllCRMAccounts',     'crmacct_owner_username',  'MaintainPersonalCRMAccounts',   'ViewPersonalCRMAccounts'
     UNION ALL SELECT 'EMP',   'public', 'emp',      'MaintainEmployees',            'ViewEmployees',          NULL,                      NULL,                            NULL
     UNION ALL SELECT 'I',     'public', 'item',     'MaintainItemMasters',          'ViewItemMasters',        NULL,                      NULL,                            NULL
     UNION ALL SELECT 'INCDT', 'public', 'incdt',    'MaintainAllIncidents',         'ViewAllIncidents',       'incdt_owner_username',    'MaintainPersonalIncidents',     'ViewPersonalIncidents'
     UNION ALL SELECT 'IR',    'public', 'itemsrc',  'MaintainItemSources',          'ViewItemSources',        NULL,                      NULL,                            NULL
     UNION ALL SELECT 'IS',    'public', 'itemsite', 'MaintainItemSites',            'ViewItemSites',          NULL,                      NULL,                            NULL
     UNION ALL SELECT 'J',     'public', 'prj',      'MaintainAllProjects',          'ViewAllProjects',        'prj_owner_username',      'MaintainPersonalProjects',      'ViewPersonalProjects'
     UNION ALL SELECT 'J',     'public', 'prj',      'MaintainAllProjects',          'ViewAllProjects',        'prj_username',            'MaintainPersonalProjects',      'ViewPersonalProjects'
     UNION ALL SELECT 'L',     'public', 'location', 'MaintainLocations',            'ViewLocations',          NULL,                      NULL,                            NULL
     UNION ALL SELECT 'OPP',   'public', 'ophead',   'MaintainAllOpportunities',     'ViewAllOpportunities',   'ophead_owner_username',   'MaintainPersonalOpportunities', 'ViewPersonalOpportunities'
     UNION ALL SELECT 'P',     'public', 'pohead',   'MaintainPurchaseOrders',       'ViewPurchaseOrders',     NULL,                      NULL,                            NULL
     UNION ALL SELECT 'PI',    'public', 'pohead',   'MaintainPurchaseOrders',       'ViewPurchaseOrders',     NULL,                      NULL,                            NULL
     UNION ALL SELECT 'Q',     'public', 'quhead',   'MaintainQuotes',               'ViewQuotes',             NULL,                      NULL,                            NULL
     UNION ALL SELECT 'QI',    'public', 'quhead',   'MaintainQuotes',               'ViewQuotes',             NULL,                      NULL,                            NULL
     UNION ALL SELECT 'RA',    'public', 'rahead',   'MaintainReturns',              'ViewReturns',            NULL,                      NULL,                            NULL
     UNION ALL SELECT 'RI',    'public', 'rahead',   'MaintainReturns',              'ViewReturns',            NULL,                      NULL,                            NULL
     UNION ALL SELECT 'S',     'public', 'cohead',   'MaintainSalesOrders',          'ViewSalesOrders',        NULL,                      NULL,                            NULL
     UNION ALL SELECT 'SI',    'public', 'cohead',   'MaintainSalesOrders',          'ViewSalesOrders',        NULL,                      NULL,                            NULL
     UNION ALL SELECT 'T',     'public', 'cntct',    'MaintainAllContacts',          'ViewAllContacts',        'cntct_owner_username',    'MaintainPersonalContacts',      'ViewPersonalContacts'
     UNION ALL SELECT 'TE',    'te',     'tehead',   'MaintainTimeExpense',          'ViewTimeExpenseHistory', 'tehead_username',         'MaintainTimeExpenseSelf',       NULL
     UNION ALL SELECT 'TE',    'te',     'tehead',   'MaintainTimeExpenseOthers',    'ViewTimeExpenseHistory', 'tehead_username',         'MaintainTimeExpenseSelf',       NULL
     UNION ALL SELECT 'TI',    'public', 'tohead',   'MaintainTransferOrders',       'ViewTransferOrders',     NULL,                      NULL,                            NULL
     UNION ALL SELECT 'TO',    'public', 'tohead',   'MaintainTransferOrders',       'ViewTransferOrders',     NULL,                      NULL,                            NULL
     UNION ALL SELECT 'TODO',  'public', 'todoitem', 'MaintainAllToDoItems',         'ViewAllToDoItems',       'todoitem_owner_username', 'MaintainPersonalToDoItems',     'ViewPersonalToDoItems'
     UNION ALL SELECT 'V',     'public', 'vendinfo', 'MaintainVendors',              'ViewVendors',            NULL,                      NULL,                            NULL
     UNION ALL SELECT 'W',     'public', 'wo',       'MaintainWorkOrders',           'ViewWorkOrders',         NULL,                      NULL,                            NULL
     UNION ALL SELECT 'WH',    'public', 'whsinfo',  'MaintainWarehouses',           'ViewWarehouses',         NULL,                      NULL,                            NULL)
  -- UNION ALL SELECT 'LS',    'public', 'ls',       NULL,                           NULL,                     NULL,                      NULL,                            NULL
  -- UNION ALL SELECT 'P',     'public', 'pohead',   'MaintainPostedPurchaseOrders', 'ViewPurchaseOrders',     NULL,                      NULL,                            NULL -- additional criteria?
  -- UNION ALL SELECT 'PI',    'public', 'pohead',   'MaintainPostedPurchaseOrders', 'ViewPurchaseOrders',     NULL,                      NULL,                            NULL -- additional criteria?
     SELECT *
       FROM privdesc
      WHERE otype = pObjectType
  LOOP
    _privfound := TRUE;
    RAISE DEBUG '% % % % % % %',
                _privdesc.otype, _privdesc.masterschema, _privdesc.mastertable,
                _privdesc.editall, _privdesc.viewall, _privdesc.editmine, _privdesc.viewmine;

    IF checkPrivilege(CASE UPPER(pPrivType) WHEN 'CREATE' THEN _privdesc.editall
                                            WHEN 'EDIT'   THEN _privdesc.editall
                                            WHEN 'DELETE' THEN _privdesc.editall
                                            WHEN 'VIEW'   THEN _privdesc.viewall
                      END) THEN
      _haspriv = TRUE;

    ELSIF checkPrivilege(CASE UPPER(pPrivType) WHEN 'CREATE' THEN _privdesc.editmine
                                               WHEN 'EDIT'   THEN _privdesc.editmine
                                               WHEN 'DELETE' THEN _privdesc.editmine
                                               WHEN 'VIEW'   THEN _privdesc.viewmine
                         END) THEN
      IF pObjectId IS NULL THEN
      _haspriv = TRUE;

      ELSE
        _pkey := primaryKeyFields(_privdesc.masterschema, _privdesc.mastertable);

        -- SELECT ... FROM schema.table WHERE pkeyfield = pObjectId AND ownerfield = pUser
        _qstr := 'SELECT EXISTS(SELECT 1
                                  FROM ' || quote_ident(_privdesc.masterschema)
                                   || '.' || quote_ident(_privdesc.mastertable)
                                   || ' WHERE ' || quote_ident(_pkey[1]) || ' = ' || pObjectId
                                   || '   AND ' || quote_ident(_privdesc.ownerfield)
                                   || '= ' || quote_literal(COALESCE(pUser, getEffectiveXtUser())) || ');';
        RAISE DEBUG '%', _qstr;

        EXECUTE _qstr INTO _haspriv;
      END IF;
    END IF;

    EXIT WHEN _haspriv;
  END LOOP;

  RETURN _haspriv OR NOT _privfound;

END;
$$ LANGUAGE 'plpgsql' STABLE;

COMMENT ON FUNCTION hasPrivOnObject(pPrivType TEXT, pObjectType TEXT, pObjectId INTEGER, pUser TEXT) IS
'Return if a user has permission to view or edit a specific database object.
pPrivType is either CREATE, EDIT, DELETE, or VIEW, and controls which privilege is checked.
pObjectType is one of the string constants used by the Documents widget, such as ADDR for Addresses.
pObjectId is the internal id of the record in the table associated with pObjectType (defaults to NULL).
pUser is the username to be checked for those pObjectTypes that restrict access to individual users (NULL == current user and is the default).';


// ==========================================================================
// Project:   XT.Metasql
// Copyright: ©2011 OpenMFG LLC, d/b/a xTuple
// ==========================================================================
/*globals XT */

/** @class XT.Metasql

  The XT.Metasql is an extension of the SC.Record class that adds
  xTuple-specific functionality.

  To use XT.Metasql you must specify the query to run using the
  metasqlGroup and MetasqlName properties that correspond to
  equivalent columns in the metasql table of an xTuple database.

  {{{
       XT.Foo = XT.Metasql.extend({
         metasqlGroup: 'foo',
         metasqlName: 'bar'
       });
  }}}

  Note that column names do not need to be specified as attributes on the model.
  Metasql records will automatically infer them from the Metasql definition.

  Metasql statements used in xTuple's SproutCore implementation should
  include a column named 'id' and a parameter option to filter on that id
  like so:

  {{{
      SELECT foo_id AS id, foo_name, foo_descrip
      FROM foo
      <? if exists("id") ?>
      WHERE (foo_id = <? value("id") ?>)
      <? endif ?>
      ;
  }}}

  The id is used to notify corresponding editor controllers which record to
  load upon request, and is also used to refresh the Metasql record if changes
  have been commited by a correponding editor model.

  Generally queries run in xTuple's SproutCore Metasql implementation work
  very similar to regular queries in SproutCore.  For example a more
  sophisticated Metasql statement might look like this:

  {{{
      SELECT foo_id AS id, foo_name, foo_descrip, foo_class, foo_active
      FROM foo
      WHERE (true)
      <? if exists("id") ?>
        AND (foo_id = <? value("id") ?>)
      <? endif ?>
      <? if exists("name") ?>
        AND (foo_name = <? value("name") ?>)
      <? endif ?>
      <? if exists("descrip") ?>
        AND (foo_descrip = <? value("descrip") ?>)
      <? endif ?>
      <? if exists("class") ?>
        AND (foo_class = <? value("class") ?>)
      <? endif ?>
      <? if exists("active") ?>
        AND (foo_active)
      <? endif ?>
      ;
  }}}

  A corresponding query that would be run against this statement might
  look like this:

  {{{
      var fooRecords = null;
      var query = null;
      var params = new Object;

      // Create the query parameters
      params.class = 'Toys';
      params.active = YES;

      // Build the query
      query = SC.Query.local(XT.Foo, {
        parameters: params
      })

      // Run the query
      fooRecords =  XT.store.find(query);
  }}}

  This will populate the XT.Foo model with all records where foo_class is
  'Truck' and foo_active is true.

  Note that existing records are not automatically cleared when a query
  is run.  To clear any previously cached results from the store call the
  unloadRecords() method before running your query:

  {{{
    XT.store.unloadRecords(XT.Foo);
  }}}

  @extends XT.Record
  @version 0.1
*/

sc_require("models/record");

XM.Metasql = XM.Record.extend(SC.Freezable,
/** @scope XT.Metasql.prototype */
{
  className: 'XM.Metasql',

  primaryKey: 'id',

  isEditable: NO,

  /**
  Required.  The name of the MetasqlGroup stored in the database.
  */
  metasqlGroup: null,

  /**
  Required.  The name of the Metasql query stored in the database.
  */
  metasqlName: null,

}) ;


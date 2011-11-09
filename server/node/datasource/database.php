<?php
  //session_start(); // required session_start but validate_login should have already been called.

  function cleanValue($value) {
    global $pgconn;
    if(get_magic_quotes_gpc()) {
        $value = stripslashes($value);
    }

    if(!is_numeric($value)) {
        $value = pg_escape_string($pgconn, $value);
    }
    return $value;
  }

  function slLastError()
  {
    $order   = array("\r\n", "\n", "\r");
    $replace = ' ';

    // Processes \r\n's first so they aren't converted twice.
    return str_replace($order, $replace, @pg_last_error());
  }

  //$pgconn = pg_pconnect("host=dev.xtuple.org port=7000 dbname=dev user=web password=sEcReTpAsSwOrD");
  // this is less efficient than connecting as a single user with pg_pconnect however this allows us
  // to work with our existing database's auth mechanisms without changing them to support a psuedo user
  // $pgconn = @pg_connect("host=dev.openmfg.com port=7000 dbname=dev user='${_SESSION['pg_username']}' password='${_SESSION['pg_password']}'");
  $pgconn = @pg_connect("host=dev.openmfg.com port=7000 dbname=dev user='cole' password='cole'");
  if($pgconn === false)
  {
    header('HTTP/1.1 500 Internal Server Error');
    header('X-Reason: Could not connect to database: ' . slLastError());
    exit;
  }

  function pgParseStringArray($sa) {
    $a = split(",", trim($sa, "{}"));
    return $a;
  }

  function fixObjectDatatypes($obj, $res) {
    foreach($obj as $field => $value) {
      $fieldnum = pg_field_num($res, '"'.$field.'"');   // quotes maintain case of fieldname
      if (! is_null($value) && $fieldnum >= 0) {
        switch (pg_field_type($res, $fieldnum)) {
          case 'int4':
          case 'int8':
            if (is_array($obj))
              $obj[$field] = (integer)$value;
            else
              $obj->$field = (integer)$value;
            break;
          case 'bool':
            if (is_array($obj))
              $obj[$field] = ($value == "t");
            else
              $obj->$field = ($value == "t");
            break;
          case 'numeric':
            if (is_array($obj))
              $obj[$field] = (double)$value;
            else
              $obj->$field = (double)$value;
            break;
          // default is to leave as text
        }
      }
    }
  }

 ?>

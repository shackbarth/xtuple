<?php
  // require_once('validateLogin.php');
  require_once('preprocess.php');
  require_once('database.php');
  require_once('metasqlClass.php');

  $extra = (array_key_exists('PATH_INFO', $_SERVER) ? $_SERVER['PATH_INFO'] : '/');
  if(empty($extra))
    $extra = '/';
  $parts = explode('/', $extra);
  $group = (isset($parts[1]) ? $parts[1] : FALSE);
  $name = (isset($parts[2]) ? $parts[2] : FALSE);

  if($group === false || $name === false)
  {
    header('HTTP/1.1 400 Bad Request');
    header('X-Reason: Group and Name both required');
    return;
  }
  $cGroup = cleanValue($group);
  $cName = cleanValue($name);
  $sql = "SELECT metasql_query
            FROM metasql
           WHERE((metasql_group='$cGroup')
             AND (metasql_name='$cName'))
           ORDER BY metasql_grade DESC
           LIMIT 1;";

  $res = pg_query($pgconn, $sql);
  if($res === false) {
    header('HTTP/1.1 400 Bad Request');
    header('X-Reason: ' . slLastError());
    return;
  }
  $obj = pg_fetch_object($res);
  $metasql = "";
  if($obj) {
    $metasql = $obj->metasql_query;
  }
  pg_free_result($res);

  if(empty($metasql))
  {
    header('HTTP/1.1 400 Bad Request');
    header('X-Reason: No MetaSQL found');
    return;
  }

  $params = getJsonPayload();

  # now we need to parse the metasql file and replace the parameters with the appropriate values
  $sql = $metasql;
  $mql = new MetaSQLQuery($sql);
  $sql = $mql->toQuery($params);

  $res = pg_query($pgconn, $sql);
  if($res === false) {
    header('HTTP/1.1 400 Bad Request');
    header('X-Reason: ' . slLastError());
    return;
  }
  $output->content = array();
  while($obj = pg_fetch_object($res)) {
    fixObjectDatatypes($obj, $res);
    array_push($output->content, $obj);
  }
  pg_free_result($res);

  header('HTTP/1.1 200 OK');
  echo json_encode($output);
 ?>

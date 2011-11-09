<?php

  function getJsonPayload() {
    $payload = FALSE;

    // make sure there is payload data
    if(isset($_SERVER['CONTENT_LENGTH']) && $_SERVER['CONTENT_LENGTH'] > 0) {
      $payload = '';
      $httpContent = fopen('php://input', 'r');
      while($data = fread($httpContent, 1024)) {
          $payload .= $data;
      }
      fclose($httpContent);
    }

    // check to make sure there was payload and we read it in
    if(!$payload)
      return FALSE;

    // translate the JSON into an associative array
    $obj = json_decode($payload);

    return $obj;
  }


  $method = $_SERVER['REQUEST_METHOD'];

  $url_record_type = array_pop(explode('/', $_SERVER['SCRIPT_NAME']));
  if(substr($url_record_type, -4) == ".php")
    $url_record_type = substr($url_record_type, 0, -4);

  $extra = (array_key_exists('PATH_INFO', $_SERVER) ? $_SERVER['PATH_INFO'] : '/');
  if(empty($extra))
    $extra = '/';
  $parts = explode('/', $extra);

  $record_id = (isset($parts[1]) ? $parts[1] : FALSE);

 ?>

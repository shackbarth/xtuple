var http = require('http'),
    PROXY_LISTEN = 4020,
    PROXY_HOST = '127.0.0.1', PROXY_PORT = 9000,
    PROXY_PREFIX_FROM = '/datasource/', PROXY_PREFIX_TO = '/';

http.createServer(function(request, response) {
  var body = '';
  
  request.addListener('data', function(chunk) {
    body += chunk;
  });

  request.addListener('end', function() {
    var proxyClient, proxyRequest,
        url = request.url;

    if (PROXY_PREFIX_FROM.length > 0 && url.indexOf(PROXY_PREFIX_FROM) < 0) {
      console.error("Don't know how to proxy: " + url);
      response.writeHead(404);
      response.end();
      return; // don't proxy this
    } else {
      url = url.replace(PROXY_PREFIX_FROM, PROXY_PREFIX_TO);
    }

    console.log("PROXYING http://localhost:"+PROXY_LISTEN + request.url + " TO http://" + PROXY_HOST + ":" + PROXY_PORT + url);
    proxyClient = http.createClient(PROXY_PORT, PROXY_HOST);

    proxyClient.addListener('error', function(err) {
      console.error('ERROR: "' + err.message + '" for proxy request on ' + PROXY_HOST + ':' + PROXY_PORT);
      response.writeHead(404);
      response.end();
    });

    request.headers.host = PROXY_HOST;
    request.headers['content-length'] = body.length;
    request.headers['X-Forwarded-Host'] = request.headers.host + ':' + PROXY_LISTEN;
    if (PROXY_PORT != 80) request.headers.host += ':' + PROXY_PORT;
    
    proxyRequest = proxyClient.request(request.method, url, request.headers);

    if (body.length > 0) { proxyRequest.write(body); }

    proxyRequest.addListener('response', function(proxyResponse) {
      response.writeHead(proxyResponse.statusCode, proxyResponse.headers);
      proxyResponse.addListener('data', function(chunk) {
        response.write(chunk, 'binary');
      });
      proxyResponse.addListener('end', function() {
        response.end();
      });
    });

    proxyRequest.end();
  });

}).listen(PROXY_LISTEN);

console.log("PROXYING http://"+PROXY_HOST+":"+PROXY_LISTEN + PROXY_PREFIX_FROM + 'foo' + " TO http://" + PROXY_HOST + ":" + PROXY_PORT + PROXY_PREFIX_TO + 'foo');

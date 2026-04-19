const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({
  target: 'http://localhost:3000',
  changeOrigin: true,
  ws: true
});

const server = http.createServer((req, res) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  proxy.web(req, res, (err) => {
    console.error('Proxy error:', err);
    res.writeHead(502);
    res.end('Proxy error');
  });
});

server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});

console.log('Proxy server starting on port 8080...');
server.listen(8080, () => {
  console.log('Proxy server running on http://localhost:8080');
  console.log('Forwarding to http://localhost:3000');
});

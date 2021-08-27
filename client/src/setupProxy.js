const createProxyMiddleware = require('http-proxy-middleware'); 
// src/setupProxy.js 
module.exports = function(app) { 
    app.use( createProxyMiddleware('/api', {
         target: "http://localhost:5000/", changeOrigin: true 
        })
     );
 };


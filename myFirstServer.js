/********************************************** 
* myFirstServer.js
* Houle, Daniel B. 
* CS350/491 Summer 2019
* This file holds the beginnings of a NodeJS 
* server.
***********************************************/

const http = require('http'); // To use the HTTP interfaces in Node.js
const fs = require('fs'); // For interacting with the file system
const path = require('path'); // For working with file and directory paths
const url = require('url'); // For URL resolution and parsing
// const nodemailer = require('nodemailer'); // The Nodemailer module makes it easy to send emails from your computer
// can assign the appropriate MIME type to the requested resource based on its extension
const mimeTypes = {
  '.html': 'text/html',
  '.htm': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

http.createServer(function (req, res) {
  /* 
    This block merely skips over the call for the 
    favicon, as I'm not dealing with it yet.
  */
  if (req.url === '/favicon.ico') {
    res.writeHead(200, {'Content-Type': 'image/x-icon'} );
    return res.end();
  }
  /* 
    `url.parse(urlString)` returns a URL object
    `url.pathname` Gets and sets the path portion of the URL.
  */
  var pathname = url.parse(req.url).pathname;
  /*
    `path.extname()` returns the extension of the path, from the last occurrence of the . (period) 
    character to end of string in the last portion of the path. If there is no . in the last 
    portion of the path, or if there are no . characters other than the first character of the 
    basename of path (see path.basename()) , an empty string is returned.
  */
  var ext = path.extname(pathname);
  /*
    `fs.readFile(path, callback)` asynchronously reads the entire contents of a file.
  */
  fs.readFile(__dirname + pathname, function(err, data){
    // Handle any type of error first
    if (err) {
      if(ext){
        res.writeHead(404, {'Content-Type': mimeTypes[ext]});
      }
      else{
        res.writeHead(404, {'Content-Type': 'text/html'});
      }
      return res.end("404 Not Found");
    }  
    // If `ext` is not an empty string, deal with the MIME type
    if(ext){
      res.writeHead(200, {'Content-Type': mimeTypes[ext]});
    }
    else{
      // This is a catch all
      res.writeHead(200, {'Content-Type': 'text/html'});
    }
    res.write(data);
    return res.end();
  });

}).listen(8080);






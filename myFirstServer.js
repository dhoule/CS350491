/********************************************** 
* myFirstServer.js
* Houle, Daniel B. 
* CS350/491 Summer 2019
* This file holds the beginnings of a NodeJS 
* server.
***********************************************/

const express = require('express');

const http = require('http'); // To use the HTTP interfaces in Node.js
const fs = require('fs'); // For interacting with the file system
const path = require('path'); // For working with file and directory paths
const url = require('url'); // For URL resolution and parsing
const qs = require('querystring'); // provides utilities for parsing and formatting URL query strings
const ffv = require('./node_modules/feedbackformval'); // custom validator
const nodemailer = require('nodemailer'); // module makes it easy to send emails from your computer
const uuidv1 = require('uuid/v1');
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

var app = express();
app.use(express.static('assets'));

// This block is used to determine the port to use on a foreign repo
var port = process.env.PORT || 8080;

console.log('\n\n**********\nListening on port: ', port,'\n**********\n\n');

http.createServer(app).listen(port);

// This is the only POST route that exists
app.post('/views/Feedback/index.htm', function (req, res) {
  var body = '';
  var testValidity = false; // never trust the client side
  // receiving data
  req.on('data', function(chunk) {
    body += chunk.toString();
  });
  // received all data
  req.on('end', function() {
    testValidity = ffv.validateForm(body);
    if (testValidity === true) {
      // The form is fully valid
      var ts = Date.now(); // Using a timestamp as a reference number
      var parsed = qs.parse(body);
      fs.appendFile('flatfileDB.txt', convertToString(parsed, ts), function(error){
        if (error) {
          console.log('Error writing to flatfileDB.txt file: ', error);
          throw error;
        }
        console.log('Wrote to flatfileDB.txt file successfully!');
      });
      sendEmail(parsed['email'],ts);
      res.writeHead(301, {'Content-Type': 'text/plain', Location: '/'} );
      res.end();
    }
    else {
      // There are errors that need to be sent back to the client
      // res.writeHead(422, {'Content-Type': 'text/plain'} ); // TODO change this back
      res.writeHead(301, {'Content-Type': 'text/plain', Location: '/'} );
      res.end(testValidity);
    }
  });
});

app.get('*', function (req, res) {
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
  // Sets up a default route to go directly to the "front page"
  pathname = ( pathname === '/' || pathname === '' ) ? '/index.htm' : pathname;

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
});


// Function merely converts data from an object to a string.
function convertToString(dirty, ts) {
  var temp = "{\tid:\"" + uuidv1() + "\", ";
  for (let dirt in dirty) {
    temp += dirt + ":\"" + dirty[dirt].replace(/"/g,'\\"') + "\", "
  }
  temp += "reference_id:\"" + ts + "\", created_at:" + Date() + "\t}\n";
  return temp;
} // end convertToString


// Function is used to send confirmation email.
function sendEmail(email, reference) {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.CS350491EMAILUSER,
      pass: process.env.CS350491EMAILPASS
    }
  });

  var mailOptions = {
    from: process.env.CS350491EMAILUSER,
    to: email,
    subject: 'Confirmation email',
    text: "Your information has been received.\nThank you, again, for your feedback.\nYour reference number for further emails is " + reference + "."
  };

  // This block is used to test the mailing server
  /*
    transporter.verify(function(error, success) {
      if (error) {
        console.log('************',error);
      } 
      else {
        console.log('Server is ready to take our messages');
      }
    });
  */

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
} // end sendEmail







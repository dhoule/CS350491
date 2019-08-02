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
// Used to create a database if it does not exist, and make a connection to it.
const mongoose = require('mongoose');
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

// The port 27017 is specified by the MongoDB. TODO look this up for deployment to Heroku
var dbUrl = process.env.MONGODB_URI || "mongodb://localhost:27017/CS350_491DB";

console.log('\n\n**********\nAttempting to connect to DB at: ', dbUrl,'\n**********\n\n');
var formModel;
var db = mongoose.connect(dbUrl, {useNewUrlParser: true}, function (err, client) {
  if (err) throw err;
  console.log("Database created!");

  // Need to set up some schema
  var formSchema = new mongoose.Schema({
    email: String,
    firstname: String,
    lastname: String,
    titlename: String,
    bodytext: String,
    phone: String,
    created_at: Date,
    reference_id: String
  });
  formModel = mongoose.model('Form', formSchema);
  // want to start the server only when the database is connected
  app.listen(port, function() {
    console.log('\n\n**********\nlistening on port: ', port,'\n**********\n\n');
  });
});




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

      var formM = new formModel(addAttributes(parsed, ts));
      formM.save(function (err, result) {
        if (err) { return console.log(err); }
        console.log('Saved to database');
        startEmailProcess(result['email'],result['firstname'],result['lastname'],result['titlename'],ts);
        res.writeHead(301, {'Content-Type': 'text/plain', Location: '/'} );
        res.end();
      });
    }
    else {
      // There are errors that need to be sent back to the client
      // res.writeHead(422, {'Content-Type': 'text/plain'} ); // TODO change this back
      res.writeHead(301, {'Content-Type': 'text/plain', Location: '/'} );
      res.end(testValidity);
    }
  });
});

// This handles all GET requests
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


// Function adds some attributes and and sanatizes them
function addAttributes(dirty, ts) {
  dirty.created_at = Date();
  dirty.reference_id = ts;
  return dirty;
} // end addAttributes


// Function is used to start the confirmation email process.
function startEmailProcess(email, first, last, title, reference) {
  // Find out how many times the given email has shown up before
  var query = formModel.find({'email': email}).select("email created_at -_id");
  query.exec(
    function(err,results) {
      if(err) { console.log(err); return err; }
      
      /* 
        The array is to contain only the emails of the those that the user submitted.
        Since this is called from within the callback function of the insertion to 
        the MongoDB, even if the user is new, there will be ONE entry.
      */
      var len = results.length - 1;
      formModel.find().distinct("email",
        function(error,num) {
          if(error) { console.log(error); return error; }

          sendEmail(len, num, email, first, last, title, reference);
        }
      );
    }
  );
} // end startEmailProcess

// Function builds the info, starts at least, and send the email
function sendEmail(len, num, email, first, last, title, reference) {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.CS350491EMAILUSER,
      pass: process.env.CS350491EMAILPASS
    }
  });
  /* 
    This is just to check if the `email` value has been seen before. 
    It's most likely not needed, as this code is called from within
    the callback function of the insertion to the MongoDB.
  */
  var ct = (num.indexOf(email) == -1) ? (num.length + 1) : num.length;
  
  // Need to determine what body text to use
  var body = createEmailBody(ct, len, reference, first, last, title);

  var mailOptions = {
    from: process.env.CS350491EMAILUSER,
    to: email,
    subject: 'Confirmation email',
    html: body
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

  // Send the email and log the results
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
} // end sendEmail

// Returns the body text of the email
function createEmailBody(ct, len, reference, first, last, title) {
  var body = "";
  var greeting = (title == "") ? first + " " + last : title + " " + last;
  body += getHeadPart() + bodyText(greeting, ct, len, reference) + getBottomPart();
  return body;
} // end createEmailBody

/* 
  Function holds the HEAD section, and the start, of the email.
  mso = Microsoft Office
  Yes, I found this online, and have modified it to fit my needs.
*/
function getHeadPart() {
  var   temp = "<html xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\">\n";
  temp += "<head>\n";
  temp += "  <!--[if gte mso 9]>\n";
  temp += "  <xml>\n";
  temp += "  <o:OfficeDocumentSettings>\n";
  temp += "  <o:AllowPNG/>\n";
  temp += "  <o:PixelsPerInch>96</o:PixelsPerInch>\n";
  temp += "  </o:OfficeDocumentSettings>\n";
  temp += "  </xml>\n";
  temp += "  <![endif]-->\n";
  temp += "  <title>Feedback Confirmation</title>\n";
  temp += "  <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n";
  temp += "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0 \">\n";
  temp += "  <meta name=\"format-detection\" content=\"telephone=no\">\n";
  temp += "  <!--[if !mso]><!-->\n";
  temp += "  <link href=\"https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800\" rel=\"stylesheet\">\n";
  temp += "  <!--<![endif]-->\n";
  temp += "  <style type=\"text/css\">\n";
  temp += "    body {\n";
  temp += "      margin: 0 !important;\n";
  temp += "      padding: 0 !important;\n";
  temp += "      -webkit-text-size-adjust: 100% !important;\n";
  temp += "      -ms-text-size-adjust: 100% !important;\n";
  temp += "      -webkit-font-smoothing: antialiased !important;\n";
  temp += "    }\n";
  temp += "    table {\n";
  temp += "      border-collapse: collapse;\n";
  temp += "      mso-table-lspace: 0px;\n";
  temp += "      mso-table-rspace: 0px;\n";
  temp += "    }\n";
  temp += "    td, span {\n";
  temp += "      border-collapse: collapse;\n";
  temp += "      mso-line-height-rule: exactly;\n";
  temp += "    }\n";
  temp += "    @media only screen and (min-width:481px) and (max-width:699px) {\n";
  temp += "      .em_main_table {\n";
  temp += "        width: 100% !important;\n";
  temp += "      }\n";
  temp += "      .em_hide {\n";
  temp += "        display: none !important;\n";
  temp += "      }\n";
  temp += "      .em_padd {\n";
  temp += "        padding: 20px 10px !important;\n";
  temp += "      }\n";
  temp += "    }\n";
  temp += "    @media screen and (max-width: 480px) {\n";
  temp += "      .em_main_table {\n";
  temp += "        width: 100% !important;\n";
  temp += "      }\n";
  temp += "      .em_hide {\n";
  temp += "        display: none !important;\n";
  temp += "      }\n";
  temp += "      .em_padd {\n";
  temp += "        padding: 20px 10px !important;\n";
  temp += "      }\n";
  temp += "      u + .em_body .em_full_wrap {\n";
  temp += "        width: 100% !important;\n";
  temp += "        width: 100vw !important;\n";
  temp += "      }\n";
  temp += "    }\n";
  temp += "  </style>\n";
  temp += "</head>\n";
  temp += "<body class=\"em_body\" style=\"margin:0px; padding:0px;\" bgcolor=\"#800020\">\n";
  temp += "  <table class=\"em_full_wrap\" valign=\"top\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" bgcolor=\"#800020\" align=\"left\">\n";
  temp += "    <tbody>\n";
  temp += "      <tr>\n";
  temp += "        <td valign=\"top\" align=\"left\">\n";
  temp += "          <table class=\"em_main_table\" style=\"width:700px;\" width=\"700\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" align=\"left\">\n";
  temp += "            <tbody>\n";
  temp += "              <tr>\n";
  temp += "                <td style=\"font-family:'Open Sans', Arial, sans-serif; padding:15px; color:white;\" class=\"em_padd\" valign=\"top\" bgcolor=\"#800020\" align=\"left\">\n";
  return temp;
} // end getHeadPart

// Used to create the body text depending on what is sent to it
function bodyText(greeting, ct, len, reference) {
  var   temp = "                  <h1>Hello, " + greeting +"</h1>\n";
  temp += "                </td>\n";
  temp += "              </tr>\n";
  temp += "              <tr>\n";
  temp += "                <td style=\"color:white;\" class=\"em_padd\" valign=\"top\" bgcolor=\"#800020\" align=\"left\">\n";
  temp += (len < 1) ? "                  Thank you, again, for your feedback.\n" : "                  Thank you for revisiting.\n";
  temp += "                </td>\n";
  temp += "              </tr>\n";
  temp += "              <tr>\n";
  temp += "                <td style=\"color:white;\" class=\"em_padd\" valign=\"top\" bgcolor=\"#800020\" align=\"left\">\n";
  temp += "                  Your information has been received.\n";
  temp += "                </td>\n";
  temp += "              </tr>\n";
  temp += "              <tr>\n";
  temp += "                <td style=\"color:white;\" class=\"em_padd\" valign=\"top\" bgcolor=\"#800020\" align=\"left\">\n";
  temp += "                  You are the " + getOrdinalSuffix(ct) + " honored guest, who has left a feedback.\n";
  temp += "                </td>\n";
  temp += "              </tr>\n";
  temp += "              <tr>\n";
  temp += "                <td style=\"color:white;\" class=\"em_padd\" valign=\"top\" bgcolor=\"#800020\" align=\"left\">\n";
  temp += "                  Your reference number for further emails is <strong>" + reference + "</strong>.\n";
  temp += "                </td>\n";
  temp += "              </tr>\n";

  return temp;
} // end bodyText

// This is the bottom part of the email
function getBottomPart() {
  var temp = "            </tbody>\n";
  temp += "          </table>\n";
  temp += "        </td>\n";
  temp += "      </tr>\n";
  temp += "    </tbody>\n";
  temp += "  </table>\n";
  temp += "  <div class=\"em_hide\" style=\"white-space: nowrap; display: none; font-size:0px; line-height:0px;\">\n";
  temp += "    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;\n";
  temp += "  </div>\n";
  temp += "</body>\n";
  temp += "</html>\n";
  return temp;
} // end getBottomPart

// Used to determine what suffix to add to the number
function getOrdinalSuffix(i) {
  var j = i % 10;
  var k = i % 100;
  if (j == 1 && k != 11) {
    return i + "st";
  }
  if (j == 2 && k != 12) {
    return i + "nd";
  }
  if (j == 3 && k != 13) {
    return i + "rd";
  }
  return i + "th";
} // end getOrdinalSuffix





/********************************************** 
* Feedback.js
* Houle, Daniel B. 
* CS350/491 Summer 2019
* This file holds the functions needed for the
* form validation of feedback.htm
***********************************************/

// Function will be used to, eventually, start events to send an email to the user

function sendEmail(event) {
  event.preventDefault(); // this was suggested for manual submit and redirect
  var form = document.getElementById("feedback-form");
  var title, firstName, lastName, email, comments; // Setting up the variables
  var collection = new Array(); // Holds messages to display to the user
  var text = ""; // Used to build all messages

  // Recheck the validity of the elements and collect messages if not valid
  if (!form.elements["first-name"].checkValidity()) {
    collection.push("\"First Name\" is a required field");
  }
  if (!form.elements["last-name"].checkValidity()) {
    collection.push("\"Last Name\" is a required field");
  }
  if (!form.elements["email"].checkValidity()) {
    collection.push("\"Email\" is a required field and must be a valid email");
  }
  if (!form.elements['phone'].checkValidity()) {
    collection.push("\"Phone Num\" must be in the form of ###-###-#### to be valid");
  }
  if (!form.elements["body-text"].checkValidity()) {
    collection.push("\"Message\" is a required field");
  }
  if (collection.length > 0) {
    for (var element of collection) {
      text += element + "\n";
    }
    alert(text);
    return false;
  }

  title = form.elements["title-name"].value;
  firstName = form.elements["first-name"].value;
  lastName = form.elements["last-name"].value;

  if (title === "") {
    text = "Thank you for your submition, " + firstName + " " + lastName + ".";
  }
  else {
    text = "Thank you for your submition, " + title + " " + lastName + ".";
  }
  text += "\n\nYour information is being processed.\nA confirmation email should be sent to you shortly."
  alert(text);
  form.submit();
} // end sendEmail

// Function makes sure the value of the required string fields are not empty

function validateField(dirty, field) {
  if (dirty.type == "email") {
    if (!dirty.checkValidity()) {
      alert("\"Email\" is a required field and must be a valid email");
      return false;
    }
  }
  else if (dirty.type == "tel") {
    if (!dirty.checkValidity()) {
      alert("\"Phone Num\" must be in the form of ###-###-#### to be valid");
      return false;
    }
  }
  else {
    if (!dirty.checkValidity()) {
      alert(field + " is a required field");
      return false;
    }
  }
  return true;
} // end validateField

      
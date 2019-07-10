/********************************************** 
* Footer.js
* Houle, Daniel B. 
* CS350/491 Summer 2019
* This file handles the footers at the bottom of 
* pages.
***********************************************/


function modifyNavbar() {
  var menu = document.getElementById("menuNavBar");
  if (menu.className === "navbar") {
    menu.className += " responsive";
  } else {
    menu.className = "navbar";
  }
}
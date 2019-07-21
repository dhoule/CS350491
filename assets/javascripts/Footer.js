/********************************************** 
* Footer.js
* Houle, Daniel B. 
* CS350/491 Summer 2019
* This file handles the footers at the bottom of 
* pages.
***********************************************/

/* 
	Hardcoded list of view directories. 
	Must be exactly the same as the directory names.
	Only letters and underscores are allowed.
*/
var directories = [
	'Feedback',
	'Lil_Story',
	'Media',
	'Weekly_Schedule'
];

// Changes the class value of the navbar element
function modifyNavbar() {
  var menu = document.getElementById("menuNavBar");
  if (menu.className === "navbar") {
    menu.className += " responsive";
  } else {
    menu.className = "navbar";
  }
} // end modifyNavbar

/* 
	Actually builds the innerHTML of the navbar on the `page` that calls this function.
	This is an onload even listener function, on the body element in the pages.
	The name of the directory the view is in must be give, along with the event.
*/
function buildNavbarMenu(e,page) {
	var menu = document.getElementById("menuNavBar");
	// Except for the 'main', all of the relative paths start the same way 
	var firstPart = (page == 'main') ? '<a class="button" href="./views/': '<a class="button" href="../';
	// For all but the 'main' page, the 'main' page needs to be the first button.
	var temp = (page == 'main') ? '' : getMainButton();
	// go over the directories
	for (let directory of directories) {
		// No sense in have a link to the current page, on the current page
		if (page != directory) {
			// Build each button <a> element
			temp += firstPart + directory + '/index.htm">' + directory.replace('_', ' ') + '</a>';
		}
	}
	// Add the last element 
	temp += getLastButton();
	// Adds the innHTML to the navbar
	menu.innerHTML = temp;
} // end buildNavbarMenu

// This is just to take it out of the calling function
function getMainButton() {
	return '<a class="button" href="../../index.htm">Main page</a>';
} // end getMainButton

// This just takes the string out of the calling function
function getLastButton() {
	return '<a href="javascript:void(0);" style="font-size:15px;" class="icon" onclick="modifyNavbar()">&#9776;</a>';
} // end getLastButton


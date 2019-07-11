/********************************************** 
* Footer.js
* Houle, Daniel B. 
* CS350/491 Summer 2019
* This file handles the footers at the bottom of 
* pages.
***********************************************/

var directories = [
	'Feedback',
	'Lil_Story',
	'Media',
	'Weekly_Schedule'
];

function modifyNavbar() {
  var menu = document.getElementById("menuNavBar");
  if (menu.className === "navbar") {
    menu.className += " responsive";
  } else {
    menu.className = "navbar";
  }
}

function buildNavbarMenu(e,page) {
	var menu = document.getElementById("menuNavBar");
	var firstPart = (page == 'main') ? '<a class="button" href="./views/': '<a class="button" href="../';
	var temp = (page == 'main') ? '' : getMainButton();
	for (let directory of directories) {
		if (page != directory) {
			temp += firstPart + directory + '/index.htm">' + directory.replace('_', ' ') + '</a>';
		}
	}
	temp += getLastButton();
	console.log(temp);
	menu.innerHTML = temp;
}

function getMainButton() {
	return '<a class="button" href="../../index.htm">Main page</a>';
}

function getLastButton() {
	return '<a href="javascript:void(0);" style="font-size:15px;" class="icon" onclick="modifyNavbar()">&#9776;</a>';
}


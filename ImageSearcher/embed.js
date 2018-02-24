function start() {
	// var logo = document.createElement("img");
	// logo.src = chrome.runtime.getURL("icon128.png");
	// chrome.storage.local.set({'ISstatus': "1"});
	if (r = document.querySelectorAll(".imageSearchEl")) {
		r.forEach(function(e){e.remove();});
	}

	document.querySelectorAll("img").forEach(inject);
	document.querySelectorAll("*[style*=background-image]").forEach(inject);	
	var videos = document.querySelectorAll("video");


	window.onscroll = function() {
		// if (r = document.querySelectorAll(".imageSearchEl")) {
			// r.forEach(function(e){e.remove();});
		// }
		document.onmousemove = function(e) {
      		start();
			document.onmousemove = null;
    	};
	}
	/*imgs.forEach(function(e){
		var logo = document.createElement("img");
		logo.src = chrome.runtime.getURL("icon128.png");
		logo.style = 'position: absolute; top: ' + getCoords(e).top + '; left:' + getCoords(e).left  + ';'; 

		e.parentNode.append()
	});
*/
}

function inject(e) {
	var t = e.getBoundingClientRect();
	if (t.height < 1 || t.width < 1) return;
	var value = '';
	if (e.src){
		value = e.src;
	} else if (value = e.style.backgroundImage) {
		value = value.substring(value.indexOf("http"), value.length - 2)
	}

	var logo = document.createElement("img");
	var p = getParams(e);
	logo.src = chrome.runtime.getURL("Images/icons/icon128.png");
	// logo.style = 'position: absolute; top: ' + p.top + 'px; left:' + p.left  + 'px; z-index: 20; width: ' + p.width + "; height: " + p.height +";";
	logo.style.position = "absolute";
	logo.style.top = p.top + 'px';
	logo.style.left = p.left  + 'px';
	logo.style.zIndex = 9999;
	logo.style.width = p.width + 'px';
	logo.style.height = p.height + 'px';
	logo.style.opacity = 0.5;
	logo.setAttribute("class", "imageSearchEl");
	logo.setAttribute("value", value);

	document.querySelector("body").append(logo);

	var cover = document.createElement("img");
	cover.src = value;
	cover.style.position = "absolute";
	cover.style.top = t.top - 5 + pageYOffset + 'px';
	cover.style.left = t.left - 5 + pageXOffset  + 'px';
	cover.style.zIndex = 9998;
	cover.style.width = t.width + 'px';
	cover.style.height = t.height + 'px';
	cover.style.border = "5px dashed black";
	cover.style.opacity = 0.8;
	cover.setAttribute("class", "imageSearchEl");

	logo.onmouseover = function() {
		logo.style.opacity = 0.85;
		e.style.opacity = 0.5;
		document.querySelector("body").append(cover);
	}

	logo.onmouseout = function() {
		e.style.opacity = 1;
	 	logo.style.opacity = 0.5;
		e.style.zIndex = 0;
	 	start();
		// document.querySelector(".").remove();
	}

}

function getParams(e) { // кроме IE8-
  	var box = e.getBoundingClientRect();
  	var s = 40;
  	console.log(box.height + ' ' + box.width)
  
	if (box.height < 61) {
		if (Math.floor(box.height * 0.5) < 16) {
  			s = 16;
  		} else {
  			s = Math.floor(box.height * 0.5);
  		}
  	} else if (box.width < 61) {
  		if (Math.floor(box.width * 0.5) < 16) {
  			s = 16;
  		} else {
  			s = Math.floor(box.width * 0.5);
		}
	}	
  console.log(s);
  return {
    top: box.top + pageYOffset + Math.floor(box.height * 0.01),
    left: box.left + pageXOffset + Math.floor(box.width * 0.01),
    width: s,
    height: s
  };

}

document.onclick = function() {start();};
start();

function deactISMode() {
 	if (r = document.querySelectorAll(".imageSearchEl")) {
		r.forEach(function(e){e.remove();});
	}
	chrome.storage.local.set({'ISstatus': "0"});
	document.onclick = null;
	window.onscroll = null;
	document.onmousemove = null;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(request);
	if (request.todo == "deactISMode") {
		deactISMode();
	}
});


/*
document.ready(start());
document.on('page:load', start)
document.on('turbolinks:load', start);
document.on('change', start);

*/

/*var css = document.createElement("style");

document.querySelectorAll("img").forEach(function(e){
	var logo = document.createElement("img");
	var p = getParams(e);
	logo.src = "http://reload2u.com/wp-content/uploads/2016/08/icon-game-1.jpg";
	// logo.style = 'position: absolute; top: ' + p.top + 'px; left:' + p.left  + 'px; z-index: 20; width: ' + p.width + "; height: " + p.height +";";
	logo.style.position = "absolute";
	logo.style.top = p.top + 'px';
	logo.style.left = p.left  + 'px';
	logo.style.zIndex = 20;
	logo.style.width = p.width + 'px';
	logo.style.height = p.height + 'px';
	logo.style.opacity = 0.5;

	logo.class = "imageSearchEl";
	//console.log(e);
	// console.log(logo);
	// console.log(e.parentNode);

	document.querySelector("body").append(logo);
});*/
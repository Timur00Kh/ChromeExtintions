function start() {
	if (r = document.querySelectorAll(".imageSearchEl")) {
		r.forEach(function(e){e.remove();});
	}

	imgs = document.querySelectorAll("img:not(.imageSearchEl):not([indexedbyis=true]), *[style*=background-image]:not([indexedbyis=true])");
	inject(imgs);	
	var videos = document.querySelectorAll("video");
}

function searchNew() {
	imgs = document.querySelectorAll("img:not(.imageSearchEl):not([indexedbyis=true]), *[style*=background-image]:not([indexedbyis=true])");
	inject(imgs);	
	var videos = document.querySelectorAll("video");
}

var allElements = [];
function inject(elem) {
	var arr = [];
	elem.forEach( function(e) {
		var v = new Object();
		v.el = e;
		v.logo = document.createElement("img");
		v.cover = document.createElement("img");
		arr.push(v);
		allElements.push(v);
	});
	arr.forEach( function(e) {
		var t = e.el.getBoundingClientRect();
		e.el.setAttribute("indexedByIS", "true");
		if (t.height < 1 || t.width < 1) return;
		var value = '';
		if (e.el.src){
			value = e.el.src;
		} else if (value = e.el.style.backgroundImage) {
			value = value.substring(value.indexOf("(") + 2, value.length - 2)
		}	
		// if (value.indexOf("//") == 0) value = "http:" + value;

		var p = getParams(e.el);
		e.logo.src = chrome.runtime.getURL("Images/icons/icon128.png");
		e.logo.style.position = "absolute";
		e.logo.style.zIndex = 9998;
		e.logo.style.opacity = 0.5;
		e.logo.setAttribute("class", "imageSearchEl");
		e.logo.setAttribute("value", value);
		e.logo.setAttribute("title", "open in new tab");

		document.querySelector("body").append(e.logo);

		e.cover.src = value;
		e.cover.style.position = "absolute";
		e.cover.style.zIndex = 9997;
		e.cover.style.border = "5px dashed black";
		e.cover.style.opacity = 0.95;
		e.cover.setAttribute("class", "imageSearchEl");

		arrange(e);

		e.logo.onmouseover = function() {
			e.logo.style.opacity = 0.9;
			document.querySelector("body").append(e.cover);
		}

		e.logo.onmouseout = function() {
			arr.forEach( function(e) {
				arrange(e);
				e.cover.remove();
			});
		}

		e.logo.onclick = function() {

			/*
			//soon... may be
			if (e.cover.naturalWidth == 0  || e.cover.naturalHeight == 0){
				html2canvas(e.el, {letterRendering: 1, allowTaint : true}).then(canvas => {
					canvas.style.position = "fixed";
					canvas.style.zIndex = 9999;
					canvas.style.top = 0 + 'px';
					canvas.style.left = 0 + 'px';
					document.body.appendChild(canvas);
					console.log(canvas);
					chrome.runtime.sendMessage({todo: "openB64", dimensions:});
				});
			} else {

			}*/
		}
	});

	function arrange(e) {
		t = e.el.getBoundingClientRect();
		if (t.height < 1 || t.width < 1) {
			e.el.setAttribute('indexedbyis', "");
			e.logo.remove();
			e.cover.remove();
		}
		p = getParams(e.el);
	 	e.logo.style.opacity = 0.5;
		e.logo.style.top = p.top + 'px';
		e.logo.style.left = p.left  + 'px';
		e.logo.style.width = p.width + 'px';
		e.logo.style.height = p.height + 'px';
		e.cover.style.top = t.top - 5 + pageYOffset + 'px';	
		e.cover.style.left = t.left - 5 + pageXOffset  + 'px';
		e.cover.style.width = t.width + 'px';	
		e.cover.style.height = t.height + 'px';
	}

	var timer = null;
	window.onscroll = function() {
		allElements.forEach( function(e) {
			e.logo.style.display = "none";
		});
    	if(timer !== null) {
        	clearTimeout(timer);        
    	}
    	timer = setTimeout(function() {
    		allElements.forEach( function(e) {
    			arrange(e);
				e.logo.style.display = "";
			});
      		searchNew();
    	}, 150);
	};

	document.onclick = function() {
	setTimeout(function() {
		allElements.forEach( function(e) {
    		arrange(e);
		});
      	searchNew();
    }, 1000);
};
}



function getParams(e) { // кроме IE8-
  	var box = e.getBoundingClientRect();
  	var s = 40;
  	  
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
  
  return {
    top: box.top + pageYOffset + Math.floor(box.height * 0.01),
    left: box.left + pageXOffset + Math.floor(box.width * 0.01),
    width: s,
    height: s
  };

}

var conf = "Скрипт может быть очень лагучим, если на странице больше 1к изоображений"
if (!document.querySelectorAll(".imageSearchEl").length) {
	if (confirm(conf)) start();
} else {
	deactISMode();
}

function deactISMode() {
 	if (r = document.querySelectorAll(".imageSearchEl")) {
		r.forEach(function(e){e.remove();});
	}
	if (a = document.querySelectorAll("[indexedbyis=true]")){
		a.forEach(function(e){
			e.setAttribute('indexedbyis', "");
		})
	}
	if (allElements.length) {
		allElements.forEach( function(e) {
			e.el.remove();
			e.logo.remove();
			e.cove.remove();
		});
	}
	// chrome.storage.local.set({'ISstatus': "0"});
	document.onclick = null;
	window.onscroll = null;
	allElements = [];
	// document.onmousemove = null;
}

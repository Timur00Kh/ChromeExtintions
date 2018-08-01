
var search = document.getElementById("searchh"),
    search_container = search.querySelector(".search_container"),
    // searchs_containers = search.querySelector("#searchs_containers"),
    SEARCH = JSON.parse(localStorage.SEARCH),
    options = JSON.parse(localStorage.getItem("search_options")),
    search_btn = search.querySelector("#search_btn"),
    historyS = localStorage.historyS ? JSON.parse(localStorage.historyS) : [];

function saveHistory() {
    localStorage["historyS"] = JSON.stringify(historyS);
}


/*Main*/
var params = {};
window.location.href
    .substring(window.location.href.indexOf("?") + 1,
        window.location.href.indexOf("#") > -1 ? window.location.href.indexOf("#") : window.location.href.length)
    .split("&")
    .forEach(function (e) {
        e = e.split("=");
        params[e[0]] = e[1];
    });
console.log(params);
console.log(historyS);
if (params.id) {
    var flag = true;
    for (var g = historyS.length - 1; g >= 0; g--){
        console.log(historyS[g].id);
        if (historyS[g].deleted) {
            historyS.splice(g, 1);
            saveHistory();
            continue;
        }
        if (flag && (historyS[g].id === Number(params.id))) {
            main(params.url ? params.url : historyS[g].url, historyS[g].location, historyS[g].hosting, historyS[g].id);
            flag = false;
        }
    }
    if (flag && !params.url) alert("It seem image was deleted from history or has never existed");
} else {
    main(atob(params.url), atob(params.location), atob(params.hosting), params.id);
}


function main(url, location, hosting, id) {
    var img = document.createElement("img");
    img.src = url;
    img.id = "image";
    console.log(img);
    img.setAttribute("class", "img-thumbnail bubble");
    document.getElementById("img-holder").prepend(img);
    document.getElementById("load-img").remove();
    var loc = location ? (location === "2" ? url : location) : null;
    document.querySelector("#location a").innerHTML = loc ? loc : "No data";
    document.querySelector("#location a").setAttribute("href", loc ? loc : "");
    document.querySelector("#location a").setAttribute("target", "_blank");
    document.getElementById("location").title = loc ? loc : "";

    img.onload = function () {
        img.width = img.naturalWidth;
        img.height = img.naturalHeight;
        document.getElementById("size").innerHTML =  img.naturalWidth + " x "  + img.naturalHeight + " ";
        document.getElementById("scaledSize").innerHTML =  " (Scaled to " + img.width + " x "  + img.height + ")";

        window.onresize = function () {
            document.getElementById("scaledSize").innerHTML =  " (Scaled to " + img.width + " x "  + img.height + ")";
        };

        if (this.src.indexOf("data:") === -1 && this.src.indexOf("blob:") === -1) {
            getInfo(this);
        } else {
            getBase64Info(this, true)
        }

        function getInfo(img) {
            var http = new XMLHttpRequest();
            http.open('HEAD', img.src, true);
            http.send(null);
            http.onreadystatechange = function () {
                console.log(http);
                if (http.status === 200 && http.readyState === 4) {
                    var fileSize = niceBytes(http.getResponseHeader('content-length'));
                    var imgType = http.getResponseHeader("Content-Type").split("/")[1];
                    console.log(fileSize);
                    console.log(imgType);
                    if (fileSize.bytes && fileSize.nice && imgType) {
                        setProperties(fileSize, imgType);
                    } else if (imgType) {
                        console.log("XHR file size calculating failed");
                        getBase64Info(img, imgType)
                    } else {
                        getBase64Info(img, false)
                    }
                }

                if (http.status !== 200) {
                    console.log("lllllllll");
                    getBase64Info(img, false)
                }
            };
            http.onerror = function () {
                console.log(http);
                getBase64Info(img, false)
            };
        }

        function getBase64Info(img, imgType) {
            var b64 = img.src;
            if (!imgType) {
                var format = b64.split(".");
                imgType = b64.split(".").length > 1 && format[format.length - 1].length < 5 ? format[format.length - 1] : "???";
            }
            if (b64.indexOf("data:") === -1) {
                var canvas = document.createElement('CANVAS');
                var ctx = canvas.getContext('2d');
                var dataURL;
                canvas.height = img.naturalHeight;
                canvas.width = img.naturalWidth;
                ctx.drawImage(img, 0, 0);
                b64 = canvas.toDataURL();
            } else {
                imgType = b64.substring(b64.indexOf("/") + 1, b64.indexOf(";"));
            }
            setProperties(niceBytes(b64.length / 4 * 3), imgType);
        }

        function setProperties(fileSize, type) {
            document.getElementById("type").innerHTML = type;
            document.getElementById("fileSize").innerHTML = fileSize.nice + " / " + fileSize.bytes;
        }

        function niceBytes(x) {
            var units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                n = o = parseInt(x, 10) || 0,
                l = 0,
                result = {};
            while (n > 1024) {
                n = n / 1024;
                l++;
            }
            result.nice = l > 0 ? n.toFixed(2) + ' ' + units[l] : null;
            result.bytes = o.toLocaleString() + ' ' + units[0];
            return result;
        }
    };

    if (url.indexOf("data:") === -1) {
        document.getElementById("url").value = url;
        document.getElementById("url_copy").disabled = false;
        document.getElementById("url_copy").onclick = function (ev) {
            copyTextToClipboard(document.getElementById("url").value);
            // window.location.href += "saasfsdf"
        };
        document.getElementById("url_open").onclick = function (ev) {
            chrome.tabs.getCurrent(function (tab) {
                chrome.tabs.create({
                    "url": document.getElementById("url").value,
                    "index": ++tab.index
                });
            });
        };
        document.getElementById("url_open").disabled = false;
        document.getElementById("url_open").href = url;
        // document.getElementById("url_get").remove();
        document.getElementById("data_get").onclick = function (ev) {
            var canvas = document.createElement('CANVAS');
            var ctx = canvas.getContext('2d');
            var dataURL;
            canvas.height = img.naturalHeight;
            canvas.width = img.naturalWidth;
            ctx.drawImage(img, 0, 0);
            document.getElementById("data").value = canvas.toDataURL();
            document.getElementById("data_copy").style.display = "";
            document.getElementById("data_open").style.display = "";
            ev.target.remove();
        }

    } else {
        document.getElementById("data").value = url;
        document.getElementById("data_copy").style.display = "";
        document.getElementById("data_open").style.display = "";


        document.getElementById("data_get").remove();
    }

    document.getElementById("data_copy").onclick = function (ev) {
        copyTextToClipboard(document.getElementById("data").value);
    };
    document.getElementById("data_open").onclick = function (ev) {
        chrome.tabs.getCurrent(function (tab) {
            chrome.tabs.create({
                "url": document.getElementById("data").value,
                "index": ++tab.index
            });
        });
    };

    if (hosting) {
        document.getElementById("hosting").value = hosting;
        document.getElementById("hosting_copy").style.display = "";
        document.getElementById("hosting_open").style.display = "";
        document.getElementById("upload").remove();

        document.getElementById("hosting_copy").onclick = function (ev) {
            copyTextToClipboard(document.getElementById("hosting").value);
        };
        document.getElementById("hosting_open").onclick = function (ev) {
            chrome.tabs.getCurrent(function (tab) {
                chrome.tabs.create({
                    "url": document.getElementById("hosting").value,
                    "index": ++tab.index
                });
            });
        }
    } else {
        document.getElementById("upload").onclick = function () {
            if (document.getElementById("data_get")) {
                document.getElementById("data_get").click();
            }
            chrome.tabs.getCurrent(function (tab) {
                console.log(uploadBase64);
                uploadBase64(document.getElementById("data").value, null, tab);
            });
        }
    }
}

/*Search*/
search_container.remove();
SEARCH.forEach(function (el, i, arr) {
    if (!options[el.id]) {
        var t = search_container.cloneNode(true);
        t.querySelector(".search_title").innerHTML = el.title;
        t.querySelector("#search_check").id = el.id;
        t.querySelectorAll("label").forEach(function (value) {
            value.setAttribute("for", el.id);
        });
        searchs_container.append(t);
    }
});

var all = search_container.cloneNode(true);
all.querySelector(".search_title").innerHTML = "ALL";
all.querySelector("#search_check").id = "all";
all.querySelectorAll("label").forEach(function (value) {
    value.setAttribute("for", "all");
});
searchs_container.append(all);

all.onchange = function (e) {
    if (e.target.checked) {
        search.querySelectorAll("input").forEach(function (e, i) {
            setTimeout(function () {
                s1();
            }, getRandomInt(10,500));
            function s1() {
                e.checked = true;
            }
        })
    } else {
        search.querySelectorAll("input").forEach(function (e) {
            e.checked = false;
        })
    }
};

search_btn.onclick = function () {
    var ids = [];
    search.querySelectorAll("input").forEach(function (e) {
        if (e.checked === true) ids.push(e.id);
    });
    SEARCH.forEach(function (s, i) {
        ids.forEach(function (id) {
            if (s.id === id) {
                incStatictics(id);
                var normUrl;
                if ((normUrl = document.getElementById("hosting").value)) {
                    open(normUrl);
                } else if ((normUrl = document.getElementById("url").value) && normUrl.length > 0) {
                    open(normUrl);
                } else if (document.getElementById("data").value && document.getElementById("data").value.length > 0) {
                    document.getElementById("upload").click();
                    function s1(s) {
                        setTimeout(function () {
                            s2(s);
                        }, 500)
                    }
                    function s2(s) {
                        if (s > 30) return;
                        console.log("yep");
                        normUrl = document.getElementById("hosting").value;
                        if (normUrl && normUrl.length > 0) {
                            open(normUrl);
                        } else {
                            s1(++s);
                        }
                    }
                    s1(0);
                } else {
                    alert("Where is url??");
                }
            }
        });
        function open(normUrl) {
            console.log("Norm: " + normUrl);
            setTimeout(function () {
                chrome.tabs.getCurrent(function (tab) {
                    chrome.tabs.create({
                        "url": s.srchUrl + normUrl,
                        "index": tab.index + i + 1
                    });
                });
            }, 1000 * i);
        }
    });
};

/*HISTORY*/
var history_holder = document.getElementById("history_holder"),
    history_item = document.querySelector(".history_item");
history_item.remove();

if (!options["history_options"]) {
    console.log(historyS);

    if (historyS.length === 0) {
        var nd = document.createElement("h6");
        nd.setAttribute("class", "card-subtitle text-muted");
        nd.innerHTML = "No data";
        console.log(history_holder.parentNode);
        history_holder.parentNode.append(nd);
        document.getElementById("history_load_btn").remove();
    } else {
        var j = historyS.length - 14;
        for (var i = historyS.length - 1; i > historyS.length - 4; i--) {
            appendHistoryItem(i);
        }
        document.getElementById("history_load_btn").onclick = function () {
            for (; i > j; i--) {
                appendHistoryItem(i);
            }
            j -= 10;
        }
    }
} else {
    var nd = document.createElement("h6");
    nd.setAttribute("class", "card-subtitle text-muted");
    nd.innerHTML = "History is disabled";
    history_holder.parentNode.append(nd);
    document.getElementById("history_load_btn").remove();
}

function appendHistoryItem(i) {
    if (i <= -1 || i >= historyS.length) {
        document.getElementById("history_load_btn").innerHTML = "End";
        document.getElementById("history_load_btn").disabled = true;
        return false;
    }
    if (historyS[i].deleted) return false;
    var cur = history_item.cloneNode(true);
    if (params.id && historyS[i].id === Number(params.id)) {
        cur.style.backgroundColor = "#F7F7F7";
        cur.title = "current image";
    }
    cur.querySelector(".history_img").src = historyS[i].url;
    cur.querySelector(".history_item_url").innerHTML = historyS[i].url;
    cur.querySelector(".history_item_location").innerHTML = historyS[i].location ? ((historyS[i].location === "2") ? historyS[i].url : historyS[i].location) : "No data";
    cur.querySelector(".history_item_location").setAttribute("href", historyS[i].location ? ((historyS[i].location === "2") ? historyS[i].url : historyS[i].location) : "");
    cur.querySelector(".history_item_url").setAttribute("href", historyS[i].url);
    // var l = historyS[i].location ? ("&location=" + btoa(historyS[i].location)) : "",
    //     h = historyS[i].hosting ? ("&hosting=" + btoa(historyS[i].hosting)) : "",
    //     u = "?url=" + btoa(historyS[i].url) + "&id=" + historyS[i].id,
        link = chrome.runtime.getURL("newtab.html") + "?id=" + historyS[i].id;
    // console.log(h)
    cur.querySelector(".history_item_link").setAttribute("href", link);
    var date = historyS[i].date ? historyS[i].date : "????-??-?? ??:??:??";
    cur.querySelector(".date").innerHTML = date;
    cur.querySelector(".delete_history_item").title = "delete";
    cur.querySelector(".delete_history_item").onclick = function () {
        historyS[i].deleted = true;
        saveHistory();
        var inner = cur.children[0].children;
        console.log(inner);
        // inner[1].style.display = "none";
        var b =inner[2];
        b.remove()
        console.log(inner);

        var div = document.createElement("div"),
            a = document.createElement("button");
        a.innerHTML = "Cancel";

        div.setAttribute("class", "col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 mr-xl-0 mt-1 ml-sm-0 ml-auto mr-5 mr-sm-0");
        a.setAttribute("class", "btn btn-outline-info card-link bubble");
        a.onclick = function () {
            div.remove();
            cur.children[0].append(b);
            historyS[i].deleted = false;
            saveHistory();

        };
        div.append(a);
        cur.children[0].append(div);


    };
    history_holder.append(cur);
}



function dataImageOnClick(res, info, tab){
    console.log(res);
    uploadMessage = res ? (res.message ? res.message : null) : null;
    if (res && res.status && res.status === "ok") {
        chrome.notifications.create("img_search_notificathion", {
            iconUrl: "Images/icons/256.png",
            title: "Image was uploaded",
            message: uploadMessage ? uploadMessage : "Image was uploaded to Image hosting",
            contextMessage: res.url,
            type: "basic",
            eventTime: Date.now() + 2000
        });
        document.getElementById("hosting").value = res.url;
        document.getElementById("hosting_copy").style.display = "";
        document.getElementById("hosting_open").style.display = "";
        document.getElementById("upload").remove();
        console.log(params.id);
        for (var i = historyS.length - 1; i >= 0; i--){
            console.log(historyS[i]);
            if (historyS[i].id == params.id){
                historyS[i].hosting = res.url;
                saveHistory();
                break;
            }
        }
    } else {
        chrome.notifications.create("img_search_notification", {
            iconUrl: "Images/icons/256.png",
            title: "Something went wrong",
            message: uploadMessage ? uploadMessage : "Image wasn't uploaded to Image hosting",
            contextMessage: "Image isn't public acessable",
            type: "basic",
            eventTime: Date.now() + 2000
        });
        // return;
    }
}




document.querySelectorAll('input[type="text"]').forEach(function (e) {
    e.onclick = function (ee) {
        ee.target.setSelectionRange(0, this.value.length);
    }
});


/*DOWNLOAD*/
document.getElementById("download_btn").onclick = function () {
    var name = document.getElementById("download_btn").value;
    chrome.downloads.download({
        url: url,
        filename: name.length > 0 ? name : undefined,
        saveAs: document.getElementById("save_as").checked
    });
};


/*system*/
function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

uploadBase64 = new Function("b64, info, tab", localStorage["func"]);

function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function() {
        console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
        console.error('Async: Could not copy text: ', err);
    });
}

function incStatictics(id) {
    if (options["statistics_options"]) return;
    statistics = localStorage.statistics ? JSON.parse(localStorage.statistics) : {};
    var stat = statistics[id];
    if (stat) {
        if (!stat.value) {
            stat.value = 1;
        } else {
            stat.value++;
        }
    } else {
        statistics[id] = {};
        statistics[id].value = 1;
    }
    for (var i = 0; i < SEARCH.length; i++) {
        if (SEARCH[i].id === id) {
            statistics[id].title = SEARCH[i].title
        }
    }
    localStorage.statistics = JSON.stringify(statistics);
}
var SEARCH = [];
var ss = "";
var current = {};
var options = {};
var statistics = {};
var func = "";
var historyS = [];

var opnNewTabItem = {};
var opnNewTabItems = [];

var CONTEXTS = ["image", "video", "link", "frame", "audio", "page"];

var uploadMessage;
var tabInfo = {};

const system_top = [
    {
        id: "opnNewTab",
        title: "Open in a new Tab",
        srchUrl: "",
        onclick: genericOnClick /*function (info, tab) {
            chrome.tabs.create({
                "url": /!*chrome.runtime.getURL("newtab.html"), + "?q=" + *!//!*(current.url ? current.url : info.srcUrl)*!/,
                "index": ++tab.index
            });
        }*/
    },
    {
        id: "opnNewTab_s1",
        type: "separator",
        title: "separator",
        system: true
    }
];

const system_bottom = [
    {
        id: "s2",
        type: "separator",
        title: "separator",
        system: true
    },
    {
        id: "options",
        type: "normal",
        title: "options",
        system: true,
        onclick: function (info, tab) {
            chrome.tabs.create({
                "url": "/options.html",
                "index": ++tab.index
            });
            console.log("sett")
        }
    }
];

const SEARCH_DEFAULT = [
    {
        id: "google",
        title: "Google Search",
        srchUrl: "http://images.google.com/searchbyimage?image_url="
    },
    {
        id: "yandex",
        title: "Yandex Search",
        srchUrl: "https://yandex.ru/images/search?source=collections&rpt=imageview&&url="
    },
    {
        id: "whatanime",
        title: "Search by whatanime",
        srchUrl: "https://whatanime.ga/?url="
    },
    {
        id: "tineye",
        title: "TinEye Search",
        srchUrl: "http://tineye.com/search/?url="
    },
    {
        id: "saucenao",
        title: "SauceNAO Search",
        srchUrl: "http://saucenao.com/search.php?db=999&url="
    },
    {
        id: "iqdb",
        title: "IQDB Search",
        srchUrl: "http://iqdb.org/?url="
    }
];




function init() {
    /*Инициализация настроек*/
    if (localStorage.getItem("SEARCH") != null) {
        SEARCH = JSON.parse(localStorage.getItem("SEARCH"));
    } else {
        SEARCH = SEARCH_DEFAULT;
        localStorage.SEARCH = JSON.stringify(SEARCH);
    }
    if (localStorage.getItem("search_options") != null) {
        options = JSON.parse(localStorage.getItem("search_options"));
    } else {
        options = {
            whatanime: true,
            tineye: true,
            saucenao: true,
            iqdb: true
        };
        localStorage.search_options = JSON.stringify(options);
    }
    statistics = localStorage.getItem("statistics") != null ? JSON.parse(localStorage.getItem("statistics")) : {};
    func = localStorage["func"] != null ? localStorage["func"] : (uploadBase64_DEFAULT + "").substring(
        (uploadBase64_DEFAULT + "").indexOf("{") + 3, (uploadBase64_DEFAULT + "").length - 1
    );
    for (var t in statistics) {
        statistics[t].name = SEARCH[t];
    }
    historyS = localStorage.getItem("historyS") != null ? JSON.parse(localStorage.getItem("historyS")) : [];

    /*Очистка старых меню*/
    chrome.contextMenus.removeAll();

    /*Создание системных меню в начале*/
    var e = system_top[0];
    chrome.contextMenus.create({
        id: e.id,
        title: e.title,
        contexts: ["image"],
        onclick: e.onclick ? e.onclick : genericOnClick,
        visible: !options[e.id]
    });
    e = system_top[1];
    chrome.contextMenus.create({
        id: e.id,
        title: e.title,
        contexts: ["image"],
        type: !options[system_top[0].id] ? "separator" : "normal",
        visible: !options[system_top[0].id]
    });


    /*Создание сновных меню*/
    SEARCH.forEach(function (e) {
        chrome.contextMenus.create({
            id: e.id,
            title: e.title,
            contexts: ["image"],
            onclick: e.onclick ? e.onclick : genericOnClick,
            type: e.type ? e.type : "normal",
            visible: !options[e.id]
        });
    });

    /*Создание системных меню в конце*/
    system_bottom.forEach(function (e) {
        chrome.contextMenus.create({
            id: e.id,
            title: e.title,
            contexts: ["image"],
            onclick: e.onclick ? e.onclick : genericOnClick,
            type: e.type ? e.type : "normal",
            visible: !options[e.id]
        });
    });

    /*options*/
    function zzz() {
        var e = system_top[0];
        chrome.contextMenus.create({
            id: e.id + "_options",
            parentId: "options",
            title: e.title,
            contexts: ["all"],
            type: "checkbox",
            onclick: function () {
                options[system_top[0].id] = !options[system_top[0].id];
                options[system_top[1].id] = !options[system_top[0].id];
                localStorage["search_options"] = JSON.stringify(options);
                chrome.contextMenus.update(system_top[0].id, {
                    visible: !options[system_top[0].id]
                });
                chrome.contextMenus.update(system_top[1].id, {
                    type: !options[system_top[0].id] ? "separator" : "normal",
                    visible: !options[system_top[0].id]
                });
            },
            checked: !options[e.id]
        })
    }
    zzz();
    SEARCH.forEach(function (e) {
        if (!e.system)
        chrome.contextMenus.create({
            id: e.id + "_options",
            parentId: "options",
            title: e.title,
            contexts: ["all"],
            onclick: function () {
                options[e.id] = !options[e.id];
                localStorage["search_options"] = JSON.stringify(options);
                chrome.contextMenus.update(e.id, {
                    visible: !options[e.id]
                });
            },
            type: "checkbox",
            checked: !options[e.id]
        });
    });

    /*Настройки advanced*/
    chrome.contextMenus.create({
        id: "s3",
        parentId: "options",
        contexts: ["all"],
        type: "separator"
    });
    chrome.contextMenus.create({
        id: "advMode",
        parentId: "options",
        title: "more options",
        contexts: ["all"],
        onclick: function (info, tab) {
            chrome.tabs.create({
                "url": chrome.runtime.getURL("options.html"),
                "index": ++tab.index
            });
        }
    });
}
init();

/*Иньекция скрипта advMode контроллера*/
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (!options["video_options"] || !options["bg_img_options"]) {
        if (changeInfo.status && changeInfo.status === "complete") {
            console.log({
                tabId: tabId,
                changeInfo: changeInfo,
                tab: tab
            });
            if (tab.url.indexOf("http") > -1) {
                chrome.tabs.executeScript(tabId, {file: "executable.js", allFrames: true, runAt: "document_end"});
            } else {
                deleteContextMenus();
            }
        }
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log({
        request: request,
        sender: sender
    });
    if (!request.key && !request.key === "img_searcher") return;
    if (request.type === "none") deleteContextMenus();
    if (request.type !== "newTab") {
            current = request;
    }
    current.date = Date.now();
    if (request.type === "img") {
        updateContextMenus();
    }
    if (request.type === "bg_img" && !options["bg_img_options"]) {
        updateContextMenus();
    }
    if (request.type === "video" && !options["video_options"]){
        updateContextVideoMenus()
    }
    if (request.type === "video_prop"){
        current.dimensions = request.dimensions;
        current.window = request.window;
        captureTab(tabInfo.info, tabInfo.tab);
    }
    if (request.type === "get"){
        sendResponse({
            options: options,
            SEARCH: SEARCH,
            statistics: statistics,
            func: func
        });
    }
    if (request.type === "set") {
        if (request.options) {
            options = request.options;
            localStorage["search_options"] = JSON.stringify(options);
        }
        if (request.SEARCH) {
            SEARCH = request.SEARCH;
            localStorage["SEARCH"] = JSON.stringify(SEARCH);
        }
        if (request.statistics) {
            statistics = request.statistics;
            localStorage["statistics"] = JSON.stringify(statistics);
        }
        if (request.func) {
            func = request.func;
            localStorage["func"] = JSON.stringify(func);
            uploadUpload();
        }
        if (request.reset) {
            var reset = request.reset;
            if (reset.options) delete localStorage["search_options"];
            if (reset.SEARCH) delete localStorage["SEARCH"];
            if (reset.statistics) delete localStorage["statistics"];
            if (reset.history) delete localStorage["historyS"];
            if (reset.func) {
                delete localStorage["func"];
                uploadUpload();
            }
        }
        init();
    }
    if (request.type === "newTab") {

    }
});

function updateContextSystemMenus(video) {
    system_top.forEach(function (e) {
        chrome.contextMenus.update(e.id,{
            contexts: CONTEXTS,
            onclick: video ? videoOnClick : e.onclick
        }, function () {
            console.log("sdfsdfsdfsddddd")
        });
    });
    system_bottom.forEach(function (e) {
        chrome.contextMenus.update(e.id,{
            contexts: CONTEXTS
            // onclick: videoOnClick
        });
    });
}

function updateContextVideoMenus() {
    SEARCH.forEach(function (e) {
        chrome.contextMenus.update(e.id,{
            contexts: CONTEXTS,
            onclick: videoOnClick
        });
    });
    updateContextSystemMenus(true);
}

function videoOnClick(info, tab) {
    console.log({
        tab: tab,
        info: info,
        search: SEARCH
    });
    chrome.tabs.sendMessage(tab.id, {
        src: current.src,
        dimensions: current.dimensions
    }, function (res) {
        console.log(res);
        if (res !== "ok") return;

        setTimeout(function () {
            chrome.tabs.captureVisibleTab(function (e) {
                var d = current.dimensions;
                var w = current.window;
                console.log(d);
                console.log(current);
                var img = new Image();
                img.src = e;
                img.onload = function () {
                    var canvas = document.createElement("canvas");
                    var maxW = d.right > w.maxWidth ? w.maxWidth - (d.left > 0 ? d.left : 0) : d.width;
                    var maxH = d.bottom > w.maxHeight ? w.maxHeight - (d.top > 0 ? d.top : 0) : d.height;
                    canvas.width = d.left < 0 ? maxW + d.left : maxW;
                    canvas.height = d.top < 0 ? maxH + d.top : maxH;
                    var context = canvas.getContext("2d");
                    context.drawImage(img,
                        d.left > 0 ? d.left : 0,
                        d.top > 0 ? d.top : 0,
                        d.left < 0 ? maxW + d.left : maxW,
                        d.top < 0 ? maxH + d.top : maxH,
                        0, 0,
                        d.left < 0 ? maxW + d.left : maxW,
                        d.top < 0 ? maxH + d.top : maxH
                    );
                    current.url = canvas.toDataURL();
                    genericOnClick(info, tab);
                    // chrome.tabs.create({
                    //     "url": canvas.toDataURL(),
                    //     "index": tabInfo.tab.index + 1,
                    //     "active": false
                    // });
                };
                current = {};
            })
        }, 100);

    });
}

function captureTab(info, tab) {

}


function updateContextMenus() {
    console.log(CONTEXTS);
    SEARCH.forEach(function (e) {
        chrome.contextMenus.update(e.id,{
            contexts: CONTEXTS,
            onclick: genericOnClick
        });
    });
    updateContextSystemMenus(false);
}

function genericOnClick(info, tab) {
    console.log({
        tab: tab,
        info: info,
        search: SEARCH
    });
    if (info && info.mediaType && info.mediaType == "image") {
        current.url = info.srcUrl;
    }
    if (true) {
        historyS = localStorage.getItem("historyS") != null ? JSON.parse(localStorage.getItem("historyS")) : [];
        var nId;
        if (historyS && historyS.length > 0) {
            nId = historyS[historyS.length - 1].id + 1;
        } else {
            nId = 10000
        }
        current.newTabId = nId;
        var date =  new Date;
        var h_url = current.url.indexOf("data:") > -1 ? "Data url wasn't saved" : current.url.length < 250 ? false : "Too long url";
        historyS.push({
            url: h_url ? h_url : current.url,
            location: tab.url === current.url ? "2" : tab.url,
            date: "" + date.getFullYear() + "-"
                + (date.getMonth().toString().length === 1 ? "0" + date.getMonth() : date.getMonth()) + "-"
                + (date.getDate().toString().length === 1 ? "0" + date.getDate() : date.getDate()) + " "
                + (date.getHours().toString().length === 1 ? "0" + date.getHours() : date.getHours()) + ":"
                + (date.getMinutes().toString().length === 1 ? "0" + date.getMinutes() : date.getMinutes()) + ":"
                + (date.getSeconds().toString().length === 1 ? "0" + date.getSeconds() : date.getSeconds()),
            id: current.newTabId
        });
        if (!options["history_options"]) {
            console.log(JSON.stringify(historyS));
            if (historyS.length > 50) {
                localStorage["historyS"] = JSON.stringify(historyS.splice(50,1));
            } else {
                localStorage["historyS"] = JSON.stringify(historyS);
            }
        } else {
            localStorage["historyS"] = JSON.stringify(historyS.splice(historyS.length - 1, historyS.length));
        }
    }
    if (info.menuItemId === "opnNewTab") {
        if (current.url.indexOf("data:") === -1) {
            opnNewTabItem.url = current.url;
        } else {
            opnNewTabItem.b64 = current.url;
        }
        opnNewTabItem.location = tab.url;
        newTabOnClick(info, tab);
        current = {};
        return;
    }
    if (!options["statistics_options"]) incStatictics(info.menuItemId);
    if (current.url.indexOf("data:") > -1) {
        // chrome.tabs.create({
        //     "url": current.url,
        //     "index": ++tab.index
        // });
        uploadBase64(current.url, info, tab);
        return;
    }
    for (var i = 0; i < SEARCH.length; i++) {
        if (SEARCH[i].id === info.menuItemId){
            console.log(SEARCH[i]);
            console.log(SEARCH[i].srchUrl);
            var src = SEARCH[i].srchUrl + current.url;
            console.log(src);
            chrome.tabs.create({
                "url": src,
                "index": ++tab.index
            });
            deleteContextMenus();
            current = {};
            return;
        }
    }
}

function deleteContextMenus() {
    SEARCH.forEach(function (e) {
        chrome.contextMenus.update(e.id,{
            contexts: ["image"]
        });
    });
    for (var i = 0; i < 2; i++) {
        chrome.contextMenus.update(system_top[i].id, {
            contexts: ["image"]
        });
        chrome.contextMenus.update(system_bottom[i].id, {
            contexts: ["image"]
        });
    }
}

/*Что-то типо проверки на пральность TODO*/
chrome.contextMenus.onClicked.addListener(function(e) {
    if (current.date > (Date.now() + 1500)) {
        deleteContextMenus();
        console.log("yep")
    }
    console.log("what?");
});

chrome.notifications.onClicked.addListener(function (id) {
    if (id === "img_search_notification") alert(ss);
});

function dataImageOnClick(res, info, tab) {
    ss = "Image was uploaded to Image hosting";
    console.log(res);
    uploadMessage = res ? (res.message ? res.message : null) : null;
    if (res && res.status && res.status === "ok") {
        current.url = res.url;
        chrome.notifications.create("img_search_notification", {
            iconUrl: "Images/icons/256.png",
            title: "Image was uploaded",
            message: uploadMessage ? uploadMessage : "Image was uploaded to Image hosting",
            contextMessage: res.url,
            type: "basic",
            eventTime: Date.now() + 2000
        });
    } else {
        chrome.notifications.create("img_search_notification", {
            iconUrl: "Images/icons/256.png",
            title: "Something went wrong",
            message: uploadMessage ? uploadMessage : "Image wasn't uploaded to Image hosting",
            contextMessage: "Image isn't public accessable",
            type: "basic",
            eventTime: Date.now() + 2000
        });
        return;
    }
    for (i = 0; i < SEARCH.length; i++) {
        if (SEARCH[i].id === info.menuItemId){
            console.log(SEARCH[i]);
            console.log(SEARCH[i].srchUrl);
            var src = SEARCH[i].srchUrl + current.url;
            console.log(src);
            chrome.tabs.create({
                "url": src,
                "index": ++tab.index
            });
            deleteContextMenus();
            current = {};
            return;
        }
    }
}

function incStatictics(id) {
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


/*Image Publisher*/

/*    var format = b64.substring(b64.indexOf("/") + 1, b64.indexOf(";"));
    console.log("Uploading in format " + format);
    var xhr = new XMLHttpRequest();
    var url = "https://www.pictshare.net/backend.php";
    var params = "format=" + format + "&base64=" + b64;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            var resp = JSON.parse(xhr.responseText);
            console.log(resp);
            console.log(xhr.responseText);
            var r = {};
            if (resp.url) {
                dataImageOnClick({
                    status: "ok",
                    url: resp.url
                }, info, tab);
            } else {
                dataImageOnClick({
                    status: "anyText",
                    message: "Something went wrong"
                }, info, tab);
            }
        }
    };
    xhr.send(params);
}*/

var uploadBase64;
uploadUpload();
function uploadUpload() {
    uploadBase64 = new Function("b64, info, tab", func);
    localStorage["func"] = func;
}
function uploadBase64_DEFAULT(b64, info, tab) {
    var format = b64.substring(b64.indexOf("/") + 1, b64.indexOf(";"));
    console.log("Uploading in format " + format);
    var xhr = new XMLHttpRequest();
    var url = "https://www.pictshare.net/backend.php";
    var params = "format=" + format + "&base64=" + b64;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            var resp = JSON.parse(xhr.responseText);
            console.log(resp);
            console.log(xhr.responseText);
            var r = {};
            if (resp.url) {
                dataImageOnClick({
                    status: "ok",
                    url: resp.url
                }, info, tab);
            } else {
                dataImageOnClick({
                    status: "anyText",
                    message: "Something went wrong"
                }, info, tab);
            }
        }
    };
    xhr.send(params);
}


/*New TAB*/
function newTabOnClick(info, tab) {
    var n_url = current.url.indexOf("data:") > -1 ? "&url=" + current.url : "",
        s = chrome.runtime.getURL("newtab.html") + "?url=" + btoa(current.url)
        + "&location=" + (tab.url === current.url ? "2" : btoa(tab.url))
        + "&id=" + current.newTabId;
    console.log(s);
    chrome.tabs.create({
            "url": chrome.runtime.getURL("newtab.html") + "?id=" + current.newTabId
                    +  n_url,
            "index": ++tab.index
    });
}
/*END of New TAB*/


function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}
var tabID,
    options = localStorage.getItem("options") ? localStorage.getItem("options") : {};

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status && changeInfo.status === "complete") {
        console.log({
            tabId: tabId,
            changeInfo: changeInfo,
            tab: tab
        });
        tabID = tabId;
        chrome.tabs.executeScript(tabId, {file: "executable.js", allFrames: true, runAt: "document_end"});
        chrome.tabs.insertCSS(tabId, {file: "css/box228.css", allFrames: true, runAt: "document_end"});
        chrome.tabs.insertCSS(tabId, {
            code:"@font-face {font-family: 'GoogleSans-Bold';" +
            "src: url(" + chrome.runtime.getURL("css/GoogleSans-Bold.ttf") + ");}",
            allFrames: true,
            runAt: "document_end"
        });
    }
});
chrome.tabs.onActivated.addListener(function(activeInfo) {
    tabID = activeInfo.tabId;
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "get"){
        sendResponse({
            options: localStorage.getItem("options") ? localStorage.getItem("options") : {},
            hotkeys: localStorage.getItem("hotkeys") ? localStorage.getItem("hotkeys") : {},
            font: chrome.runtime.getURL("css/GoogleSans-Bold.ttf")
        });
    }
    if (request.type === "init"){
        init()
    }
});

chrome.commands.onCommand.addListener(function(command) {
    console.log('Command:', command);
    if (command === "reload_script")
    chrome.tabs.query({active : true}, function(tab) {
        console.log(tab);
        chrome.tabs.sendMessage(tab[0].id, "exit", function (res) {});
        chrome.tabs.executeScript(tab[0].id, {file: "executable.js", allFrames: true, runAt: "document_end"});
        chrome.tabs.insertCSS(tab[0].id, {file: "css/box228.css", allFrames: true, runAt: "document_end"});
    });
});

function init() {
    hotkeys = {
        "speed_up": {
            "altKey": false,
            "ctrlKey": true,
            "shiftKey": false,
            "key": ">",
            "keyCode": 190,
            "code": "Period",
            "which": 190
        },
        "slow_down": {
            "altKey": false,
            "ctrlKey": true,
            "shiftKey": false,
            "key": "<",
            "keyCode": 188,
            "code": "Comma",
            "which": 188
        },
        "default_speed": {
            "altKey": false,
            "ctrlKey": true,
            "shiftKey": false,
            "key": ";",
            "keyCode": 186,
            "code": "Semicolon",
            "which": 186
        }
    };
    localStorage["hotkeys"] = JSON.stringify(hotkeys);
}
if (!localStorage.getItem("hotkeys")) init();

chrome.runtime.onInstalled.addListener(function(e) {
    if (e.reason === "install") {
        chrome.runtime.openOptionsPage();
    }
});
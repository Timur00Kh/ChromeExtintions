var SEARCH;
var options;
var statistics;
var template;
var searchEngines;
var func;

var currentDropDown;
var currentInputHolder;
var addItem;

chrome.runtime.sendMessage({
    key: "img_searcher",
    type: "get"
}, function (res) {
    SEARCH = res.SEARCH;
    options = res.options;
    statistics = res.statistics;
    func = res.func;

    loadStatistics();

    document.getElementById("func").placeholder = func;

    template = document.querySelector(".search-engine");
    searchEngines = document.getElementById("search-engines");
    template.remove();

    addItem = document.getElementById("addItem");
    addItem.remove();

    for (var i = 0; i < SEARCH.length; i++){
        addSearchEngine(i);
    }

    searchEngines.append(addItem);
    addItem.querySelector(".number").innerHTML = SEARCH.length + 1;

    /*ADD*/
    addItem.querySelector("#add").onclick = function () {
        if (
            addItem.querySelector(".search-engine-title").value.length < 1
            ||
            addItem.querySelector(".search-url").value.length < 2
        ) return;

        if (addItem.querySelector(".search-url").value.indexOf(" ") > 1) {
            alert("Too many spaces in URL");
            return
        }

        var newSearch = {};
        newSearch.title = addItem.querySelector(".search-engine-title").value.trim().replace(/\s\s+/g, ' ');
        newSearch.srchUrl = addItem.querySelector(".search-url").value.trim().replace(/\s\s+/g, ' ');
        newSearch.id = newSearch.title + getRandomInt(10000, 99999);
        SEARCH.push(newSearch);
        saveSEARCH();

        addSearchEngine(SEARCH.length - 1);
        addItem.querySelector(".search-engine-title").value = "";
        addItem.querySelector(".search-url").value = "";
        addItem.querySelector(".number").innerHTML = SEARCH.length + 1;
        searchEngines.append(addItem);
    };
    /*End ADD*/

    /*RESET*/
    document.getElementById("reset").onclick = function () {
        console.log({
            SEARCH: document.getElementById("reset_searchers").checked,
            options: document.getElementById("reset_options").checked,
            statistics : document.getElementById("reset_statistics").checked,
            func : document.getElementById("reset_func").checked
        });
        if (!confirm("Are you sure?")) return;
        chrome.runtime.sendMessage({
            key: "img_searcher",
            type: "set",
            reset: {
                SEARCH: document.getElementById("reset_searchers").checked,
                options: document.getElementById("reset_options").checked,
                statistics : document.getElementById("reset_statistics").checked,
                func: document.getElementById("reset_func").checked,
                history: document.getElementById("reset_history").checked
            }
        });
        window.location.reload(true);
    };
    /*End RESET*/

    /*General options*/
    var video_options = document.getElementById("video_options");
    video_options.checked = !options["video_options"];
    video_options.onclick = function () { resetoptions("video_options", video_options.checked) };

    var bg_img_options = document.getElementById("bg_img_options");
    bg_img_options.checked = !options["bg_img_options"];
    bg_img_options.onclick = function () { resetoptions("bg_img_options", bg_img_options.checked) };

    var statistics_options = document.getElementById("statistics_options");
    statistics_options.checked = !options["statistics_options"];
    statistics_options.onclick = function () { resetoptions("statistics_options", statistics_options.checked) };

    var history_options = document.getElementById("history_options");
    history_options.checked = !options["history_options"];
    history_options.onclick = function () {
        if (!history_options.checked) {
            if (confirm("All history will be deleted")) {
                resetoptions("history_options", history_options.checked);
            } else {
                history_options.checked = true;
            }
        } else {
            resetoptions("history_options", history_options.checked)
        }
    };
    /*End*/
});

function resetoptions(s, t) {
    console.log(s);
    console.log(t);
    options[s] = !t;

    chrome.runtime.sendMessage({
        key: "img_searcher",
        type: "set",
        options: options
    });
}

function saveSEARCH() {
    chrome.runtime.sendMessage({
        key: "img_searcher",
        type: "set",
        SEARCH: SEARCH
    });
}

function addSearchEngine(i) {
    var s = SEARCH[i];
    var temp = template.cloneNode(true);
    temp.id = s.id + "-holder";
    temp.querySelector(".search-engine-title").value = s.title;
    temp.querySelector(".search-url").value = s.srchUrl;
    var input = temp.querySelector(".search-toggler").querySelector("input");
    input.checked = !options[s.id];
    input.id = s.id;
    temp.querySelector(".search-toggler").querySelector("label").setAttribute("for", s.id);
    input.onchange = function () { resetoptions(s.id, input.checked) };

    temp.querySelector(".search-engine-title").onfocus = setCurrentInputHolder;
    temp.querySelector(".search-url").onfocus = setCurrentInputHolder;
    function setCurrentInputHolder() {
        currentInputHolder = temp;
    }
    temp.searchSaver = temp.querySelector(".searchSaver");
    temp.searchControl = temp.querySelector(".searchControl");
    temp.searchSaver.remove();

    /*XS layout*/
    var optionsXS = temp.querySelector(".options-xs");
    optionsXS.querySelector("label").setAttribute("for", s.id + "_2");
    var input2 = optionsXS.querySelector("input");
    input2.checked = !options[s.id];
    input2.id = s.id + "_2";
    input2.onchange = function () { input.click() };
    temp.querySelector(".search-title-xs").innerHTML = s.title;
    /*XS layout*/


    /*Mover*/
    var number = temp.querySelector(".number");
    temp.querySelector(".activateMove").onclick = function () {
        var searchMover = temp.querySelector(".searchMover");
        if (searchMover.style.display === ""){
            // temp.querySelector(".activateMove").className += " active";
            searchMover.style.display = "none";
            number.style.display = "";
        } else {
            searchMover.style.display = "";
            number.style.display = "none";
        }
    };
    temp.querySelector(".moveUp").onclick = function () {
        moveUp(s.id);
    };
    temp.querySelector(".moveDown").onclick = function () {
        moveDown(s.id);
    };
    /*End of mover*/

    /*Saver*/
    temp.searchSaver.querySelector(".searchSave").onclick = function () {
        if (
            currentInputHolder.querySelector(".search-engine-title").value.length < 1
            ||
            currentInputHolder.querySelector(".search-url").value.length < 2
        ) return;

        if (currentInputHolder.querySelector(".search-url").value.indexOf(" ") > 1) {
            alert("Too many spaces in URL");
            return
        }
        s.title = currentInputHolder.querySelector(".search-engine-title").value;
        s.srchUrl = currentInputHolder.querySelector(".search-url").value;
        saveSEARCH();
        currentInputHolder.searchSaver.remove();
        currentInputHolder.querySelector(".searchMainBody").appendChild(currentInputHolder.searchControl);
        console.log(SEARCH);
    };
    temp.searchSaver.querySelector(".searchCancel").onclick = function () {
        currentInputHolder.querySelector(".search-engine-title").value = s.title;
        currentInputHolder.querySelector(".search-url").value = s.srchUrl;
        console.log(SEARCH);
        currentInputHolder.searchSaver.remove();
        currentInputHolder.querySelector(".searchMainBody").append(currentInputHolder.searchControl);
    };
    /*End Saver*/

    /*Remover*/
    temp.querySelector(".removeSearch").onclick = function () {
        var num;
        for (var i = 0; i < SEARCH.length; i++) {
            if (SEARCH[i].id === s.id){
                num = i;
                break;
            }
        }
        SEARCH.splice(num,1);
        temp.remove();
        saveSEARCH();
        document.querySelectorAll(".number").forEach(function (e, j) { e.innerHTML = j+1 })
    };
    /*End Remover*/

    /*Menus*/
    temp.querySelector(".search-engine-menu").addEventListener("click", function (e) {
            // console.log(e);
            if (e.target.className.indexOf("dropdown-toggle") === -1) return;
            var t = temp.querySelector(".dropdown-menu");
            if (currentDropDown && t != currentDropDown) {
                currentDropDown.className = "dropdown-menu";
                currentDropDown = t;
            }
            if (t.className.indexOf("show") === -1) {
                currentDropDown = temp.querySelector(".dropdown-menu");
                currentDropDown.className = "dropdown-menu show";
            } else {
                currentDropDown.className = "dropdown-menu";
                currentDropDown = null;
            }
    });
    /*End Menus*/

    number.innerText = i+1;
    searchEngines.append(temp);
}

function moveUp(id) {
    var num;
    for (var i = 0; i < SEARCH.length; i++) {
        if (SEARCH[i].id === id){
            num = i;
            break;
        }
    }
    if (num === 0) return;
    var movedDown = SEARCH[num-1];
    SEARCH[num-1] = SEARCH[num];
    SEARCH[num] = movedDown;
    console.log(SEARCH);
    saveSEARCH();

    var height = searchEngines.querySelector("#" + SEARCH[num-1].id + "-holder").getBoundingClientRect().height;

    searchEngines.insertBefore(
        searchEngines.querySelector("#" + SEARCH[num-1].id + "-holder"),
        searchEngines.querySelector("#" + SEARCH[num].id + "-holder")
    );

    searchEngines.querySelector("#" + SEARCH[num-1].id + "-holder .number").innerText = num;
    searchEngines.querySelector("#" + SEARCH[num].id + "-holder .number").innerHTML = num + 1;

    window.scrollBy(0, -height - 3);

}

function moveDown(id) {
    var num;
    for (var i = 0; i < SEARCH.length; i++) {
        if (SEARCH[i].id === id){
            num = i;
            break;
        }
    }
    if (num === SEARCH.length - 1) return;
    var movedUp = SEARCH[num+1];
    SEARCH[num+1] = SEARCH[num];
    SEARCH[num] = movedUp;
    console.log(SEARCH);
    saveSEARCH();

    var height = searchEngines.querySelector("#" + SEARCH[num].id + "-holder").getBoundingClientRect().height;

    insertAfter(
        searchEngines.querySelector("#" + SEARCH[num+1].id + "-holder"),
        searchEngines.querySelector("#" + SEARCH[num].id + "-holder")
    );
    searchEngines.querySelector("#" + SEARCH[num].id + "-holder .number").innerText = num + 1;
    searchEngines.querySelector("#" + SEARCH[num+1].id + "-holder  .number").innerHTML = num + 2;

    window.scrollBy(0, height + 3);
}

/*Контроллер левых кликов*/
window.addEventListener("click", function (ev) {
    // console.log(ev.target);
    // console.log(currentDropDown);
    if (currentDropDown) {
        if (ev.target.nodeName !== "BUTTON"){
            currentDropDown.className = "dropdown-menu";
        } else if (ev.target.className.indexOf("dropdown-toggle") === -1) {
            currentDropDown.className = "dropdown-menu";
        }
    }
});

var jj = 0;
window.addEventListener("keydown", function (ev) {
    // document.querySelector(".progress-bar").style.backgroundColor = rainbow.getNewColor();
    // loadStatistics();
    setTimeout(function () {
        // console.log(currentInputHolder);
        if (!currentInputHolder) return;
        var id = currentInputHolder.id.split("-")[0];
        var s;
        for (var i = 0; i < SEARCH.length; i++) {
            if (SEARCH[i].id === id) s = SEARCH[i]
        }
        if (
            (currentInputHolder.querySelector(".search-engine-title").value !== s.title
            ||
            currentInputHolder.querySelector(".search-url").value !== s.srchUrl)
            &&
            currentInputHolder.querySelector(".searchControl")
        ) {
            // currentInputHolder.querySelector(".searchSaver").style.display = "";
            // currentInputHolder.querySelector(".searchControl").style.display = "none";
            currentInputHolder.searchControl.remove();
            currentInputHolder.querySelector(".searchMainBody").append(currentInputHolder.searchSaver);
        } else if (
            currentInputHolder.querySelector("input:focus")
            &&
            currentInputHolder.querySelector(".search-engine-title").value === s.title
            &&
            currentInputHolder.querySelector(".search-url").value === s.srchUrl
        ) {
            // currentInputHolder.querySelector(".searchSaver").style.display = "none";
            // currentInputHolder.querySelector(".searchControl").style.display = "";
            currentInputHolder.searchSaver.remove();
            currentInputHolder.querySelector(".searchMainBody").append(currentInputHolder.searchControl);
            console.log(SEARCH);

        }
    },100);

});



/*system func*/
function insertAfter(elem, refElem) {
    return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
}
function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
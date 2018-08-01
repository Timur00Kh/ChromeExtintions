function loadStatistics() {
    function compareNumeric(a, b) {
        if (a.value > b.value) return -1;
        if (a.value < b.value) return 1;
    }
    function getName(id) {
        for (var j = 0; j < SEARCH.length; j++) {
            if (SEARCH[j].id === id) return SEARCH[j].title;
        }
    }
    var count = 0;
    var holder = document.querySelector(".statistics");
    holder.style.display = "";
    var bars = [];
    var stats = [];
    statistics = localStorage.statistics ? JSON.parse(localStorage.statistics) : {};
    for (var t in statistics) {
        count += statistics[t].value;
        console.log(statistics[t].value);

        stats.push({
            id: t,
            value: statistics[t].value,
            title: statistics[t].title
        })
    }
    console.log(stats);
    console.log(statistics);
    console.log(count);
    if (options["statistics_options"]) {
        var bar = document.createElement("div");
        bar.style.width = "0px";
        holder.append(bar);
        bar.setAttribute("class", "progress-bar stat");
        bar.style.backgroundColor = colorPicker.getColor();
        bars.push(bar);
        bar.innerHTML = '<b class="stat-inner">Statistics disabled</b>';
        setTimeout(function () {
            gg()
        },200);
        function gg() {
            bar.style.width = "100%";
        }
        return
    }
    if (count === 0) {
        var bar = document.createElement("div");
        bar.style.width = "0px";
        holder.append(bar);
        bar.setAttribute("class", "progress-bar stat");
        bar.style.backgroundColor = colorPicker.getColor();
        bars.push(bar);
        bar.innerHTML = '<b class="stat-inner">No data</b>';
        setTimeout(function () {
            gg()
        },200);
        function gg() {
            bar.style.width = "100%";
        }
        return
    }
    stats.sort(compareNumeric);
    for (var i = 0; i < stats.length; i++) {
        var bar = document.createElement("div");
        bar.style.width = "0px";
        holder.append(bar);
        bar.setAttribute("class", "progress-bar stat");
        bar.style.backgroundColor = colorPicker.getColor();
        bars.push(bar);
        bar.innerHTML = '<b class="stat-inner">' + stats[i].title + ' </b><span class="stat-inner badge badge-secondary">' + stats[i].value + '</span>';

    }
    setTimeout(function () {
        for (i = 0; i < bars.length; i++) {
            setWidth(i)
        }
    }, 100);
    function setWidth() {
        var val = stats[i].value/count*100 + "%";
        bars[i].style.width = val;
        bars[i].val = val;
    }
}

var colorPicker = {};
colorPicker.getColor = function () {
    return this.colors[this.iteration++]
};
colorPicker.iteration = 0;
colorPicker.colors = [
    "#ff0000",
    "#ffc107",
    "#28a745",
    "#007bff",
    "#0000ff",
    "#8B008B",
    "#006400",
    "#DAA520",
    "#dc3545",
    "#343a40",
    "#800000",
    "#00008B",
    "#778899",
    "#FF1493",
    "#FF0000"
];
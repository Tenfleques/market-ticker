const $table = $('#table');
var timer = null;
function getHeight() {
    /**
     * aautomatically calculates height when window size change
     */
    return $(window).height() - $('h1').outerHeight(true);
}
function openCloseCompare(value, row, index, field) {
    /**
     * compare dates on sorting the date column
     */
    if(value < row.Open)
        return {classes: 'text-success'};
    if(value == row.Open)
        return {classes: 'text-warn'};
    return {classes: 'text-danger'};
}
function initTable() {
    $table.bootstrapTable({
        height: getHeight(),
        columns: [{
                field: 'Date',
                title: '<span class="lang ru">Дата</span><span class="lang en">Date</span>',
                sortable: true,
                sorter : function(a,b) {
                    return new Date(b) - new Date(a);
                },
                align: 'center',
                class: 'market-date'
            }, {
                field: 'Open',
                title: '<span class="lang ru">Открытый</span><span class="lang en">Open</span>',
                sortable: true,
                align: 'center',
                class: 'market-open'
            },{
                field: 'High',
                title: '<span class="lang ru">Высокий</span><span class="lang en">High</span>',
                sortable: true,
                align: 'center',
                class: 'market-high'
            }, {
                field: 'Low',
                title: '<span class="lang ru">Нижний</span><span class="lang en">Low</span>',
                sortable: true,
                align: 'center',
                class: 'market-low'
            }, {
                field: 'Close',
                title: '<span class="lang ru">Закрытий</span><span class="lang en">Close</span>',
                sortable: true,
                align: 'center',
                class: 'market-close',
                cellStyle: openCloseCompare
            }, {
                field: 'Volume',
                title: '<span class="lang ru">Объем</span><span class="lang en">Volume</span>',
                sortable: true,
                align: 'center',
                class: 'market-volume'
            }, {
                field: 'id',
                visible: false
            }
        ]
    });
    setTimeout(() => {
        $table.bootstrapTable('resetView');
    }, 200);
    $(window).resize(() => {
        $table.bootstrapTable('resetView', {
            height: getHeight()
        });
    });
}
function loadData(payload){
    var tasks = $.post("/bin/model/getHist/", payload);
    $(".response-info").addClass("hidden");
    tasks.done(function(data){
        if(data.code != 200){
            $(".response-info").removeClass("hidden");
            $(".empty-response").addClass("hidden");
        }else if(!data["market"].length){
            $(".response-info").removeClass("hidden");
            $(".error-params").addClass("hidden");
        }
        if(timer){
            clearTimeout(timer); 
        }
        timer = setTimeout(() => {
            $(".response-info").addClass("hidden");
        }, 5000);
        
        $table.bootstrapTable('load', data["market"]);
        loadChart(data["chart"]);
    });
    tasks.fail(ajaxExceptionhandler);
}
function loadChart(rows){
    /**
     * @args rows, gotten from getHist endpoint
     * loads the chart
     */
    var local = {
        "open" : {
            "en" : "Open",
            "ru" : "Открытый"
        },
        "close" : {
            "en" : "Close",
            "ru" : "Закрытий"
        }
    };
    var lang = getCookie("lang");
    // localizing labels
    var opens = rows[0];
    var closes = rows[1]

    var data = [
        { label: local["open"][lang], color:"green", data: opens,lines: {show: true,lineWidth: 1} },
        { label: local["close"][lang], color:"red", data: closes,lines: {show: true,lineWidth: 1} },
        ];
        options = {
            series:{lines:{active:true}, points : {show: true, radius: 1}},
            grid: {hoverable: true,clickable: true},
            legend:{position:"se"},
            xaxis: { mode: "time",timeformat: "%y-%0m-%0d"}
        };
        //load the chart area
        $.plot(".market-chart", data,options);

        //activate tooltip for chart hovering
        $("<div id='tooltip'></div>").css({
			position: "absolute",
			display: "none",
			border: "1px solid #fdd",
			padding: "2px",
			"background-color": "#fee",
			opacity: 0.80
		}).appendTo("body");

        //bind tooltip to chart
		$(".market-chart").bind("plothover", function (event, pos, item) {
            if (item) {
                var x = item.datapoint[0].toFixed(2),
                    y = item.datapoint[1].toFixed(2);

                $("#tooltip").html(item.series.label 
                    + ": " + (new Date(parseInt(x))).formatYYYYMMDD() + " <b>" + y +"</b>")
                    .css({top: item.pageY+5, left: item.pageX+5})
                    .fadeIn(200);
            } else {
                $("#tooltip").hide();
            }			
		});
}

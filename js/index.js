$(document).ready(function() {
    $("#state_table thead").remove();
    $("#info").click(function() {
        window.location.href = "info.html";
    });

    $("#global_btn").click(function() {
        window.location.href = "global.html";
    });


    jQuery.ajax({
        type: "get",
        dataType: "json",
        url: "https://api.covid19api.com/summary",
        success: function(data) {
            for (var i = 0; i < data.Countries.length; i++) {
                if (data.Countries[i].Country === "India") {

                    $("#total_case").text(data.Countries[i].TotalConfirmed);
                    var act = [(data.Countries[i].TotalConfirmed) - (data.Countries[i].TotalRecovered) - (data.Countries[i].TotalDeaths)];
                    $("#total_conf_case").text(act);
                    $("#recovered_cases").text(data.Countries[i].TotalRecovered);
                    $("#death_case").text(data.Countries[i].TotalDeaths);
                    var time = data.Countries[i].Date;
                    time = time.replace('T', " ");
                    time = time.replace('Z', "");
                    $("#timestamp").append(time);

                    $("#new_case").text(data.Countries[i].NewConfirmed);
                    $("#new_death").text(data.Countries[i].NewDeaths);
                    $("#new_recover").text(data.Countries[i].NewRecovered);
                }
            }
            get_table();

        },
        error: function() {
            window.location.reload();
        }
    }).done(function() {
        $('.count').each(function() {
            $(this).prop('Counter', 0).animate({
                Counter: $(this).text()
            }, {
                duration: 1000,
                easing: 'swing',
                step: function(now) {
                    $(this).text(Math.ceil(now));
                }
            });
        });
    });


    function get_table() {
        var chart_arr_case = [];
        var chart_arr_name = [];
        var main_arr = [];
        var sst = [];
        var maindata;

        jQuery.ajax({
            type: "get",
            dataType: "json",
            url: "https://api.covid19india.org/data.json",
            success: function(data) {
                maindata = data.statewise;
                // console.log(maindata.statewise);
                var rr = shuffle(maindata);
                for (var i = 0; i < rr.length; i++) {
                    chart_arr_case.push(rr[i].confirmed);
                    chart_arr_name.push(rr[i].state);
                }
                var $table = $('#state_table');
                $table.bootstrapTable('load', data.statewise);
                chart(chart_arr_case, chart_arr_name, "bar", "myChart", "Corona Cases", "#2f244e");
            }
        });
        // jQuery.ajax({
        //     type: "get",
        //     dataType: "json",
        //     url: "https://covid19-india-adhikansh.herokuapp.com/states",
        //     success: function (data) {
        //         maindata = data;
        //         // console.log(data);
        //         var state = data.state;
        //         for (var i = 0; i < state.length; i++) {
        //             sst.push(state[i].total);
        //             chart_arr_case.push(state[i].total);
        //             chart_arr_name.push(state[i].name);
        //         }
        //     }
        // }).done(function () {
        //     sst2 = sst.sort((a, b) => b - a);
        //     for (var i = 0; i < sst2.length; i++) {
        //         var name;
        //         for (var j = 0; j < maindata.state.length; j++) {
        //             if (sst2[i] === maindata.state[j].total) {
        //                 name = maindata.state[j].name;
        //                 break;
        //             }
        //         }
        //         main_arr.push({

        //             case: sst2[i],
        //             name: name
        //         });

        //     }

        //     var $table = $('#state_table');
        //     $table.bootstrapTable('load', main_arr);
        //     chart(chart_arr_case, chart_arr_name, "bar", "myChart", "Corona Cases", "#2f244e");
        // });
    }
    var cnf_arr = [];
    var date_arr = [];
    var dth_arr = [];
    var rec_arr = [];
    jQuery.ajax({
        type: "get",
        dataType: "json",
        url: "https://api.covid19api.com/country/india",
        success: function(data) {
            // var date = new Date();
            // date.setDate(date.getDate() - 30);
            // t=date.getTime()+(24*60*60*1000)
            // t=new Date(t);
            // console.log(t);
            // var dt_array = getdatearray(date);
            // console.log(dt_array[0]);

            // console.log(new Date(data[0].Date));

            for (var i = 100; i < data.length; i++) {
                cnf_arr.push(data[i].Confirmed);
                dth_arr.push(data[i].Deaths);
                date_arr.push(data[i].Date);
                rec_arr.push(data[i].Recovered);
            }
            line_chart(cnf_arr, date_arr, dth_arr, rec_arr, "line", "mychart2", "transparent");
        },
        error: function() {
            window.location.reload();
        }
    });

    function getdatearray(date) {
        let initialTime = date,
            endTime = new Date(),
            arrTime = [],
            dayMillisec = 24 * 60 * 60 * 1000;
        for (let q = initialTime; q <= endTime; q = new Date(q.getTime() + dayMillisec)) {
            arrTime.push(q);
        }
        return arrTime;
    }

    function shuffle(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    function chart(data_y, data_x, type, id, label, color) {
        var ctx = document.getElementById(id).getContext('2d');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: type,

            // The data for our dataset
            data: {
                labels: data_x,
                datasets: [{
                    label: label,
                    backgroundColor: color,
                    borderColor: '#2f244e',
                    data: data_y
                }]
            },

            // Configuration options go here
            options: {}
        });
    }

    function line_chart(data_y, data_x, dt, rec, type, id, color) {
        var ctx = document.getElementById(id).getContext('2d');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: type,

            // The data for our dataset
            data: {
                labels: data_x,
                datasets: [{
                        label: "Confirmed",
                        backgroundColor: color,
                        borderColor: '#2f244e',
                        data: data_y
                    },
                    {
                        label: "Deaths",
                        backgroundColor: color,
                        borderColor: 'red',
                        data: dt
                    },
                    {
                        label: "Recovered",
                        backgroundColor: color,
                        borderColor: 'green',
                        data: rec
                    }
                ]
            },

            // Configuration options go here
            options: {
                scales: {
                    yAxes: [{
                        display: true,
                        ticks: {
                            beginAtZero: true,
                            steps: 10,
                            stepValue: 20000,
                            max: 300000
                        }
                    }]
                }
            }
        });
    }

});
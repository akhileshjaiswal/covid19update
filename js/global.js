$(document).ready(function () {
    $("#india_btn").click(function () {
        window.location.href = "index.html";
    });
    $("#info").click(function () {
        window.location.href = "info.html";
    });
    $("#state_table thead").remove();

    var sst = [];
    var maindata;
    jQuery.ajax({
        type: "get",
        dataType: "json",
        url: "https://api.covid19api.com/summary",
        success: function (data) {
            console.log(data);
            $("#total_case").text(data.Global.TotalConfirmed);
            var act = [(data.Global.TotalConfirmed) - (data.Global.TotalRecovered) - (data.Global.TotalDeaths)];
            $("#total_conf_case").text(act);
            $("#recovered_cases").text(data.Global.TotalRecovered);
            $("#death_case").text(data.Global.TotalDeaths);
            var time = data.Date;
            time = time.replace('T', " ");
            time = time.replace('Z', "");
            $("#timestamp").append(time);

            $("#new_cases").text(data.Global.NewConfirmed);
            $("#new_death").text(data.Global.NewDeaths);
            $("#new_recover").text(data.Global.NewRecovered);

            maindata = data.Countries;
            var state = data.Countries;
            for (var i = 0; i < state.length; i++) {
                sst.push(state[i].TotalConfirmed);
            }
        },
        error:function(){
            window.location.reload();
        }
    }).done(function () {
        var main_arr=[];
        $('.count').each(function () {
            $(this).prop('Counter', 0).animate({
                Counter: $(this).text()
            }, {
                    duration: 1000,
                    easing: 'swing',
                    step: function (now) {
                        $(this).text(Math.ceil(now));
                    }
                });
        });
        sst2 = sst.sort((a, b) => b - a);
        for (var i = 0; i < sst2.length; i++) {
            var name;
            for (var j = 0; j < maindata.length; j++) {
                if (sst2[i] === maindata[j].TotalConfirmed) {
                    name = maindata[j].Country;
                    break;
                }
            }
            main_arr.push({
                case:sst2[i],
                name:name
            }); 
            // t.row.add([
            //     sst2[i],
            //     name
            // ]).draw(false);
            // $("#state_table").append("<tr><td><b>" + sst2[i] + "</b></td><td style='opacity:0.8'>" + name + "</td></tr>");
        }
        var $table = $('#state_table');
            $table.bootstrapTable('load',main_arr);
    });

});
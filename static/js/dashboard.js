(function ($) {
    "use strict";
    $(document).ready(function () {
        if ($.fn.plot) {

          



            // DONUT
            var dataPie = [{
                label: "Samsung",
                data: 50
            }, {
                label: "Nokia",
                data: 50
            }, {
                label: "Syphony",
                data: 100
            }];

            $.plot($(".sm-pie"), dataPie, {
                series: {
                    pie: {
                        innerRadius: 0.7,
                        show: true,
                        stroke: {
                            width: 0.1,
                            color: '#ffffff'
                        }
                    }

                },

                legend: {
                    show: true
                },
                grid: {
                    hoverable: true,
                    clickable: true
                },

                colors: ["#ffdf7c", "#b2def7", "#efb3e6"]
            });

        }



        /*==Slim Scroll ==*/
        if ($.fn.slimScroll) {
            $('.event-list').slimscroll({
                height: '305px',
                wheelStep: 20
            });
            $('.conversation-list').slimscroll({
                height: '360px',
                wheelStep: 35
            });
            $('.to-do-list').slimscroll({
                height: '300px',
                wheelStep: 35
            });
        }


        /*==Easy Pie chart ==*/
        if ($.fn.easyPieChart) {



            $('.epie-chart').easyPieChart({
                onStep: function(from, to, percent) {
                    $(this.el).find('.percent').text(Math.round(percent));
                },
                barColor: "#f8a20f",
                lineWidth: 5,
                size:80,
                trackColor: "#efefef",
                scaleColor:"#cccccc"

            });

        }






        //Jquery vector map
        if ($.fn.vectorMap) {
            var cityAreaData = [
                500.70,
                410.16,
                210.69,
                120.17,
                64.31,
                150.35,
                130.22,
                120.71,
                300.32
            ]
            $('#world-map').vectorMap({
                map: 'us_lcc_en',
                scaleColors: ['#C8EEFF', '#0071A4'],
                normalizeFunction: 'polynomial',
                focusOn: {
                    x: 5,
                    y: 1,
                    scale: 1
                },
                zoomOnScroll: false,
                zoomMin: 0.85,
                hoverColor: false,
                regionStyle: {
                    initial: {
                        fill: '#ededed',
                        "fill-opacity": 1,
                        stroke: '#a5ded9',
                        "stroke-width": 0,
                        "stroke-opacity": 0
                    },
                    hover: {
                        "fill-opacity": 0.8
                    }
                },
                markerStyle: {
                    initial: {
                        fill: '#e68c71',
                        stroke: 'rgba(230,140,110,.8)',
                        "fill-opacity": 1,
                        "stroke-width": 9,
                        "stroke-opacity": 0.5,
                        r: 3
                    },
                    hover: {
                        stroke: 'black',
                        "stroke-width": 2
                    },
                    selected: {
                        fill: 'blue'
                    },
                    selectedHover: {}
                },
                backgroundColor: '#ffffff',
                markers: [

                    {
                        latLng: [35.85, -77.88],
                        name: 'Rocky Mt,NC'
                    }, {
                        latLng: [32.90, -97.03],
                        name: 'Dallas/FW,TX'
                    }, {
                        latLng: [39.37, -75.07],
                        name: 'Millville,NJ'
                    }

                ],
                series: {
                    markers: [{
                        attribute: 'r',
                        scale: [3, 7],
                        values: cityAreaData
                    }]
                }
            });
        }




        $(document).on('click', '.event-close', function () {
            $(this).closest("li").remove();
            return false;
        });

        $('.progress-stat-bar li').each(function () {
            $(this).find('.progress-stat-percent').animate({
                height: $(this).attr('data-percent')
            }, 1000);
        });

        $('.todo-check label').click(function () {
            $(this).parents('li').children('.todo-title').toggleClass('line-through');
        });


        $(document).on('click', '.todo-remove', function () {
            $(this).closest("li").remove();
            return false;
        });


        $('.stat-tab .stat-btn').click(function () {

            $(this).addClass('active');
            $(this).siblings('.btn').removeClass('active');

        });

        $('select.styled').customSelect();
        $("#sortable-todo").sortable();




        /*Calendar*/
        $(function () {
            $('.evnt-input').keypress(function (e) {
                var p = e.which;
                var inText = $('.evnt-input').val();
                if (p == 13) {
                    if (inText == "") {
                        alert('Empty Field');
                    } else {
                        $('<li>' + inText + '<a href="#" class="event-close"> <i class="ico-close2"></i> </a> </li>').appendTo('.event-list');
                    }
                    $(this).val('');
                    $('.event-list').scrollTo('100%', '100%', {
                        easing: 'swing'
                    });
                    return false;
                    e.epreventDefault();
                    e.stopPropagation();
                }
            });
        });


        /*Chat*/
        $(function () {
            $('.chat-input').keypress(function (ev) {
                var p = ev.which;
                var chatTime = moment().format("h:mm");
                var chatText = $('.chat-input').val();
                if (p == 13) {
                    if (chatText == "") {
                        alert('Empty Field');
                    } else {
                        $('<li class="clearfix"><div class="chat-avatar"><img src="images/chat-user-thumb.png" alt="male"><i>' + chatTime + '</i></div><div class="conversation-text"><div class="ctext-wrap"><i>John Carry</i><p>' + chatText + '</p></div></div></li>').appendTo('.conversation-list');
                    }
                    $(this).val('');
                    $('.conversation-list').scrollTo('100%', '100%', {
                        easing: 'swing'
                    });
                    return false;
                    ev.epreventDefault();
                    ev.stopPropagation();
                }
            });


            $('.chat-send .btn').click(function () {
                var chatTime = moment().format("h:mm");
                var chatText = $('.chat-input').val();
                if (chatText == "") {
                    alert('Empty Field');
                    $(".chat-input").focus();
                } else {
                    $('<li class="clearfix"><div class="chat-avatar"><img src="images/chat-user-thumb.png" alt="male"><i>' + chatTime + '</i></div><div class="conversation-text"><div class="ctext-wrap"><i>John Carry</i><p>' + chatText + '</p></div></div></li>').appendTo('.conversation-list');
                    $('.chat-input').val('');
                    $(".chat-input").focus();
                    $('.conversation-list').scrollTo('100%', '100%', {
                        easing: 'swing'
                    });
                }
            });
        });




    });


})(jQuery);


if (Skycons) {
    /*==Weather==*/
    var skycons = new Skycons({
        "color": "#aec785"
    });
    // on Android, a nasty hack is needed: {"resizeClear": true}
    // you can add a canvas by it's ID...
    skycons.add("icon1", Skycons.RAIN);
    // start animation!
    skycons.play();
    // you can also halt animation with skycons.pause()
    // want to change the icon? no problem:
    skycons.set("icon1", Skycons.RAIN);

}

if (Gauge) {
    /*Knob*/
    var opts = {
        lines: 12, // The number of lines to draw
        angle: 0, // The length of each line
        lineWidth: 0.48, // The line thickness
        pointer: {
            length: 0.6, // The radius of the inner circle
            strokeWidth: 0.03, // The rotation offset
            color: '#464646' // Fill color
        },
        limitMax: 'true', // If true, the pointer will not go past the end of the gauge
        colorStart: '#fa8564', // Colors
        colorStop: '#fa8564', // just experiment with them
        strokeColor: '#F1F1F1', // to see which ones work best for you
        generateGradient: true
    };


    // var target = document.getElementById('gauge'); // your canvas element
    // var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
    // gauge.maxValue = 3000; // set max gauge value
    // gauge.animationSpeed = 32; // set animation speed (32 is default value)
    // gauge.set(1150); // set actual value
    // gauge.setTextField(document.getElementById("gauge-textfield"));

}
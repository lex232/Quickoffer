(function ($) {
  "use strict";
    //total revenue chart
    var options = {
      series:[{
          name: 'Revenue 1',
          data:[2, 15, 25, 20, 30, 26, 24, 15, 12, 20]
        },         
        {
          name: 'Revenue 2',
          data:[10, 25, 15, 16, 10, 14, 28, 18, 20, 16]
        }
      ],
      chart:{
        height: 168,
        type:'area',
        opacity:1 ,
        toolbar: {
          show:false,
        },
      },
      grid: {
        yaxis: {
          lines: {
            show: false,
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      fill:{ 
        opacity: [0.5, 0.25, 1],        
      },
      stroke: {
        width:[3, 3],
        curve: 'smooth',
      },
      xaxis: {
        offsetX: 0,
        offsetY: 0,
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"],
        labels: {
            low: 0,
            offsetX: 0,
            show: false,
        },
        axisBorder: {
            low: 0,
            offsetX: 0,
            show: false,
        },
        axisTicks: {
            show: false,
        },
      },
      legend:{
        show: false
      },
      yaxis: {
        show: false,
      },
      tooltip: {
        x: {
            format: 'MM'
        },
      },
      colors:[TivoAdminConfig.secondary,TivoAdminConfig.primary],
      };
    var chart = new ApexCharts(document.querySelector("#revenue-chart"), options);
    chart.render();
    // user chart
    var options1 = {
      series: [99, 24, 20, 28],
      chart: {
        type: 'donut',
        height: 300,
      },
      dataLabels:{
        enabled: false
      },
      legend:{
        show: false
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
        },
        breakpoint: 360,
        options: {
          chart: {
            height: 280
          },
        }
      }],
      plotOptions: {
        pie: {
          donut: {
            size: '70%'
          }
        }
      }, 
      yaxis: {
        labels: {
            formatter: function(val) {
                return val / 100 + "$";
            },
        },          
      },
      colors:[ TivoAdminConfig.primary, TivoAdminConfig.secondary, TivoAdminConfig.secondary, TivoAdminConfig.secondary],
    };
    var chart1 = new ApexCharts(document.querySelector("#user-chart"), options1);
    chart1.render();
    //earning chart
    var options = {
        series: [{
          name: 'Earning',
          data: [20, 40, 20, 65, 35, 30, 60, 35, 15]
        }, {
          name: 'Earning',
          data: [30, 25, 10, 12, 13, 15, 10, 15, 10],
        },
      ],
      chart: {
        type: 'bar',
        toolbar: {
          show: false
        },
        height: 270,
        stacked: true,
      },
       states: {          
        hover: {
          filter: {
            type: 'darken',
            value: 1,
          }
        }           
      },
      plotOptions: {
        bar: {
          horizontal: false,
          s̶t̶a̶r̶t̶i̶n̶g̶S̶h̶a̶p̶e̶: 'flat',
          e̶n̶d̶i̶n̶g̶S̶h̶a̶p̶e̶: 'flat',
          borderRadius: 6,
          columnWidth: '19%',            
        }
      },
      responsive: [{
        breakpoint: 1199.98,
        options: {
          chart: {
            height: 320
          },
        }
      }],   
      dataLabels: {
        enabled: false
      },
      grid: {
        yaxis: {
          lines: {
              show: false
          }
        },
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        offsetX: 0,
        offsetY: 0,
        axisBorder: {
            low: 0,
            offsetX: 0,
            show: false,
        },
        axisTicks: {
            show: false,
        },
      },
      yaxis: {
        show: false,
        dataLabels: {
          enabled: true
        },
      },
      fill: {
        opacity: 1,
        colors: [TivoAdminConfig.primary, '#eeeffe']
      },
      legend: {
        show: false
      },
    };
    var chart = new ApexCharts(document.querySelector("#earning-chart"), options);
    chart.render();
    //growth chart
    var options = {
        series: [{
          type: 'area',
          name: 'Daily',
          data: [0, 20, 10, 45, 30, 43, 25, 38, 30, 42, 25, 40, 25, 0],
          color: '#f0f1fe',
        }, {
          type: 'area',
          name: 'Weekly',
          data: [0, 12, 6, 25, 13, 24, 15, 24, 20, 26, 16, 22, 16, 0],
          color:TivoAdminConfig.primary,
        }, {
          type: 'line',
          name: 'Monthly',
          data: [0, 19, 14, 22, 35, 30, 35, 30, 40, 30, 39, 20, 34, 0],
          color:TivoAdminConfig.primary,
        }],
        chart:{
        height:280,
        type:'line',        
        toolbar:{
          show: false
        },
      },
      stroke: {
        width: [0, 0, 5],
        curve: 'smooth'
      },
      annotations: {
        xaxis: [{
            x: 300,
            strokeDashArray: 0,
            borderWidth: 3,
            borderColor: TivoAdminConfig.primary,
          },
        ],
        points: [{
            x: 300,
            y: 48,
            marker: {
                size: 8,
                fillColor: TivoAdminConfig.primary,
                strokeColor: TivoAdminConfig.primary,
                radius: 5,
            },
            label: {
              borderWidth: 0,
              offsetY: 0,
              text: 'We are Achieve Our Goal in Progress',
              style: {
                fontSize: '14px',
                fontWeight: '600',
                fontFamily:'Montserrat',
              }
          }
        }],
      },
      responsive: [{
        breakpoint: 767,
        options: {
          chart: {
            height: 250
          },
        },
        breakpoint: 575,
        options: {
          chart: {
            height: 220
          },
          annotations: {
            xaxis: [{
                x: 100,
                strokeDashArray: 0,
                borderWidth: 3,
                borderColor: TivoAdminConfig.primary,
              },
            ],
            points: [{
                x: 100,
                y: 48,
                marker: {
                    size: 8,
                    fillColor: TivoAdminConfig.primary,
                    strokeColor: TivoAdminConfig.primary,
                    radius: 5,
                },
                label: {
                  borderWidth: 0,
                  offsetX: 25,
                  text: 'We are Achieve Our Goal in Progress',
                  style: {
                    fontSize: '14px',
                    fontWeight: '600',
                    fontFamily:'Montserrat',
                  }
              }
            }],
          },
        }
      }],
      fill: {
        type: ['solid' , 'gradient' , 'gradient'],
        gradient: {
          shade: 'dark',
          type: "horizontal",
          shadeIntensity: 1,
          gradientToColors: [TivoAdminConfig.secondary , TivoAdminConfig.primary ],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 0.2,
          stops: [0, 100, 100, 100],
        }
      },      
      grid: {
        yaxis: {
          lines: {
            show: false,
          }
        }
      },
      xaxis: {
        offsetX: 0,
        offsetY: 0,
        categories: ["11-09-2022", "12-09-2022", "13-09-2022", "14-09-2022", "15-09-2022", "16-09-2022", "17-09-2022", "18-09-2022", "19-09-2022", "20-09-2022", "21-09-2022", "22-09-2022", "23-09-2022", "24-09-2022"],
        axisBorder: {
            low: 0,
            offsetX: 0,
            show: false,
        },
        axisTicks: {
            show: false,
        },
        labels: {
          low: 0,
          offsetX: 0,
          show: false,
        }
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy'
        },
      },
      yaxis: {
        show: false,
        lines: {
          show: false
        },
        dataLabels: {
          enabled: true
        },
      },
      legend: {
        show: false
      }
    };
    var chart = new ApexCharts(document.querySelector("#growth-chart"), options);
    chart.render();
    // vector map
    ! function(maps) {
      "use strict";
      var b = function() {};
      b.prototype.init = function() {
          maps("#asia").vectorMap({
              map: "asia_mill",
              backgroundColor: "transparent",
              regionStyle: {
                  initial: {
                      fill: TivoAdminConfig.primary
                  } 
              },
              zoomButtons : false,
              markers: [
                  { latLng: [39.91, 116.36], name: 'china', style: {r: 8, fill:'#61ae41'}},
                  { latLng: [24.774, 46.73], name: 'saudi Arbia', style: {r: 8, fill: TivoAdminConfig.primary}},
                  { latLng: [43.238949, 76.889709], name: 'Kazakhstan', style: {r: 8, fill: TivoAdminConfig.secondary}}
              ],
              series: {
            regions: [{
              scale: ['#fdd5df', '#fd0846'],
              normalizeFunction: 'polynomial',
            }]
          }
          })
      }, maps.VectorMap = new b, maps.VectorMap.Constructor = b
    }(window.jQuery),
      function(maps) {
          "use strict";
          maps.VectorMap.init()
    }(window.jQuery);
})(jQuery);
 // time 
 function startTime() {
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  m = checkTime(m);
  document.getElementById('txt').innerHTML =
  h + ":" + m  + ' ' + ampm;
  var t = setTimeout(startTime, 500);
}
function checkTime(i) {
  if (i < 10) {i = "0" + i};
  return i;
}
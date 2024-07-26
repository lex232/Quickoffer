(function ($) {
  "use strict";
    // goal overview start
    var options = {
        series: [75],
        chart: {
        height: 345,
        type: 'radialBar',
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 135,
          hollow: {
            size: '78%',
            dropShadow: {
              enabled: false,
            }
          },
          dataLabels: {
            show: true,
            name: {
              show: false,
            },
            value: {
              color: TivoAdminConfig.primary,
              fontSize: '36px',
              fontWeight: '700',
              show: true,
            }
          }
        }
      },
      responsive:[{
        breakpoint: 1551,
        options: {    
          chart: {
            height: 460, 
          },
        },
        breakpoint: 1200,
        options: {    
          chart: {
            height: 340,
          },
        },
        breakpoint: 1024,
        options: {    
          chart: {
            height: 300,
            width: 200,
          },
        },
        breakpoint: 480,
        options: {    
          chart: {
            height: 300, 
          },
        },
      }],
      colors: [TivoAdminConfig.primary],
      stroke: {
        lineCap: 'round'
      },
      tooltip: {
        enabled: false
      }
    };
    var chart = new ApexCharts(document.querySelector("#goal"), options);
    chart.render();
    //slider product box
    $('#owl-carousel-1').owlCarousel({
      loop:true,
      margin:10,
      nav:false,
      responsive:{
        1000:{
            items:1
        },
        0:{
          items: 1
        }
      }
    })
    // order static chart
    var options = {
          series: [{
          type: 'area',
          name: 'Last 2 Month',
          data: [42, 40, 28, 30, 25, 30, 35, 25]
        }, {
          type: 'line',
          name: 'Last 2 Days',
          data: [50, 40, 50, 45, 50, 30, 70, 60]
        }],
          chart: {
          height: 320,
          type: 'line',
          stacked: false,
          toolbar: {
            show: false
          }
        },
        grid: {
          yaxis:{
            lines:{
              show: false
            }
          }
        },
        stroke: {
          width: [0, 3, 5],
          curve: 'smooth'
        },
        annotations: {
          points: [{
            x: 8,
            y: 50,
            marker: {
              size: 4,
              fillColor: '#fff',
              strokeColor: TivoAdminConfig.primary,
              radius: 3,
            },
            label: {
              borderColor: '#ffffff',
              offsetY: 0,
              style: {
                color: TivoAdminConfig.primary,
                background: '#ffffff',
                fontSize: 16
              },
              text: '$3.9k',
            }
          },]
        }, 
        colors: [TivoAdminConfig.primary],
        xaxis: {
          offsetX: 0,
          offsetY: 0,
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
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
              format: 'MM'
          },
        },
        fill: {
          type: ['gradient', 'solid', 'gradient'],
          gradient: {
            shade: 'light',
            type: "vertical",
            shadeIntensity: 1,
            gradientToColors: [ TivoAdminConfig.primary, '#fff5f7', TivoAdminConfig.primary ],
            inverseColors: true,
            opacityFrom: 0.6,
            opacityTo: 0,
            stops: [0, 100, 100, 100],
          }
        },
        subtitle: {
          text: 'If you have it, you can make anything you want look good.',
          align: 'left',
          margin: 0,
          offsetX: 0,
          offsetY: 0,
          floating: false,
          style: {
            fontSize:  '11px',
            fontWeight:  '400',
            color:  '#9699a2'
          },
        },
        legend: {
          show: false
        },
        yaxis: {
          show: false
        },
      };
    var chart = new ApexCharts(document.querySelector("#order-chart"), options);
    chart.render();
})(jQuery);
(function() {
    'use strict';

    let chart, series;

    new Vue({
        mixins: [Components.VueTRON, Components.Notices, Components.Helper],
        el: '#App',
        data: {
            pair_address: '',
            visible: {
                menu: false
            },
            settings: {
                search: '',
                type: 'liquidity',
                period: 365,
                txs_tab: 'all'
            },
            txs: []
        },
        mounted() {
            Object.assign(this, JSON.parse(this.$el.getAttribute('data')));

            this.upChart();
            this.upTxs();
        },
        methods: {
            upChart() {
                fetch('/pairs/' + this.pair_address + '/charts/?type=' + this.settings.type + '&period=' + this.settings.period).then(r => r.json()).then(r => {
                    if(!chart && (chart = document.getElementById('chart'))) {
                        chart = LightweightCharts.createChart(chart, { // https://github.com/tradingview/lightweight-charts/blob/master/docs/series-basics.md
                            width: chart.offsetWidth,
                            height: chart.offsetHeight,
                            rightPriceScale: {
                                borderVisible: false
                            },
                            timeScale: {
                                borderVisible: false
                            },
                            grid: {
                                vertLines: {
                                    visible: false
                                },
                                horzLines: {
                                    visible: false
                                }
                            },
                            crosshair: {
                                vertLine: {
                                    width: 1,
                                    color: 'rgba(255, 0, 122, 0.1)',
                                    style: 0
                                },
                                horzLine: {
                                    visible: false,
                                    labelVisible: false
                                }
                            }
                        });

                        series = chart.addAreaSeries();
                        series.applyOptions({
                            priceFormat: {
                                type: 'custom',
                                formatter: v => v.toFixed(6)
                            },
                            scaleMargins: {
                                top: 0.1,
                                bottom: 0.1
                            },
                            topColor: 'rgba(255, 0, 122, 0.8)',
                            bottomColor: 'rgba(255, 0, 122, 0)',
                            lineColor: 'rgba(255, 0, 122, 1)',
                            lineStyle: 0,
                            lineWidth: 2,
                            crosshairMarkerVisible: false
                        });
                        series.setData(r.data);
                        chart.timeScale().fitContent();

                        chart.subscribeCrosshairMove(param => {
                            document.getElementById('chart_legend').innerText = param.time ? param.seriesPrices.get(series).toFixed(6) : '';
                        });
                    }
                    else if(chart) {
                        series.setData(r.data);
                        chart.timeScale().fitContent();
                    }
                });
            },
            upTxs() {
                fetch('/pairs/' + this.pair_address + '/txs/?type=' + this.settings.txs_tab).then(r => r.json()).then(r => {
                    this.txs = r.data;
                });
            }
        }
    });
})();
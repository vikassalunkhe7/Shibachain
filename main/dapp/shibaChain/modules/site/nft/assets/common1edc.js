(function() {
    'use strict';

    const ABI = [{"stateMutability":"Nonpayable","type":"Constructor"},{"inputs":[{"indexed":true,"name":"id","type":"uint256"},{"indexed":true,"name":"token","type":"address"},{"name":"start","type":"uint40"},{"name":"end","type":"uint40"}],"name":"Add","type":"Event"},{"inputs":[{"indexed":true,"name":"account","type":"address"},{"indexed":true,"name":"id","type":"uint256"},{"name":"amount","type":"uint256"}],"name":"Bet","type":"Event"},{"inputs":[{"indexed":true,"name":"account","type":"address"},{"indexed":true,"name":"id","type":"uint256"},{"name":"amount","type":"uint256"}],"name":"Winner","type":"Event"},{"inputs":[{"indexed":true,"name":"account","type":"address"},{"indexed":true,"name":"id","type":"uint256"},{"name":"amount","type":"uint256"}],"name":"Withdraw","type":"Event"},{"inputs":[{"name":"_token","type":"address"},{"name":"id","type":"uint256"},{"name":"from","type":"address"},{"name":"start","type":"uint40"},{"name":"end","type":"uint40"}],"name":"add","stateMutability":"Nonpayable","type":"Function"},{"inputs":[{"name":"id","type":"uint256"},{"name":"value","type":"uint256"}],"name":"bet","stateMutability":"Nonpayable","type":"Function"},{"payable":true,"inputs":[{"name":"id","type":"uint256"}],"name":"betTRX","stateMutability":"Payable","type":"Function"},{"outputs":[{"name":"bet","type":"uint256"},{"name":"lider","type":"address"},{"name":"memberBet","type":"uint256"}],"constant":true,"inputs":[{"name":"id","type":"uint256"},{"name":"member","type":"address"}],"name":"getLotBet","stateMutability":"View","type":"Function"},{"outputs":[{"name":"token","type":"address"},{"name":"id","type":"uint256"},{"name":"bet","type":"uint256"},{"name":"lider","type":"address"},{"name":"start","type":"uint40"},{"name":"end","type":"uint40"}],"constant":true,"inputs":[{"type":"uint256"}],"name":"lots","stateMutability":"View","type":"Function"},{"outputs":[{"type":"address"}],"constant":true,"name":"regulator","stateMutability":"View","type":"Function"},{"inputs":[{"name":"id","type":"uint256"},{"name":"to","type":"address"}],"name":"remove","stateMutability":"Nonpayable","type":"Function"},{"inputs":[{"name":"_token","type":"address"},{"name":"to","type":"address"},{"name":"amount","type":"uint256"}],"name":"rescue","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"address"}],"constant":true,"name":"token","stateMutability":"View","type":"Function"},{"inputs":[{"name":"id","type":"uint256"}],"name":"withdraw","stateMutability":"Nonpayable","type":"Function"}];

    let auction, timer_id;

    Vue.directive('chart', {
        inserted(el, binding) {
            if(!el.__chart) {
                el.__chart = LightweightCharts.createChart(el, {
                    width: el.offsetWidth,
                    height: el.offsetHeight,
                    rightPriceScale: {borderVisible: false},
                    timeScale: {borderVisible: false},
                    grid: {
                        vertLines: {visible: false},
                        horzLines: {visible: false}
                    },
                    crosshair: {
                        vertLine: {
                            width: 1,
                            color: 'rgba(255, 0, 122, 0.1)',
                            style: 0
                        },
                        horzLine: {
                            width: 1,
                            color: 'rgba(255, 0, 122, 0.1)',
                            style: 0
                        }
                    }
                });

                el.__series = el.__chart.addAreaSeries();
                el.__series.applyOptions({
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
                    lineWidth: 2
                });
            }

            el.__series.setData(binding.value);
            el.__chart.timeScale().fitContent();
        },
        update(el, binding) {
            if(el.__chart) {
                el.__series.setData(binding.value);
                el.__chart.timeScale().fitContent();
            }
        }
    });

    new Vue({
        mixins: [Components.VueTRON, Components.Notices, Components.Helper],
        el: '#App',
        data: {
            auction_address: '',
            visible: {
                menu: false,
            },
            search: {
                query: ''
            },
            select: {
                id: 0
            },
            meta: {},
            section: '',
            lots: [],
            count: 0,
            bet: 0,
            now: Math.round(Date.now() / 1000)
        },
        mounted() {
            Object.assign(this, JSON.parse(this.$el.getAttribute('data')));

            this.init();

            timer_id = setInterval(() => {
                this.now = Math.round(Date.now() / 1000);
                if(this.select.id) this.upLot(this.select.id);
            }, 1000);

            window.addEventListener('popstate', this.init, false);
        },
        destroyed() {
            clearInterval(timer_id);
        },
        watch: {
            'tron.auth'() {
                this.getTronWeb().then(tronWeb => {
                    auction = tronWeb.contract(ABI, this.auction_address);
                });
            },
            'tron.account'() {
                this.init();
            },
        },
        methods: {
            toParam(obj) {
                return Object.keys(obj).map(v => (obj[v] ? encodeURIComponent(v) + '=' + encodeURIComponent(obj[v]) : '')).filter(v => v).join('&');
            },
            init() {
                let m = location.pathname.match(/^\/nft(?:\/(lot|collection|author|soon|end|my))?(?:\/(\d+))?\/$/i);
                if(m) this.go(m[1], m[2]);
            },
            go(section, id, offset) {
                this.section = section;

                window.history.pushState(section, null, '/nft/' + (section ? section + '/' : '') + (id ? id + '/' : ''));

                if(section == 'lot') {
                    this.getLot(id);
                    this.getLots({similar_id: id}, offset);
                }
                else {
                    this.select.id = 0;

                    if(section == 'collection') this.getLots({collection_id: id}, offset);
                    else if(section == 'author') this.getLots({user_id: id}, offset);
                    else this.getLots({tab: section}, offset);
                }
            },
            getLots(search, offset) {
                if('tab' in search) search.tab = search.tab || 'active';

                fetch('/api/v0/lots/?' + this.toParam(Object.assign({address: this.tron.account, offset: offset}, search, this.search))).then(r => r.json()).then(res => {
                    this.count = res.data.count;
                    this.lots = offset > 0 ? this.lots.concat(res.data.items) : res.data.items;
                    this.meta = res.data.meta || {};
                });
            },
            getLot(id) {
                fetch('/api/v0/lot/?id=' + id + '&address=' + encodeURIComponent(this.tron.account)).then(r => r.json()).then(res => {
                    this.select = res.data;
                    this.bet = parseFloat(((res.data.max_bet + 0.1) - this.select.your_bet).toFixed(1));

                    this.upLot(id);
                });
            },
            upLot(id) {
                if(auction && this.tron.account) {
                    auction.getLotBet(id, this.tron.account).call().then(res => {
                        this.select.max_bet = res.bet / (10 ** this.select.token.decimals);
                        this.select.your_bet = res.memberBet / (10 ** this.select.token.decimals);
                        this.select.lider = tronWeb.address.fromHex(res.lider);
                        let bet = parseFloat(((this.select.max_bet + 0.1) - this.select.your_bet).toFixed(1));
                        if(this.bet < bet) this.bet = bet;
                    });
                }
            },
            createBet() {
                if(!(this.bet > 0) || !auction || !this.tron.account) return;

                let amount = '0x' + Math.floor(this.bet * (10 ** this.select.token.decimals)).toString(16),
                    not = this.sendTxNotice(),
                    fn = tx => {
                        not.sent(tx);

                        setTimeout(() => {
                            this.getLot(this.select.id);
                        }, 5000);

                        this.awaitTx(tx).then(res => {
                            if(res.receipt.result == 'SUCCESS') {
                                not.success(tx);
                                this.getLot(this.select.id);
                            }
                            else not.error(res.receipt.result);
                        });
                    };

                if(this.select.token.address) {
                    this.infApproveIfNeed(this.select.token.address, this.auction_address, amount).then(() => {
                        auction.bet(this.select.id, amount).send({feeLimit: 50000000}).then(fn, not.cancel);
                    });
                }
                else {
                    auction.betTRX(this.select.id).send({
                        feeLimit: 50000000,
                        callValue: amount
                    }).then(fn, not.cancel);
                }
            },
            withdrawBet() {
                if(!auction || !this.tron.account) return;

                let not = this.sendTxNotice();

                auction.withdraw(this.select.id).send({feeLimit: 50000000}).then(tx => {
                    not.sent(tx);

                    setTimeout(() => {
                        this.getLot(this.select.id);
                    }, 5000);

                    this.awaitTx(tx).then(res => {
                        if(res.receipt.result == 'SUCCESS') {
                            not.success(tx);
                            this.getLot(this.select.id);
                        }
                        else not.error(res.receipt.result);
                    });
                }, not.cancel);
            }
        }
    });
})();
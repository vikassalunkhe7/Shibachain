(function() {
    'use strict';

    const ABI = [{"inputs":[{"name":"_factory","type":"address"},{"name":"_wtrx","type":"address"}],"stateMutability":"Nonpayable","type":"Constructor"},{"payable":true,"stateMutability":"Payable","type":"Fallback"},{"outputs":[{"name":"amountA","type":"uint256"},{"name":"amountB","type":"uint256"},{"name":"liquidity","type":"uint256"}],"inputs":[{"name":"tokenA","type":"address"},{"name":"tokenB","type":"address"},{"name":"amountADesired","type":"uint256"},{"name":"amountBDesired","type":"uint256"},{"name":"amountAMin","type":"uint256"},{"name":"amountBMin","type":"uint256"},{"name":"to","type":"address"},{"name":"deadline","type":"uint256"}],"name":"addLiquidity","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"name":"amountToken","type":"uint256"},{"name":"amountTRX","type":"uint256"},{"name":"liquidity","type":"uint256"}],"payable":true,"inputs":[{"name":"token","type":"address"},{"name":"amountTokenDesired","type":"uint256"},{"name":"amountTokenMin","type":"uint256"},{"name":"amountTRXMin","type":"uint256"},{"name":"to","type":"address"},{"name":"deadline","type":"uint256"}],"name":"addLiquidityTRX","stateMutability":"Payable","type":"Function"},{"outputs":[{"name":"amountB","type":"uint256"},{"name":"share","type":"uint256"}],"constant":true,"inputs":[{"name":"amountA","type":"uint256"},{"name":"tokenA","type":"address"},{"name":"tokenB","type":"address"},{"name":"reverse","type":"bool"}],"name":"calcPairLiquidity","stateMutability":"View","type":"Function"},{"outputs":[{"name":"amountB","type":"uint256"},{"name":"priceImpact","type":"uint256"}],"constant":true,"inputs":[{"name":"amountA","type":"uint256"},{"name":"tokenA","type":"address"},{"name":"tokenB","type":"address"},{"name":"reverse","type":"bool"}],"name":"calcPairSwap","stateMutability":"View","type":"Function"},{"outputs":[{"type":"address"}],"constant":true,"name":"factory","stateMutability":"View","type":"Function"},{"outputs":[{"name":"amounts","type":"uint256[]"}],"constant":true,"inputs":[{"name":"amountOut","type":"uint256"},{"name":"path","type":"address[]"}],"name":"getAmountsIn","stateMutability":"View","type":"Function"},{"outputs":[{"name":"amounts","type":"uint256[]"}],"constant":true,"inputs":[{"name":"amountIn","type":"uint256"},{"name":"path","type":"address[]"}],"name":"getAmountsOut","stateMutability":"View","type":"Function"},{"outputs":[{"name":"pair","type":"address"},{"name":"totalSupply","type":"uint256"},{"name":"supply","type":"uint256"},{"name":"reserveA","type":"uint256"},{"name":"reserveB","type":"uint256"}],"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"tokenA","type":"address"},{"name":"tokenB","type":"address"}],"name":"getPair","stateMutability":"View","type":"Function"},{"outputs":[{"name":"count","type":"uint256"},{"name":"from","type":"address[]"},{"name":"to","type":"address[]"},{"name":"supply","type":"uint256[]"}],"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"start","type":"uint256"},{"name":"limit","type":"uint256"}],"name":"getPairs","stateMutability":"View","type":"Function"},{"outputs":[{"name":"amountA","type":"uint256"},{"name":"amountB","type":"uint256"}],"inputs":[{"name":"tokenA","type":"address"},{"name":"tokenB","type":"address"},{"name":"liquidity","type":"uint256"},{"name":"amountAMin","type":"uint256"},{"name":"amountBMin","type":"uint256"},{"name":"to","type":"address"},{"name":"deadline","type":"uint256"}],"name":"removeLiquidity","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"name":"amountToken","type":"uint256"},{"name":"amountTRX","type":"uint256"}],"inputs":[{"name":"token","type":"address"},{"name":"liquidity","type":"uint256"},{"name":"amountTokenMin","type":"uint256"},{"name":"amountTRXMin","type":"uint256"},{"name":"to","type":"address"},{"name":"deadline","type":"uint256"}],"name":"removeLiquidityTRX","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"name":"amounts","type":"uint256[]"}],"payable":true,"inputs":[{"name":"amountOutMin","type":"uint256"},{"name":"path","type":"address[]"},{"name":"to","type":"address"},{"name":"deadline","type":"uint256"}],"name":"swapExactTRXForTokens","stateMutability":"Payable","type":"Function"},{"outputs":[{"name":"amounts","type":"uint256[]"}],"inputs":[{"name":"amountIn","type":"uint256"},{"name":"amountOutMin","type":"uint256"},{"name":"path","type":"address[]"},{"name":"to","type":"address"},{"name":"deadline","type":"uint256"}],"name":"swapExactTokensForTRX","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"name":"amounts","type":"uint256[]"}],"inputs":[{"name":"amountIn","type":"uint256"},{"name":"amountOutMin","type":"uint256"},{"name":"path","type":"address[]"},{"name":"to","type":"address"},{"name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokens","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"name":"amounts","type":"uint256[]"}],"payable":true,"inputs":[{"name":"amountOut","type":"uint256"},{"name":"path","type":"address[]"},{"name":"to","type":"address"},{"name":"deadline","type":"uint256"}],"name":"swapTRXForExactTokens","stateMutability":"Payable","type":"Function"},{"outputs":[{"name":"amounts","type":"uint256[]"}],"inputs":[{"name":"amountOut","type":"uint256"},{"name":"amountInMax","type":"uint256"},{"name":"path","type":"address[]"},{"name":"to","type":"address"},{"name":"deadline","type":"uint256"}],"name":"swapTokensForExactTRX","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"name":"amounts","type":"uint256[]"}],"inputs":[{"name":"amountOut","type":"uint256"},{"name":"amountInMax","type":"uint256"},{"name":"path","type":"address[]"},{"name":"to","type":"address"},{"name":"deadline","type":"uint256"}],"name":"swapTokensForExactTokens","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"address"}],"constant":true,"name":"wtrx","stateMutability":"View","type":"Function"}];

    const ABI_TRC20 = [{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];

    const WTRX = 'TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR';

    let route;

    Vue.directive('range', {
        inserted(el, binding) {
            let down = e => {
                    window.addEventListener('mousemove', move);
                    window.addEventListener('mouseup', up);
                },
                move = e => {
                    let offset = el.parentElement.offsetLeft,
                        width = el.parentElement.offsetWidth,
                        event = document.createEvent("HTMLEvents"); 

                    event.initEvent('input', false, true);
                    event.value = Math.round(Math.min(width, Math.max(e.clientX - offset, 0)) / width * 100);
                    el.dispatchEvent(event);

                    e.preventDefault();
                },
                up = e => {
                    window.removeEventListener('mousemove', move);
                    window.removeEventListener('mouseup', up);
                };

            el.addEventListener('mousedown', down);
            el.parentElement.addEventListener('click', move);
        }
    });

    new Vue({
        mixins: [Components.VueTRON, Components.Notices, Components.Helper],
        el: '#App',
        data: {
            tokens: [{symbol: 'trx', address: null, decimals: 6, balance: 0, round: 4}],
            route_address: '',
            visible: {
                tab: 'swap',
                modal: '',
                settings: false,
                menu: false,
                select_token_to: false,
                select_token_search: ''
            },
            settings: {
                slippage: 0.5,
                hand_slippage: '',
                deadline: 3,
                darkmode: false
            },
            swap: {
                last_change_from: true,
                from: 'trx',
                to: '',
                amount_from: '',
                amount_to: '',
                impact: 0,
                pair: '',
                total_supply: 0,
                supply: 0,
                reserve_from: 0,
                reserve_to: 0,
                share: 0,
                remove: 50
            },
            info: {
                total_trx_liquidity: 0,
                total_usd_liquidity: 0
            },
            liquidities: []
        },
        mounted() {
            Object.assign(this, JSON.parse(this.$el.getAttribute('data')));
            Object.assign(this.settings, JSON.parse(localStorage.getItem('settings')) || {});

            window.onbeforeunload = () => {
                localStorage.setItem('settings', JSON.stringify(this.settings));
            };

            window.onfocus = () => {
                this.upRate();
                this.upBalance();
                if(route) this.upLiquiditiesList();
            };
            setInterval(this.upRate, 5000);

            let m = location.hash.match(/^#(?:\/(swap|liquidity|add|remove))?(?:\/([a-z]+))?(?:\/([a-z]+))?\/?$/i);
            if(m) {
                if(m[1]) this.visible.tab = m[1];
                if(m[2] && this.tokenBySymbol(m[2]).symbol) this.swap.from = m[2];
                if(m[3] && this.tokenBySymbol(m[3]).symbol) this.swap.to = m[3];
            }

            fetch('https://uswap.me/api/v0/info/').then(r => r.json()).then(r => {
                this.info = r.data;
            });
        },
        computed: {
            FromToken() {
                return this.swap.from ? this.tokenBySymbol(this.swap.from) : {};
            },
            ToToken() {
                return this.swap.to ? this.tokenBySymbol(this.swap.to) : {};
            }
        },
        watch: {
            'tron.auth'() {
                this.getTronWeb().then(tronWeb => {
                    route = tronWeb.contract(ABI, this.route_address);
                    this.upLiquiditiesList();
                    this.upLiquidity();
                });
            },
            'tron.account'() {
                if(/^login/.test(this.visible.modal)) {
                    this.visible.modal = '';
                }

                this.upBalance();
                if(route) this.upLiquiditiesList();
            },
            'visible.tab'() {
                this.upHash();
                if(this.visible.tab == 'liquidity' && route) this.upLiquiditiesList();
            },
            'swap.from'() {
                this.upLiquidity();
                this.upBalance();
                this.upHash();
            },
            'swap.to'() {
                this.upLiquidity();
                this.upBalance();
                this.upHash();
            }
        },
        methods: {
            frombi(value, from) {
                return parseFloat(value / (10 ** this[from ? 'FromToken' : 'ToToken'].decimals)) || 0;
            },
            tobi(value, from) {
                return '0x' + (Math.floor(parseFloat(value) * (10 ** this[from ? 'FromToken' : 'ToToken'].decimals)) || 0).toString(16);
            },
            tokenByAddr(address) {
                return (this.tokens.filter(v => v.address == address) || [{}])[0];
            },
            tokenBySymbol(symbol) {
                return (this.tokens.filter(v => v.symbol == symbol) || [{}])[0];
            },
            upHash() {
                location.hash = '/' + [this.visible.tab != 'swap' ? this.visible.tab : '', this.swap.from, this.swap.to].filter(v => v).join('/');
            },
            upBalance() {
                if(!this.tron.account) return;

                this.getTronWeb().then(tronWeb => {
                    if(this.swap.from) {
                        let token = this.tokenBySymbol(this.swap.from);

                        if(token.symbol == 'trx') {
                            tronWeb.trx.getBalance(this.tron.account).then(balance => {
                                token.balance = balance / 1e6;
                            });
                        }
                        else {
                            tronWeb.contract(ABI_TRC20, token.address).balanceOf(this.tron.account).call().then(res => {
                                token.balance = res / 10 ** token.decimals;
                            });
                        }
                    }

                    if(this.swap.to) {
                        let token = this.tokenBySymbol(this.swap.to);

                        if(token.symbol == 'trx') {
                            tronWeb.trx.getBalance(this.tron.account).then(balance => {
                                token.balance = balance / 1e6;
                            });
                        }
                        else {
                            tronWeb.contract(ABI_TRC20, token.address).balanceOf(this.tron.account).call().then(res => {
                                token.balance = res / 10 ** token.decimals;
                            });
                        }
                    }
                });
            },
            upLiquiditiesList() {
                if(!this.tron.account) return;

                this.getTronWeb().then(tronWeb => {
                    let liquidities = [],
                        err_count = 0;

                    const fn = (offset, limit) => {
                        route.getPairs(this.tron.account, offset, limit).call().then(res => {
                            for(let i = 0; i < res.supply.length; i++) {
                                let from = this.tokenByAddr(tronWeb.address.fromHex(res.from[i])),
                                    to = this.tokenByAddr(tronWeb.address.fromHex(res.to[i])),
                                    supply = parseFloat(parseInt(res.supply[i]) / (10 ** 8) || 0);

                                if(supply >= 0.000001) {
                                    liquidities.push({
                                        from: from.symbol == 'wtrx' ? 'trx' : from.symbol,
                                        to: to.symbol == 'wtrx' ? 'trx' : to.symbol,
                                        supply: supply
                                    });
                                }
                            }

                            if(parseInt(res.count) > offset + limit) fn(offset + limit, limit);
                            else this.liquidities = liquidities;
                        }, e => {
                            if(err_count++ < 10) fn(offset, limit);
                            else this.notice('Error: ' + e, 'error');
                        });
                    };

                    fn(0, 20);
                });
            },
            upLiquidity() {
                if(!this.swap.from || !this.swap.to || !this.tron.account) return;
                
                this.getTronWeb().then(tronWeb => {
                    route.getPair(this.tron.account, (this.FromToken.address || WTRX), (this.ToToken.address || WTRX)).call().then(res => {
                        this.swap.pair = tronWeb.address.fromHex(res.pair);
                        this.swap.total_supply = parseFloat(parseInt(res.totalSupply) / (10 ** 8) || 0);
                        this.swap.supply = parseFloat(parseInt(res.supply) / (10 ** 8) || 0);
                        this.swap.reserve_from = this.frombi(res.reserveA, true);
                        this.swap.reserve_to = this.frombi(res.reserveB, false);
                    });
                });
            },
            upRate(last_change_from) {
                if(!this.swap.from || !this.swap.to || !this.tron.account) return;

                if(last_change_from !== undefined) this.swap.last_change_from = last_change_from;

                let reverse = !this.swap.last_change_from;

                route[this.visible.tab == 'add' ? 'calcPairLiquidity' : 'calcPairSwap'](
                    (reverse ? this.tobi(this.swap.amount_to, false) : this.tobi(this.swap.amount_from, true)),
                    (this.FromToken.address || WTRX),
                    (this.ToToken.address || WTRX),
                    reverse
                ).call().then(res => {
                    this.swap[reverse ? 'amount_from' : 'amount_to'] = this.frombi(res.amountB, reverse);
                    this.swap.impact = 'priceImpact' in res ? ((parseInt(res.priceImpact) || 0) / 100) : 0;
                    this.swap.share = 'share' in res ? (parseInt(res.share) || 0) : 0;
                }, (e) => {
                    if(!(this.visible.tab == 'add' && e == 'REVERT opcode executed')) {
                        this.swap[reverse ? 'amount_from' : 'amount_to'] = '';
                    }
                    this.swap.impact = 0;
                    this.swap.share = 0;
                });
            },
            swapCurrencies() {
                let to = this.swap.to,
                    amount_to = this.swap.amount_to;

                this.swap.last_change_from = !this.swap.last_change_from;
                this.swap.to = this.swap.from;
                this.swap.amount_to = this.swap.amount_from;
                this.swap.from = to;
                this.swap.amount_from = amount_to;

                this.upRate();
            },
            swaped() {
                let fm = this.swap.last_change_from,
                    in_amount = fm ? this.swap.amount_from : (this.swap.amount_from + (this.swap.amount_from / 100 * this.settings.slippage)),
                    out_amount = fm ? (this.swap.amount_to - this.swap.amount_to / 100 * this.settings.slippage) : this.swap.amount_to,
                    path = [(this.FromToken.address || WTRX), (this.ToToken.address || WTRX)],
                    recipient = this.tron.account,
                    deadline = parseInt(Date.now() / 1000) + this.settings.deadline * 60,
                    not = this.sendTxNotice(),
                    resolve = (tx) => {
                        this.visible.modal = '';
                        this.swap.amount_from = this.swap.amount_to = 0;

                        not.sent(tx);

                        setTimeout(() => {
                            this.upRate();
                            this.upBalance();
                        }, 5000);

                        this.awaitTx(tx).then(res => {
                            if(res.receipt.result == 'SUCCESS') {
                                not.success(tx);
                                this.upRate();
                                this.upBalance();
                            }
                            else not.error(res.receipt.result);
                        });
                    },
                    reject = (e) => {
                        this.visible.modal = '';
                        not.error(typeof e == 'string' ? e : (e.message ? e.message : ''));
                    };

                in_amount = this.tobi(in_amount, true);
                out_amount = this.tobi(out_amount, false);

                this.visible.modal = 'swap_wait';

                this.infApproveIfNeed(this.FromToken.address, this.route_address, in_amount).then(() => {
                    if(!this.FromToken.address) {
                        if(fm) route.swapExactTRXForTokens(out_amount, path, recipient, deadline).send({callValue: in_amount, feeLimit: 50000000}).then(resolve, reject);
                        else route.swapTRXForExactTokens(out_amount, path, recipient, deadline).send({callValue: in_amount, feeLimit: 50000000}).then(resolve, reject);
                    }
                    else if(!this.ToToken.address) {
                        if(fm) route.swapExactTokensForTRX(in_amount, out_amount, path, recipient, deadline).send({feeLimit: 50000000}).then(resolve, reject);
                        else route.swapTokensForExactTRX(out_amount, in_amount, path, recipient, deadline).send({feeLimit: 50000000}).then(resolve, reject);
                    }
                    else {
                        if(fm) route.swapExactTokensForTokens(in_amount, out_amount, path, recipient, deadline).send({feeLimit: 50000000}).then(resolve, reject);
                        else route.swapTokensForExactTokens(out_amount, in_amount, path, recipient, deadline).send({feeLimit: 50000000}).then(resolve, reject);
                    }
                }, reject);
            },
            supply() {
                let fm = this.swap.last_change_from,
                    amount1 = this.swap.amount_from,
                    amount2 = this.swap.amount_to,
                    min_amount1 = (amount1 - amount1 / 100 * this.settings.slippage),
                    min_amount2 = (amount2 - amount2 / 100 * this.settings.slippage),
                    recipient = this.tron.account,
                    deadline = parseInt(Date.now() / 1000) + this.settings.deadline * 60,
                    not = this.sendTxNotice(),
                    resolve = (tx) => {
                        this.visible.modal = '';
                        this.visible.tab = 'liquidity';
                        this.swap.amount_from = this.swap.amount_to = 0;

                        not.sent(tx);

                        setTimeout(() => {
                            this.upRate();
                            this.upBalance();
                            this.upLiquidity();
                            this.upLiquiditiesList();
                        }, 5000);

                        this.awaitTx(tx).then(res => {
                            if(res.receipt.result == 'SUCCESS') {
                                not.success(tx);
                                this.upRate();
                                this.upBalance();
                                this.upLiquidity();
                                this.upLiquiditiesList();
                            }
                            else not.error(res.receipt.result);
                        });
                    },
                    reject = (e) => {
                        this.visible.modal = '';
                        not.error(typeof e == 'string' ? e : (e.message ? e.message : ''));
                    };

                amount1 = this.tobi(amount1, true);
                amount2 = this.tobi(amount2, false);
                min_amount1 = this.tobi(min_amount1, true);
                min_amount2 = this.tobi(min_amount2, false);
                
                this.infApproveIfNeed(this.FromToken.address, this.route_address, this.swap.amount_from).then(() => {
                    this.infApproveIfNeed(this.ToToken.address, this.route_address, this.swap.amount_to).then(() => {
                        this.visible.modal = 'add_wait';

                        if(!this.FromToken.address || !this.ToToken.address) {
                            if(!this.FromToken.address) route.addLiquidityTRX(this.ToToken.address, amount2, min_amount2, min_amount1, recipient, deadline).send({callValue: amount1, feeLimit: 50000000}).then(resolve, reject);
                            else route.addLiquidityTRX(this.FromToken.address, amount1, min_amount1, min_amount2, recipient, deadline).send({callValue: amount2, feeLimit: 50000000}).then(resolve, reject);
                        }
                        else route.addLiquidity(this.FromToken.address, this.ToToken.address, amount1, amount2, min_amount1, min_amount2, recipient, deadline).send({feeLimit: 50000000}).then(resolve, reject);
                    }, reject);
                }, reject);
            },
            remove() {
                let liquidity = this.swap.remove * this.swap.supply / 100,
                    amount1 = this.swap.remove * (this.swap.supply / this.swap.total_supply) * this.swap.reserve_from / 100,
                    amount2 = this.swap.remove * (this.swap.supply / this.swap.total_supply) * this.swap.reserve_to / 100,
                    min_amount1 = (amount1 - amount1 / 100 * this.settings.slippage),
                    min_amount2 = (amount2 - amount2 / 100 * this.settings.slippage),
                    recipient = this.tron.account,
                    deadline = parseInt(Date.now() / 1000) + this.settings.deadline * 60,
                    not = this.sendTxNotice(),
                    resolve = (tx) => {
                        this.visible.modal = '';
                        this.visible.tab = 'liquidity';

                        not.sent(tx);

                        setTimeout(() => {
                            this.upRate();
                            this.upBalance();
                            this.upLiquidity();
                            this.upLiquiditiesList();
                        }, 5000);

                        this.awaitTx(tx).then(res => {
                            if(res.receipt.result == 'SUCCESS') {
                                not.success(tx);
                                this.upRate();
                                this.upBalance();
                                this.upLiquidity();
                                this.upLiquiditiesList();
                            }
                            else not.error(res.receipt.result);
                        });
                    },
                    reject = (e) => {
                        this.visible.modal = '';
                        not.error(typeof e == 'string' ? e : (e.message ? e.message : ''));
                    };

                liquidity = '0x' + Math.floor(liquidity * (10 ** 8) || 0).toString(16);
                min_amount1 = this.tobi(min_amount1, true);
                min_amount2 = this.tobi(min_amount2, false);

                this.balanceOf(this.swap.pair, this.tron.account).then(liq_balance => {
                    if(this.swap.remove == 100) liquidity = liq_balance;

                    this.infApproveIfNeed(this.swap.pair, this.route_address, liquidity).then(() => {
                        this.visible.modal = 'remove_wait';

                        if(!this.FromToken.address || !this.ToToken.address) {
                            if(!this.FromToken.address) route.removeLiquidityTRX(this.ToToken.address, liquidity, min_amount2, min_amount1, recipient, deadline).send({feeLimit: 50000000}).then(resolve, reject);
                            else route.removeLiquidityTRX(this.FromToken.address, liquidity, min_amount1, min_amount2, recipient, deadline).send({feeLimit: 50000000}).then(resolve, reject);
                        }
                        else route.removeLiquidity(this.FromToken.address, this.ToToken.address, liquidity, min_amount1, min_amount2, recipient, deadline).send({feeLimit: 50000000}).then(resolve, reject);
                    }, reject);
                });
            }
        }
    });
})();
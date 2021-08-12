(function() {
    'use strict';

    const ABI = [{"inputs":[{"name":"_dist","type":"address"},{"name":"_token","type":"address"},{"name":"_provided","type":"address"},{"name":"_start","type":"uint40"},{"name":"_duration_days","type":"uint40"},{"name":"_freeze_days","type":"uint40"}],"stateMutability":"Nonpayable","type":"Constructor"},{"inputs":[{"indexed":true,"name":"user","type":"address"},{"indexed":true,"name":"upline","type":"address"},{"name":"amount","type":"uint256"}],"name":"RefFee","type":"Event"},{"inputs":[{"name":"amount","type":"uint256"}],"name":"Repayment","type":"Event"},{"inputs":[{"indexed":true,"name":"user","type":"address"},{"name":"reward","type":"uint256"}],"name":"Reward","type":"Event"},{"inputs":[{"indexed":true,"name":"member","type":"address"},{"name":"amount","type":"uint256"}],"name":"Stake","type":"Event"},{"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"Transfer","type":"Event"},{"inputs":[{"indexed":true,"name":"member","type":"address"},{"name":"amount","type":"uint256"}],"name":"Withdraw","type":"Event"},{"outputs":[{"type":"uint256"}],"constant":true,"inputs":[{"type":"address"}],"name":"balanceOf","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"inputs":[{"name":"amount","type":"uint256"}],"name":"calcProvide","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"name":"calcRate","stateMutability":"View","type":"Function"},{"outputs":[{"type":"address"}],"constant":true,"name":"dist","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"name":"distribution","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint40"}],"constant":true,"name":"duration","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"inputs":[{"name":"member","type":"address"}],"name":"earned","stateMutability":"View","type":"Function"},{"name":"exit","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"name":"amount","type":"uint40"}],"constant":true,"name":"fee","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint40"}],"constant":true,"name":"finish","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint40"}],"constant":true,"name":"freeze","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"name":"last_rate","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint40"}],"constant":true,"name":"last_update","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"inputs":[{"type":"address"}],"name":"paids","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"inputs":[{"type":"address"}],"name":"provide","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"name":"provide_size","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"name":"provide_sum","stateMutability":"View","type":"Function"},{"outputs":[{"type":"address"}],"constant":true,"name":"provided","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"name":"rate","stateMutability":"View","type":"Function"},{"outputs":[{"type":"address"}],"constant":true,"name":"ref","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint16"}],"constant":true,"name":"reffee","stateMutability":"View","type":"Function"},{"outputs":[{"type":"address"}],"constant":true,"name":"regulator","stateMutability":"View","type":"Function"},{"inputs":[{"name":"amount","type":"uint256"}],"name":"repayment","stateMutability":"Nonpayable","type":"Function"},{"inputs":[{"name":"_token","type":"address"},{"name":"to","type":"address"},{"name":"amount","type":"uint256"}],"name":"rescue","stateMutability":"Nonpayable","type":"Function"},{"name":"reward","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"inputs":[{"type":"address"}],"name":"rewards","stateMutability":"View","type":"Function"},{"inputs":[{"name":"members","type":"address[]"},{"name":"percents","type":"uint40[]"}],"name":"setFee","stateMutability":"Nonpayable","type":"Function"},{"inputs":[{"name":"value","type":"uint256"}],"name":"setProvideSize","stateMutability":"Nonpayable","type":"Function"},{"inputs":[{"name":"value","type":"uint16"}],"name":"setReffee","stateMutability":"Nonpayable","type":"Function"},{"inputs":[{"name":"amount","type":"uint256"}],"name":"stake","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"uint40"}],"constant":true,"name":"start","stateMutability":"View","type":"Function"},{"outputs":[{"type":"address"}],"constant":true,"name":"token","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"name":"totalSupply","stateMutability":"View","type":"Function"},{"inputs":[{"name":"amount","type":"uint256"}],"name":"withdraw","stateMutability":"Nonpayable","type":"Function"},{"inputs":[{"name":"amount","type":"uint256"}],"name":"withdraws","stateMutability":"Nonpayable","type":"Function"}];

    const ABI_POOLS = [{"outputs":[{"type":"uint256"}],"constant":true,"name":"count","stateMutability":"View","type":"Function"},{"outputs":[{"name":"matches","type":"uint256"},{"name":"params1","type":"address[]"},{"name":"params2","type":"uint256[]"}],"constant":true,"inputs":[{"name":"member","type":"address"},{"name":"start","type":"uint256"},{"name":"limit","type":"uint256"}],"name":"get","stateMutability":"View","type":"Function"}];

    new Vue({
        mixins: [Components.VueTRON, Components.Notices, Components.Helper],
        el: '#App',
        data: {
            route: '',
            tokens: [],
            pairs: [],
            visible: {
                tab: 'staking',
                modal: '',
                menu: false,
                staking: 'actual',
                search: '',
                dist: 'ume',
                provided: ''
            },
            swap: {
                stake: 0,
                amount: 0,
                provide: 0
            },
            staking: [],
            count: 0,
            last_height: 0,
            now: Math.floor(Date.now() / 1000)
        },
        mounted() {
            Object.assign(this, JSON.parse(this.$el.getAttribute('data')));

            let m = location.hash.match(/^#(?:\/(ume|eft))?(?:\/(actual|active|my|soon|ended))?$/i);
            if(m) {
                if(m[1]) this.visible.dist = m[1];
                if(m[2]) this.visible.staking = m[2];
            }

            if(window.parent && window != window.parent) {
                window.addEventListener('resize', this.upHeght);
                window.addEventListener('click', this.upHeght);
                setTimeout(this.upHeght, 100);
            }
        },
        watch: {
            'tron.account'() {
                if(/^login/.test(this.visible.modal)) {
                    this.visible.modal = '';
                }

                fetch('/api/v0/tokens/').then(r => r.json()).then(r => {
                    this.tokens = r.data.map(v => { v.balance = 0; return v; });

                    fetch('https://uswap.me/api/v0/pairs/').then(r => r.json()).then(r => {
                        this.pairs = r.data;

                        this.upBalance();
                        this.upStakingList();
                    });
                });
            },
            'visible.dist'() {
                this.upHash();
            },
            'visible.staking'() {
                this.upHash();
            },
            'visible.provided'() {
                this.upHash();
            },
        },
        computed: {
            stakingList() {
                let s = this.visible.search.trim().toLowerCase();
                return this.staking.filter(v => {
                    return (
                            (this.visible.staking == 'actual' && this.now < v.start + v.duration)
                            || (this.visible.staking == 'active' && this.now >= v.start && this.now < v.start + v.duration)
                            || (this.visible.staking == 'ended' && this.now > v.start + v.duration)
                            || (this.visible.staking == 'my' && v.balance > 0)
                            || (this.visible.staking == 'soon' && this.now < v.start)
                        ) && (!s || (v.from + '/' + v.to).indexOf(s) >= 0) && v.provided == this.visible.provided; //  && v.dist == this.visible.dist
                });
            },
            stakingBalances() {
                let balances = {};

                this.stakingList.forEach(v => {
                    if(v.balance > 0) {
                        balances[v.from] = (parseFloat(balances[v.from]) || 0) + v.from_staked * (v.balance / v.token_supply);
                        if(v.to) balances[v.to] = (parseFloat(balances[v.to]) || 0) + v.to_staked * (v.balance / v.token_supply);
                    }

                    if(v.earned > 0) balances[v.dist] = (parseFloat(balances[v.dist]) || 0) + v.earned;
                    if(v.provide > 0) balances[v.provided] = (parseFloat(balances[v.provided]) || 0) + v.provide;
                });

                return balances;
            }
        },
        methods: {
            tokenByAddr(address) {
                return (this.tokens.filter(v => v.address == address) || [{}])[0];
            },
            tokenBySymbol(symbol) {
                return (this.tokens.filter(v => v.symbol == symbol) || [{}])[0];
            },
            pairByAddress(address) {
                return (this.pairs.filter(v => v.address == address) || [{}])[0];
            },
            rateBySymbol(symbol) {
                if(symbol == 'trx') return this.pairs.filter(v => v.from == 'trx' && v.to == 'usdt')[0].price_from;
                let p = (this.pairs.filter(v => v.from == symbol && v.to == 'trx' || v.to == symbol && v.from == 'trx') || [{}])[0] || {};
                return (p.from == symbol ? p.price_from : p.price_to) || 0;
            },
            upHash() {
                location.hash = '/' + [this.visible.dist != 'umi' ? this.visible.dist : '', this.visible.provided, this.visible.staking != 'actual' ? this.visible.staking : ''].filter(v => v).join('/');
            },
            upHeght() {
                if(window.parent && window != window.parent) {
                    let new_height = document.querySelector('.form__wrap').offsetHeight + 160;

                    if(this.last_height != new_height) {
                        window.parent.postMessage({type: 'changeHeight', value: (this.last_height = new_height)}, '*');
                    }
                }
            },
            getContract(address, abi = null) {
                if(!this.tron.account) return;

                return new Promise((resolve, reject) => {
                    this.getTronWeb().then(tronWeb => {
                        resolve(tronWeb.contract(abi ? abi : ABI, address));
                    }, reject);
                });
            },
            upBalance() {
                if(!this.tron.account) return;

                this.getTronWeb().then(tronWeb => {
                    tronWeb.trx.getBalance(this.tron.account).then(balance => {
                        this.tokens[0].balance = balance / 1e6;
                    });

                    let token = this.tokenBySymbol('ume');
                    this.balanceOf(token.address, this.tron.account).then(balance => {
                        token.balance = balance / (10 ** token.decimals);

                        token = this.tokenBySymbol('eft');

                        this.balanceOf(token.address, this.tron.account).then(balance => {
                            token.balance = balance / (10 ** token.decimals);
                        });
                    });
                });
            },
            upStakingList(upstake = null) {
                if(!this.tron.account) return;

                this.getTronWeb().then(tronWeb => {
                    this.getContract(this.route, ABI_POOLS).then(contract => {
                        contract.count().call().then(count => {
                            count = this.count = parseInt(count);

                            if(!upstake) this.staking = [];
                            let err_count = 0,
                                need_withdraw = false;

                            const fn = (offset, limit) => {
                                contract.get(this.tron.account, offset, limit).call().then(res => {
                                    for(let i = 0; i < res.matches; i++) {
                                        let p1 = i * 4,
                                            p2 = i * 17,
                                            pair = this.pairByAddress(tronWeb.address.fromHex(res.params1[p1 + 1])),
                                            dist = this.tokenByAddr(tronWeb.address.fromHex(res.params1[p1 + 2])),
                                            provided = this.tokenByAddr(tronWeb.address.fromHex(res.params1[p1 + 3])),
                                            token = !pair ? this.tokenByAddr(tronWeb.address.fromHex(res.params1[p1 + 1])) : dist,
                                            token0 = pair ? this.tokenBySymbol(pair.from) : null,
                                            token1 = pair ? this.tokenBySymbol(pair.to) : null;

                                        let stake = {
                                            special: ['TWa8iGSm4XPyFUuyZU2SChHm2Dom6u8K5L', 'TJ3gFPmeAXHBULy87rH81evDBeDpgCpgCD'].indexOf(tronWeb.address.fromHex(res.params1[p1])) >= 0,
                                            show_special_params: false,
                                            index: parseInt(res.params2[p2]),
                                            dist: dist.symbol,
                                            provided: provided ? provided.symbol : '',
                                            contract: tronWeb.address.fromHex(res.params1[p1]),
                                            token: tronWeb.address.fromHex(res.params1[p1 + 1]),
                                            from: pair ? pair.from : token.symbol,
                                            to: pair ? pair.to : '',
                                            total_earned: res.params2[p2 + 5] / (10 ** dist.decimals),
                                            start: parseInt(res.params2[p2 + 8]),
                                            duration: parseInt(res.params2[p2 + 9]),
                                            freeze: parseInt(res.params2[p2 + 10]),
                                            fee: parseInt(res.params2[p2 + 11]) / 100,
                                            reffee: parseInt(res.params2[p2 + 16]) / 100,
                                            total_supply: res.params2[p2 + 7] / (10 ** token.decimals),
                                            dist_supply: res.params2[p2 + 6] / (10 ** dist.decimals),
                                            from_staked: pair ? res.params2[p2 + 2] / (10 ** token0.decimals) : res.params2[p2 + 2] / (10 ** token.decimals),
                                            to_staked: pair ? res.params2[p2 + 3] / (10 ** token1.decimals) : 0,
                                            balance: res.params2[p2 + 12] / (10 ** token.decimals),
                                            token_balance: res.params2[p2 + 4] / (10 ** token.decimals),
                                            token_supply: res.params2[p2 + 1] / (10 ** token.decimals),
                                            earned: res.params2[p2 + 13]  / (10 ** dist.decimals),
                                            provide_sum: provided ? res.params2[p2 + 14]  / (10 ** provided.decimals) : 0,
                                            provide: provided ? res.params2[p2 + 15]  / (10 ** provided.decimals) : 0,
                                            apy: 0
                                        };

                                        if(stake.provided && stake.dist == stake.provided) {
                                            stake.dist_supply -= stake.provide_sum;
                                        }

                                        if(this.now < stake.start + stake.duration) {
                                            let yapy = stake.total_earned / stake.duration * 31526000 * 100,
                                                sapy = stake.total_supply / stake.token_supply;

                                            if(stake.from == 'trx' || stake.to == 'trx') stake.apy = yapy * this.rateBySymbol(dist.symbol) / (stake[stake.from == 'trx' ? 'from_staked' : 'to_staked'] * 2 * sapy);
                                            else if(stake.from == dist.symbol && !stake.to) stake.apy = yapy / (stake.from_staked * (stake.total_supply / stake.token_supply));
                                            else if(stake.from == dist.symbol || stake.to == dist.symbol) stake.apy = yapy / (stake[stake.from == dist.symbol ? 'from_staked' : 'to_staked'] * (stake.to ? 2 * sapy : 1));
                                            else stake.apy = yapy / (this.rateBySymbol(stake.from) / this.rateBySymbol(dist.symbol)) / (stake.from_staked * (stake.to ? 2 : 1) * sapy);

                                            stake.apy = stake.apy < 1 ? 0 : stake.apy;
                                        }
                                        else if(stake.balance > 0) need_withdraw = true;

                                        if(!upstake) this.staking.push(stake);
                                        else Object.assign(upstake, stake);
                                    }
                                    
                                    this.staking.sort((a, b) => a.apy < b.apy ? 1 : -1);
                                    this.staking.sort((a, b) => a.apy == 0 ? -1 : 1);
                                    this.staking.sort((a, b) => a.special ? -1 : 1);

                                    if(!upstake) {
                                        setTimeout(this.upHeght, 100);

                                        if(offset <= 0) {
                                            if(need_withdraw) this.notice('You have unwithdrawn staked liquidity in the completed pools. Please withdraw it.', 'warning');
                                        }
                                        else fn(Math.max(0, offset - limit), limit);
                                    }
                                }, e => {
                                    if(err_count++ < 10) fn(offset, limit);
                                    else this.notice('Error: ' + e, 'error');
                                });
                            };

                            upstake ? fn(upstake.index, 1) : fn(count - 6, 6);
                        });
                    });
                });
            },
            calcProvide(stake) {
                if(!stake.provided) return this.swap.provide = 0;

                let decimals = !this.pairByAddress(stake.token) ? this.tokenByAddr(stake.token).decimals : 8,
                    amount = '0x' + Math.floor(this.swap.amount * (10 ** decimals)).toString(16);

                this.getContract(stake.contract).then(contract => {
                    contract.calcProvide(amount).call().then(res => {
                        this.swap.provide = parseInt(res) / (10 ** this.tokenBySymbol(stake.provided).decimals);
                    }, () => {
                        this.swap.provide = 0;
                    });
                });
            },
            reward(stake) {
                this.getContract(stake.contract).then(contract => {
                    let not = this.sendTxNotice();

                    contract.reward().send({feeLimit: 50000000}).then(tx => {
                        not.sent(tx);
                        setTimeout(() => { this.upStakingList(stake); }, 5000);

                        this.awaitTx(tx).then(res => {
                            if(res.receipt.result == 'SUCCESS') {
                                not.success(tx);
                                this.upStakingList(stake);
                            }
                            else not.error(res.receipt.result);
                        });
                    }, not.cancel);
                });
            },
            stake(stake) {
                if(!(this.swap.amount > 0)) return;
                if(stake.token_balance < this.swap.amount) return this.notice('Insufficient funds', 'error');

                let decimals = !this.pairByAddress(stake.token) ? this.tokenByAddr(stake.token).decimals : 8,
                    amount = '0x' + Math.floor(this.swap.amount * (10 ** decimals)).toString(16),
                    provide = stake.provided ? '0x' + Math.floor(this.swap.provide * (10 ** this.tokenBySymbol(stake.provided).decimals)).toString(16) : '0x0';

                this.getContract(stake.contract).then(contract => {
                    let not = this.sendTxNotice();

                    this.infApproveIfNeed(stake.token, stake.contract, amount).then(() => {
                        this.infApproveIfNeed((this.tokenBySymbol(stake.provided) || {}).address, stake.contract, provide).then(() => {
                            contract.stake(amount).send({feeLimit: 50000000}).then(tx => {
                                not.sent(tx);
                                setTimeout(() => {
                                    this.swap.amount = 0;
                                    this.visible.tab = 'staking';
                                    this.visible.staking = 'my';
                                    this.upStakingList(stake);
                                }, 5000);

                                this.awaitTx(tx).then(res => {
                                    if(res.receipt.result == 'SUCCESS') {
                                        not.success(tx);
                                        this.upStakingList(stake);
                                    }
                                    else not.error(res.receipt.result);
                                });
                            }, not.cancel);
                        });
                    });
                });
            },
            unstake(stake) {
                if(!(this.swap.amount > 0)) return;
                if(stake.balance < this.swap.amount) return this.notice('Insufficient funds', 'error');

                let decimals = !this.pairByAddress(stake.token) ? this.tokenByAddr(stake.token).decimals : 8;
                let amount = '0x' + Math.floor(this.swap.amount * (10 ** decimals)).toString(16);

                this.getContract(stake.contract).then(contract => {
                    let not = this.sendTxNotice();

                    contract.withdraws(amount).send({feeLimit: 50000000}).then(tx => {
                        not.sent(tx);
                        setTimeout(() => {
                            this.swap.amount = 0;
                            this.visible.tab = 'staking';
                            this.visible.staking = 'actual';
                            this.upStakingList(stake);
                        }, 5000);

                        this.awaitTx(tx).then(res => {
                            if(res.receipt.result == 'SUCCESS') {
                                not.success(tx);
                                this.upStakingList(stake);
                            }
                            else not.error(res.receipt.result);
                        });
                    }, not.cancel);
                });
            }
        }
    });
})();
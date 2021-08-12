(function() {
    'use strict';

    const ABI = [{"inputs":[{"name":"_token","type":"address"},{"name":"_ume","type":"address"},{"name":"_start","type":"uint40"}],"stateMutability":"Nonpayable","type":"Constructor"},{"inputs":[{"name":"amount","type":"uint256"}],"name":"Repayment","type":"Event"},{"inputs":[{"indexed":true,"name":"user","type":"address"},{"name":"reward","type":"uint256"}],"name":"Reward","type":"Event"},{"inputs":[{"indexed":true,"name":"member","type":"address"},{"name":"amount","type":"uint256"}],"name":"Stake","type":"Event"},{"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"Transfer","type":"Event"},{"inputs":[{"indexed":true,"name":"member","type":"address"},{"name":"amount","type":"uint256"}],"name":"Withdraw","type":"Event"},{"outputs":[{"type":"uint40"}],"constant":true,"name":"DURATION","stateMutability":"View","type":"Function"},{"outputs":[{"type":"address"}],"constant":true,"name":"WTRX","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"inputs":[{"type":"address"}],"name":"balanceOf","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"name":"calcRate","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"inputs":[{"name":"member","type":"address"}],"name":"earned","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint40"}],"constant":true,"name":"finish","stateMutability":"View","type":"Function"},{"outputs":[{"name":"total_supply","type":"uint256"},{"name":"ume_balance","type":"uint256"},{"name":"reserve0","type":"uint256"},{"name":"reserve1","type":"uint256"},{"name":"member_balance","type":"uint256"},{"name":"member_reserve","type":"uint256"},{"name":"_earned","type":"uint256"}],"constant":true,"inputs":[{"name":"member","type":"address"}],"name":"info","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint40"}],"constant":true,"name":"lastTime","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"name":"last_rate","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint40"}],"constant":true,"name":"last_update","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"inputs":[{"type":"address"}],"name":"paids","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"name":"rate","stateMutability":"View","type":"Function"},{"outputs":[{"type":"address"}],"constant":true,"name":"regulator","stateMutability":"View","type":"Function"},{"inputs":[{"name":"amount","type":"uint256"}],"name":"repayment","stateMutability":"Nonpayable","type":"Function"},{"inputs":[{"name":"_token","type":"address"},{"name":"to","type":"address"},{"name":"amount","type":"uint256"}],"name":"rescue","stateMutability":"Nonpayable","type":"Function"},{"name":"reward","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"inputs":[{"type":"address"}],"name":"rewards","stateMutability":"View","type":"Function"},{"inputs":[{"name":"amount","type":"uint256"}],"name":"stake","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"uint40"}],"constant":true,"name":"start","stateMutability":"View","type":"Function"},{"outputs":[{"type":"address"}],"constant":true,"name":"token","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"name":"totalSupply","stateMutability":"View","type":"Function"},{"outputs":[{"type":"address"}],"constant":true,"name":"ume","stateMutability":"View","type":"Function"},{"inputs":[{"name":"amount","type":"uint256"}],"name":"withdraw","stateMutability":"Nonpayable","type":"Function"},{"inputs":[{"name":"amount","type":"uint256"}],"name":"withdraws","stateMutability":"Nonpayable","type":"Function"}];

    const ABI_POOLS = [{"outputs":[{"name":"matches","type":"uint256"},{"name":"pool","type":"address[]"},{"name":"token","type":"address[]"},{"name":"params","type":"uint256[]"}],"constant":true,"inputs":[{"name":"member","type":"address"},{"name":"start","type":"uint256"},{"name":"limit","type":"uint256"},{"name":"active","type":"bool"}],"name":"get","stateMutability":"View","type":"Function"}];

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
                staking: 'active',
                search: ''
            },
            swap: {
                stake: 0,
                amount: 0
            },
            staking: [],
            now: Math.floor(Date.now() / 1000)
        },
        mounted() {
            Object.assign(this, JSON.parse(this.$el.getAttribute('data')));
        },
        watch: {
            'tron.account'() {
                if(/^login/.test(this.visible.modal)) {
                    this.visible.modal = '';
                }

                fetch('https://uswap.me/api/v0/tokens/').then(r => r.json()).then(r => {
                    this.tokens = r.data.map(v => { v.balance = 0; return v; });

                    fetch('https://uswap.me/api/v0/pairs/').then(r => r.json()).then(r => {
                        this.pairs = r.data;

                        this.upBalance();
                        this.upStakingList();
                    });
                });
            }
        },
        computed: {
            stakingList() {
                let s = this.visible.search.trim().toLowerCase();
                return this.staking.filter(v => {
                    return ((this.visible.staking == 'active' && this.now < v.start + v.duration)
                        || (this.visible.staking == 'ended' && this.now > v.start + v.duration)
                        || (this.visible.staking == 'my' && v.balance > 0)
                        || (this.visible.staking == 'soon' && this.now < v.start)) && (!s || v.from.indexOf(s) >= 0 || v.to.indexOf(s) >= 0);
                });
            },
            stakingBalances() {
                let balances = {
                    ume: this.staking.reduce((s, v) => s + v.earned, 0)
                };

                this.staking.forEach(v => {
                    if(v.balance > 0) {
                        balances[v.from] = (parseFloat(balances[v.from]) || 0) + v.from_staked * (v.balance / v.token_supply);
                        if(v.to) balances[v.to] = (parseFloat(balances[v.to]) || 0) + v.to_staked * (v.balance / v.token_supply);
                    }
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
                });
            },
            upStakingList(upstake = null) {
                if(!this.tron.account) return;

                this.getTronWeb().then(tronWeb => {
                    this.getContract(this.route, ABI_POOLS).then(contract => {
                        this.staking = [];
                        let err_count = 0,
                            need_withdraw = false;

                        const fn = (offset, limit) => {
                            contract.get(this.tron.account, offset, limit, false).call().then(res => {
                                for(let i = 0; i < res.matches; i++) {
                                    let p = i * 11,
                                        pair = this.pairByAddress(tronWeb.address.fromHex(res.token[i])),
                                        ume = this.tokenBySymbol('ume'),
                                        token = !pair ? this.tokenByAddr(tronWeb.address.fromHex(res.token[i])) : ume,
                                        token0 = pair ? this.tokenBySymbol(pair.from) : null,
                                        token1 = pair ? this.tokenBySymbol(pair.to) : null;

                                    this.staking.push({
                                        contract: tronWeb.address.fromHex(res.pool[i]),
                                        token: tronWeb.address.fromHex(res.token[i]),
                                        from: pair ? pair.from : token.symbol,
                                        to: pair ? pair.to : '',
                                        total_earned: res.params[p + 4] / (10 ** ume.decimals),
                                        start: parseInt(res.params[p + 7]),
                                        duration: parseInt(res.params[p + 8]),
                                        total_supply: res.params[p + 6] / (10 ** token.decimals),
                                        ume_supply: res.params[p + 5] / (10 ** ume.decimals),
                                        from_staked: pair ? res.params[p + 1] / (10 ** token0.decimals) : res.params[p + 1] / (10 ** token.decimals),
                                        to_staked: pair ? res.params[p + 2] / (10 ** token1.decimals) : 0,
                                        balance: res.params[p + 9] / (10 ** token.decimals),
                                        token_balance: res.params[p + 3] / (10 ** token.decimals),
                                        token_supply: res.params[p] / (10 ** token.decimals),
                                        earned: res.params[p + 10]  / (10 ** ume.decimals),
                                        apy: 0
                                    });

                                    let stake = this.staking[this.staking.length - 1];

                                    if(this.now < stake.start + stake.duration) {
                                        let yapy = stake.total_earned / stake.duration * 31526000 * 100,
                                            sapy = stake.total_supply / stake.token_supply;

                                        if(stake.from == 'trx' || stake.to == 'trx') stake.apy = yapy * this.rateBySymbol('ume') / (stake[stake.from == 'trx' ? 'from_staked' : 'to_staked'] * 2 * sapy);
                                        else if(stake.from == 'ume' || stake.to == 'ume') stake.apy = yapy / (stake[stake.from == 'ume' ? 'from_staked' : 'to_staked'] * (stake.to ? 2 * sapy : 1));
                                        else stake.apy = yapy / (this.rateBySymbol(stake.from) / this.rateBySymbol('ume')) / (stake.from_staked * (stake.to ? 2 : 1) * sapy);
                                    }
                                    else if(stake.balance > 0) need_withdraw = true;
                                }
                                
                                if(res.matches < limit) {
                                    this.staking.sort((a, b) => a.apy < b.apy ? 1 : -1);
                                    if(need_withdraw) this.notice('You have unwithdrawn staked liquidity in the completed pools. Please withdraw it.', 'warning');
                                }
                                else fn(offset + limit, limit);
                            }, e => {
                                if(err_count++ < 10) fn(offset, limit);
                                else this.notice('Error: ' + e, 'error');
                            });
                        };

                        fn(0, 8);
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

                let decimals = !this.pairByAddress(stake.token) ? this.tokenByAddr(stake.token).decimals : 8;
                let amount = '0x' + Math.floor(this.swap.amount * (10 ** decimals)).toString(16);

                this.getContract(stake.contract).then(contract => {
                    let not = this.sendTxNotice();

                    this.infApproveIfNeed(stake.token, stake.contract, amount).then(() => {
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
                            this.visible.staking = 'active';
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
(function() {
    'use strict';

    const ABI = [{"inputs":[{"name":"_dist","type":"address"},{"name":"_token","type":"address"},{"name":"_start","type":"uint40"},{"name":"_duration_days","type":"uint40"}],"stateMutability":"Nonpayable","type":"Constructor"},{"inputs":[{"name":"amount","type":"uint256"}],"name":"Repayment","type":"Event"},{"inputs":[{"indexed":true,"name":"user","type":"address"},{"name":"reward","type":"uint256"}],"name":"Reward","type":"Event"},{"inputs":[{"indexed":true,"name":"member","type":"address"},{"name":"amount","type":"uint256"}],"name":"Stake","type":"Event"},{"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"Transfer","type":"Event"},{"inputs":[{"indexed":true,"name":"member","type":"address"},{"indexed":true,"name":"vote","type":"address"},{"name":"amount","type":"uint256"}],"name":"Voted","type":"Event"},{"inputs":[{"indexed":true,"name":"member","type":"address"},{"name":"amount","type":"uint256"}],"name":"Withdraw","type":"Event"},{"outputs":[{"type":"uint256"}],"constant":true,"inputs":[{"type":"address"}],"name":"balanceOf","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"name":"calcRate","stateMutability":"View","type":"Function"},{"outputs":[{"type":"address"}],"constant":true,"name":"dist","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"name":"distribution","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint40"}],"constant":true,"name":"duration","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"inputs":[{"name":"member","type":"address"}],"name":"earned","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint40"}],"constant":true,"name":"finish","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"name":"last_rate","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint40"}],"constant":true,"name":"last_update","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"inputs":[{"type":"address"}],"name":"paids","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"name":"rate","stateMutability":"View","type":"Function"},{"outputs":[{"type":"address"}],"constant":true,"name":"regulator","stateMutability":"View","type":"Function"},{"inputs":[{"name":"amount","type":"uint256"}],"name":"repayment","stateMutability":"Nonpayable","type":"Function"},{"inputs":[{"name":"_token","type":"address"},{"name":"to","type":"address"},{"name":"amount","type":"uint256"}],"name":"rescue","stateMutability":"Nonpayable","type":"Function"},{"name":"reward","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"inputs":[{"type":"address"}],"name":"rewards","stateMutability":"View","type":"Function"},{"inputs":[{"name":"amount","type":"uint256"},{"name":"_vote","type":"address"}],"name":"stake","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"uint40"}],"constant":true,"name":"start","stateMutability":"View","type":"Function"},{"outputs":[{"type":"address"}],"constant":true,"name":"token","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"name":"totalSupply","stateMutability":"View","type":"Function"},{"outputs":[{"name":"to","type":"address"},{"name":"amount","type":"uint256"}],"constant":true,"inputs":[{"name":"member","type":"address"}],"name":"voteOf","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"inputs":[{"type":"address"}],"name":"vote_amounts","stateMutability":"View","type":"Function"},{"outputs":[{"name":"to","type":"address"},{"name":"amount","type":"uint256"}],"constant":true,"inputs":[{"type":"address"}],"name":"votes","stateMutability":"View","type":"Function"},{"outputs":[{"name":"results","type":"uint256[]"}],"constant":true,"inputs":[{"name":"addrs","type":"address[]"}],"name":"votingResults","stateMutability":"View","type":"Function"},{"inputs":[{"name":"amount","type":"uint256"}],"name":"withdraw","stateMutability":"Nonpayable","type":"Function"},{"inputs":[{"name":"amount","type":"uint256"}],"name":"withdraws","stateMutability":"Nonpayable","type":"Function"}];

    const ABI_POOLS = [{"inputs":[{"indexed":true,"name":"pool","type":"address"},{"indexed":true,"name":"index","type":"uint256"}],"name":"Add","type":"Event"},{"inputs":[{"indexed":true,"name":"pool","type":"address"},{"indexed":true,"name":"index","type":"uint256"}],"name":"Remove","type":"Event"},{"inputs":[{"name":"pool","type":"address"}],"name":"add","stateMutability":"Nonpayable","type":"Function"},{"inputs":[{"name":"spender","type":"address"}],"name":"allow","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"name":"count","stateMutability":"View","type":"Function"},{"inputs":[{"name":"spender","type":"address"}],"name":"deny","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"name":"matches","type":"uint256"},{"name":"info","type":"address[]"},{"name":"params","type":"uint256[]"}],"constant":true,"inputs":[{"name":"member","type":"address"},{"name":"start","type":"uint256"},{"name":"limit","type":"uint256"},{"name":"status","type":"uint8"}],"name":"get","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint256"}],"constant":true,"inputs":[{"type":"address"}],"name":"pools_by_addr","stateMutability":"View","type":"Function"},{"outputs":[{"type":"address"}],"constant":true,"inputs":[{"type":"uint256"}],"name":"pools_by_index","stateMutability":"View","type":"Function"},{"outputs":[{"type":"address"}],"constant":true,"name":"regulator","stateMutability":"View","type":"Function"},{"inputs":[{"name":"pool","type":"address"}],"name":"remove","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"bool"}],"constant":true,"inputs":[{"type":"address"}],"name":"whitelist","stateMutability":"View","type":"Function"}];

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
                search: ''
            },
            swap: {
                stake: 0,
                amount: 0,
                vote: null
            },
            votes: {
                'TLEWNetfj4XfRKzkoWwctJMdCZayjxhWtY': {
                    title: 'Vote for your favorite token?',
                    options: {
                        'T9yD14Nj9j7xAB4dbGeiX9h8unkKLxmGkn': 'BRG',
                        'T9yD14Nj9j7xAB4dbGeiX9h8unkKT76qbH': 'DICE',
                        'T9yD14Nj9j7xAB4dbGeiX9h8unkKawPyGg': 'LIVE',
                        'T9yD14Nj9j7xAB4dbGeiX9h8unkKi6mJHp': 'BNKR'
                    }
                },
                'TW6N5qtq5DTYKPsoe5rxGJakuTXi1kNizy': {
                    title: 'Vote to freeze UME and EFT in staking',
                    options: {
                        'T9yD14Nj9j7xAB4dbGeiX9h8unkKLxmGkn': 'Disable Freeze',
                        'T9yD14Nj9j7xAB4dbGeiX9h8unkKT76qbH': 'Reduce Freeze to 10%',
                        'T9yD14Nj9j7xAB4dbGeiX9h8unkKawPyGg': 'Reduce Freeze to 20%',
                        'T9yD14Nj9j7xAB4dbGeiX9h8unkKi6mJHp': 'Leave Freeze at 30%',
                        'T9yD14Nj9j7xAB4dbGeiX9h8unkKsN8FyA': 'Increase freezing up to 40%'
                    }
                },
                'TFec9Uu22rjhvdi6NskxihbcmmVpuSeGEH': {
                    title: 'Which token do you want to see listed on Uswap with UME liquidity farming pool?',
                    options: {
                        'T9yD14Nj9j7xAB4dbGeiX9h8unkKLxmGkn': 'UP',
                        'T9yD14Nj9j7xAB4dbGeiX9h8unkKT76qbH': 'SEED',
                        'T9yD14Nj9j7xAB4dbGeiX9h8unkKawPyGg': '888',
                        'T9yD14Nj9j7xAB4dbGeiX9h8unkKi6mJHp': 'LIVE',
                        'T9yD14Nj9j7xAB4dbGeiX9h8unkKsN8FyA': 'BNKR'
                    }
                },
                'TE8BfY4NoYrDN2jym4x5QEjxtfqExzmA9v': {
                    title: 'Uswap referral program - commission percentage vote',
                    options: {
                        'T9yD14Nj9j7xAB4dbGeiX9h8unkKLxmGkn': 'Keep at 15%',
                        'T9yD14Nj9j7xAB4dbGeiX9h8unkKT76qbH': 'Reduce to 10%',
                        'T9yD14Nj9j7xAB4dbGeiX9h8unkKawPyGg': 'Reduce to 5%',
                        'T9yD14Nj9j7xAB4dbGeiX9h8unkKi6mJHp': 'Remove completely'
                    }
                },
                'TSrRD9z6piAmgBLeHZLjghp8ve3XmipxbN': {
                    title: 'In what currency to conduct IFO?',
                    options: {
                        'T9yD14Nj9j7xAB4dbGeiX9h8unkKLxmGkn': 'TRX',
                        'T9yD14Nj9j7xAB4dbGeiX9h8unkKT76qbH': 'UME',
                        'T9yD14Nj9j7xAB4dbGeiX9h8unkKawPyGg': 'LP TRX / UME',
                        'T9yD14Nj9j7xAB4dbGeiX9h8unkKi6mJHp': 'USDT'
                    }
                }
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

                fetch('/api/v0/tokens/').then(r => r.json()).then(r => {
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
                    return (!s || ((this.votes[v.contract] || {}).title || '').toLowerCase().indexOf(s) >= 0);
                });
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
                        contract.count().call().then(count => {
                            count = parseInt(count);

                            this.staking = [];
                            let err_count = 0,
                                need_withdraw = false;

                            const fn = (offset, limit) => {
                                contract.get(this.tron.account, offset, limit, ['all', 'actual', 'active', 'my', 'soon', 'ended'].indexOf(this.visible.staking)).call().then(res => {
                                    for(let i = 0; i < res.matches; i++) {
                                        let pi = i * 3, 
                                            p = i * 11,
                                            pair = this.pairByAddress(tronWeb.address.fromHex(res.info[pi + 1])),
                                            dist = this.tokenByAddr(tronWeb.address.fromHex(res.info[pi + 2])),
                                            token = !pair ? this.tokenByAddr(tronWeb.address.fromHex(res.info[pi + 1])) : dist,
                                            token0 = pair ? this.tokenBySymbol(pair.from) : null,
                                            token1 = pair ? this.tokenBySymbol(pair.to) : null;

                                        this.staking.push({
                                            dist: dist.symbol,
                                            contract: tronWeb.address.fromHex(res.info[pi]),
                                            token: tronWeb.address.fromHex(res.info[pi + 1]),
                                            from: pair ? pair.from : token.symbol,
                                            to: pair ? pair.to : '',
                                            total_earned: res.params[p + 4] / (10 ** dist.decimals),
                                            start: parseInt(res.params[p + 7]),
                                            duration: parseInt(res.params[p + 8]),
                                            total_supply: res.params[p + 6] / (10 ** token.decimals),
                                            dist_supply: res.params[p + 5] / (10 ** dist.decimals),
                                            from_staked: pair ? res.params[p + 1] / (10 ** token0.decimals) : res.params[p + 1] / (10 ** token.decimals),
                                            to_staked: pair ? res.params[p + 2] / (10 ** token1.decimals) : 0,
                                            balance: res.params[p + 9] / (10 ** token.decimals),
                                            token_balance: res.params[p + 3] / (10 ** token.decimals),
                                            token_supply: res.params[p] / (10 ** token.decimals),
                                            earned: res.params[p + 10]  / (10 ** dist.decimals),
                                            apy: 0,
                                            options: [],
                                            vote_amount: 0,
                                            vote_address: '',
                                            show_more: false
                                        });

                                        let stake = this.staking[this.staking.length - 1];

                                        if(this.now < stake.start + stake.duration) {
                                            let yapy = stake.total_earned / stake.duration * 31526000 * 100,
                                                sapy = stake.total_supply / stake.token_supply;

                                            if(stake.from == 'trx' || stake.to == 'trx') stake.apy = yapy * this.rateBySymbol(dist.symbol) / (stake[stake.from == 'trx' ? 'from_staked' : 'to_staked'] * 2 * sapy);
                                            else if(stake.from == dist.symbol || stake.to == dist.symbol) stake.apy = yapy / (stake[stake.from == dist.symbol ? 'from_staked' : 'to_staked'] * (stake.to ? 2 * sapy : 1));
                                            else stake.apy = yapy / (this.rateBySymbol(stake.from) / this.rateBySymbol(dist.symbol)) / (stake.from_staked * (stake.to ? 2 : 1) * sapy);
                                        }
                                        else if(stake.balance > 0) need_withdraw = true;
                                    }
                                    
                                    if(offset + limit >= count) {
                                        //this.staking.sort((a, b) => a.apy < b.apy ? 1 : -1);
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
                });
            },
            upStake(stake) {
                this.getContract(stake.contract).then(contract => {
                    contract.votingResults(Object.keys(this.votes[stake.contract].options)).call().then(res => {
                        stake.options = res.results.map(v => parseInt(v));
                    });

                    contract.voteOf(this.tron.account).call().then(res => {
                        stake.vote_amount = parseInt(res.amount);
                        stake.vote_address = tronWeb.address.fromHex(res.to);
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
                        contract.stake(amount, this.swap.vote).send({feeLimit: 50000000}).then(tx => {
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
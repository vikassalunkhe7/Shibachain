(function() {
    'use strict';

    const ABI_TRC20 = [{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}];

    new Vue({
        mixins: [Components.VueTRON, Components.Notices, Components.Helper],
        el: '#App',
        data: {
            tokens: [],
            rates: {},
            visible: {
                modal: '',
                menu: false,
                search: ''
            }
        },
        mounted() {
            Object.assign(this, JSON.parse(this.$el.getAttribute('data')));

            fetch('/api/v0/rates/').then(r => r.json()).then(r => {
                this.rates = r.data;
            });
        },
        watch: {
            'tron.account'() {
                if(/^login/.test(this.visible.modal)) {
                    this.visible.modal = '';
                }

                this.upBalance();
            }
        },
        methods: {
            upBalance() {
                this.getTronWeb().then(tronWeb => {
                    let fn = i => {
                        if(i >= this.tokens.length) return;

                        let token = this.tokens[i];

                        if(token.address) {
                            tronWeb.contract(ABI_TRC20, token.address).balanceOf(this.tron.account).call().then(res => {
                                token.balance = res / 10 ** token.decimals;
                                fn(i + 1);
                            }); 
                        }
                        else {
                            tronWeb.trx.getBalance(this.tron.account).then(balance => {
                                token.balance = balance / 1e6;
                                fn(i + 1);
                            });
                        }
                    };

                    fn(0);
                });
            },
        }
    });
})();
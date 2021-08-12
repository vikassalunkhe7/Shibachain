(function() {
    'use strict';

    const ABI = [{"inputs":[{"indexed":true,"name":"member","type":"address"},{"name":"value","type":"uint8"}],"name":"SetGlobal","type":"Event"},{"inputs":[{"indexed":true,"name":"member","type":"address"},{"indexed":true,"name":"partner","type":"address"},{"name":"value","type":"uint8"}],"name":"SetPartner","type":"Event"},{"inputs":[{"indexed":true,"name":"member","type":"address"},{"indexed":true,"name":"project","type":"address"},{"name":"value","type":"uint8"}],"name":"SetProject","type":"Event"},{"inputs":[{"indexed":true,"name":"partner","type":"address"},{"indexed":true,"name":"upline","type":"address"}],"name":"Upline","type":"Event"},{"outputs":[{"name":"upline","type":"address"},{"name":"value","type":"uint8"}],"constant":true,"inputs":[{"name":"project","type":"address"},{"name":"partner","type":"address"}],"name":"get","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint8"}],"constant":true,"inputs":[{"type":"address"}],"name":"global","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint8"}],"constant":true,"inputs":[{"type":"address"},{"type":"address"}],"name":"partners","stateMutability":"View","type":"Function"},{"outputs":[{"type":"uint8"}],"constant":true,"inputs":[{"type":"address"},{"type":"address"}],"name":"projects","stateMutability":"View","type":"Function"},{"inputs":[{"name":"upline","type":"address"}],"name":"register","stateMutability":"Nonpayable","type":"Function"},{"inputs":[{"name":"value","type":"uint8"}],"name":"setGlobal","stateMutability":"Nonpayable","type":"Function"},{"inputs":[{"name":"partner","type":"address"},{"name":"value","type":"uint8"}],"name":"setPartner","stateMutability":"Nonpayable","type":"Function"},{"inputs":[{"name":"project","type":"address"},{"name":"value","type":"uint8"}],"name":"setProject","stateMutability":"Nonpayable","type":"Function"},{"outputs":[{"type":"address"}],"constant":true,"inputs":[{"type":"address"}],"name":"uplines","stateMutability":"View","type":"Function"}];

    let contract;

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
                    event.value = Math.round(Math.min(width, Math.max(e.clientX - offset, 0)) / width * 101);
                    el.dispatchEvent(event);

                    e.preventDefault();
                },
                up = e => {
                    let event = document.createEvent("HTMLEvents"); 

                    event.initEvent('change', false, true);
                    el.dispatchEvent(event);

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
            contract: '',
            ref: '',
            visible: {
                modal: '',
                menu: false
            },
            user: {
                upline: '',
                global: 101,
                project: 0,
                project_address: '',
                partner: 0,
                partner_address: ''
            }
        },
        mounted() {
            Object.assign(this, JSON.parse(this.$el.getAttribute('data')));
        },
        watch: {
            'tron.auth'() {
                this.getTronWeb().then(tronWeb => {
                    contract = tronWeb.contract(ABI, this.contract);

                    this.update();
                });
            },
            'tron.account'() {
                if(/^login/.test(this.visible.modal)) {
                    this.visible.modal = '';
                }

                if(contract) this.update();
            }
        },
        methods: {
            update() {
                if(!this.tron.account) return;

                this.getTronWeb().then(tronWeb => {
                    contract.uplines(this.tron.account).call().then(res => {
                        this.user.upline = tronWeb.address.fromHex(res);
                        if(this.user.upline == 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb') this.user.upline = '';
                    });

                    contract.global(this.tron.account).call().then(res => {
                        this.user.global = parseInt(res);
                        if(this.user.global == 0) this.user.global = 101;
                    });
                });
            },
            upProjectAddress(address) {
                if(!this.tron.account) return;

                if(/^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(address)) {
                    this.user.project_address = address;

                    this.getTronWeb().then(tronWeb => {
                        contract.projects(this.tron.account, this.user.project_address).call().then(res => {
                            this.user.project = parseInt(res);
                        });
                    });
                }
                else this.user.project_address = '';
            },
            upPartnerAddress(address) {
                if(!this.tron.account) return;

                if(/^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(address)) {
                    this.user.partner_address = address;

                    this.getTronWeb().then(tronWeb => {
                        contract.partners(this.tron.account, this.user.partner_address).call().then(res => {
                            this.user.partner = parseInt(res);
                        });
                    });
                }
                else this.user.partner_address = '';
            },
            register() {
                if(!this.ref || !contract) return;

                let not = this.sendTxNotice();

                contract.register(this.ref).send({feeLimit: 50000000}).then(tx => {
                    not.sent(tx);

                    setTimeout(this.update, 5000);

                    this.awaitTx(tx).then(res => {
                        if(res.receipt.result == 'SUCCESS') {
                            not.success(tx);
                            this.update();
                        }
                        else not.error(res.receipt.result);
                    });
                }, not.cancel);
            },
            setGlobal() {
                if(!contract) return;

                let not = this.sendTxNotice();

                contract.setGlobal(this.user.global).send({feeLimit: 50000000}).then(tx => {
                    not.sent(tx);

                    setTimeout(this.update, 5000);

                    this.awaitTx(tx).then(res => {
                        if(res.receipt.result == 'SUCCESS') {
                            not.success(tx);
                            this.update();
                        }
                        else not.error(res.receipt.result);
                    });
                }, e => {
                    this.update();
                    not.cancel(e);
                });
            },
            setProject() {
                if(!contract) return;

                let not = this.sendTxNotice();

                contract.setProject(this.user.project_address, this.user.project).send({feeLimit: 50000000}).then(tx => {
                    not.sent(tx);

                    setTimeout(() => { this.upProjectAddress(this.user.project_address); }, 5000);

                    this.awaitTx(tx).then(res => {
                        if(res.receipt.result == 'SUCCESS') {
                            not.success(tx);
                            this.upProjectAddress(this.user.project_address);
                        }
                        else not.error(res.receipt.result);
                    });
                }, e => {
                    this.upProjectAddress(this.user.project_address);
                    not.cancel(e);
                });
            },
            setPartner() {
                if(!contract) return;

                let not = this.sendTxNotice();

                contract.setPartner(this.user.partner_address, this.user.partner).send({feeLimit: 50000000}).then(tx => {
                    not.sent(tx);

                    setTimeout(() => { this.upPartnerAddress(this.user.partner_address); }, 5000);

                    this.awaitTx(tx).then(res => {
                        if(res.receipt.result == 'SUCCESS') {
                            not.success(tx);
                            this.upPartnerAddress(this.user.partner_address);
                        }
                        else not.error(res.receipt.result);
                    });
                }, e => {
                    this.upPartnerAddress(this.user.partner_address);
                    not.cancel(e);
                });
            }
        }
    });
})();
(function() {
    'use strict';

    window.Components = {};

    window.Components.VueTRON = {
        data() {
            return {
                tron: { 
                    tronWeb: false,
                    auth: false,
                    account: ''
                }
            };
        },
        created() {
            let self = this,
                tries = 0,
                debug = location.href.match(/debug=(T[1-9A-HJ-NP-Za-km-z]{33})/);

            setTimeout(function initTimer() {
                if(!window.tronWeb) return ++tries < 50 ? setTimeout(initTimer, 100) : null;

                self.tron.tronWeb = !!window.tronWeb;

                window.tronWeb.on('addressChanged', function() {
                    self.tron.account = debug ? debug[1] : window.tronWeb.defaultAddress.base58;
                });

                setTimeout(function chechAuth() {
                    self.tron.auth = window.tronWeb && window.tronWeb.ready;
                    if(!self.tron.auth) setTimeout(chechAuth, 200);
                    else self.tron.account = debug ? debug[1] : window.tronWeb.defaultAddress.base58;
                }, 200);
            }, 100);
        },
        methods: {
            getTronWeb() {
                return new Promise((resolve, reject) => {
                    window.tronWeb ? resolve(window.tronWeb) : reject('TronWeb not found');
                });
            },
            awaitTx(tx) {
                return new Promise((resolve, reject) => {
                    this.getTronWeb().then(tronWeb => {
                        let i = 0;
                        (function chech() {
                            tronWeb.trx.getTransactionInfo(tx).then(res => {
                                res && ('id' in res) ? resolve(res) : (i++ < 300 ? setTimeout(chech, 1000) : reject(new Error('Transaction not found')));
                            }, reject);
                        })();
                    }, reject);
                });
            }
        }
    };

    window.Components.Notices = {
        data() {
            return {
                notices: []
            };
        },
        methods: {
            notice(text, type, params = {}) {
                let wrap = {
                    text: text,
                    type: type,
                    link: params.link || '',
                    link_label: params.link_label || '',
                    status: params.status || '',
                    close: (timeout) => { let i = this.notices.indexOf(wrap); if(i >= 0) timeout > 0 ? setTimeout(() => { wrap.close(0); }, timeout) : this.notices.splice(i, 1); }
                };

                this.notices.push(wrap);

                if(!('timeout' in params) || params.timeout > 0) setTimeout(wrap.close, params.timeout || 5000);

                return wrap;
            },
            sendTxNotice() {
                let not = this.notice('Confirm sending the transaction', 'warning', {timeout: 0});

                return {
                    sent(tx) {
                        not.type = 'warning';
                        not.text = 'The transaction was successfully sent. Waiting for confirmation.';
                        not.status = 'Pending..';
                        not.link = 'https://tronscan.org/#/transaction/' + tx;
                        not.link_label = 'View on TronScan';
                    },
                    success(tx) {
                        not.type = 'success';
                        not.text = 'Transaction confirmed successfully';
                        not.status = 'Confirm';
                        not.link = 'https://tronscan.org/#/transaction/' + tx;
                        not.link_label = 'View on TronScan';
                        not.close(10000);
                    },
                    error(msg) {
                        not.type = 'error';
                        not.status = 'Error';
                        not.text = 'Error sending transaction' + (msg ? ' (' + msg + ')' : '');
                    },
                    cancel() {
                        not.type = 'error';
                        not.text = 'Cancel sending a transaction';
                        not.close(5000);
                    }
                };
            }
        }
    };

    window.Components.Helper = {
        methods: {
            round(value, exp = 2) {
                value = parseFloat(value);
                value = isNaN(value) || !isFinite(value) ? 0 : value;

                return exp > 0 ? value.toFixed(exp).replace(/(\.)?0+$/, '') : parseInt(value);
            },
            copyText(value) {
                let s = document.createElement('input');
                s.value = value;
                document.body.appendChild(s);

                if(navigator.userAgent.match(/ipad|ipod|iphone/i)) {
                    s.contentEditable = true;
                    s.readOnly = false;
                    let range = document.createRange();
                    range.selectNodeContents(s);
                    let sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                    s.setSelectionRange(0, 999999);
                }
                else s.select();

                try { document.execCommand('copy'); }
                catch (err) { }

                s.remove();
            },
            uploadFile(accept) {
                return new Promise((resolve, reject) => {
                    let inp = document.createElement('input');

                    inp.type = 'file';
                    inp.accept = accept || '*';
                    inp.style = 'display:none';

                    inp.addEventListener('change', () => {
                        for(let i = 0; i < inp.files.length; i++) {
                            let form = new FormData();
                            form.append('file', inp.files[i]);

                            fetch('/upload/', {method: 'POST', body: form})
                                .then(res => res.json())
                                .then(res => { res.error ? reject(res.error) : resolve(res.file); })
                                .catch(reject);
                        }
                    }, false);

                    document.querySelector('body').appendChild(inp);

                    inp.click();
                    inp.remove();
                });
            },
            infApproveIfNeed(token_address, spender, min_amount) {
                return new Promise((resolve, reject) => {
                    if(!token_address || !min_amount) return resolve();

                    this.getTronWeb().then(tronWeb => {
                        tronWeb.transactionBuilder.triggerConstantContract(token_address, 'allowance(address,address)', {}, [{type: 'address', value: this.tron.account}, {type: 'address', value: spender}], this.tron.account).then(res => {
                            let allowance = tronWeb.toDecimal('0x' + res.constant_result[0]);

                            if(allowance == 0 || allowance < (min_amount || 0)) {
                                tronWeb.transactionBuilder.triggerSmartContract(token_address, 'approve(address,uint256)', {}, [{type: 'address', value: spender}, {type: 'uint256', value: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'}], this.tron.account).then(raw_tx => {
                                    tronWeb.trx.sign(raw_tx.transaction).then(sign => {
                                        tronWeb.trx.sendRawTransaction(sign).then(tx => {
                                            resolve(tx.transaction.txID);
                                        }, reject);
                                    }, reject);
                                }, reject);
                            }
                            else resolve();
                        }, reject);
                    }, reject);
                });
            },
            getReserves(pair_address) {
                return new Promise((resolve, reject) => {
                    this.getTronWeb().then(tronWeb => {
                        tronWeb.transactionBuilder.triggerConstantContract(pair_address, 'getReserves()', {}, [], this.tron.account).then(res => {
                            resolve({
                                reserve0: tronWeb.toDecimal('0x' + res.constant_result[0].substr(0, 64)),
                                reserve1: tronWeb.toDecimal('0x' + res.constant_result[0].substr(64, 64))
                            });
                        }, reject);
                    }, reject);
                });
            },
            balanceOf(token_address, member) {
                return new Promise((resolve, reject) => {
                    this.getTronWeb().then(tronWeb => {
                        tronWeb.transactionBuilder.triggerConstantContract(token_address, 'balanceOf(address)', {}, [{type: 'address', value: member}], this.tron.account).then(res => {
                            resolve('0x' + res.constant_result[0].substr(0, 64));
                        }, reject);
                    }, reject);
                });
            }
        }
    };
})();
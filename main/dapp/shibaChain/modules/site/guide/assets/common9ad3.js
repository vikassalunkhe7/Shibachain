(function() {
    'use strict';

    new Vue({
        mixins: [Components.VueTRON, Components.Notices, Components.Helper],
        el: '#App',
        data: {
            visible: {
                menu: false
            }
        }
    });
})();
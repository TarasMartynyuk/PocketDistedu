// #region require
AccountManager = require('./Backend/AccountManager');

// #endregion

 var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
        // cacheManager = new CacheManager();
        // dateChecker = new DateChecker();
        // dateChecker.update();
        AccountManager.printLP();
        // accountManager.rewriteLoginPassWord("newLogin", "newPassword");
    },

    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

$(function(){
    app.initialize();
    
});


// module.exports.App = app;

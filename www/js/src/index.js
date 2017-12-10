// #region require
var AccountManager = require('./Backend/AccountManager');
var CacheManager = require('./Backend/CacheManager');

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

        CacheManager.initialize();
        // AccountManager.printLP();
        // accountManager.rewriteLoginPassWord("newLogin", "newPassword");
    },
    
};

$(function(){
    app.initialize();
    
});


// module.exports.App = app;

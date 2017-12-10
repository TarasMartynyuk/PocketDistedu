// #region require
var AccountManager = require('./Backend/AccountManager');
var CacheManager = require('./Backend/CacheManager');
var Debug = require("./Backend/Debug");

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
        Debug.init();

        AccountManager.passwordValid(function(s) {

        }, function(error) {
            Debug.lge(error);
        });
    }
    
};

$(function(){
    app.initialize();
    
});


// module.exports.App = app;

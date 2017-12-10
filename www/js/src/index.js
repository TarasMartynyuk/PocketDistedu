// #region require
var AccountManager = require('./Backend/AccountManager');
var CacheManager = require('./Backend/CacheManager');
var PathLookup = require("./Backend/PathLookup");

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
        PathLookup.init();
        // CacheManager.initialize();
        // AccountManager.tryGetLogPassFile( function(file){
        //     console.log("found : " + file);
        // }, function(error) {
        //     console.log(error);
        // });
        // AccountManager.printLP();
        AccountManager.rewriteLoginPassWord("newLogin", "newPassword");
    },
    
};

$(function(){
    app.initialize();
    
});


// module.exports.App = app;

// #region require
var AccountManager = require('./Backend/AccountManager');
var CacheManager = require('./Backend/CacheManager');
var Debug = require("./Backend/Debug");
var DisteduDownloader = require("./Backend/DIsteduDownloader");

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

        //     // DisteduDownloader.getAllCoursesList();
        }, function(error) {
            Debug.lge(error);
        });

        // AccountManager.rewriteLoginPassWord("taras22", "eduKMA22@");
    }
    
};

$(function(){
    app.initialize();
    
});


// module.exports.App = app;

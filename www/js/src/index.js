// #region require
var AccountManager = require('./Backend/AccountManager');
var CacheManager = require('./Backend/CacheManager');
var Debug = require("./Backend/Debug");
var DisteduDownloader = require("./Backend/DIsteduDownloader");
var CourseManager = require("./Backend/CourseManager");

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

        AccountManager.savedPasswordValid(function(logPas) {
            // Debug.lg(logPas.login);
            // Debug.lg(logPas.password);
            CourseManager.coursesSerialized(function () {
                Debug.lg("COURSES DESERIALIZED");
            }, function() {
                Debug.lg("COURSES NOT FOUND");
                // filter all available user's courses
                DisteduDownloader.getAllCoursesList(function(allCourses) {

                });
            });
        }, function(error) {
            Debug.lge(error);
        });
    }
};

$(function(){
    app.initialize();
});
// module.exports.App = app;

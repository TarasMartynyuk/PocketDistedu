// #region require
var AccountManager = require('./Backend/AccountManager');
var CacheManager = require('./Backend/CacheManager');
var Debug = require("./Backend/Debug");
var DisteduDownloader = require("./Backend/DIsteduDownloader");
var AssignmentManager = require("./Backend/AssignmentManager");
var DateParser = require('./Backend/DateParser');

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
        Debug.lg("DEVICEREADY");

        $('#submit').click(function () {
            var login = $('#login').val();
            // Debug.lg(login);

            var password = $('#password').val();
            // Debug.lg(password);

            AccountManager.rewriteLoginPassWord(login, password, function() {
                Debug.lg("successfully wrote logpass to file");
            }, function(error) {
                Debug.lg(error);
            });

        });

        $('#test-file').click(function () {
            AccountManager.savedPasswordValid(function(logPas) {
                // Debug.lg(logPas.login);
                // Debug.lg(logPas.password);
                // AssignmentManager.tryLoadSerializedCourses(function () {
                //     Debug.lg("COURSES DESERIALIZED");
                // }, function(error) {
                //     Debug.lge("COURSES NOT FOUND : ");
                //     Debug.lge(error);
                //     // filter all available user's courses
                //     // DisteduDownloader.getAllCoursesList(function(allCourses) {
                //     //     Debug.lg(allCourses);
                //     // });
                // });
                // AssignmentManager.saveUserCoursesTable();
            
                DisteduDownloader.getCourseAssignments(131, function(){
                }, function(error){
                    Debug.lg(error);
                });
                // var dateObj = DateParser.parseUkrDateStr("понеділок  11 грудня 2017, 23:55");
                // Debug.lg(dateObj);
            }, function(error) {
                Debug.lge(error);
                // Debug.lge("message" + error.message);
            });
        });
    }
};

$(function(){
    app.initialize();
});
module.exports.App = app;

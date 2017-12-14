// #region require
var AccountManager = require('./Backend/AccountManager');
var CacheManager = require('./Backend/CacheManager');
var Debug = require("./Backend/Debug");
var DisteduDownloader = require("./Backend/DIsteduDownloader");
var AssignmentManager = require("./Backend/AssignmentManager");
var DeadlineVCH = require('./Backend/DeadlineValidityChecker');

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

        //TODO: remove later!
        var filteredCourses = [
            { id : 189, 
                course : "JavaScript" 
            },
            { id : 131, 
                course : "Основи комп'ютерних алгоритмів на Java" 
            }
        ];
        $('#test-file').click(function () {
            AccountManager.savedPasswordValid(function(logPas) {
                // Debug.lg(logPas.login);
                // Debug.lg(logPas.password);
                AssignmentManager.tryLoadSerializedCourses(function () {
                    Debug.lg("COURSES DESERIALIZED");
                }, function(error) {
                    console.clear();
                    Debug.lge("COURSES NOT FOUND : ");
                    // Debug.lge(error);
                    // filter all available user's courses
                    AssignmentManager.saveUserAssignmentsArr(filteredCourses, function() {

                    }, function(error){
                        Debug.lg(error);
                    });
                });
                // AssignmentManager.saveUserCoursesTable();
                
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

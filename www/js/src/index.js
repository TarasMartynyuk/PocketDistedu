// #region require
var AccountManager = require('./Backend/AccountManager');
var Debug = require("./Backend/Debug");
var DisteduDownloader = require("./Backend/DIsteduDownloader");
var AssignmentManager = require("./Backend/AssignmentManager");
var AssignmentClass = require('./Backend/data classes/AssignmentClass');
var DeadlineVCH = require('./Backend/DeadlineValidityChecker');
var Dedl = require('./Backend/DeadlineValidityChecker');

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
        var TEST_FILTER_COURSES = [
            { id : 189, 
                course : "JavaScript" 
            },
            { id : 131, 
                course : "Основи комп'ютерних алгоритмів на Java" 
            }
        ];

        $('#test-file').click(function () {

            // Debug.lg(AssignmentClass.AssignmentProto);
            // Debug.lg(new AssignmentClass.Assignment("asdsaddsa"));
            // return;

            // return;
            console.clear();
            
            // Dedl.printDate();
            AccountManager.savedPasswordValid(function(logPas) {
                // console.clear();
                AssignmentManager.tryLoadSerializedAssignments(function () {
                    Debug.lg("COURSES DESERIALIZED");

                    AssignmentManager.update(function(assignmentsData){
                        Debug.lg("Constructed ass data from assignments successfully:");
                        Debug.lg(assignmentsData);
                        AssignmentManager.serializeAssignmentsFromMemory(function(){
                            Debug.lg("success");
                        }, function(error){
                            Debug.lg(error);
                        })

                    }, function(error){
                        // Debug.lge("right place");
                        Debug.lge(error);
                    });
                    // DisteduDownloader.test();
                    // AssignmentManager.markAsCompleted(131, "Практичне 12.1");
                    // AssignmentManager.serializeAssignmentsFromMemory(function () {
                    //     Debug.lg("serializing : ");
                    // }, function(erorr){
                    //     Debug.lge(error);
                    // });
                    // AssignmentManager.saveUserAssignmentsArr(TEST_FILTER_COURSES, function() {
                    //     Debug.lg("serialized : ");
                    //     // Debug.lg();
                        
                    // }, function(error){
                    //     Debug.lg(error);
                    // });

                }, function(error) {
                    Debug.lge("ASSIGNMENTS NOT FOUND : ");
                    Debug.lge(error);
                    // Debug.lge(error);
                    // filter all available user's courses
                    AssignmentManager.saveUserAssignmentsArr(TEST_FILTER_COURSES, function() {
                        Debug.lg("serialized : ");
                        // Debug.lg();
                        
                    }, function(error){
                        Debug.lg(error);
                    });
                });
                
            }, function(error) {
                Debug.lge(error);
            });
        });
    }
};

$(function(){
    app.initialize();
});

module.exports.App = app;

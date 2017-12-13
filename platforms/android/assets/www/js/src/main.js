// #region require
var AccountManager = require('./Backend/AccountManager');
var CacheManager = require('./Backend/CacheManager');
var Debug = require("./Backend/Debug");
var DisteduDownloader = require("./Backend/DIsteduDownloader");

// #endregion



$(function(){
    //This code will execute when the page is ready

    var Index = require('./Frontend/index');
    var Login = require('./Frontend/login');


});

$(window).on('load', function() {
    // alert(window.location.href);
    if (window.location.href == "http://192.168.0.103:3000/") {
        Debug.init();

        // AccountManager.rewriteLoginPassWord('malitska', 'Ba.ndersnatched7105');

        AccountManager.savedPasswordValid(function (logPas) {
            Debug.lg(logPas.login);
            Debug.lg(logPas.password);

            // DisteduDownloader.getAllCoursesList();
        }, function (error) {
            Debug.lge(error);


            window.location.href = './login.html';


        });
    }
});


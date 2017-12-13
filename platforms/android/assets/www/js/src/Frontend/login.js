// #region require
var AccountManager = require('../Backend/AccountManager');
var CacheManager = require('../Backend/CacheManager');
var Debug = require("../Backend/Debug");
var DisteduDownloader = require("../Backend/DIsteduDownloader");

// #endregion
 

$("#input-submit").click(function () {

    validate();
});

function validate() {

    Debug.init();
    var login = $("#input-login").val();
    var password = $("#input-pass").val();

    var logPass = {
        login: login,
        password: password
    };

    AccountManager.passwordValid(logPass, function (data) {

        Debug.lg(data.login);
        Debug.lg(data.password);



        AccountManager.rewriteLoginPassWord(login, password, function(){
            window.location = './index.html';
        }, function(error){
            $(".error-message p").css("display", "block!important");
            $("#input-login").val("");
            $("#input-pass").val("");
            Debug.lge(error);
        });

        // DisteduDownloader.getAllCoursesList();
    }, function (error) {
        //

        $(".error-message p").css("display", "block!important");
        $("#input-login").val("");
        $("#input-pass").val("");
        Debug.lge(error);
    });

}

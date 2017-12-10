(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var  loginPassWordFileName = "loginCredentials.txt";

function rewriteLoginPassWord(newLogin, newPassword) {
    var logPasName = this.loginPassWordFileName;
    window.requestFileSystem(window.PERSISTENT, 5 * 1024, function(fs){
        var logPassDirPath = fs.root
        window.resolveLocalFileSystemURL(PathLookup.cacheRootPath, function(cacheRootDir){
            cacheRootDir.getFile(logPasName, {create : true}, function (file){
                console.log("created : " + file);
                console.log("toURL() : " + file.toURL());
                console.log("fullpath : " + file.fullPath);
                writeToFile(file, new Blob([newLogin + "\n" + newPassword]));
                
            }, onLocalUrlError(logPasName));
        }, onLocalUrlError(PathLookup.cacheRootPath));
    }), function(error){
        console.error(error);
    }
}

function printLP() {
    console.log("LOGINPASS");
}

function getLoginPassword() {
    var loginPassword = {
        login : "admin",
        password : "11111"
    }    
    return loginPassword;
}
    
function writeToFile(fileEntry, dataObj) {
    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function() {
            console.log("Successful file write : " + fileEntry);
        };

        fileWriter.onerror = function (e) {
            console.error("Failed file write: " + fileEntry + "\nerror : " + e.toString());
        };

        fileWriter.write(dataObj);
    });
}

module.exports.rewriteLoginPassWord = rewriteLoginPassWord;
module.exports.printLP = printLP;
},{}],2:[function(require,module,exports){
// #region require
AccountManager = require('./Backend/AccountManager');

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
        // cacheManager = new CacheManager();
        // dateChecker = new DateChecker();
        // dateChecker.update();
        AccountManager.printLP();
        // accountManager.rewriteLoginPassWord("newLogin", "newPassword");
    },

    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

$(function(){
    app.initialize();
    
});


// module.exports.App = app;

},{"./Backend/AccountManager":1}]},{},[2]);

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var loginPassWordFileName = "loginCredentials.txt";
var PathLookup = require('./PathLookup');
var ErrorHandlers = require('./ErrorHandlers');

// successCallback recieves {login, password} as argument
// errorCallback will recieve a string
function passwordValid(successCallback, errorCallback){
    // first check if file exists
    tryGetLogPassFile(function(fileEntry){
        // attempt to read login and password
        fileEntry.file(function (file) {
            var reader = new FileReader();
    
            reader.onloadend = function() {
                PathLookup.lg("Successful file read: " + this.result);
                PathLookup.lg(fileEntry.fullPath + ": " + this.result);
            };
    
            reader.readAsText(file);
    
        }, ErrorHandlers.onErrorReadFile);


    }, errorCallback("login-password file does not exist yet"));
}

function rewriteLoginPassWord(newLogin, newPassword, onFinished) {

    window.requestFileSystem(window.PERSISTENT, 5 * 1024, function(fs){
        var logPassDirPath = fs.root
        window.resolveLocalFileSystemURL(PathLookup.cacheRootPath, function(cacheRootDir){
            cacheRootDir.getFile(loginPassWordFileName, {create : true}, function (file){
                PathLookup.lg("created : " + file);
                PathLookup.lg("toURL() : " + file.toURL());
                PathLookup.lg("fullpath : " + file.fullPath);
                writeToFile(file, new Blob([newLogin + "\n" + newPassword]));
                
            }, ErrorHandlers.onLocalUrlError(loginPassWordFileName));
        }, ErrorHandlers.onLocalUrlError(PathLookup.cacheRootPath));
    }), function(error){
        console.error(error);
    }
}

function getLoginPassword() {
    var loginPassword = {
        login : "admin",
        password : "11111"
    }    
    return loginPassword;
}

//#region helpers
// success recieves file as argument
function tryGetLogPassFile(success, failure){

    window.requestFileSystem(window.PERSISTENT, 5 * 1024, function(fs){
        
        window.resolveLocalFileSystemURL(PathLookup.cacheRootPath, function(cacheRootDir){
            
            cacheRootDir.getFile(loginPassWordFileName, {create : false}, function(file){
                success(file)
            }, function(error) {
                failure(error)
            } );

        }, ErrorHandlers.onLocalUrlError(PathLookup.cacheRootPath));
    }), function(error){
        console.error(error);
    }
}

function writeToFile(fileEntry, dataObj) {
    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function() {
            PathLookup.lg("Successful file write : " + fileEntry);
            PathLookup.lg(dataObj);
        };

        fileWriter.onerror = function (e) {
            console.error("Failed file write: " + fileEntry + "\nerror : " + e.toString());
        };

        fileWriter.write(dataObj);
    });
}
//#endregion

module.exports.rewriteLoginPassWord = rewriteLoginPassWord;
module.exports.printLP = printLP;
module.exports.tryGetLogPassFile = tryGetLogPassFile;

},{"./ErrorHandlers":3,"./PathLookup":4}],2:[function(require,module,exports){
// handles distedu data storage, removal
// and data requests

//#region path vars
var PathLookup = require('./PathLookup');
var ErrorHandlers = require('./ErrorHandlers');

var resourcesDirName = "Resources/";
var assignmentsDirName = "Assignments/";
var weekDirName = "Week/";

var recoursesPath = PathLookup.cacheRootPath + weekDirName + resourcesDirName;
var assignmentsPath = PathLookup.cacheRootPath + weekDirName + assignmentsDirName;

//#endregion
// var dateChecker = new DateChecker();


function initialize() {
    // var test = PathLookup.cacheRootPath + weekDirName ;
    // var test = assignmentsPath ;
    // PathLookup.lg();
    // PathLookup.lg(cordova.file.applicationStorageDirectory);
    // PathLookup.lg(cordova.file);
    
    // log("TEST PASSED");
    // log("TEST PASSED");
    // log("TEST PASSED");
    

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
        
        // log('searching for : applicationStorageDirectory : ' + cordova.file.applicationStorageDirectory);
        window.resolveLocalFileSystemURL(PathLookup.cacheRootPath, function (dir) {
            log("found directory : " + dir.toURL());

            create

            }, function(error) {
                log("NOT found directory : " + "applicationStorageDirectory");
                // createCacheDirs(instance, resourcesDirName, assignmentsDirName);
            },
        function(error) {
            PathLookup.lg(error);
        });
    });

}


//#region helpers
function createCacheDirs(instance, resourcesDirName, assignmentsDirName) {
    PathLookup.lg("createCacheDirs\n\n");
    // PathLookup.lg(PathLookup.PathLookup.cacheRootPath);
    window.resolveLocalFileSystemURL(PathLookup.PathLookup.cacheRootPath, function (rootDir) {
        PathLookup.lg("found directory : " + rootDir.toURL());
        createDirectory(rootDir, weekDirName, function(weekDir){
            PathLookup.lg(weekDir.toURL());
            createDirectory(weekDir, resourcesDirName);
            createDirectory(weekDir, assignmentsDirName);
        });
        
    }, onLocalUrlError(PathLookup.PathLookup.cacheRootPath));
}
// onCreatedCallback recieves created dir as argument
function createDirectory(rootDirEntry, newDirName, onCreatedCallback) {
    onCreatedCallback = onCreatedCallback || function(dirEntry) {
        PathLookup.lg('created dir ' + dirEntry.toURL());
    };
    rootDirEntry.getDirectory(newDirName, { create: true }, onCreatedCallback, ErrorHandlers.onErrorGetDir(newDirName));
}
//#endregion



module.exports.initialize = initialize;









},{"./ErrorHandlers":3,"./PathLookup":4}],3:[function(require,module,exports){
function onLocalUrlError(URL) {
    return function(error) {
        console.error(" error resolving URL: " + URL);
        console.error("returned such error: " + error);
    }
}

function onErrorGetDir(newDirName) {
    return function(error) {
        console.error('Error getting dir ' + newDirName + "\n" + error);
    }
}

function onErrorCreateFile(newFileName) {
    return function(error) {
        console.error('Error creating  file ' + newFileName + "\n" + error);
    }
}

function onErrorReadFile(filename) {
    return function(error) {
        console.error('Error reading  file ' + filename + "\n" + error);
    }
}

module.exports.onLocalUrlError = onLocalUrlError;
module.exports.onErrorGetDir = onErrorGetDir;
module.exports.onErrorCreateFile = onErrorCreateFile;
module.exports.onErrorReadFile = onErrorReadFile;



},{}],4:[function(require,module,exports){
// for testing, place them in root;
function init() {
    var debug = true;
    var cacheRootPath = debug? "filesystem:http://192.168.0.103:3000/persistent/" : cordova.file.dataDirectory;
    var lg = debug? console.log : log;
    var lge = debug? console.error : log;
    
    function log(message) {
        
            logP = document.createElement("p");
            $(logP).text(message);
            $('#console').append(logP);
    }

    function logError(message) {
        
            logP = document.createElement("p");
            $(logP).text(message);
            $(logP).css('color', 'red');
            $('#console').append(logP);
    }

    module.exports.cacheRootPath = cacheRootPath;
    module.exports.lg = lg;
}

module.exports.init = init;


},{}],5:[function(require,module,exports){
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

},{"./Backend/AccountManager":1,"./Backend/CacheManager":2,"./Backend/PathLookup":4}]},{},[5]);

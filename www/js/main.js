(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var  loginPassWordFileName = "loginCredentials.txt";

// successCallback recieves {login, password} as argument
function passwordValid(successCallback, errorCallback){
    
}

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
    // console.log();
    // console.log(cordova.file.applicationStorageDirectory);
    // console.log(cordova.file);
    
    var test = cordova.file.applicationStorageDirectory;
    // log("TEST PASSED");
    // log("TEST PASSED");
    // log("TEST PASSED");
    

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
        
        log('searching for : applicationStorageDirectory : ' + cordova.file.applicationStorageDirectory);
        window.resolveLocalFileSystemURL(cordova.file.applicationStorageDirectory, function (dir) {
            log("found directory : " + dir.toURL());

            createDirectory(dir, "NEWDIR", function(dir){
                log("created dir : " + dir.toURL());
            })

            }, function(error) {
                log("NOT found directory : " + "applicationStorageDirectory");
                // createCacheDirs(instance, resourcesDirName, assignmentsDirName);
            },
        function(error) {
            console.log(error);
        });
    });

    test = cordova.file.externalApplicationStorageDirectory;
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
        
        log('searching for : externalApplicationStorageDirectory : ' + cordova.file.externalApplicationStorageDirectory);
        
        window.resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, function (dir) {
            log("found directory : " + dir.toURL());
            createDirectory(dir, "NEWDIR", function(dir){
                log("created dir : " + dir.toURL());
            })
            }, function(error) {
                log("NOT found directory : " + "externalApplicationStorageDirectory");
                // createCacheDirs(instance, resourcesDirName, assignmentsDirName);
            },
        function(error) {
            console.log(error);
        });
    });

    
    test = cordova.file.dataDirectory;
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {

            log('searching for : dataDirectory : ' + cordova.file.dataDirectory);
        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dir) {
            log("found directory : " + dir.toURL());
            createDirectory(dir, "NEWDIR", function(dir){
                log("created dir : " + dir.toURL());
            })
            
            }, function(error) {
                log("NOT found directory : " + "dataDirectory");
                // createCacheDirs(instance, resourcesDirName, assignmentsDirName);
            },
        function(error) {
            console.log(error);
        });
    });
}

//#region helpers
function createCacheDirs(instance, resourcesDirName, assignmentsDirName) {
    console.log("createCacheDirs\n\n");
    // console.log(PathLookup.PathLookup.cacheRootPath);
    window.resolveLocalFileSystemURL(PathLookup.PathLookup.cacheRootPath, function (rootDir) {
        console.log("found directory : " + rootDir.toURL());
        createDirectory(rootDir, weekDirName, function(weekDir){
            console.log(weekDir.toURL());
            createDirectory(weekDir, resourcesDirName);
            createDirectory(weekDir, assignmentsDirName);
        });
        
    }, onLocalUrlError(PathLookup.PathLookup.cacheRootPath));
}
// onCreatedCallback recieves created dir as argument
function createDirectory(rootDirEntry, newDirName, onCreatedCallback) {
    onCreatedCallback = onCreatedCallback || function(dirEntry) {
        log('created dir ' + dirEntry.toURL());
    };
    rootDirEntry.getDirectory(newDirName, { create: true }, onCreatedCallback, ErrorHandlers.onErrorGetDir(newDirName));
}
//#endregion

function log(message) {

    logP = document.createElement("p");
    $(logP).text(message);
    $('#console').append(logP);
}

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
},{}],4:[function(require,module,exports){
// for testing, place them in root;
var cacheRootPath = "filesystem:http://192.168.0.103:3000/persistent/";

module.exports.cacheRootPath = cacheRootPath;
},{}],5:[function(require,module,exports){
// #region require
var AccountManager = require('./Backend/AccountManager');
var CacheManager = require('./Backend/CacheManager');

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

        CacheManager.initialize();
        // AccountManager.printLP();
        // accountManager.rewriteLoginPassWord("newLogin", "newPassword");
    },
    
};

$(function(){
    app.initialize();
    
});


// module.exports.App = app;

},{"./Backend/AccountManager":1,"./Backend/CacheManager":2}]},{},[5]);

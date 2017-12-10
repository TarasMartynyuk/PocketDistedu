(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var loginPassWordFileName = "loginCredentials.txt";
var logPasBackupName = "loginCredentialsBACKUP.txt";
var Debug = require('./Debug');
var ErrorHandlers = require('./ErrorHandlers');
var loginURL = "http://distedu.ukma.edu.ua/login/index.php";
var savedLogin;
var savedPassword;

// successCallback recieves {login, password} as argument
// errorCallback will recieve a string
function passwordValid(successCallback, errorCallback) {
    // first check if file exists
    getLoginPassword(function(logPas){
        // try to login into distedu
        Debug.lg(logPas.login);
        Debug.lg(logPas.password);
        login = logPas.login + "dasdsadsa";
        password = logPas,password;
        
        tryAuthenticate( function(data) {
            // the server returns login page if the password/name was not valid
                Debug.lg(" POST RESULT : \n\n\n" + $(data).find('title'));
                // Debug.lg(" POST RESULT : \n\n\n" + data);
                
                $.ajax({
                    type : "GET",
                    url : "http://distedu.ukma.edu.ua/mod/resource/index.php?id=131",
                success : function(data) {
                    Debug.lg('success with GET\n\n\n');
                    Debug.lg($(data).find('title'));
                    // Debug.lg(data);
                },
                error : function(err) {
                    Debug.lge(err);
                }
            });
            // Debug.lg("posted");
            // Debug.lg(data);
        }, function (error) {
            Dubug.lge(error);
        });
    }, function(error) {
      errorCallback(error);
    });
}

function rewriteLoginPassWord(newLogin, newPassword, onFinished) {

    window.requestFileSystem(window.PERSISTENT, 5 * 1024, function(fs){
        var logPassDirPath = fs.root
        window.resolveLocalFileSystemURL(Debug.cacheRootPath, function(cacheRootDir){
            cacheRootDir.getFile(loginPassWordFileName, {create : true}, function (file){
                Debug.lg("created : " + file);
                Debug.lg("toURL() : " + file.toURL());
                Debug.lg("fullpath : " + file.fullPath);
                writeToFile(file, new Blob([newLogin + "\n" + newPassword]));
                
            }, ErrorHandlers.onLocalUrlError(loginPassWordFileName));
        }, ErrorHandlers.onLocalUrlError(Debug.cacheRootPath));
    }), function(error){
        console.error(error);
    }
}

// successCallback recieves {login, password} as argument
function getLoginPassword(success, failure) {
    
    tryGetLogPassFile(function(fileEntry){
        // attempt to read login and password
        fileEntry.file(function (file) {
            var reader = new FileReader();
    
            reader.onloadend = function() {
                var contents = this.result.split('\n');

                success({
                    login : contents[0],
                    password : contents[1]
                });
            };
    
            reader.readAsText(file);
    
        }, ErrorHandlers.onErrorReadFile);


    }, function(error) {
        failure("login-password file does not exist yet");
    });
}

//#region helpers
// success recieves file as argument
function tryGetLogPassFile(success, failure){

    failure = failure || ErrorHandlers.onLocalUrlError(Debug.cacheRootPath + loginPassWordFileName);

    window.requestFileSystem(window.PERSISTENT, 5 * 1024, function(fs){
        
        window.resolveLocalFileSystemURL(Debug.cacheRootPath, function(cacheRootDir){
            
            cacheRootDir.getFile(loginPassWordFileName, {create : false}, function(file){
                success(file)
            }, function(error) {
                failure(error)
            } );

        }, ErrorHandlers.onLocalUrlError(Debug.cacheRootPath));
    }), function(error){
        console.error(error);
    }
}

function writeToFile(fileEntry, dataObj) {
    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function() {
            Debug.lg("Successful file write : " + fileEntry);
            Debug.lg(dataObj);
        };

        fileWriter.onerror = function (e) {
            console.error("Failed file write: " + fileEntry + "\nerror : " + e.toString());
        };

        fileWriter.write(dataObj);
    });
}

function tryAuthenticate(success, error) {
    $.ajax({
        type : "POST",
        url : loginURL,

        data : {
            username : savedLogin,
            password : savedPassword,
            testcookies : 1
        },
        success : function(data) {
            success(data);
            Debug.lg("posted");
        },
        error : function(err) {
            Debug.lge(err);
            error(err);
        }
    });

}
//#endregion

module.exports.rewriteLoginPassWord = rewriteLoginPassWord;
module.exports.tryGetLogPassFile = tryGetLogPassFile;
module.exports.passwordValid = passwordValid;

},{"./Debug":3,"./ErrorHandlers":4}],2:[function(require,module,exports){
// handles distedu data storage, removal
// and data requests

//#region path vars
var Debug = require('./Debug');
var ErrorHandlers = require('./ErrorHandlers');

var resourcesDirName = "Resources/";
var assignmentsDirName = "Assignments/";
var weekDirName = "Week/";

var recoursesPath = Debug.cacheRootPath + weekDirName + resourcesDirName;
var assignmentsPath = Debug.cacheRootPath + weekDirName + assignmentsDirName;

//#endregion
// var dateChecker = new DateChecker();


function initialize() {
    // var test = Debug.cacheRootPath + weekDirName ;
    // var test = assignmentsPath ;
    // Debug.lg();
    // Debug.lg(cordova.file.applicationStorageDirectory);
    // Debug.lg(cordova.file);
    
    // log("TEST PASSED");
    // log("TEST PASSED");
    // log("TEST PASSED");
    

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
        
        // log('searching for : applicationStorageDirectory : ' + cordova.file.applicationStorageDirectory);
        window.resolveLocalFileSystemURL(Debug.cacheRootPath, function (dir) {
            log("found directory : " + dir.toURL());

            create

            }, function(error) {
                log("NOT found directory : " + "applicationStorageDirectory");
                // createCacheDirs(instance, resourcesDirName, assignmentsDirName);
            },
        function(error) {
            Debug.lg(error);
        });
    });

}


//#region helpers
function createCacheDirs(instance, resourcesDirName, assignmentsDirName) {
    Debug.lg("createCacheDirs\n\n");
    // Debug.lg(Debug.Debug.cacheRootPath);
    window.resolveLocalFileSystemURL(Debug.Debug.cacheRootPath, function (rootDir) {
        Debug.lg("found directory : " + rootDir.toURL());
        createDirectory(rootDir, weekDirName, function(weekDir){
            Debug.lg(weekDir.toURL());
            createDirectory(weekDir, resourcesDirName);
            createDirectory(weekDir, assignmentsDirName);
        });
        
    }, onLocalUrlError(Debug.Debug.cacheRootPath));
}
// onCreatedCallback recieves created dir as argument
function createDirectory(rootDirEntry, newDirName, onCreatedCallback) {
    onCreatedCallback = onCreatedCallback || function(dirEntry) {
        Debug.lg('created dir ' + dirEntry.toURL());
    };
    rootDirEntry.getDirectory(newDirName, { create: true }, onCreatedCallback, ErrorHandlers.onErrorGetDir(newDirName));
}
//#endregion



module.exports.initialize = initialize;









},{"./Debug":3,"./ErrorHandlers":4}],3:[function(require,module,exports){
// for testing, place them in root;
function init() {
    var debug = true; // when in browser, that is
    var cacheRootPath = debug? "filesystem:http://192.168.0.103:3000/persistent/" : cordova.file.dataDirectory;
    var lg = debug? console.log : log;
    var lge = debug? console.error : logError;
    
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
    module.exports.lge = lge;    
}

module.exports.init = init;


},{}],4:[function(require,module,exports){
function onLocalUrlError(URL) {
    return function(error) {
        PathLookup.lge(" error resolving URL: " + URL);
        PathLookup.lge("returned such error: " + error);
    }
}

function onErrorGetDir(newDirName) {
    return function(error) {
        PathLookup.lge('Error getting dir ' + newDirName + "\n" + error);
    }
}

function onErrorCreateFile(newFileName) {
    return function(error) {
        PathLookup.lge('Error creating  file ' + newFileName + "\n" + error);
    }
}

function onErrorReadFile(filename) {
    return function(error) {
        PathLookup.lge('Error reading  file ' + filename + "\n" + error);
    }
}

module.exports.onLocalUrlError = onLocalUrlError;
module.exports.onErrorGetDir = onErrorGetDir;
module.exports.onErrorCreateFile = onErrorCreateFile;
module.exports.onErrorReadFile = onErrorReadFile;



},{}],5:[function(require,module,exports){
// #region require
var AccountManager = require('./Backend/AccountManager');
var CacheManager = require('./Backend/CacheManager');
var Debug = require("./Backend/Debug");

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

        }, function(error) {
            Debug.lge(error);
        });
    }
    
};

$(function(){
    app.initialize();
    
});


// module.exports.App = app;

},{"./Backend/AccountManager":1,"./Backend/CacheManager":2,"./Backend/Debug":3}]},{},[5]);

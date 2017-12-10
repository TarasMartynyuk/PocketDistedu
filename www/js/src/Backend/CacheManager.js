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
        
        window.resolveLocalFileSystemURL(test, function (dir) {
            log("found directory : " + dir.toURL());
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
        
        window.resolveLocalFileSystemURL(test, function (dir) {
            log("found directory : " + dir.toURL());
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
        
        window.resolveLocalFileSystemURL(test, function (dir) {
            log("found directory : " + dir.toURL());
            }, function(error) {
                log("NOT found directory : " + "dataDirectory");
                // createCacheDirs(instance, resourcesDirName, assignmentsDirName);
            },
        function(error) {
            console.log(error);
        });
    });
}

    // console.log(fs.root.toInternalURL());
    
        // fs.root.getFile("newPersistentFile.txt", { create: true, exclusive: false }, function (fileEntry) {
            
        //     console.log("fileEntry is file? " + fileEntry.isFile.toString());
        //     console.log(fileEntry.name);
        //     console.log(fileEntry.fullPath);
            
        //     // fileEntry.name == 'someFile.txt'
        //     // fileEntry.fullPath == '/someFile.txt'
        //     // writeFile(fileEntry, null);
        // }, onErrorCreateFile("new1.txt"));
        // fs.root.getFile("newPersistentFile.txt", { create: true, exclusive: false }, function (fileEntry) {
            
        //         // console.log("fileEntry is file? " + fileEntry.isFile.toString());
        //         // console.log(fileEntry.name);
        //          console.log(fileEntry.toURL() + "FOUND");
                    
        //         // fileEntry.name == 'someFile.txt'
        //         // fileEntry.fullPath == '/someFile.txt'
        //         // writeFile(fileEntry, null);
        
        // }, function(error){
        //     console.log("NOT FOUND");
        // });




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
        console.log('created dir ' + dirEntry.toURL());
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









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









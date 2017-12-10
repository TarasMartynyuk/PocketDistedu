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









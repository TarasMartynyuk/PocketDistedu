// handles distedu data storage, removal
// and data requests

//#region path vars
var Debug = require('./Debug');
var ErrorHandlers = require('./ErrorHandlers');
var DisteduDownloader = require('./DisteduDownloader');

var resourcesDirName = "Resources";
var assignmentsDirName = "Assignments";
// root for all asignments directories - emplty when week is not cached
var weekDirName = "Week";


//#endregion


function initialize(alreadyCachedCallback, cacheMissingCallback) {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
        
        // check if we have cached files already - wether weekDir exists
        window.resolveLocalFileSystemURL(Debug.cacheRootPath, function (dir) {
            log("found directory : " + dir.toURL());

           

            
        }, function(error) {
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









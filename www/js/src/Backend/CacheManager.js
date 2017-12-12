// handles assignments storage, removal
// and data requests

//#region path vars
var Debug = require('./Debug');
var ErrorHandlers = require('./ErrorHandlers');

// root for all asignments directories - emplty when week is not cached
var weekDirName = "Week";
var resourcesDirName = "Resources";
var assignmentDescrFilename = "description.txt";
//#endregion

// creates a folder for assignment with all needed data cached there
function cacheAssignmentData(assignment) {
    
}

<<<<<<< HEAD
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
=======
function deleteAssignmentData(assignment) {

}

// onCreatedCallback recieves created dir as argument
function createDirectory(rootDirEntry, newDirName, onCreatedCallback) {
    onCreatedCallback = onCreatedCallback || function(dirEntry) {
        Debug.lg('created dir ' + dirEntry.toURL());
>>>>>>> TarasMartynyuk
    };
    rootDirEntry.getDirectory(newDirName, { create: true }, onCreatedCallback, ErrorHandlers.onErrorGetDir(newDirName));
}
//#endregion

module.exports.cacheAssignmentData = cacheAssignmentData;
module.exports.assignmentDescrFilename = assignmentDescrFilename;
module.exports.resourcesDirName = resourcesDirName;














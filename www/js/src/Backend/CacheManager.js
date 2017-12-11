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

function deleteAssignmentData(assignment) {

}

// onCreatedCallback recieves created dir as argument
function createDirectory(rootDirEntry, newDirName, onCreatedCallback) {
    onCreatedCallback = onCreatedCallback || function(dirEntry) {
        Debug.lg('created dir ' + dirEntry.toURL());
    };
    rootDirEntry.getDirectory(newDirName, { create: true }, onCreatedCallback, ErrorHandlers.onErrorGetDir(newDirName));
}
//#endregion

module.exports.cacheAssignmentData = cacheAssignmentData;
module.exports.assignmentDescrFilename = assignmentDescrFilename;
module.exports.resourcesDirName = resourcesDirName;














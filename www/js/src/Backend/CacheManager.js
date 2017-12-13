// handles assignments storage, removal
// and data requests

//#region path vars
var Debug = require('./Debug');
var ErrorCommenter = require('./ErrorCommenter');

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
function createDirectory(rootDirEntry, newDirName, onCreatedCallback, failure) {
    onCreatedCallback = onCreatedCallback || function(dirEntry) {
        Debug.lg('created dir ' + dirEntry.toURL());
    };
    rootDirEntry.getDirectory(newDirName, { create: true }, onCreatedCallback, function(error){
        commentedError = ErrorCommenter.addCommentPrefix(error, "Error creating dir : " + rootDirEntry + newDirName);
        newDirName(error);
    });
}
//#endregion

module.exports.cacheAssignmentData = cacheAssignmentData;
module.exports.assignmentDescrFilename = assignmentDescrFilename;
module.exports.resourcesDirName = resourcesDirName;














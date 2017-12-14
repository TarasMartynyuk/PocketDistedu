// handles assignments storage, removal
// and data requests

//#region path vars
var Debug = require('./Debug');
var ErrorCommenter = require('./ErrorCommenter');

// root for all asignments directories - emplty when week is not cached
var courseIdDirTemplate = "CourseId"; // add number to end
var weekDirTemplate = "Week"; // add number to end
var resourcesDir = "Resources";
//#endregion

// creates a folder for assignment with all needed data cached there
function cacheAssignmentData(assignment, success, failure) {
    Debug.lg("cached data for " + assignment.name);
    // Debug.lg(assignment);
    success();
}

function deleteAssignmentData(assignment, success, failure, deleteWeekDir) {
    Debug.lg("deleted data for "  + assignment.name);
    // Debug.lg(assignment);
    success();
}

//#region helpers
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
module.exports.deleteAssignmentData = deleteAssignmentData;













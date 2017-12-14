// handles assignments storage, removal
// and data requests

//#region path vars
var Debug = require('./Debug');
var ErrorCommenter = require('./ErrorCommenter');
var FileWriter = require('./FileWriter');
var DisteduDownloader = require('./DIsteduDownloader');

// root for all asignments directories - emplty when week is not cached
var courseIdDirTemplate = "CourseId"; // add number to end
var weekDirTemplate = "Week"; // add number to end
var resourcesDir = "Resources";
//#endregion

// creates a folder for assignment with all needed data cached there
function cacheAssignmentData(assignment, success, failure) {
    
    var idDirName = courseIdDirTemplate + assignment.id;
    var weekDirName = weekDirTemplate + assignment.id;

    window.resolveLocalFileSystemURL(Debug.cacheRootPath, function(rootDirEntry){

        rootDirEntry.getDirectory(idDirName, {create : true}, function(idDirEntry){
            // create file for assignment
            DisteduDownloader.getAssignmentDescription(assignment, function(descr) {

                success();
                Debug.lg("cached data for " + assignment.name);
            }, function(error){
                failure(error);
            })


        }, function(error){
            failure(error);
        });
    }, function(error){
        failure(error);
    });
    
    
}

function deleteAssignmentData(assignment, success, failure, deleteWeekDir) {
    Debug.lg("deleted data for "  + assignment.name);
    // Debug.lg(assignment);
    success();
}

//#region helpers
// onCreatedCallback recieves created dir as argument
function createDirectory(parentDirEntry, newDirName, onCreatedCallback, failure) {
    onCreatedCallback = onCreatedCallback || function(dirEntry) {
        Debug.lg('created dir ' + dirEntry.toURL());
    };
    parentDirEntry.getDirectory(newDirName, { create: true }, onCreatedCallback, function(error){
        commentedError = ErrorCommenter.addCommentPrefix(error, "Error creating dir : " + parentDirEntry + newDirName);
        newDirName(error);
    });
}

function createFile(parentDirEntry, filename, contents, onCreatedCallback, failure) {
    parentDirEntry.getFile(filename, {create : true, exclusive : true}, function (fileEntry){
        FileWriter.write(fileEntry, contents, onCreatedCallback, failure);

    }, function (error){
        failure(ErrorCommenter.addCommentPrefix(error, "Error creating file for assignment"));
    });
}
//#endregion

module.exports.cacheAssignmentData = cacheAssignmentData;
module.exports.deleteAssignmentData = deleteAssignmentData;













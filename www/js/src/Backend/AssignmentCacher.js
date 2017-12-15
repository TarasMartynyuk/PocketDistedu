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
    
    getWeekDir(assignment, true, function(weekDirentry) {
        // create file for assignment
        DisteduDownloader.getAssignmentDescription(assignment, function(descr) {
    
            Debug.lg("cached data for " + assignment.name);
            Debug.lg(descr);
            createFile(weekDirentry, assignment.name + ".txt", descr, success, failure);

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
// success recieves weekDir for this assignment as arg,
// if allowCreation is true, CREATES this dir if it does not exist,
// else throwes error if the path does not exist
function getWeekDir(assignment, allowCreation, success, failure) {
    window.resolveLocalFileSystemURL(Debug.cacheRootPath, function(rootDirEntry){
        
        var idDirName = courseIdDirTemplate + assignment.courseId;
        rootDirEntry.getDirectory(idDirName, {create : allowCreation}, function(idDirEntry){

            var weekDirName = weekDirTemplate + assignment.week;
            idDirEntry.getDirectory(weekDirName, {create : allowCreation}, function(weekDirEntry){
            
                success(weekDirEntry);
            
            }, function(error){
                failure(error);
            });

        }, function(error){
            failure(error);
        });

    }, function(error){
        failure(error);
    });
}

// onCreatedCallback recieves created dir as argument
function createDirectory(parentDirEntry, newDirName, onCreatedCallback, failure) {
    
    parentDirEntry.getDirectory(newDirName, { create: true, exclusive : true }, onCreatedCallback, function(error){
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













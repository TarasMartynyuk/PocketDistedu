// handles assignments storage, removal
// and data requests

//#region path vars
var Debug = require('./Debug');
var ErrorCommenter = require('./ErrorCommenter');
var FileWriter = require('./FileWriter');
var DisteduDownloader = require('./DIsteduDownloader');
var AssignmentClass = require('./data classes/AssignmentClass');

// root for all asignments directories - emplty when week is not cached
var courseIdDirTemplate = "CourseId"; // add number to end
var weekDirTemplate = "Week"; // add number to end
var resourcesDirName = "Resources";
//#endregion


// success takes AssignmentData as arg
function getAssignmentData(assignment, success, failure) {
    // var 
    Debug.lg("getAssignmentData");
    Debug.lg(assignment.AssignmentDescrPath);


    window.resolveLocalFileSystemURL(assignment.AssignmentDescrPath, function(fileEntry){

        fileEntry.file(function (file) {
            var reader = new FileReader();

            reader.onloadend = function (e) {
                // Debug.lg("read : " + this.result);
                Debug.lg("read html for : " + assignment.name);
                var data = new AssignmentClass.AssignmentData(assignment.name, assignment.deadline, this.result);
                success(data);
            };
            reader.readAsText(file);

        }, function(error) {
            failure( ErrorCommenter.addCommentPrefix(error, "cannot read file : "+ assignment.AssignmentDescrPath));
        });
    }, function(error) {
        Debug.lg("err localFileSysemRUL");
        failure(ErrorCommenter.addCommentPrefix(error, "Cant resolve url " + assignment.AssignmentDescrPath));
    });
}
// creates a folder for assignment with all needed data cached there
function cacheAssignmentData(assignment, success, failure) {
    
    getWeekDir(assignment, true, function(weekDirEntry) {
        // create file for assignment
        cacheDescr(assignment, weekDirEntry, function() {

            success();

        }, failure);

        // download resources, if needed
        

    }, failure);
}

function deleteAssignmentData(assignment, success, failure, deleteWeekDir) {
    Debug.lg("deleted data for "  + assignment.name);
    // Debug.lg(assignment);
    success();
}

//#region helpers
// returns
function downloadFilesToDir(dir, fileUrls, success, failure) {
    Debug.lg("downloaded such urls :");
    // Debug.lg(fileUrls);
    // Debug.lg("to this dir: ");
    // Debug.lg(dir.toURL());
}


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
        failure(error);
    });
}

function cacheDescr(assignment, weekDirEntry, success, failure) {
    // make name valid!!

    var validName = assignment.name.replace('.', '_')  + ".txt";
    DisteduDownloader.getAssignmentDescription(assignment, function(descr) {
        
        Debug.lg("fetched html descr for " + validName);
        // Debug.lg(descr);
        createFile(weekDirEntry, validName, descr, function(){

            Debug.lg("changing property to : ");
            Debug.lg(weekDirEntry.toURL() + validName);
            
            assignment.AssignmentDescrPath = weekDirEntry.toURL() + validName;
            assignment.cached = true;
            success();


        }, failure);

    },  failure);
}

function cacheResources(assignment, weekDirEntry, success, failure) {

    weekDirEntry.getDirectory(resourcesDirName, {create : false}, function(resourcesDirEntry){
        // if it exists - (there IS **** of it) we have already cached the resources to this weed and course
        DisteduDownloader.getResourcesUrls(assignment, function(urls){

            downloadFilesToDir(resourcesDirEntry, urls, success, failure);
        }, failure);

    }, function (error){
        createDirectory(weekDirEntry, resourcesDirName, function(resourcesDirEntry){

            DisteduDownloader.getResourcesUrls(assignment, function(urls){

                downloadFilesToDir(resourcesDirEntry, urls, success, failure);
            })
        }, failure);
    });
}

// TODO: rewrite with exclusive + checks!
function createFile(parentDirEntry, filename, contents, onCreatedCallback, failure) {
    parentDirEntry.getFile(filename, {create : true, exclusive : false}, function (fileEntry){
        FileWriter.write(fileEntry, contents, onCreatedCallback, failure);

    }, function (error){
        Debug.lge("error in createFile");
        failure(error);
    });
}
//#endregion

module.exports.cacheAssignmentData = cacheAssignmentData;
module.exports.deleteAssignmentData = deleteAssignmentData;
module.exports.getAssignmentData = getAssignmentData;













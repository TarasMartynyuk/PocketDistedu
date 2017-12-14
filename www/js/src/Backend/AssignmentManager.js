//#region defs 
var Debug = require("./Debug");
var FileWriter = require('./FileWriter');
var DisteduDownloader = require('./DIsteduDownloader');
var ErrorCommenter = require('./ErrorCommenter');
var Promise = require('bluebird');

// [{id - number : course - str }]
var idToCourse = [];
var assignmentArr = [];
// var userCourses = [];
var coursesJsonName = "userCourses.json";

//#endregion

// success takes 0 args, 
// is run when userCourses where successfully retrieved from disk
// failure takes string representing error
function tryLoadSerializedCourses(success, failure) {
    getSerializedCourses(function(serCourses) {
        userCourses = serCourses;
        success()
    }, function(error) {
        failure(error);
    });
}

// delete courses that are marked as done from disk(if deadline has passed), 
// cache those that are not longer than week from now
function update() {

}

// pass user - filtered array of {id, courseName(str)} as arg,
// serializes it to be able to use in next sessions
// also loads to userCourses variable
// DOES NOT cache assignments resources and descriptions
function saveUserAssignmentsArr(filteredCourses, success, failure) {
   
    // var currDate = 
    assignmentsPromises = [];
    
    for(var i = 0; i < filteredCourses.length; i++) {
        // use course id to get all future assignments and construct idToAssignmentArr
        assignmentsPromises.push(DisteduDownloader.getCourseAssignments(filteredCourses[i].id));
    }

    Promise.all(assignmentsPromises).then(function(futureAssignments) {
        success();
        Debug.lg("SUCCESS constructing future assignments arr from web");
        Debug.lg(futureAssignments);
        // and cache them instantly
        
    }).catch(function(error){
        failure(ErrorCommenter.addCommentPrefix(error, "Error constructing futureAssignments from web pages"));
    })
    
}

//#region helpres
function reserializeAssignmentsArray(newCourses, success, failure) {
    window.resolveLocalFileSystemURL(Debug.cacheRootPath, function(cacheRootDir){
        
        cacheRootDir.getFile(coursesJsonName, {create : true}, function(file) {
            // write json
            FileWriter.writeObjToFile(file, newCourses, success, failure);
        
        }, function(error) {
            var commentedError = ErrorCommenter.addCommentPrefix(error, "Error getting file: " + Debug.cacheRootPath + coursesJsonName);
            failure(error);
        });
    }, function(error) {
        var commentedError = ErrorCommenter.addCommentPrefix(error, "Error getting dir: " + Debug.cacheRootPath);
        failure(error);
    });
}

// success takes ser courses as arg
function getSerializedCourses(success, failure) {
    window.resolveLocalFileSystemURL(Debug.cacheRootPath + coursesJsonName, function(fileEntry){
        
        fileEntry.file(function (file) {
            var reader = new FileReader();

            reader.onloadend = function (e) {
                try {
                    var serializedCourses = JSON.parse(this.result);
                    Debug.lg("loaded : ")
                    Debug.lg(serializedCourses);

                    success(serializedCourses);
                } catch(e) {
                    failure(e);
                }
            };
            reader.readAsText(file);

        }, function(error) {
            failure( "cannot read file : "+ Debug.cacheRootPath + coursesJsonName)
        });
        
    }, function(error) {
        failure("cannot find URL : " + Debug.cacheRootPath + coursesJsonName);
    });
}
//#endregion

module.exports.tryLoadSerializedCourses = tryLoadSerializedCourses;
module.exports.saveUserAssignmentsArr = saveUserAssignmentsArr;
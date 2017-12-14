//#region defs 
var Debug = require("./Debug");
var FileWriter = require('./FileWriter');
var DisteduDownloader = require('./DIsteduDownloader');
var DeadlineValChecker = require('./DeadlineValidityChecker');
var ErrorCommenter = require('./ErrorCommenter');
var Promise = require('bluebird');
var AssignmentClass = require('./data classes/AssignmentClass');

var assignmentsJsonName = "userAssignments.json";

// {id : {name : assignment}}
var loadedAssignmentsTable = {};
//#endregion

// if success loads serialized assignments into memory
// is run when userCourses where successfully retrieved from disk
// failure takes string representing error
function tryLoadSerializedAssignments(success, failure) {
    getSerializedAssignments(function(serAssignments) {
        for(var i = 0; i < serAssignments.length; i++) {
            if(loadedAssignmentsTable[serAssignments[i].courseId] == undefined) {
                loadedAssignmentsTable[serAssignments[i].courseId] = {};
            }
            loadedAssignmentsTable[serAssignments[i].courseId] [serAssignments[i].name] = serAssignments[i];
        }
        Debug.lg("loaded : ");
        Debug.lg(loadedAssignmentsTable);

        success();
    }, function(error) {
        failure(error);
    });
}

// assignmentArr is array os serialized assignments
// delete courses that are marked as done from disk(if deadline has passed), 
// cache those that are not longer than week from now
function update(assignmentArr, success, failure) {
    
    var dataConstructPromises = [];
    var deleteCachePromises = [];
    // for ALL the assignments,  if their deadline is in next week
    // construct data from them, caching if they are not yet cached
    for(var i = 0; i < assignmentArr.length; i++) {

        // Debug.lg("deadline");
        // Debug.lg(assignmentArr[i].deadline);

        var deadlineStatus = DeadlineValChecker.deadlineStatus(assignmentArr[i].deadline);

        if(deadlineStatus < 0) {
            // delete from disk and from array
            deleteCachePromises.push(assignmentArr[i].deleteCache());
            // Debug.lg("deleting cache for ");
            // Debug.lg(assignmentArr[i]);

        } else if(deadlineStatus == 0 ) {
            // cache
            var dataConstructPromise;
            if(assignmentArr[i].cached) {   
                dataConstructPromise = assignmentArr[i].fetchData(deadlineStatus);
                
            } else {    // cache before fetching data from disk 
                // Debug.lg("constructin right away : ");
                // Debug.lg(assignmentArr[i]);
                
                // assignmentArr[i].TEST();
                var assignmentRef = assignmentArr[i];
                dataConstructPromise = assignmentArr[i].cache()
                    .then(function() {
                        return assignmentRef.fetchData(deadlineStatus);
                    });
            }

            dataConstructPromises.push(dataConstructPromise);
        } 
    }

    Promise.all(deleteCachePromises).then(function(promisesResult) {
        Debug.lg("Deleted cache data for outdated assignments successfully:");
        // Debug.lg(promisesResult);
        
    }).then(function(){
        return Promise.all(dataConstructPromises);

    }).then(function(assignmentsData) {
        
        success(assignmentsData);
    }).catch(function(error){
        Debug.lge(error);
    });

    //TODO: re-serialize the array with outdated assignments missing!
}

// pass user - filtered array of {id, courseName(str)} as arg,
// serializes its assignments to be able to use in next sessions
// DOES NOT cache assignments resources and descriptions
function saveUserAssignmentsArr(filteredCourses, success, failure) {
   
    assignmentsPromises = [];
    
    for(var i = 0; i < filteredCourses.length; i++) {
        // use course id to get all future assignments and construct idToAssignmentArr
        assignmentsPromises.push(DisteduDownloader.getCourseAssignments(filteredCourses[i].id));
    }

    // future assignments is array of arrays (1 array for each courseId)
    Promise.all(assignmentsPromises).then(function(futureAssignments) {
        Debug.lg("SUCCESS constructing future assignments arr from web");
        // and cache them 

        // flatten the array 
        var futureAssignments1D = [];

        for(var i = 0; i < futureAssignments.length; i++) {
            var idArray = futureAssignments[i];
            for(var j = 0; j < idArray.length; j++) {
                futureAssignments1D.push(idArray[j]);
            }
        }

        reserializeAssignmentsArray(futureAssignments1D, success, failure);
        
    }).catch(function(error){
        failure(ErrorCommenter.addCommentPrefix(error, "Error constructing futureAssignments from web pages"));
    })
    
}

// serializes current contents of loadedAssignments var
function serializeAssignmentsFromMemory(success, failure) {
    var assignmentsToSer = [];
    var ids = Object.keys(loadedAssignmentsTable);
    for(var i = 0; i < ids.length; i++) {
        var IdsAssignments = Object.values(loadedAssignmentsTable[ids[i]]);
        // Debug.lg(loadedAssignmentsTable[ids[i]]);
        // Debug.lg(IdsAssignments);

        for(var j = 0; j < IdsAssignments.length; j++) {
            Debug.lg(IdsAssignments[j].completed);
            if(IdsAssignments[j].completed) {
                assignmentsToSer.push(IdsAssignments[j]);
            }
        }
    }
    Debug.lg("serializing : ");
    Debug.lg(assignmentsToSer);
    // reserializeAssignmentsArray(assignmentsToSer);
}

// synch method - WOW
function markAsCompleted(courseId, assignmentName) {
    Debug.lg("marking as completed");
    Debug.lg(loadedAssignmentsTable[courseId][assignmentName]);
    loadedAssignmentsTable[courseId][assignmentName].completed = true;
}

//#region helpres
function reserializeAssignmentsArray(newAssignments, success, failure) {
    window.resolveLocalFileSystemURL(Debug.cacheRootPath, function(cacheRootDir){
        
        cacheRootDir.getFile(assignmentsJsonName, {create : true}, function(file) {
            // write json
            FileWriter.writeObjToFile(file, newAssignments, success, failure);
        
        }, function(error) {
            var commentedError = ErrorCommenter.addCommentPrefix(error, "Error getting file: " + Debug.cacheRootPath + assignmentsJsonName);
            failure(error);
        });
    }, function(error) {
        var commentedError = ErrorCommenter.addCommentPrefix(error, "Error getting dir: " + Debug.cacheRootPath);
        failure(error);
    });
}

// success takes ser assignments as arg
function getSerializedAssignments(success, failure) {
    window.resolveLocalFileSystemURL(Debug.cacheRootPath + assignmentsJsonName, function(fileEntry){
        // Debug.lg("fetched fileentry");
        fileEntry.file(function (file) {
            var reader = new FileReader();

            reader.onloadend = function (e) {
                try {
                    var serializedAssignmets = JSON.parse(this.result);
                    // deadline is not jsut string, parse to Date
                    // also, proto is messed up
                    for(var i = 0; i < serializedAssignmets.length; i++) {
                        serializedAssignmets[i].deadline = new Date(serializedAssignmets[i].deadline);
                        Object.setPrototypeOf(serializedAssignmets[i], AssignmentClass.AssignmentProto);
                    }
                    success(serializedAssignmets);
                    Debug.lg("read success");
                } catch(e) {
                    failure(e);
                }
            };
            reader.readAsText(file);

        }, function(error) {
            failure( "cannot read file : "+ Debug.cacheRootPath + assignmentsJsonName)
        });
        
    }, function(error) {
        failure("cannot find URL : " + Debug.cacheRootPath + assignmentsJsonName);
    });
}
//#endregion

module.exports.tryLoadSerializedAssignments = tryLoadSerializedAssignments;
module.exports.saveUserAssignmentsArr = saveUserAssignmentsArr;
module.exports.update = update;
module.exports.markAsCompleted = markAsCompleted;
module.exports.serializeAssignmentsFromMemory = serializeAssignmentsFromMemory;


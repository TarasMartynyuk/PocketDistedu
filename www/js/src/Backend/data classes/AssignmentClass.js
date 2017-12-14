var AssignmentCacher = require('../AssignmentCacher');
var Debug = require('../Debug');
// name : string, 
// deadline : Data object (JS)
// week : Number
// courseId : Number
// cached - wether its data exists on disk
// assignmentDatapath - global path to the directory where task and resources are stored
// function Assignment
function Assignment (name, deadline, week, id, courseId) {
        this.name = name,
        this.id = id;
        this.deadline = deadline,
    
        this.week = week; // Number
        this.courseId = courseId

        this.cached = false;
        this.AssignmentDataPath = null; // null if not cached
        this.completed = false;
    }

Assignment.prototype = {
    
    // returns a PROMISE with AssignmentData as resolve arg
    fetchData : function (deadline) {
        return new Promise(function(resolve, reject) {
            resolve("AssignmentData for assignment :" + deadline);
        });
    },
    // creates a dir for its courseID, if not present
    // creates a dir for its week(inside id folder), if not present
    // creates a file inside weekDir, in form this.name.txt - for descr
    // creates a folder inside dir for resources, if not present and loads all weeks resources there
    // returns a PROMISE
    cache : function() {
        var thisRef = this;
        return new Promise(function (resolve, reject) {
            
            AssignmentCacher.cacheAssignmentData(thisRef, resolve, reject);
        });
    },

    // deletes weekDir(with all resources and other assignments!) if deleteWeekDir is true
    // returns PROMISE
    deleteCache : function(deleteWeekDir) {

        var thisRef = this;
        return new Promise(function(resolve, reject) {
            // resolve("AssignmentData for assignment :" + this.name);
            AssignmentCacher.deleteAssignmentData(thisRef, resolve, reject);
        });
    },
}

// name : string, 
// deadline : Data object (JS)
// assignmentDescription : string - html file
// resources : [ url, url... ] - pdf or doc(mostly))
function AssignmentData(assignment, onInitEnd) {
    this.name = assignment.name;
    this.deadline = assignment.deadline;
    // get string from file
    
}

module.exports.Assignment = Assignment;
module.exports.AssignmentProto = Assignment.prototype;
module.exports.AssignmentData = AssignmentData;

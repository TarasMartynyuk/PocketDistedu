var CacheManager = require('../CacheManager');

// name : string, 
// deadline : Data object (JS)
// week : Number
// assignmentDatapath - global path to the directory where task and resources are stored
function Assignment(name, deadline, week) {
    this.name = name,
    this.deadline = deadline,

    this.week = week; // Number
    this.cached = false;
    this.AssignmentDataPath = null;
}

Assignment.prototype = {
    
    cache : function() {
        
    },
    remove : function() {

    }
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
module.exports.AssignmentData = AssignmentData;

var CacheManager = require('../CacheManager');

// name : string, deadline : string
// assignmentDatapath - global path to the directory where task and resources are stored
function Assignment(name, deadline) {
    this.name = name,
    this.deadline = deadline,

    this.AssignmentDataPath = null;
    this.cached = false;
}

Assignment.prototype = {
    
    cache : function() {
        
    },
    remove : function() {

    }
}

// name : string, deadline : string
// assignmentDescription : string - html file
// resources : [ url, url... ] - pdf or doc(mostly))
function AssignmentData(assignment, onInitEnd) {
    this.name = assignment.name;
    this.deadline = assignment.deadline;
    // get string from file
    
}
var DisteduDownloader = require('../DisteduDownloader');
var CacheManager = require('../CacheManager');

function Course(name, id) {
    this.name = name;
    // used to find assignment pages
    this.id = id;
    // Assignment object representing every upcoming assignment 
    this.futureAssignments = [];
}

Course.prototype = {
    cacheAssignment : function(assignment) {

    },
    removeAssignment : function () {

    }
}

module.exports.Course = Course;

// module.exports = class Course {
//     constructor (name, id) {
//         this.name = name;
//         // used to find assignment pages
//         this.id = id;
//         // Assignment object representing every upcoming assignment 
//         this.futureAssignments = [];
//     }

//     cacheAssignment (assignment) {
        
//     }
            
//     removeAssignment() {
        
//     }

// }


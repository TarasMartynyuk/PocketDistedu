var DisteduDownloader = require('../DisteduDownloader');
var CacheManager = require('../CacheManager');

function Course (name, id) {
    this.name = name;
    // used to find assignment pages
    this.id = id;
    // Assignment object representing every upcoming assignment
    futureAssignments = [];
}

Course.prototype = {
    cacheAssignment = function(assignment) {

    },
    removeAssignment() {

    }
}
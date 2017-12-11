var AccountManager = require('./AccountManager');
var Debug = require('./Debug');
var cheerio = require('cheerio');

// success takes list of all courses of user (using his data from AccountManager) as argument, 
// in format [{ string_name : int_id, otherEntry, ...}]
function getAllCoursesList(success) {
    // first, get the after-login page
    AccountManager.getAuthPage( function(afterLoginPage){
        var cher = cheerio.load(afterLoginPage);
        var div = cher(".logininfo").first();
        var a = cher(div).find('a').first();
        Debug.lg(a.attr('href'));

        // Debug.lg(cher(div).children);
        
        // .children('a')
        
    }, function(error){
        Debug.lge(error);
    });
}

// success takes HTML string with all courses assignments as arg
function getCourseAssignmentsPage(course, success) {
    
}

// success takes HTML string with all courses resources as arg
function getCourseResourcesPage(course, success) {

}

module.exports.getAllCoursesList = getAllCoursesList;
module.exports.getCourseAssignmentsPage = getCourseAssignmentsPage;
module.exports.getCourseResourcesPage = getCourseResourcesPage;



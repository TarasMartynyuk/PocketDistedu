var AccountManager = require('./AccountManager');
var Debug = require('./Debug');
var cheerio = require('cheerio');
var CourseClass = require('./data classes/CourseClass');

// success takes list of all courses of user (using his data from AccountManager) as argument, 
// in format [{ string_name : int_id, otherEntry, ...}]
function getAllCoursesList(success) {
    // first, get the after-login page
    AccountManager.getAuthPage( function(afterLoginPage){

        var cher = cheerio.load(afterLoginPage);
        var div = cher(".logininfo").first();
        var a = cher(div).find('a').first();
        var userPageURL = a.attr('href');
        userPageURL = userPageURL.replace(/[0-9]+$/i, "1");
        Debug.lg(userPageURL);

        $.ajax({
            type : "GET",
            url : userPageURL,
            success : function(data) {
                cher = cheerio.load(data);
                Debug.lg(cher('title').text());
                
                var allCourses = [];
                var courseContainer = cher('.info.c1');
                Debug.lg(courseContainer.children());
                courseContainer.children().each(function(index, element){

                    var id = element.attribs.href.match(/[0-9]+$/i)[0];
                    var course = new CourseClass.Course(element.firstChild.data, id);
                    // Debug.lg(course);
                    allCourses.push(course);
                });
                success(allCourses);
            },
            error : function(err) {
                Debug.lge("GET  : \n");
                Debug.lge(err);
            }
        });

        // Debug.lg(cher(div).children);
        
        // .children('a')
        
    }, function(error){
        Debug.lge("error AUTH");
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



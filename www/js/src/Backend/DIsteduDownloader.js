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
        var userPageURL = a.attr('href') + "2193892183";
        userPageURL = userPageURL.replace(/[0-9]+$/i, "1");
        Debug.lg(userPageURL);

        $.ajax({
            type : "GET",
            url : userPageURL,
            success : function(data) {
                // success(data);
                cher = cheerio.load(data);
                Debug.lg(cher('title').text());
                
                var allCourses = [];
                var courseContainer = cher('.info.c1');
                Debug.lg(courseContainer.children());
                // Debug.lg(courseContainer.find(':nth-child(2)'));
                courseContainer.children().each(function(index, element){
                    // allCourses.push(element.attr('href'))
                    Debug.lg(index);
                    Debug.lg(element.attribs.href);
                
                });
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



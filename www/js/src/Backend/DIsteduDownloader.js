//#region defs
var AccountManager = require('./AccountManager');
var Debug = require('./Debug');
var cheerio = require('cheerio');
var CourseClass = require('./data classes/CourseClass');

// just add water(crossed out) id
var assignmentsPageTemplate = "http://distedu.ukma.edu.ua/mod/assignment/index.php?id=";
var resourcesPageTemplate = "http://distedu.ukma.edu.ua/mod/resource/index.php?id=";

//#endregion


// success takes list of all courses of user (using his data from AccountManager) as argument, 
// in format [{id, course}]
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
                    allCourses.push({ 
                        id : id, 
                        course : course
                        }
                    );
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

// success takes  courses assignments as arg
// considers only corses whose deadline is later than filterDate
function getCourseAssignments(courseId, success, filterDate) {
    
    AccountManager.getAuthPage(function (loggedInPage){

        var assignmentsPageUrl = assignmentsPageTemplate + courseId;
        Debug,lg("fetching asses for from assignments page : " + assignmentsPageUrl);
        
        getPage(assignmentsPageUrl, function(assignmentsPage) {
            Debug.lg(" SUCCESS GETting assignments page :");
            Debug.lg(assignmentsPage);

        }, function(error){
            Debug.lge(error);
        });

    }, function(error) {
        Debug.lg(error);
    })
}

// success takes HTML string with all courses resources as arg
function getCourseResourcesPage(course, success) {
    
}


//#region 
// success takes returned html as arg
function getPage(url, success, failure) {
    $.ajax({
        type : "GET",
        url : url, 
        success : function(data) {
            success(data);
        },
        error : function(err) {
            failure("post to login page failed : \n");
            Debug.lge(err);
            Debug.lge(err.responseText);
        }
    });
}

//#endregion
module.exports.getAllCoursesList = getAllCoursesList;
module.exports.getCourseAssignments = getCourseAssignments;
// module.exports.getCourseResourcesPage = getCourseResourcesPage;



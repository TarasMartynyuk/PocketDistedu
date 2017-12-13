//#region defs
var AccountManager = require('./AccountManager');
var Debug = require('./Debug');
var cheerio = require('cheerio');
var CourseClass = require('./data classes/CourseClass');
var ErrorCommenter = require('./ErrorCommenter');
var DateParser = require('./DateParser');
var AssignmentClass = require('./data classes/AssignmentClass'); 

// just add water(crossed out) id
var allAssignmentsPageTemplate = "http://distedu.ukma.edu.ua/mod/assignment/index.php?id=";
var allResourcesPageTemplate = "http://distedu.ukma.edu.ua/mod/resource/index.php?id=";
var assignmentPageTemplate = "http://distedu.ukma.edu.ua/mod/assignment/";
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
function getCourseAssignments(courseId, success, failure, filterDate) {
    
    AccountManager.getAuthPage(function (loggedInPage) {

        var assignmentsPageUrl = allAssignmentsPageTemplate + courseId;
        // Debug.lg("fetching asses for from assignments page : " + assignmentsPageUrl);
        
        getPage(assignmentsPageUrl, function(assignmentsPage) {

            Debug.lg(" SUCCESS GETting assignments page :");
            var hrefNodeSelector = 'td.cell.c1';
            var deadlineNodeSelector = 'td.cell.c3';

            var cher = new cheerio.load(assignmentsPage);
            Debug.lg(cher('title').text());

            var tableRows = cher('.generaltable.boxaligncenter').children('tbody')
                .children('tr');
            tableRows = tableRows.slice(1, tableRows.length);   // first one is header row
            
            // map asssignment to their weeks
            // id : [assignment, assign]
            weekToAssignment = {};

            for(var i = 0; i < tableRows.length; i++) {
                // check if it is table divider
                var cheeredRow = cheerio.load(tableRows[i]);
                if(cheeredRow('[colspan="6"]').length > 0) {
                    Debug.lg("number " + i + " is a divider row");
                    continue;
                }
                // check if row defines new week
                var weekNumberStr = cheeredRow('td.cell.c0').text();
                // Debug.lg(weekNumberStr);

                if(weekNumberStr == '') {
                    Debug.lg("it is blank");
                    // entry for this week was already created
                } else {
                    Debug.lg("it is " + weekNumberStr);
                    // create new entry for this week
                    var weekNumber = Number(weekNumberStr);
                    weekToAssignment[weekNumber] = [];
                    
                }

                // construct assignment and add it to week's array
                var assignment = getAssignmentFromRow(cheeredRow);
            }

        }, function(error){
            failure(error);
        });

    }, function(error) {
        failure(error);
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
        error : function(error) {
            var commentedError = ErrorCommenter.addCommentPrefix(error, "error GETting secure page : " + url);
            failure(commentedError);
            Debug.lge(err.responseText);
        }
    });
}

// takes a cheerio node of assignment row in tasks page
// returns assignment obj
function getAssignmentFromRow(cheeredRow) {
    var aTableNode = cheeredRow(hrefNodeSelector)[0]; // has a in children
    var deadlineNode = cheeredRow(deadlineNodeSelector)[0]; // has text in children

    var hrefURL = assignmentPageTemplate + aTableNode.firstChild.attribs.href;
    var deadlineString = deadlineNode.firstChild.data;
    // Debug.lg(row);
    // Debug.lg("url : " + hrefURL);
    Debug.lg("aTableNode : ");
    Debug.lg(aTableNode);

    // create a date object to represent deadline
    var date = DateParser.parseUkrDateStr(deadlineString);

    var assignment = new AssignmentClass.Assignment()
}

//#endregion
module.exports.getAllCoursesList = getAllCoursesList;
module.exports.getCourseAssignments = getCourseAssignments;
// module.exports.getCourseResourcesPage = getCourseResourcesPage;



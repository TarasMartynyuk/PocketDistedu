//#region defs
var AccountManager = require('./AccountManager');
var Debug = require('./Debug');
var cheerio = require('cheerio');
var ErrorCommenter = require('./ErrorCommenter');
var DateParser = require('./DateParser');
var AssignmentClass = require('./data classes/AssignmentClass'); 
var DeadlineValidityChecker = require('./DeadlineValidityChecker');

// just add water(crossed out) id
var allAssignmentsPageTemplate = "http://distedu.ukma.edu.ua/mod/assignment/index.php?id="; // add course id
var allResourcesPageTemplate = "http://distedu.ukma.edu.ua/mod/resource/index.php?id="; // add course id
var assignmentPageTemplate = "http://distedu.ukma.edu.ua/mod/assignment/view.php?id="; // add assignment id
//#endregion
var testUrl = "http://distedu.ukma.edu.ua/mod/resource/view.php?id=10017";

function test() {
    AccountManager.getAuthPage( function(afterLoginPage) {
        
        // getPage(testUrl, function(responce){
        //     Debug.lg("responce : ");
        //     Debug.lg(responce);
        // }, function(error) {
        //     Debug.lg(error);
        // });
        // var xhttp = new XMLHttpRequest();
        var testUrl = window.location.href;
        var xhttp = new XMLHttpRequest();
        xhttp.open('HEAD', testUrl);
        xhttp.onreadystatechange = function () {
            if (this.readyState == this.DONE) {
                console.log(this.status);
                var contentType = this.getResponseHeader("Content-Type");
                Debug.lg(contentType);
            }
        };
        xhttp.send();

    }, function(error) {
        Debug.lg(error);
    });

}
// success takes list of all courses of user (using his data from AccountManager) as argument, 
// in format [{id, course}]
function getAllCoursesList(success, failure) {
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

                    
                    var name = element.firstChild.data;
                    var id = element.attribs.href.match(/[0-9]+$/i)[0];
                    // Debug.lg(course);
                    allCourses.push({ 
                        id : id, 
                        course : name
                        }
                    );
                });
                success(allCourses);
            },
            error : function(error) {
                failure(ErrorCommenter.addCommentPrefix(error, "GET  : \n"));
            }
        });

    }, failure);
}

// returnes a promise, whose resolve takes courses assignments as arg
function getCourseAssignments(courseId) {
    
    return new Promise(function(resolve, reject){

        AccountManager.getAuthPage(function (loggedInPage) {
            
                    var assignmentsPageUrl = allAssignmentsPageTemplate + courseId;
                    // Debug.lg("fetching asses for from assignments page : " + assignmentsPageUrl);
                    
                    getPage(assignmentsPageUrl, function(assignmentsPage) {
            
                        Debug.lg(" SUCCESS GETting assignments page :");
            
                        var cher = new cheerio.load(assignmentsPage);
                        Debug.lg(cher('title').text());
            
                        var tableRows = cher('.generaltable.boxaligncenter').children('tbody')
                            .children('tr');
                        tableRows = tableRows.slice(1, tableRows.length);   // first one is header row
                        
                        // console.clear();
                        var courseAssignments = [];
            
                        var weekNumber;
                        for(var i = 0; i < tableRows.length; i++) {
                            // check if it is table divider
                            var cheeredRow = cheerio.load(tableRows[i]);
                            if(cheeredRow('[colspan="6"]').length > 0) {
                                // Debug.lg("\nnumber " + i + " is a divider row");
                                continue;
                            }
                            // check if row defines new week
                            var weekNumberStr = cheeredRow('td.cell.c0').text();
                            // Debug.lg(weekNumberStr);
            
                            // change weekNumber only if first cell is not blank
                            if(weekNumberStr != '') {
                                weekNumber = Number(weekNumberStr);
                            }
                            // construct assignment and add it to week's array
                            var assignment = getAssignmentFromRow(cheeredRow, weekNumber, courseId);
                            if(assignment != null) {
                                courseAssignments.push(assignment);
                            }
                        }
                        resolve(courseAssignments);
                    }, function(error){
                        reject(error);
                    });
            
                }, function(error) {
                    reject(error);
                })
    });
    
}

// TODO: add proper naming
var done = false;
// success takes [url, url] of download urls for all week's resources
function getResourcesUrls(assignment, success, failure) {

    AccountManager.getAuthPage(function(afterLoginPage) {
        var courseResourcesPage = allResourcesPageTemplate + assignment.courseId;

        getPage(courseResourcesPage, function(resPage){

            var cher = cheerio.load(resPage);
            // Debug.lg(cher('title').text());
            weekStr = assignment.week.toString();

            var weekCells = cher('.cell.c0');
            var weekStartFound = false;
            var urls = [];
            if(done == false) {
                weekCells.each(function(index, element){
                    // Debug.lg(element.nextSibling.firstChild.attribs.href);
                    Debug.lg(element.nextSibling.firstChild);
                    
                    done = true;
                    if(weekStartFound) {    // add until encounter next week's node
                        if(element.firstChild != null) {    // another week's start
                            return false;
                        } else {
                                // add url
                             urls.push(element);
                             
                        }

                    } else {    // check if it is weekStart cell
                        if(element.firstChild != null && element.firstChild.data == weekStr){ 
                            // we found the first cell with our week's resources
                            weekStartFound = true;
                             // add url
                             urls.push(element);

                        }
                    }
                });
                done = true;
                Debug.lg("THe one : ");
                Debug.lg(urls);
            }
            
            success(urls);
        }, failure);
    }, failure);
}
// success takes a - description as arg
function getAssignmentDescription(assignment, success, failure) {
    // Debug.lg("getAssignmentDescription");
    AccountManager.getAuthPage(function(afterLoginPage) {

        var assignmentPageUrl = assignmentPageTemplate + assignment.id;

        getPage(assignmentPageUrl, function(assignmentUrl) {

            var cher = cheerio.load(assignmentUrl);
            var descrHtml = cher('#intro').html();
            
            success(descrHtml);

        }, function (error){
            failure(error);
        })
        
    }, function(error){
        failure(error);
    });
}

//#region helpers
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
// returns assignment obj if deadline has not yet passed
// or null 
function getAssignmentFromRow(cheeredRow, week, courseId) {
    var hrefNodeSelector = 'td.cell.c1';
    var deadlineNodeSelector = 'td.cell.c3';

    var aTableNode = cheeredRow(hrefNodeSelector)[0]; // has a in children
    var deadlineNode = cheeredRow(deadlineNodeSelector)[0]; // has text in children

    var hrefURL = aTableNode.firstChild.attribs.href;
    var id = hrefURL.match(/[0-9]+$/i)[0];
    

    var deadlineString = deadlineNode.firstChild.data;
    var name = aTableNode.firstChild.firstChild.data;

    // create a date object to represent deadline
    var deadlineDate = DateParser.parseUkrDateStr(deadlineString);
    
    var diff = DeadlineValidityChecker.deadlineStatus(deadlineDate);
    // Debug.lg("diff : " + diff);
    return diff >= 0 ?
        new AssignmentClass.Assignment(name, deadlineDate, week, id, courseId) :
        null;
}

//#endregion
module.exports.getAllCoursesList = getAllCoursesList;
module.exports.getCourseAssignments = getCourseAssignments;
module.exports.getResourcesUrls = getResourcesUrls;
module.exports.getAssignmentDescription = getAssignmentDescription;
module.exports.test = test;


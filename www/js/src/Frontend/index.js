// #region require
var AccountManager = require('../Backend/AccountManager');
// var CacheManager = require('../Backend/CacheManager');
var AssignmentManager = require('../Backend/AssignmentManager');
var Debug = require("../Backend/Debug");
var DisteduDownloader = require("../Backend/DIsteduDownloader");

var courses;
var chosenCourses=[];
var assignments;
// #endregion


$(window).on('load', function () {
    loadAssignments();
});

function addAssignmentsToIndex(){
    var template = '<a href="#" class="task-url">\n' +
        '                    <div class="task">\n' +
        '\n' +
        '                        <div class="task-content">\n' +
        '                            <p class="subj-name"></p>\n' +
        '                            <p class="deadline"></p>\n' +
        '                        </div>\n' +
        '\n' +
        '                    </div>\n' +
        '                </a>';

    assignments.forEach(function(item, i, arr){
        var node=$(template);
        // node.find(".subj-name").text(item.courseName+' - '+item.name);
        node.find(".subj-name").text(item.name);
        node.find(".deadline").text(item.deadline);
        node.find(".task").click(openTask);
        $(".tasks-center").append(node);
    });
}

function openTask(){

    var index=$(this).parent().index();

    $("#task-title").text(assignments[index].name);
    $(".task-text").text(assignments[index].assignmentDescription);

    if ($(this).attr("id") == "done") $("#task-done").prop('disabled', true);
    else {
        $("#task-done").prop('disabled', false);
        $("#task-done").click(function(){
            markAsDone(index);
        });
    }
    $(".task-box").css("display", "block");

}

function markAsDone(index){
    // AssignmentManager.markAsCompleted(assignments[index].id);
    $(".task-url").eq(index).find(".task").css("background-color", "#C2BD84");
    $(".task-url").eq(index).find(".task").attr('id','done');
    $(".task-box").css("display", "none");
    // $(".task-url").eq(index).css("display", "none");
}

function loadAssignments(){

    assignments=[];
    var test={
        name: "nameofassign",
        courseName: "ОКА",
        courseId: 2,
        deadline: "25.12.2017",
        assignmentDescription: "Blahblahblah"

    };
    assignments.push(test);
    test={
        name: "nameofassign2",
        courseName: "ПП",
        courseId: 1,
        deadline: "27.12.2017",
        assignmentDescription: "quwhuwiehql"

    };
    assignments.push(test);
    test={
        name: "nameofassign3",
        courseName: "НІТ",
        courseId: 3,
        deadline: "26.12.2017",
        assignmentDescription: "dfhfjghfdgbhg"

    };
    assignments.push(test);
    addAssignmentsToIndex();

//     AssignmentManager.tryLoadSerializedAssignments(function(){
//
//         AssignmentManager.update(function(data) {
//             // assignments=data;
//
//
//
//
//
//             Debug.lg("ASSIGN"+assignments);
//
//
//             addAssignmentsToIndex();
//
//
//
//         }, function (error) {
//             Debug.lge(error);
//         });
//     }, function (error) {
//         Debug.lge(error);
// })
};

function removeDiscipline(){
    var li=$(this).parent();
    var index= $("#disciplines-list li").index(li);
    $("#disciplines-select").append('<option selected="selected">'+(li.text().slice(0,-1))+'</option>');
    $("#disciplines-list li").eq(index).remove();

    courses.push(chosenCourses[index]);
    chosenCourses.splice(index,1);
}

$("#disciplines-add").click(function(){
    var discNode=$("#disciplines-select option:selected");
    var index=$("#disciplines-select option:selected").index();
    var discipline=discNode.text();
    // alert(discipline);
    $("#disciplines-select option:selected").remove();

    chosenCourses.push(courses[index]);
    courses.splice(index,1);


    var template = '<li><span></span><a href="#" class="disciplines-remove">x</a></li>';
    var node=$(template);
    node.find('span').text(discipline);
    node.find(".disciplines-remove").click(removeDiscipline);
    $("#disciplines-list").append(node);

});


$("#disciplines-ok").click(function(){
    Debug.init();
    courses.forEach(function(item, i, arr){
        Debug.lg(item.course);
    });
    chosenCourses.forEach(function(item, i, arr){
        Debug.lg(item.course);
    });


    AssignmentManager.saveUserAssignmentsArr(chosenCourses,function (futureAssignments1D) {

        loadAssignments();
        
        $(".content-box-container").css("display", "none");
        $(".menu").css("display", "none");
    }), function (error) {
        Debug.lge(error);
    }
});


$(".disciplines-remove").click(removeDiscipline);


$(".menu-button").click(function(){
    $(".menu").css("display", "-webkit-box");
});

$(".close-menu").click(function(){
    $(".menu").css("display", "none");
});



$("#disciplines").click(function(){
    DisteduDownloader.getAllCoursesList(function(data){
        courses=data;
        courses.forEach(function(item, i, arr){
            $("#disciplines-select").append('<option selected="selected">'+item.course+'</option>');
        });
        $(".disciplines-box").css("display", "block");
    });

});

$(".close-content-box").click(function(){
    $(".content-box-container").css("display", "none");
});

$("#logout").click(function(){
    Debug.init();
    AccountManager.rewriteLoginPassWord(' ',' ', function(){window.location.href = './login.html';}, function(error){Debug.lge(error);});

});




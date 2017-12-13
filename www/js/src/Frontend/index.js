// #region require
var AccountManager = require('../Backend/AccountManager');
var CacheManager = require('../Backend/CacheManager');
var Debug = require("../Backend/Debug");
var DisteduDownloader = require("../Backend/DIsteduDownloader");

// #endregion


function removeDiscipline(){
    var li=$(this).parent();
    var index= $("#disciplines-list li").index(li);
    $("#disciplines-select").append('<option selected="selected">'+(li.text().slice(0,-1))+'</option>');
    $("#disciplines-list li").eq(index).remove();
}

$("#disciplines-add").click(function(){
    var discipline=$("#disciplines-select option:selected").text();
    // alert(discipline);
    $("#disciplines-select option:selected").remove();
    $("#disciplines-list").append('<li>'+discipline+'<a href="#" class="disciplines-remove">x</a></li>');
    $(".disciplines-remove").click(removeDiscipline);
});


$(".disciplines-remove").click(removeDiscipline);


$(".menu-button").click(function(){
    $(".menu").css("display", "-webkit-box");
});

$(".close-menu").click(function(){
    $(".menu").css("display", "none");
});

$(".task-url").click(function(){
    $(".task-box").css("display", "block");
});

$("#disciplines").click(function(){
    $(".disciplines-box").css("display", "block");
});

$(".close-content-box").click(function(){
    $(".content-box-container").css("display", "none");
});

$("#logout").click(function(){
    Debug.init();
    AccountManager.rewriteLoginPassWord(' ',' ', function(){window.location.href = './login.html';}, function(error){Debug.lge(error);});

});




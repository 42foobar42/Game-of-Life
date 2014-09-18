/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var windowwidth;

function controls() {
    $("input#gameStart").click(function() {
        GameOfLife.build($("input#lengthOfCell").val(), $("input#numOfRows").val(), $("input#loneliness").val(), $("input#birthrateMax").val(),
                $("input#birthrateMin").val(), $("input#overpopulation").val(), $("input#NumOfPalyers").val());
        $("div#menu").show();
        $("div#playground").show();
        $("div#mainmenu").hide();
    });
    $("input#numOfRows").change(function() {
        correctFieldWith();
    });
    $("input#numOfRows").keyup(function() {
        correctFieldWith();
    });
    $("input#lengthOfCell").change(function() {
        correctFieldCount();
    });
    $("input#lengthOfCell").keyup(function() {
        correctFieldCount();
    });
}

function correctFieldCount() {
    var fieldWidth = parseInt($("input#lengthOfCell").val());
    $("input#numOfRows").val(Math.floor(windowwidth / fieldWidth));
}

function correctFieldWith() {
    var noOfFields = parseInt($("input#numOfRows").val());
    $("input#lengthOfCell").val(Math.floor(windowwidth / noOfFields));
}

function initVals() {
    windowwidth = $(document).width();
    correctFieldWith();

    console.log(windowwidth);
}

$(document).ready(function() {
// Handler for .ready() called.
    //GameOfLife.init(60, 60, 50, 50);
    $("div#menu").hide();
    $("div#playground").hide();
    $("div#statistics").hide();
    initVals();
    controls();
    GameOfLife.init();
    //makeField();
    //buttons();
});

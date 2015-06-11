/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var windowwidth;
var MIN_FIELD_WIDTH =  6;
var MAX_FIELD_WIDTH = 200;

function controls() {    
    $("input#gameStart").click(function() {
        var fieldWidth = parseInt($("input#lengthOfCell").val());
        var numberOfPlayers = parseInt($("input#NumOfPalyers").val());
        console.log(numberOfPlayers);
        if(fieldWidth <= MIN_FIELD_WIDTH){
            alert("Edge Length is lower than " + MIN_FIELD_WIDTH + ". Please chosse a higher length!");
            return ;
        }
        if(fieldWidth > MAX_FIELD_WIDTH){
            alert("Edge Length is higher than " + MAX_FIELD_WIDTH + ". Please chosse a lower length!");
            return ;
        }
        if(numberOfPlayers > 8 || numberOfPlayers < 1){
            alert("The number of Players is invalid. Please chosse a number between 1 and 8!");
            return ;
        }
        var bornRule = [];  
        var deathRule = [];
        $("input.brcheckbox:checked").each(function() {
            bornRule.push(parseInt($( this ).val()));
        });
        $("input.drcheckbox:checked").each(function() {
            deathRule.push(parseInt($( this ).val()));
        });        
        GameOfLife.build($("input#lengthOfCell").val(), $("input#numOfRows").val(), $("input#NumOfPalyers").val(), bornRule, deathRule);
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
    $("input.brcheckbox").click(function() {        
        if($(this).prop("checked")){            
            var cBox = $("input.drcheckbox[value=" + $(this).val() + "]");
            if(cBox.prop("checked")){
                cBox.prop("checked",false);
            }
        }        
    });
    $("input.drcheckbox").click(function() {        
        if($(this).prop("checked")){            
            var cBox = $("input.brcheckbox[value=" + $(this).val() + "]");
            if(cBox.prop("checked")){
                cBox.prop("checked",false);
            }
        }        
    });
}

function correctFieldCount() {
    var fieldWidth = parseInt($("input#lengthOfCell").val());
    if(fieldWidth < MIN_FIELD_WIDTH){
        fieldWidth = MIN_FIELD_WIDTH;
    }
    $("input#numOfRows").val(Math.floor(windowwidth / fieldWidth));
}

function correctFieldWith() {
    var noOfFields = parseInt($("input#numOfRows").val());
    $("input#lengthOfCell").val(Math.floor(windowwidth / noOfFields));
}

function initVals() {
    windowwidth = $(document).width();
    correctFieldWith();    
}

$(document).ready(function() {
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

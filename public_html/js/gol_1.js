/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var WidthOfField = 50;
var HeightOfField = 50;
var WidthCount = 60;
var HeightCount = 60;
var row;
var column;
var timer;
var run = false;
var field = [];
var isCalculating = false;
var ColorCount;
var round =0;

function play() {
    run = true;
    if (isCalculating === false) {
        isCalculating = true;
        $("input#roundcount").val(round);
        var ColorCount = { "green":0, "black":0};
        var blacks = [];
        var greens = [];
        //console.log(new Date());
        $("div.field").removeClass("green");
        $("div.field").removeClass("black");
        //console.log(field);
        //console.log(ColorCount);
        calculateField();
        //console.log(field);
        //console.log(field);
        for (row = 0; row < HeightCount; row++) {
            for (column = 0; column < WidthCount; column++) {
                if (field[row][column] === 0) {
                    $("#" + row + "_" + column).addClass("black");
                    ColorCount.black++;
                }
                if (field[row][column] === 1){
                    $("#" + row + "_" + column).addClass("green");
                   // console.log("green");
                    ColorCount.green++;
                }
            }
        }
        //console.log(ColorCount);
        $("input#greencount").val(ColorCount.green);
        round++;
        isCalculating = false;        
    }
}

function calculateField() {
    //var tempField = field.slice();
    var tempField = [];
    for (var i = 0; i < HeightCount; i++) {
        tempField[i] = [];
        for (var d = 0; d < WidthCount; d++) {
            tempField[i][d] = field[i][d];
            tempField = checkNeighbours(i, d, tempField);
        }
    }
    field = tempField.slice();
}

function checkNeighbours(r, c, tfield) {
    var obj = {"green": 0, "black": 0};
    var sx = r - 1;
    var sy = c - 1;
    var ex = r + 1;
    var ey = c + 1;
    for (var i = sx; i <= ex; i++) {
        for (var d = sy; d <= ey; d++) {
            if ((typeof field[i] !== "undefined") && (i !== r || d !== c)) {
                // console.log(i);
                if (field[i][d] === 0) {
                    obj.black++;
                }
                if (field[i][d] === 1) {
                    obj.green++;
                }
            } /*else {
             if (r === 2 && c === 2) {                    
             console.log(i + " != " + r + " && " + d + " != " + c);
             }
             }*/
        }
    }
    if (field[r][c] === 0 && obj.green === 3) {
        tfield[r][c] = 1;
    }
    if (field[r][c] === 1 && (obj.green <= 1 || obj.green > 3)) {
        tfield[r][c] = 0;
        //console.log("green");
    }
    return tfield;
}

function getNeighbours(r, c) {
    r = parseInt(r);
    c = parseInt(c);
    var obj = {"green": 0, "black": 0};
    var sx = r;
    var sy = c;
    var ex = r;
    var ey = c;
    if (sx > 0)
        sx--;
    if (sy > 0)
        sy--;
    if (ex < row)
        ex++;
    if (ey < column)
        ey++;
    //console.log(sx + " " + sy +" " + ex + " " + ey);
    for (var i = sx; i <= ex; i++) {
        for (var d = sy; d <= ey; d++) {
            //console.log("check this");
            if (!(d === c && i === r)) {
                //console.log("check this");
                if ($("div#" + i + "_" + d).hasClass("black"))
                    obj.black++;
                if ($("div#" + i + "_" + d).hasClass("green"))
                    obj.green++;
            }
        }
    }
    return obj;
}

function buttons() {
    $("input#start").click(function() {        
        $("div#onOff").removeClass("off");
        $("div#onOff").addClass("on");
        round=0;
        timer = setInterval(function() {
            play();
        }, 200);
    });
    $("input#stop").click(function() {
        run = false;
        $("div#onOff").removeClass("on");
        $("div#onOff").addClass("off");
        clearInterval(timer);
    });
    $("input#clear").click(function() {
        if(run === false){
            $("div.field").removeClass("green");
            $("div.field").addClass("black");    
        }
    });
}

function changeColor(obj) {
    //console.log(obj);
    var pos = $(obj).attr('id').split("_");
    if (run === false) {
        if ($(obj).hasClass("green")) {
            $(obj).removeClass("green");
            $(obj).addClass("black");
            field[pos[0]][pos[1]] = 0;
        } else {
            $(obj).removeClass("black");
            $(obj).addClass("green");
            field[pos[0]][pos[1]] = 1;
        }
    }


}
function makeField() {
    var menuheight = $("div#menu").height();
    var windowheight = $(document).height();
    var windowwidth = $(document).width() - 17;
    //var widthOfElement = (windowwidth - (windowwidth % WidthCount))/WidthCount;
    //console.log(widthOfElement);
    console.log(document.documentElement.offsetWidth);
    console.log(window);
    console.log(windowwidth);
    console.log(document.documentElement.scrollWidth);
    // console.log((windowheight - menuheight)/ HeightOfField);
    console.log(Math.floor(windowwidth / WidthCount));
    var innerHTML = "";
    //for (row = 0; row < ((windowheight - menuheight) / HeightOfField); row++) {
    for (row = 0; row < HeightCount; row++) {
        innerHTML += "<div class='row' id='row_" + row + "'>";
        //for (column = 0; column < (windowwidth / WidthOfField) - 2; column++) {
        field[row] = [];
        for (column = 0; column < WidthCount; column++) {
            field[row][column] = 0;
            //$("#playground").append("<div class='field' id='"+row + "_"+ column+"'></div>")
            innerHTML += "<div style='width:" + Math.floor(windowwidth / WidthCount) + "px;height:" + Math.floor(windowheight / HeightCount) + "px; ";
            if (column === 0)
                innerHTML += "clear:both";
            innerHTML += "' class='field black' id='" + row + "_" + column + "' onclick='changeColor(this);'></div>";
        }
        innerHTML += "</div>";
        //$("#playground").append("<div class='field' id='"+row + "_"+ column+"'></div>")
    }
    //console.log(field);
    $("#playground").html(innerHTML);
    console.log(windowwidth);
}

$(document).ready(function() {
// Handler for .ready() called.
    makeField();
    buttons();
});

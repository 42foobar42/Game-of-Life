/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var GameOfLife = (function() {
    var WidthOfField = 50;
    var HeightOfField = 50;
    var WidthCount = 60;
    var HeightCount = 60;
    var row, column, timer, loneliness, brithrateMin, brithrateMax, overpopulation;
    var run = false;
    var field = [];
    var isCalculating = false;
    var round = 0;
    var ColorCount = {"black": 0, "green": 0,  "red":0, "yellow":0, "blue":0, "white":0, "cyan":0, "magenta":0, "orange":0};

    function play() {
        run = true;
        if (isCalculating === false) {
            isCalculating = true;
            $("input#roundcount").val(round);
            var changes = calculateField();
            for (var i = 0; i < changes.length; i++) {
                switch (changes[i][1]) {
                    case 0:
                        $("div#" + changes[i][0]).removeClass("green");
                        $("div#" + changes[i][0]).addClass("black");
                        ColorCount.black++;
                        ColorCount.green--;
                        break;
                    case 1:
                        $("div#" + changes[i][0]).removeClass("black");
                        $("div#" + changes[i][0]).addClass("green");
                        ColorCount.black--;
                        ColorCount.green++;
                        break;
                }
            }
            $("input#greencount").val(ColorCount.green);
            round++;
            isCalculating = false;
        }
    }

    function calculateField() {
        //var tempField = field.slice();
        var changes = [];
        var tempField = [];
        for (var i = 0; i < HeightCount; i++) {
            tempField[i] = [];
            for (var d = 0; d < WidthCount; d++) {
                tempField[i][d] = field[i][d];
                temp = checkNeighbours(i, d, tempField);
                tempField = temp[0];
                if (temp[1].length > 0) {
                    //console.log(temp[1]);
                    //changes.push(temp[1]);
                    changes[changes.length] = temp[1];
                }
            }
        }
        field = tempField.slice();
        return changes;
    }

    function checkNeighbours(r, c, tfield) {
        var obj = {"green": 0, "black": 0};
        var change = [];
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
                }
            }
        }        
        if (field[r][c] === 0 && obj.green >= brithrateMin &&  obj.green <= brithrateMax) {
            tfield[r][c] = 1;
            change = [r + "_" + c, 1];
        }
        if (field[r][c] === 1 && (obj.green < loneliness || obj.green > overpopulation)) {
            tfield[r][c] = 0;
            change = [r + "_" + c, 0];
            //console.log("green");
        }
        return [tfield, change];
    }

    function buttons() {
        $("input#start").click(function() {
            $("div#onOff").removeClass("off");
            $("div#onOff").addClass("on");
            //field = [];
            round = 0;
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
            if (run === false) {
                clearAll();
            }
        });
        $("input#back").click(function() {
            if (run === false) {
                var answer = confirm("Stop Game and back to Mainmenu?");
                if (answer === true) {
                    clearAll();
                    $("#playground").html("");
                    $("div#menu").hide();
                    $("div#playground").hide();
                    $("div#mainmenu").show();
                }
            }
        });
    }
    function clearAll() {
        $("div.field").removeClass("green");
        $("div.field").addClass("black");
        for (var i = 0; i < field.length; i++) {
            for (var d = 0; d < field[i].length; d++) {
                field[i][d] = 0;
            }
        }
        $("input#roundcount").val(0);
        $("input#greencount").val(0);
    }
    function makeField() {
        var windowheight = $(document).height();
        /*var menuheight = $("div#menu").height();
         var windowheight = $(document).height();
         var windowwidth = $(document).width() - 17;*/
        //var widthOfElement = (windowwidth - (windowwidth % WidthCount))/WidthCount;
        //console.log(widthOfElement);
        /*console.log(document.documentElement.offsetWidth);
        console.log(window);
        console.log(windowwidth);
        console.log(document.documentElement.scrollWidth);
        // console.log((windowheight - menuheight)/ HeightOfField);
        console.log(Math.floor(windowwidth / WidthCount));*/
        var innerHTML = "";
        //for (row = 0; row < ((windowheight - menuheight) / HeightOfField); row++) {
        for (row = 0; row < HeightCount; row++) {
            innerHTML += "<div class='row' id='row_" + row + "'>";
            //for (column = 0; column < (windowwidth / WidthOfField) - 2; column++) {
            field[row] = [];
            for (column = 0; column < WidthCount; column++) {
                field[row][column] = 0;
                //$("#playground").append("<div class='field' id='"+row + "_"+ column+"'></div>")
                innerHTML += "<div style='width:" + WidthOfField + "px;height:" + HeightOfField + "px; ";
                if (column === 0)
                    innerHTML += "clear:both";
                innerHTML += "' class='field black' id='" + row + "_" + column + "' onclick='GameOfLife.changeColor(this);'></div>";
            }
            innerHTML += "</div>";
            //$("#playground").append("<div class='field' id='"+row + "_"+ column+"'></div>")
        }
        //console.log(field);
        $("#playground").html(innerHTML);
        console.log(windowwidth);
    }
    return {
        init: function(length, count, lone, maxbirth, minBrith, overpop) {
            /*WidthOfField = widthOF;
             HeightOfField = heightOF;*/
            console.log(arguments);
            loneliness = lone;
            brithrateMin = minBrith;
            brithrateMax = maxbirth; 
            overpopulation = overpop;
            WidthCount = count;
            /*var AbsHeight = Math.floor(($(document).height() - $("div#menu").height()) / count);
            //var AbsWidth = parseInt( Math.floor(windowwidth / length));
            console.log( AbsHeight);
            console.log( length);
            if(AbsHeight * count > windowwidth){
                WidthOfField = HeightOfField = length;
            } else {
                WidthOfField = HeightOfField = AbsHeight;
            }*/
            WidthOfField = HeightOfField = length;
            HeightCount = Math.floor(($(document).height() - $("div#menu").height()) / length);
            buttons();
            makeField();
            return GameOfLife;
        },
        changeColor: function(obj) {
            //console.log(obj);
            var pos = $(obj).attr('id').split("_");
            if (run === false) {
                if ($(obj).hasClass("green")) {
                    $(obj).removeClass("green");
                    $(obj).addClass("black");
                    ColorCount.green--;
                    ColorCount.black++;
                    field[pos[0]][pos[1]] = 0;
                } else {
                    $(obj).removeClass("black");
                    $(obj).addClass("green");
                    ColorCount.green++;
                    ColorCount.black--;
                    field[pos[0]][pos[1]] = 1;
                }
            }


        }
    };
}(window));


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
    var row, column, timer, loneliness, brithrateMin, brithrateMax, overpopulation, players;
    var run = false;
    var field = [];
    var isCalculating = false;
    var round = 0;
    var ColorCount = {"black": 0, "green": 0, "red": 0, "yellow": 0, "blue": 0, "white": 0, "cyan": 0, "magenta": 0, "orange": 0};
    var Colors = ["black", "green", "red", "yellow", "blue", "white", "cyan", "magenta", "orange"];

    function play() {
        run = true;
        if (isCalculating === false) {
            isCalculating = true;
            $("input#roundcount").val(round);
            var changes = calculateField();
            for (var i = 0; i < changes.length; i++) {
                var clsName = $("div#" + changes[i][0]).attr('class');
                clsName = clsName.replace("field", "").trim();
                //console.log(clsName);
                switch (changes[i][1]) {
                    case 0:
                        $("div#" + changes[i][0]).removeClass(clsName);
                        $("div#" + changes[i][0]).addClass("black");
                        ColorCount.black++;
                        ColorCount[clsName]--;
                        break;
                    default:
                        $("div#" + changes[i][0]).removeClass(clsName);
                        //console.log(changes[i][1]);
                        $("div#" + changes[i][0]).addClass(Colors[changes[i][1]]);
                        ColorCount[clsName]--;                      
                        ColorCount[Colors[changes[i][1]]]++;
                        break;
                }
            }
            //$("input#greencount").val(ColorCount.green);
            $("input#count").val(ColorCount[Colors[$("select#players").val()]]);
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
        //console.log("end calc");
        //clearInterval(timer);
        field = tempField.slice();
        return changes;
    }

    function checkNeighbours(r, c, tfield) {
        var obj = {"black": 0, "green": 0, "red": 0, "yellow": 0, "blue": 0, "white": 0, "cyan": 0, "magenta": 0, "orange": 0};
        var change = [];
        var sx = r - 1;
        var sy = c - 1;
        var ex = r + 1;
        var ey = c + 1;
        for (var i = sx; i <= ex; i++) {
            for (var d = sy; d <= ey; d++) {
                if ((typeof field[i] !== "undefined") && (i !== r || d !== c)) {
                    // console.log(i);
                    /*if (field[i][d] === 0) {
                     obj.black++;
                     }
                     if (field[i][d] === 1) {
                     obj.green++;
                     }*/
                    obj[Colors[field[i][d]]]++;
                }
            }
        }
        if (field[r][c] === 0) {
            // && obj.green >= brithrateMin && obj.green <= brithrateMax
            for (key in obj) {
                if (key !== "black" && obj[key] >= brithrateMin && obj[key] <= brithrateMax) {
                    //console.log(key + " = " + obj[key]);
                    //console.log(r + ", " + c);
                    tfield[r][c] = Colors.indexOf(key);
                    change = [r + "_" + c, tfield[r][c]];
                }
            }
        }
        if (field[r][c] !== 0) {
            // && (obj.green < loneliness || obj.green > overpopulation)
            // field[r][c]
            //for (key in obj) {
                if (obj[Colors[field[r][c]]] < loneliness || obj[Colors[field[r][c]]] > overpopulation) {
                    //console.log(obj[Colors[field[r][c]]]);
                    tfield[r][c] = 0;
                    change = [r + "_" + c, 0];
                }
            //}
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
                //var answer = confirm("Stop Game and back to Mainmenu?");
                if (confirm("Stop Game and back to Mainmenu?") === true) {
                    clearAll();
                    $("#playground").html("");
                    $("div#menu").hide();
                    $("div#playground").hide();
                    $("div#mainmenu").show();
                }
            }
        });
        $("select#players").change(function() {
            $("input#count").val(ColorCount[Colors[$("select#players").val()]]);
            for (var i = 0; i < Colors.length; i++) {
                $(this).removeClass(Colors[i]);
                $("input#count").removeClass(Colors[i]);
            }
            $(this).addClass(Colors[$("select#players").val()]);
            $("input#count").addClass(Colors[$("select#players").val()]);
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
        for(key in ColorCount){
            ColorCount[key] = 0;
        }
        ColorCount.black = row * column;
        // clear all counts
        $("input#roundcount").val(0);
        $("input#count").val(0);
    }
    function makeField() {
        //var windowheight = $(document).height();
        var innerHTML = "";
        for (row = 0; row < HeightCount; row++) {
            innerHTML += "<div class='row' id='row_" + row + "'>";
            field[row] = [];
            for (column = 0; column < WidthCount; column++) {
                field[row][column] = 0;
                innerHTML += "<div style='width:" + WidthOfField + "px;height:" + HeightOfField + "px; ";
                if (column === 0)
                    innerHTML += "clear:both";
                innerHTML += "' class='field black' id='" + row + "_" + column + "' onclick='GameOfLife.changeColor(this);'></div>";
            }
            innerHTML += "</div>";
        }
        ColorCount.black = row * column;
        $("#playground").html(innerHTML);
        console.log(windowwidth);
    }
    return {
        init: function(length, count, lone, maxbirth, minBrith, overpop, plys) {
            var selectBox = document.createElement("select");
            selectBox.setAttribute('id', 'players');
            /*WidthOfField = widthOF;
             HeightOfField = heightOF;*/
            loneliness = lone;
            brithrateMin = minBrith;
            brithrateMax = maxbirth;
            overpopulation = overpop;
            WidthCount = count;
            players = plys;
            for (var i = 0; i < plys; i++) {
                var opt = document.createElement('option');
                opt.value = i + 1;
                opt.innerHTML = "Player " + (i + 1);
                opt.className = Colors[i + 1];
                selectBox.appendChild(opt);
            }
            $("div#players").html(selectBox);
            WidthOfField = HeightOfField = length;
            HeightCount = Math.floor(($(document).height() - $("div#menu").height()) / length);
            buttons();
            makeField();
            $("select#players").addClass(Colors[$("select#players").val()]);
            $("input#count").addClass(Colors[$("select#players").val()]);
            return GameOfLife;
        },
        changeColor: function(obj) {
            //console.log(obj);
            var pos = $(obj).attr('id').split("_");
            var playerIdx = $("select#players").val();
            if (run === false) {
                if ($(obj).hasClass("black")) {
                    $(obj).removeClass("black");
                    $(obj).addClass(Colors[playerIdx]);
                    ColorCount[Colors[playerIdx]]++;
                    ColorCount.black--;
                    field[pos[0]][pos[1]] = playerIdx;
                } else {
                    for (var i = 0; i < Colors.length; i++) {
                        if ($(obj).hasClass(Colors[i])) {
                            $(obj).removeClass(Colors[i]);
                            ColorCount[Colors[i]]--;
                            //console.log(i + " === " + playerIdx);
                            if (i === parseInt( playerIdx)) {
                                //console.log("black?");
                                $(obj).addClass("black");
                                ColorCount.black++;
                                field[pos[0]][pos[1]] = 0;
                            } else {
                                $(obj).addClass(Colors[playerIdx]);
                                ColorCount[Colors[playerIdx]]++;
                                field[pos[0]][pos[1]] = playerIdx;
                            }
                            break;
                        }
                    }
                }
            }
            $("input#count").val(ColorCount[Colors[$("select#players").val()]]);
        }
    };
}(window));


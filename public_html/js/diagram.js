/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var diagram = (function() {
    var wrapper, height, width, data = [], options, g = {}, min, max, gridHeight, gridWidth, MaxW, startX, startY, endX, endY, pxPerY, pxPerX, diffY;
    var XgridLength = 10;
    var YgridLength = 10;
    var fontheight = 10;
    function makeGrid() {
        max = 0;
        min = 0;
        gridHeight = height * .9;
        gridWidth = width * .9;
        startX = (width - gridWidth) / 2;
        startY = (height - gridHeight) / 2;
        endX = startX + gridWidth;
        endY = startY + gridHeight;
        for (var i = 0; i < data.length; i++) {
            var dat = data[i];
            for (var j = 0; j < dat[0].length; j++) {
                if (dat[0][j] < min)
                    min = dat[0][j];
                if (dat[0][j] > max)
                    max = dat[0][j];
            }
        }
        g.ctx.strokeStyle = "#000000";
        g.ctx.beginPath();
        g.ctx.moveTo(startX, startY);
        //g.ctx.strokeText(max, startX-50, startY);
        g.ctx.lineTo(startX, endY + YgridLength);
        g.ctx.stroke();

        g.ctx.strokeText(min, startX - 10, endY);
        g.ctx.strokeText(0, startX, endY + 10);

        g.ctx.beginPath();
        g.ctx.lineTo(startX - XgridLength, endY);
        g.ctx.lineTo(endX, endY);
        //g.ctx.strokeText(options.rounds, endX, endY+10);
        g.ctx.stroke();

        // TODO check if diffY smaller than 10
        diffY = max - min;
        pxPerY = diffY / gridHeight;
        pxPerX = (options.rounds) / gridWidth;
        for (var i = 0; i <= 10; i++) {

            if (diffY >= 10) {
                if (i !== 0) {
                    // Y scale
                    g.ctx.strokeStyle = "#000000";
                    g.ctx.beginPath();
                    var actHeight = endY - (i * (gridHeight / 10));
                    g.ctx.moveTo(startX - XgridLength, actHeight);
                    g.ctx.lineTo(startX + XgridLength, actHeight);
                    g.ctx.strokeText(Math.floor(pxPerY * (i * (gridHeight / 10))), startX - 10, actHeight);
                    g.ctx.stroke();

                    g.ctx.strokeStyle = "#D3D3D3";
                    g.ctx.beginPath();
                    g.ctx.moveTo(startX + XgridLength, actHeight);
                    g.ctx.lineTo(startX + gridWidth, actHeight);
                    g.ctx.stroke();
                }
            }

            if (options.rounds >= 10) {
                // X Scale
                if (i !== 10) {
                    g.ctx.strokeStyle = "#000000";
                    g.ctx.beginPath();
                    var actWidth = endX - (i * (gridWidth / 10));
                    g.ctx.moveTo(actWidth, endY + YgridLength);
                    g.ctx.lineTo(actWidth, endY - YgridLength);
                    g.ctx.strokeText((options.rounds - 1) - Math.floor(pxPerX * (i * (gridWidth / 10))), actWidth, endY + fontheight + YgridLength);
                    g.ctx.stroke();

                    g.ctx.strokeStyle = "#D3D3D3";
                    g.ctx.beginPath();
                    g.ctx.moveTo(actWidth, endY - YgridLength);
                    g.ctx.lineTo(actWidth, endY - gridHeight);
                    g.ctx.stroke();
                }
            }
        }
        if (options.rounds < 10) {
            for (var i = 1; i < options.rounds; i++) {
                g.ctx.strokeStyle = "#000000";
                g.ctx.beginPath();
                var actWidth = startX + (i * (gridWidth / (options.rounds - 1)));
                g.ctx.moveTo(actWidth, endY + YgridLength);
                g.ctx.lineTo(actWidth, endY - YgridLength);
                g.ctx.strokeText(i, actWidth, endY + fontheight + YgridLength);
                g.ctx.stroke();

                g.ctx.strokeStyle = "#D3D3D3";
                g.ctx.beginPath();
                g.ctx.moveTo(actWidth, endY - YgridLength);
                g.ctx.lineTo(actWidth, endY - gridHeight);
                g.ctx.stroke();
            }
        }
        if (diffY < 10) {
            for (var i = 0; i <= diffY; i++) {
                g.ctx.strokeStyle = "#000000";
                g.ctx.beginPath();
                var actHeight = endY - (i * (gridHeight / diffY));
                g.ctx.moveTo(startX - XgridLength, actHeight);
                g.ctx.lineTo(startX + XgridLength, actHeight);
                g.ctx.strokeText(i, startX - 10, actHeight);
                g.ctx.stroke();
            }
        }
    }
    function drawData() {
        var ppV = gridHeight / (max - min);
        var ppR = Math.floor(gridWidth / MaxW);
        var widthSpace = gridWidth / (options.rounds - 1);

        for (var i = 0; i < data.length; i++) {
            var dat = data[i];
            //console.log(dat[0]);
            g.ctx.strokeStyle = dat[1];
            g.ctx.beginPath();
            var Yfactor = gridHeight / diffY;
            g.ctx.moveTo(startX, endY - (dat[0][0] * Yfactor));            //-(dat[0][0]*ppV)
            for (var d = 1; d < dat[0].length; d++) {                
                g.ctx.lineTo(startX + (widthSpace * d), endY - (dat[0][d] * Yfactor));

            }
            g.ctx.stroke();
        }
    }

    function createCanvas() {
        g.canvas = document.createElement("canvas");
        g.canvas.width = width;
        g.canvas.height = height;
        //console.log(height);
        g.ctx = g.canvas.getContext("2d");
        wrapper.appendChild(g.canvas);
    }
    return {
        init: function(divId, h, w) {
            wrapper = document.getElementById(divId);
            data = [];
            //console.log(wrapper);
            if (typeof h === "undefined") {
                height = wrapper.style.height;
            } else {
                height = h;
            }
            if (typeof w === "undefined") {
                width = wrapper.style.width;
            } else {
                width = w;
            }
            createCanvas();
            return diagram;
        },
        addData: function(d, color, desc) {
            var temp = [];
            temp.push(d, color, desc);
            data.push(temp);
            return diagram;
        },
        clearData:function(){
            data = [];
        },
        setOptions: function(op) {
            options = op;
        },
        draw: function() {
            g.ctx.clearRect(0, 0, g.canvas.width, g.canvas.height);
            makeGrid();
            drawData();
        }
    };
}(window));



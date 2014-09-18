/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var diagram = (function() {
    var wrapper, height, width, data = [], options, g = {}, min, max, gridHeight, gridWidth, MaxW, startX,startY;
    function makeGrid() {
        gridHeight = height * .9;
        gridWidth = width * .9;
        startX = (width-gridWidth )/2;
        startY = (height - gridHeight)/2;
        MaxW = 0;
        min = 0;
        max = 0;
        //console.log(data);
        for (var i = 0; i < data.length; i++) {
            var dat = data[i];
            for (var j = 0; j < dat[0].length; j++) {
                if (dat[0][j] < min)
                    min = dat[0][j];
                if (dat[0][j] > max)
                    max = dat[0][j];
                if (j > MaxW)
                    MaxW += 1;
            }
        }
        g.ctx.beginPath();
        g.ctx.moveTo(startX, gridHeight);
        g.ctx.lineTo(startX, height - gridHeight);
        g.ctx.stroke();
        g.ctx.moveTo(startX, gridHeight);
        g.ctx.lineTo(gridWidth, gridHeight);
        g.ctx.stroke();
        //var ppV = gridHeight / (max - min);
        var Hscale = max - min;
        var diffsH = gridHeight / 11;
        var diffsW = gridWidth / 11;
        // console.log(diffs);

        // check if weniger als 10 werte
        // und check wenn skala ist kleiner 10
        // check text length
        for (var i = 0; i < 10; i++) {
            g.ctx.beginPath();
            g.ctx.moveTo(startX * 0.9, gridHeight - (i * diffsH));
            g.ctx.lineTo(startX * 1.1, gridHeight - (i * diffsH));
            g.ctx.stroke();
            g.ctx.strokeText(Math.floor((Hscale / 10) * i), startX * 0.9, gridHeight - (i * diffsH) - 2);
            g.ctx.beginPath();
            g.ctx.moveTo((gridWidth-startX ) - (i * diffsW), (gridHeight) * 0.95);
            g.ctx.lineTo((gridWidth-startX ) - (i * diffsW), (gridHeight) * 1.05);
            g.ctx.stroke();
            g.ctx.strokeText(Math.floor((MaxW / 10) * i), width - (gridWidth - (i * diffsW)), (gridHeight) * 1.05);
            //g.ctx.beginPath();
            //g.ctx.moveTo((width - gridWidth) * 1.1, gridHeight - (i * diffs));

        }
        g.ctx.beginPath();
        g.ctx.moveTo(startX * 0.9, height - gridHeight);
        g.ctx.lineTo(startX * 1.1, height - gridHeight);
        g.ctx.stroke();
        g.ctx.beginPath();
        g.ctx.moveTo(width - (width - gridWidth), (gridHeight) * 0.95);
        g.ctx.lineTo(width - (width - gridWidth), (gridHeight) * 1.05);
        g.ctx.stroke();
        g.ctx.strokeText(max, startX * 0.9, height - gridHeight - 2);
        g.ctx.strokeText(MaxW, width - (width - gridWidth), (gridHeight) * 1.05);

    }
    function drawData() {
        var ppV = gridHeight / (max - min);
        var ppR = Math.floor(gridWidth / MaxW);
        var widthSpace =  gridWidth / (options.rounds-1);
        console.log(gridWidth);
        console.log(width);
        console.log("sx: " + startX);
        
        g.ctx.beginPath();
        g.ctx.moveTo(widthSpace*14, 0);
        g.ctx.lineTo(widthSpace*14, 300);
        g.ctx.moveTo(width - gridWidth + widthSpace, 0);
        g.ctx.lineTo(width - gridWidth + widthSpace, 300);
        g.ctx.stroke();
        //console.log(gridWidth);
        console.log(options.rounds + " begin " + widthSpace);
        for (var i = 0; i < data.length; i++) {
            var dat = data[i];
            //console.log(dat[0]);
            g.ctx.strokeStyle = dat[1];
            g.ctx.beginPath();
            g.ctx.moveTo(startX, height - (height - gridHeight) - (dat[0][0] * ppV));            //-(dat[0][0]*ppV)
            for (var d = 1; d < dat[0].length; d++) {
                //console.log(ppR * d);
                g.ctx.lineTo(startX + (widthSpace*d), height - (height - gridHeight) - (dat[0][d] * ppV));                
                //g.ctx.lineTo(width - gridWidth + (widthSpace*d), height - (height - gridHeight) - (dat[0][d] * ppV));
                console.log(d);
                console.log((widthSpace*d));
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
        setOptions: function(op) {
            options = op;
        },
        draw: function() {
            makeGrid();
            drawData();
        }
    };
}(window));



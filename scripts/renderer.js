class Renderer {
    // canvas:              object ({id: __, width: __, height: __})
    // num_curve_sections:  int
    constructor(canvas, num_curve_sections, show_points_flag) {
        this.canvas = document.getElementById(canvas.id);
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = this.canvas.getContext('2d');
        this.slide_idx = 0;
        this.num_curve_sections = num_curve_sections;
        this.show_points = show_points_flag;
    }

    // n:  int
    setNumCurveSections(n) {
        this.num_curve_sections = n;
        this.drawSlide(this.slide_idx);
    }

    // flag:  bool
    showPoints(flag) {
        this.show_points = flag;
        this.drawSlide(this.slide_idx);
    }
    
    // slide_idx:  int
    drawSlide(slide_idx) {
        this.slide_idx = slide_idx;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let framebuffer = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        switch (this.slide_idx) {
            case 0:
                this.drawSlide0(framebuffer);
                break;
            case 1:
                this.drawSlide1(framebuffer);
                break;
            case 2:
                this.drawSlide2(framebuffer);
                break;
            case 3:
                this.drawSlide3(framebuffer);
                break;
        }

        this.ctx.putImageData(framebuffer, 0, 0);
    }

    // framebuffer:  canvas ctx image data
    drawSlide0(framebuffer) {
        this.drawRectangle({x: 50, y: 150}, {x: 400, y: 300}, [2, 100, 100, 255], framebuffer);
    }

    // framebuffer:  canvas ctx image data
    drawSlide1(framebuffer) {
        this.drawCircle({x: 300, y: 300}, 50, [2, 100, 100, 255], framebuffer);
        this.drawCircle({x: 300, y: 300}, 150, [2, 100, 100, 255], framebuffer);
    }

    // framebuffer:  canvas ctx image data
    drawSlide2(framebuffer) {
        this.drawBezierCurve({x: 100, y: 400}, {x: 150, y: 500}, {x: 200, y: 50}, {x: 800, y: 350}, [2, 100, 100, 255], framebuffer);
    }

    // framebuffer:  canvas ctx image data
    drawSlide3(framebuffer) {
        this.drawRectangle({x: 50, y: 400}, {x: 400, y: 420}, [Math.round(Math.random()*200), Math.round(Math.random()*200), 100, 255], framebuffer)
        this.drawRectangle({x: 220, y: 400}, {x: 230, y: 100}, [Math.round(Math.random()*200), Math.round(Math.random()*200), 100, 255], framebuffer)
        this.drawRectangle({x: 220, y: 100}, {x: 100, y: 80}, [Math.round(Math.random()*200), Math.round(Math.random()*200), 100, 255], framebuffer)
        this.drawCircle({x: 400, y: 200}, 80, [Math.round(Math.random()*200), Math.round(Math.random()*200), 100, 255], framebuffer);
        this.drawRectangle({x: 480, y: 200}, {x: 500, y: 80}, [Math.round(Math.random()*200), Math.round(Math.random()*200), 100, 255], framebuffer)
        this.drawBezierCurve({x: 400+270, y: 80+342}, {x: 400+25, y: 80+384}, {x: 400+32, y: 80+11}, {x: 400+320, y: 80+20}, [Math.round(Math.random()*200), Math.round(Math.random()*200), 100, 255], framebuffer);
        this.drawRectangle({x: 700, y: 400}, {x: 750, y: 80}, [Math.round(Math.random()*200), Math.round(Math.random()*200), 100, 255], framebuffer)
        this.drawBezierCurve({x: 725, y: 240}, {x: 750, y: 260}, {x: 775, y: 280}, {x: 790, y: 400}, [Math.round(Math.random()*200), Math.round(Math.random()*200), 100, 255], framebuffer)
        this.drawBezierCurve({x: 725, y: 240}, {x: 750, y: 240}, {x: 775, y: 220}, {x: 790, y: 100}, [Math.round(Math.random()*200), Math.round(Math.random()*200), 100, 255], framebuffer)
    }

    // left_bottom:  object ({x: __, y: __})
    // right_top:    object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawRectangle(left_bottom, right_top, color, framebuffer) {
        console.log("this.drawRectangle")
        this.drawLine(left_bottom.x, left_bottom.y, right_top.x, left_bottom.y, color, framebuffer);
        this.drawLine(left_bottom.x, left_bottom.y, left_bottom.x, right_top.y, color, framebuffer);
        this.drawLine(left_bottom.x, right_top.y, right_top.x, right_top.y, color, framebuffer);
        this.drawLine(right_top.x, right_top.y, right_top.x, left_bottom.y, color, framebuffer);
    }

    // center:       object ({x: __, y: __})
    // radius:       int
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawCircle(center, radius, color, framebuffer) {
        console.log(this.num_curve_sections);
        let points = [];
        for (let i = 0; i < this.num_curve_sections; i++) {
            let x = Math.round(center.x + radius * Math.cos((7.2 / this.num_curve_sections) * i));
            let y = Math.round(center.y + radius * Math.sin((7.2 / this.num_curve_sections) * i));
            points.push([x, y]);
        }
        for (let i = 0; i < points.length-1; i++) {
            this.drawLine(points[i][0], points[i][1], points[(i+1) % points.length][0], points[(i+1) % points.length][1], color, framebuffer);
        }
    }

    // pt0:          object ({x: __, y: __})
    // pt1:          object ({x: __, y: __})
    // pt2:          object ({x: __, y: __})
    // pt3:          object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawBezierCurve(pt0, pt1, pt2, pt3, color, framebuffer) {
        let points = [];
        for (let i = 0; i < this.num_curve_sections; i++) {
            let spot = (1 / this.num_curve_sections) * i; 
            let x = Math.round((1 - spot)**3 * pt0.x + 3 * (1 - spot)**2 * spot * pt1.x + 3 * (1 - spot) * spot**2 * pt2.x + spot**3 * pt3.x);
            let y = Math.round((1 - spot)**3 * pt0.y + 3 * (1 - spot)**2 * spot * pt1.y + 3 * (1 - spot) * spot**2 * pt2.y + spot**3 * pt3.y);
            points.push([x, y]);
            for (let i = 0; i < points.length-1; i++) {
                console.log(points[0][0], points[i][1], points[(i+1) % points.length][0], points[(i+1) % points.length][1])
                this.drawLine(points[i][0], points[i][1], points[(i+1) % points.length][0], points[(i+1) % points.length][1], color, framebuffer);
            }
        }
    }

    // pt0:          object ({x: __, y: __})
    // pt1:          object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    
    drawLineLow(x0, y0, x1, y1, color, framebuffer){
        var A = y1 - y0;
        var B = x0 - x1;
        var iy = 1;
        if (A < 0) {
            iy = -1;
            A *= -1;
        }
        var D = 2 * A + B;
        var x = x0;
        var y = y0;
        var px;
        while (x <= x1){
            px = this.pixelIndex(x, y, framebuffer);
            this.setFramebufferColor(framebuffer, px, color);
            x += 1;
            if (D <= 0){
                D += 2 * A;
            }else{
                D += 2 * A + 2 * B;
                y += iy;
            }
        }
    } 
    drawLineHigh(x0,y0,x1,y1,color,framebuffer){
        var x = x0;
        var y = y0;
        var deltaX = y1 - y0;
        var deltaY = x1 - x0;
        var A = deltaY;
        var B = -deltaX;
        var px;
        var dx = 1;
    
        if (A<0)
        {
            dx = -1;
            A = A*(-1);
        }
    
        var D = (2 * A) + B;
        var D1 = (2 * A) + (2 * B);
        var D0 = (2 * A);
    
        for (var i=y0; i<y1; i++)
        {
            px = this.pixelIndex(x,y,framebuffer);
            this.setFramebufferColor(framebuffer, px, color);
    
            y = y + 1;
    
            if (D<=0)
            {	
                D = D + D0;
            }
            else
            {
                D = D + D1;
                x = x + dx;
            }
    
    
        }
    }
    drawLine(x0,y0,x1,y1,color,framebuffer){
        if (Math.abs(y1-y0) <= Math.abs(x1-x0)) {
            if (x0<x1){
                this.drawLineLow(x0,y0,x1,y1,color,framebuffer);
            }
            else{
                this.drawLineLow(x1,y1,x0,y0,color,framebuffer);
            }
        }
        else{
            if(y0<y1){
                this.drawLineHigh(x0,y0,x1,y1,color,framebuffer);
            }
            else{
                this.drawLineHigh(x1,y1,x0,y0,color,framebuffer);
            }
        }
    }

    pixelIndex(x, y, framebuffer){
        return 4 * y * framebuffer.width + 4 * x;
    }
    setFramebufferColor(framebuffer, px, color){
        framebuffer.data[px + 0] = color[0];
        framebuffer.data[px + 1] = color[1];
        framebuffer.data[px + 2] = color[2];
        framebuffer.data[px + 3] = color[3];
    }
}
//=======================

function Game(canvas_){
    this.canvas = canvas_
    this.ctx = canvas_.getContext('2d');
    this.lastFrameTimeMs = 0
    this.maxFPS = 100
    this.star = new Stars(this.ctx, this.canvas)
    this.logo = new Image();
    this.logo.src = 'img/Logo_Canvas.png';
    this.particles = new Particles(this.ctx, this.canvas)

    this.canvas.addEventListener("mousemove", this.particles.mousePosition, false);

    this.update = function(delta) {
        this.star.create_new_stars(5);
        this.star.update(delta);
        this.particles.update(delta);
    }
    
    this.draw = function() {
        this.ctx.clearRect(0, 0,  this.canvas.width,  this.canvas.height);

        var grd = this.ctx.createRadialGradient(this.canvas.width / 2, this.canvas.height / 2, 200, 
                                                this.canvas.width / 2, this.canvas.height / 2, 400);
        grd.addColorStop(0,"#09090a");
        grd.addColorStop(1,"black");

        this.ctx.fillStyle=grd;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.star.draw();
        // this.ctx.drawImage(this.logo,   this.canvas.width / 2 - this.logo.width / 2, this.canvas.height / 2 - this.logo.height / 2, 
                                        // this.logo.width, this.logo.height);

        // this.particles.draw(delta);
    }

    var that = this;
    this.mainLoop = function(timestamp) { 

        if (timestamp < that.lastFrameTimeMs + (1000 / that.maxFPS)) {
            requestAnimationFrame(that.mainLoop);
            return;
        }
        delta = timestamp - that.lastFrameTimeMs;
        that.lastFrameTimeMs = timestamp;

        that.update(delta);
        that.draw();
        requestAnimationFrame(that.mainLoop);
    }

    this.start = function(){
        requestAnimationFrame(this.mainLoop);
    }
}

function Сircle(x, y, color, ctx) {
    this.x = x
    this.y = y
    this.ctx = ctx
    this.color = color

    this.draw = function(){
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);

        this.ctx.fill();
    }
}

function Stars(ctx_, canvas_){
    this.ctx = ctx_
    this.canvas = canvas_
    this.stars_array = []
    this.max_stars = 700

    this.draw = function(){
        for(var i = 0; i < this.stars_array.length; i++){
            this.stars_array[i].draw();
        }
    } 

    this.update = function(delta){
        var i = 0;
        while(i < this.stars_array.length){
            if(this.stars_array[i].isDie()){
                delete this.stars_array[i]
                this.stars_array.splice(i, 1);
            }
            else{
                i++;
            }
        }

        for(var i = 0; i < this.stars_array.length; i++){
            this.stars_array[i].update(delta);
        }
    } 

    this.create_new_stars = function(count){
        if(this.max_stars < this.stars_array.length){
            return
        }

        for(var i = 0; i < count; i++){
            this.stars_array.push(new Star(this.ctx, this.canvas, 10));
        }
    }
} 

function Star(ctx, canvas, spawn_radius){
    this.canvas = canvas
    var spawn_radius_max = 100

    var angle = Math.random() * Math.PI * 2
    var spawn_radius_speed = Math.pow(Math.random() * (Math.pow(spawn_radius_max, 0.4) - 0) + 2.5, 2.5)

    this.speed_x = Math.cos(angle) * spawn_radius_speed
    this.speed_y = Math.sin(angle) * spawn_radius_speed

    this.deviation = Math.sqrt(Math.pow(Math.abs(this.speed_x), 2) + Math.pow(Math.abs(this.speed_y), 2)) /  
                                (spawn_radius_max * 100)
  
    var x = this.canvas.width / 2 + Math.cos(angle) *  spawn_radius * (spawn_radius_speed / spawn_radius_max)
    var y = this.canvas.height  / 2 + Math.sin(angle) * spawn_radius * (spawn_radius_speed / spawn_radius_max)
    var color = 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 130) + ',' + Math.floor(Math.random() * 255) + ')';
    Сircle.apply(this, [x, y, color, ctx]);

    this.radius = 0

    this.update = function(delta){
        var distance = this.getDistance()
        this.radius  = this.deviation * distance
    
        this.x += this.speed_x * (delta / 100000) * distance
        this.y += this.speed_y * (delta / 100000) * distance
    }

    this.getDistance = function(){
        return Math.sqrt(Math.pow(Math.abs(this.canvas.width / 2 - this.x), 2) + 
                    Math.pow(Math.abs(this.canvas.height / 2 - this.y), 2))
    }

    this.isDie = function(){
        if(this.x < 0 || this.x > this.canvas.width){
            return true
        }
        else if(this.y < 0 || this.y > this.canvas.height){
            return true
        }
        return false
    }
}

function Particles(ctx, canvas){
    this.ctx = ctx
    this.canvas = canvas
    this.particles = []
    this.color = 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 130) + ',' + Math.floor(Math.random() * 255) + ')';
    
    this.draw = function(){
        for(var i = 0; i < this.particles.length; i++){
            this.particles[i].draw();
        }
    } 

    this.update = function(delta){
        var i = 0;
        while(i < this.particles.length){
            if(this.particles[i].isDie()){
                delete this.particles[i]
                this.particles.splice(i, 1);
            }
            else{
                i++;
            }
        }

        for(var i = 0; i < this.particles.length; i++){
            this.particles[i].update(delta);
        }

        this.particles.push(new Particle(this.ctx, this.canvas, this.x, this.y, this.color));
    }

    var self = this
    this.mousePosition = function(e){
        var x = new Number();
        var y = new Number();

        if (event.x != undefined && event.y != undefined)
        {
          x = event.x;
          y = event.y;
        }
        else // Firefox method to get the position
        {
          x = event.clientX + document.body.scrollLeft +
              document.documentElement.scrollLeft;
          y = event.clientY + document.body.scrollTop +
              document.documentElement.scrollTop;
        }

        x -= self.canvas.offsetLeft;
        y -= self.canvas.offsetTop;
        self.x = x
        self.y = y
    }
}

function Particle(ctx, canvas, x, y, color){
    Сircle.apply(this, [x, y, color, ctx]);
    
    this.life = 100
    this.radius = 3
    this.radius_coefficient = this.radius / this.life

    this.update = function(delta){
        this.radius = this.life * this.radius_coefficient
        this.life -= delta
    }

    this.isDie = function(){
        return this.life < 0
    }
}

function centerElem(elem){
    var size_padding_left, size_padding_top;

    size_padding_left = document.body.clientWidth / 2 - elem.width / 2
    size_padding_top = (window.outerHeight - 150) / 2 - elem.height / 2

    elem.style.marginLeft = size_padding_left + "px";
    elem.style.marginTop = size_padding_top + "px";
}

document.addEventListener('DOMContentLoaded', function(){

    var box = document.getElementById('canvas')
    centerElem(box);

    var game = new Game(box);
    game.start();

}, false);
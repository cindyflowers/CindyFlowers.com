//https://github.com/williamngan/pt/blob/master/demo/particle.collideLine2d.js
var space;

function floatyBalls() {
    //// 1. Define Space and Form
    var colors = {
        a1: "#ff2d5d", a2: "#42dc8e", a3: "#2e43eb", a4: "#ffe359",
        b1: "#96bfed", b2: "#f5ead6", b3: "#f1f3f7", b4: "#e2e6ef"
    };
    //space = new CanvasSpace("canvas").setup( {bgcolor: "#223"} );
    space = new CanvasSpace("canvas", "#252934" ).display();
    var form = new Form( space );


    //// 2. Create Elements
    var wallTop = new Line( space.size.$multiply( 0.75, 0.40)).to( space.size.$multiply(0.25, 0.40) );
    var wall = new Line( space.size.$multiply( 0.75, 0.48)).to( space.size.$multiply(0.25, 0.48) );
    
    var wallLeft = new Line(wallTop.x, wallTop.y).to(wallTop.x, wall.y);
    var wallRight = new Line( wall.p1.x, wall.y).to( wall.p1.x, wallTop.y );

    var bound = new Pair().to( space.size );
    var center = space.size.$divide(1.8);
    var mouse = center.clone();

    // A Ball is a kind of Particle
    function Ball() {
        Particle.apply( this, arguments );
    }
    Util.extend( Ball, Particle );

    // animate this ball
    Ball.prototype.animate = function( time, frame, ctx ) {
        this.play(time, frame);
        form.stroke( false).fill(this.color);
        form.point( this, this.radius, true);
    };

    // Particle use RK4 to integrate by default. Here we change it to Euler which is faster but less accurate.
    Ball.prototype.integrate = function(t, dt) {
        this.integrateEuler(t, dt);

        // check collision with other balls
        for (var i=0; i<balls.length; i++) {
            if ( balls[i].id !== this.id && this.hasIntersect( balls[i] )) {
                this.collideParticle2d( balls[i] );
            }
        }

        // check collisions with the wall and bounds
        this.collideLine2d( wallTop );
        this.collideLine2d( wall );
        this.collideLine2d( wallLeft );
        this.collideLine2d( wallRight );
        this.collideWithinBounds( bound );
    };

    // Create 20 balls in random position, and hit it with a random initial impulse
    var balls = [];
    for (var i=0; i<20; i++) {
        var r = Math.random()*30 + 5;
        var px = Math.random()*(space.size.x - r*2) + r;
        var py = Math.random()*(space.size.y - r*2) + r;

        var p1 = new Ball( px, py );
        p1.radius = r;
        p1.mass = p1.radius;
        p1.id = i+1;
        p1.color = "rgba(0,0,0,."+(2+i%4)+")";

        p1.impulse( new Vector( (space.size.x/2-px)/((Math.random()*20)+2), (space.size.y/2-py)/((Math.random()*20)+2)) );

        space.add( p1 ); // add each ball to space to animate it
        balls.push( p1 );
    }

    //// 3. Visualize, Animate, Interact

    // the Ball class has its own animate function. Here we just add another one to space for drawing 4 lines in rectangle.
    space.add({
        animate: function(time, fps, context) {         
            form.fill( false).stroke( "#252934" );
            form.line( wallTop );
            form.line( wall );
            form.line( wallLeft );
            form.line( wallRight );
        }
    });

    // Canvas
//   space.add({
//     animate: function(time, fps, context) {

//       for (var i=0; i<balls.length; i++) {
//         // rotate the points slowly
//         var ball = balls[i];

//         // pt.rotate2D( Const.one_degree / 20, center);
//         // form.stroke( false ).fill( colors[i % 3] ).point(pt, 1);

//         // get line from pt to the mouse line


//         // opacity of line derived from distance to the line
//         var ln = new Line(ball.x, ball.y);
//         var distFromMouse = Math.abs(ln.getDistanceFromPoint(mouse))

//         if (distFromMouse < 50) {
//           if (balls[i].brightness < 0.3) balls[i].brightness += 0.015
//         } else {
//           if (balls[i].brightness > 0.1) balls[i].brightness -= 0.01
//         }

//         var color = "rgba(255,255,255,255)";
//         ball.color = color;
//       }
//     },

//     onMouseAction: function(type, x, y, evt) {
//       if (type=="move") {
//         mouse.set(x,y);
//       }
//     },

//     onTouchAction: function(type, x, y, evt) {
//       this.onMouseAction(type, x, y);
//     }
//   });
//     space.bindMouse();
    space.play();
}

floatyBalls();

$(window).resize(function(){
  space.removeAll();
  $('canvas').remove();
  floatyBalls();
});
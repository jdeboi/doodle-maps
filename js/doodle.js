// Get a reference to the canvas object
// $(document).ready(function () {
// console.log("LOADED")
var canvas = document.getElementById('doodle');
canvas.addEventListener('mousedown', down);
canvas.addEventListener('mouseup', up);
canvas.addEventListener('mousemove', drag);
// canvas.addEventListener('resize', resize);
// Create an empty project and a view for the canvas:
// paper.setup(canvas);
// paper.view.viewSize.width = window.innerWidth*2;
// paper.view.viewSize.height = window.innerHeight*2;
// console.log("CANVAS", canvas, window.innerWidth*2, window.innerHeight*2);
// Create a Paper.js Path to draw a line into it:
var path = new paper.Path();
// Give the stroke a color
path.strokeColor = 'black'; //'#ff3700';
path.strokeWidth = 10;
var numMapboxCalls = 5;
var mouseIsDown = false;

// var textItem = new paper.PointText({
//     content: 'Click and drag to draw a line.',
//     point: new paper.Point(20, 120),
//     fillColor: 'white',
// });

function down(event) {
    mouseIsDown = true;
    if (mapsShown && isDrawing) {
        // setClick(event.event.screenX, event.event.screenY);
        // saveDrawCenter = true;
        // If we produced a path before, deselect it:
        if (path) {
            path.removeSegments();
            path.selected = false;
        }
        // path.strokeColor = 'white';

        // Select the path, so we can see its segment points:
        // path.fullySelected = true;

    }
}

function drag(event) {
    if (mouseIsDown) {
        if (isDrawing) {
            // Every drag event, add a point to the path at the current
            // position of the mouse:

            // console.log(p);
            var perLeft = .6; // percent of points saved in simplify
            if (path.segments.length * perLeft < 24 * numMapboxCalls) {
                path.add(new Point(event.clientX, event.clientY));
            }
            // path.add(new Point(event.clientX, event.clientY));

            // textItem.content = 'Segment count: ' + path.segments.length;
        }
    }

}

function up(event) {
    mouseIsDown = false;
    if (isDrawing) {
        var segmentCount = path.segments.length;

        // When the mouse is released, simplify it:
        path.simplify();
        path.flatten(4);

        // Select the path, so we can see its segments:
        // path.fullySelected = false;
        path.selected = true;

        // var newSegmentCount = path.segments.length;
        // var difference = segmentCount - newSegmentCount;
        // var percentage = 100 - Math.round(newSegmentCount / segmentCount * 100);
        // textItem.content = difference + ' of the ' + segmentCount + ' segments were removed. var  ' + percentage + '%';
        // textItem.content = "sketch your wildest adventure!";
        // why
        console.log("setting coordinates");

        setCoordinates(path);

        path.removeSegments();
        path.selected = false;
    }
}





// })


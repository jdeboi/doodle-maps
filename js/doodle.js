var path = new Path();
path.strokeColor = 'black'; //'#ff3700';
path.strokeWidth = 10;
var numMapboxCalls = 5;

// var textItem = new PointText({
// 	content: 'Click and drag to draw a line.',
// 	point: new Point(20, 30),
// 	fillColor: 'black',
// });

function onMouseDown(event) {
    if (mapsShown && isDrawing) {
        if (path) {
            path.removeSegments();
            path.selected = false;
        }
    }
}

// While the user drags the mouse, points are added to the path
// at the position of the mouse:
function onMouseDrag(event) {
    if (isDrawing) {
        var perLeft = .6; // percent of points saved in simplify
        if (path.segments.length * perLeft < 24 * numMapboxCalls) {
            path.add(event.point);
        }
    }
}

// When the mouse is released, we simplify the path:
function onMouseUp(event) {
    if (isDrawing) {

        // When the mouse is released, simplify it:
        path.simplify();
        path.flatten(4);

        // Select the path, so we can see its segments:
        // path.fullySelected = false;
        path.selected = true;

        setCoordinates(path);
        path.removeSegments();
        path.selected = false;
    }
}


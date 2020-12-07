var path, rect, textItem;
initCanvas();

function initCanvas() {
  if (DEV_MODE) console.log("init canvas");
  isDrawing = false;
  path = new Path();
  rect = new Path.Rectangle({
    point: [0, 0],
    size: [view.size.width, view.size.height],
    strokeColor: 'white',
    selected: true
  });
  // rect.sendToBack();
  rect.fillColor = '#fff';

  textItem = new PointText(new Point(20, 30));
  textItem.fillColor = 'black';
  textItem.content = 'Click and drag to draw a line.';
}

function onMouseDown(event) {
  if (isDrawing) {
    // If we produced a path before, deselect it:
    if (path) {
      path.removeSegments();
      path.selected = false;
    }
    path.strokeColor = 'black';

    // Select the path, so we can see its segment points:
    path.fullySelected = true;
  }
}

function onMouseDrag(event) {
  if (isDrawing) {
    // Every drag event, add a point to the path at the current
    // position of the mouse:
    path.add(event.point);

    textItem.content = 'Segment count: ' + path.segments.length;
  }
}

function onMouseUp(event) {
  if (isDrawing) {
    var segmentCount = path.segments.length;

    // When the mouse is released, simplify it:
    path.simplify();
    path.flatten(4);

    // Select the path, so we can see its segments:
    // path.fullySelected = false;
    path.selected = true;

    var newSegmentCount = path.segments.length;
    var difference = segmentCount - newSegmentCount;
    var percentage = 100 - Math.round(newSegmentCount / segmentCount * 100);
    // textItem.content = difference + ' of the ' + segmentCount + ' segments were removed. var  ' + percentage + '%';
    textItem.content = "sketch your wildest adventure!";
    // why
    console.log("setting coordinates");
    setCoordinates(path);
    
  }
}


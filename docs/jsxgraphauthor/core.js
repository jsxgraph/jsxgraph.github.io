/**
 * JSXGraphAuthor v0.8
 * Author: ddrakulic@gmail.com, alfred.wassermann@uni-bayreuth.de
 *
 */

"use strict";

var _guis = [];

// Defining commands
var erase = -1, arrow = 0, _CHANGE_ATTR_ = -2, sketchNormal = -3,
    pointCommand = 1, lineNormal = 2, segmentNormal = 3, circleNormal = 4, polygonCommand = 5, regularPolygon = 20, conicSection5 = 21,
    angleNormal = 10, angleV = 11, angleS = 12, vectorNormal = 13, hline = 6, circle3 = 7, circler = 8, fixedSegment = 9,
    intersectionCommand = 101, angleBisector = 102, midpointCommand = 103, perpendicularNormal = 104, parallelNormal = 105,
    symmetryNormal = 150, segmentSymmetry = 151, lineSymmetry = 152, translationCommand = 153,
    distance = 200, area = 201, textCommand = 202, functionPlot = 42, sketchPolynomial = 43, angleSixty = 44, boundingBox = 45;

var JSXGraphAuthor = function (bd, axisVisibility) {

    this.language = "en";
    var stack_forward = [];
    var backwardIndex = [];
    var forwardIndex = [];
    var sketchNormalMode = 0;
    var tau;
    // Global variables
    var sketch, curve,
        points = [];


    var sketchPolynomialMode = 1;
    var degree;
    var sketchPolynomial, curvePolynomial,
        pointsPolynomial = [];


    var brdDiv = document.getElementById(bd);
    if (false) {
        this.bW = parseInt(brdDiv.style.width) / 10;
        this.bH = parseInt(brdDiv.style.height) / 10;
    } else {
        this.bW = -20;
        this.bH = 20;
    }

    this.board = JXG.JSXGraph.initBoard(bd, {
        axis: axisVisibility,
        boundingbox: [this.bW, this.bH, -this.bW, -this.bH],
        keepAspectRatio: true
    });

    this.id = this.board.id;
    _guis[this.board.id] = this;

    this.active_command = arrow;

    this.currentX = 0;
    this.currentY = 0;

    this.snapSizeX = 1;
    this.snapSizeY = 1;

    this.magnetSize = 0.5;

    this.currentPoint = null;
    this.constructionPoints = [];
    this.animation = null;
    this.newPoints = [];
    this.selectedObjects = [];
    this.pencilPointsArray = null;

    this.board.on('pointerdown', this._mouseDown);
    this.board.on('pointermove', this._mouseMove);
    this.board.on('pointerup', this._mouseUp);

    // Define new board mode "sketch"
    this.board.BOARD_MODE_SKETCH = 0x0003;
    this.BOARD_MODE_NONE = 0x0000;

    this.pointObjects = ["point", "intersection", "midpoint", "glider", "reflection", "mirrorpoint"];
    this.nonPointObjects = ["line", "segment", "circle", "perpendicular", "parallel", "conic", "bisector"];
};


function checkIfNumber(value) {
    return !isNaN(parseFloat(value));
}

function saveValueBoundingBox() {
    var inputValuex1 = document.getElementById('inputValuex1');
    var inputValuey1 = document.getElementById('inputValuey1');
    var inputValuex2 = document.getElementById('inputValuex2');
    var inputValuey2 = document.getElementById('inputValuey2');

    if (!checkIfNumber(inputValuex1.value)) {
        inputValuex1.classList.add('is-invalid');
    } else {
        inputValuex1.classList.remove('is-invalid');
    }

    if (!checkIfNumber(inputValuey1.value)) {
        inputValuey1.classList.add('is-invalid');
    } else {
        inputValuey1.classList.remove('is-invalid');
    }

    if (!checkIfNumber(inputValuex2.value)) {
        inputValuex2.classList.add('is-invalid');
    } else {
        inputValuex2.classList.remove('is-invalid');
    }

    if (!checkIfNumber(inputValuey2.value)) {
        inputValuey2.classList.add('is-invalid');
    } else {
        inputValuey2.classList.remove('is-invalid');
    }

    //if all values are a number, setBoundingBox
    if (checkIfNumber(inputValuex1.value) && checkIfNumber(inputValuey1.value) && checkIfNumber(inputValuex2.value) && checkIfNumber(inputValuey2.value)) {
        const boundingBoxModal = new bootstrap.Modal(document.getElementById('boundingBoxModal'));
        boundingBoxModal.hide();

        let x1 = Number(inputValuex1.value)
        let x2 = Number(inputValuex2.value)
        let y1 = Number(inputValuey1.value)
        let y2 = Number(inputValuey2.value)

        jsxgraphauthor.board.setBoundingBox([x1,x2,y1,y2]);
    }
}


JSXGraphAuthor.prototype.changeCommands = function (command) {
    var i;

    for (i = 0; i < this.newPoints.length; i++) {
        this.board.removeObject(this.newPoints[i]);
    }

    if (this.animation !== null) {
        this.board.removeObject(this.animation);
        this.board.removeObject(this.currentPoint);
        this.animation = null;
    }
    for (i = 0; i < this.selectedObjects.length; i++) {
        var strW = this.selectedObjects[i].getAttribute("strokeWidth") - 1;
        this.selectedObjects[i].setAttribute({ strokeWidth: strW });
    }

    this.constructionPoints = [];
    this.newPoints = [];
    this.selectedObjects = [];
    this.active_command = command;

    if (this.active_command != angleV)
        document.getElementById("angle_orientation_div_" + this.id).style.display = "none";

    if (this.active_command != textCommand)
        document.getElementById("input_text_div_" + this.id).style.display = "none";


    // Gives every command a picture and a help text
switch (command) {
    case angleSixty:
        document.getElementById("divhelp_" + this.id).innerHTML = JSXGraphAuthor.help[this.language].angleSixty;
        break;
    case functionPlot:

        document.getElementById("divhelp_" + this.id).innerHTML = JSXGraphAuthor.help[this.language].functionPlot;
        break;
    case sketchPolynomial:
        document.getElementById("divhelp_" + this.id).innerHTML = JSXGraphAuthor.help[this.language].sketchPolynomial;
        break;
    case erase:
        document.getElementById("divhelp_" + this.id).innerHTML = JSXGraphAuthor.help[this.language].erase;
        break;
    case sketchNormal:
        document.getElementById("divhelp_" + this.id).innerHTML = JSXGraphAuthor.help[this.language].sketchNormal;
        break;
    case arrow:
        document.getElementById("divhelp_" + this.id).innerHTML = JSXGraphAuthor.help[this.language].arrow;
        break;
    case pointCommand:
        document.getElementById("divhelp_" + this.id).innerHTML = JSXGraphAuthor.help[this.language].pointCommand;
        break;
    case lineNormal:
        document.getElementById("divhelp_" + this.id).innerHTML = JSXGraphAuthor.help[this.language].lineNormal;
        break;
    case hline:
        document.getElementById("divhelp_" + this.id).innerHTML = JSXGraphAuthor.help[this.language].hline;
        break;
    case segmentNormal:
        document.getElementById("divhelp_" + this.id).innerHTML = JSXGraphAuthor.help[this.language].segmentNormal;
        break;
    case vectorNormal:
        document.getElementById("divhelp_" + this.id).innerHTML = JSXGraphAuthor.help[this.language].vectorNormal;
        break;
    case fixedSegment:
        document.getElementById("divhelp_" + this.id).innerHTML = JSXGraphAuthor.help[this.language].fixedSegment;
        break;
    case circleNormal:
        document.getElementById("divhelp_" + this.id).innerHTML = JSXGraphAuthor.help[this.language].circleNormal;
        break;
    case circle3:
        document.getElementById("divhelp_" + this.id).innerHTML = JSXGraphAuthor.help[this.language].circle3;
        break;
    case circler:
        document.getElementById("divhelp_" + this.id).innerHTML = JSXGraphAuthor.help[this.language].circler;
        break;
    case conicSection5:
        document.getElementById("divhelp_" + this.id).innerHTML = JSXGraphAuthor.help[this.language].conicSection5;
        break;
    case angleNormal:
        document.getElementById("divhelp_" + this.id).innerHTML = JSXGraphAuthor.help[this.language].angleNormal;
        break;
    case angleS:
        document.getElementById("divhelp_" + this.id).innerHTML = JSXGraphAuthor.help[this.language].angleS;
        break;
    case angleV:
        document.getElementById("divhelp_" + this.id).innerHTML = JSXGraphAuthor.help[this.language].angleV;
        document.getElementById("angle_orientation_div_" + this.id).style.display = "block";
        break;
    case textCommand:
        document.getElementById("divhelp_" + this.id).innerHTML = JSXGraphAuthor.help[this.language].textCommand;
        break;
    case polygonCommand:
        document.getElementById("divhelp_" + this.id).innerHTML = JSXGraphAuthor.help[this.language].polygonCommand;
        break;
    case regularPolygon:
        document.getElementById("divhelp_" + this.id).innerHTML = JSXGraphAuthor.help[this.language].regularPolygon;
        break;
    case intersectionCommand:
        document.getElementById("divhelp_" + this.id).innerHTML = JSXGraphAuthor.help[this.language].intersectionCommand;
        break;
    case angleBisector:
        document.getElementById("divhelp_" + this.id).innerHTML = JSXGraphAuthor.help[this.language].angleBisector;
        break;
    case midpointCommand:
        document.getElementById("divhelp_" + this.id).innerHTML = JSXGraphAuthor.help[this.language].midpointCommand;
        break;
    case perpendicularNormal:
        document.getElementById("divhelp_" + this.id).innerHTML = JSXGraphAuthor.help[this.language].perpendicularNormal;
        break;
    case parallelNormal:
        document.getElementById("divhelp_" + this.id).innerHTML = JSXGraphAuthor.help[this.language].parallelNormal;
        break;
    case symmetryNormal:
        document.getElementById("divhelp_" + this.id).innerHTML = JSXGraphAuthor.help[this.language].symmetryNormal;
        break;
    case segmentSymmetry:
        document.getElementById("divhelp_" + this.id).innerHTML = JSXGraphAuthor.help[this.language].segmentSymmetry;
        break;
    case lineSymmetry:
        document.getElementById("divhelp_" + this.id).innerHTML = JSXGraphAuthor.help[this.language].lineSymmetry;
        break;
    case distance:
        document.getElementById("divhelp_" + this.id).innerHTML = JSXGraphAuthor.help[this.language].distance;
        break;
    case area:
        document.getElementById("divhelp_" + this.id).innerHTML = JSXGraphAuthor.help[this.language].area;
        break;
    case translationCommand:
        document.getElementById("divhelp_" + this.id).innerHTML = JSXGraphAuthor.help[this.language].translationCommand;
        break;
}
};


JSXGraphAuthor.prototype.iconMouseOut = function (command) {
    if (this.active_command == command)
    return;
};



function saveValue() {
    var inputValueAngle = document.getElementById('inputValueAngle').value;
}

function saveValueText() {
    var inputValueText = document.getElementById('inputValueText').value;
}

function saveValuePolygon() {
    var inputValuePolygon = document.getElementById('inputValuePolygon').value;
}

function saveValueCircler() {
    var inputValueCircler = document.getElementById('inputValueCircler').value;
}

function saveValueSegment() {
    var inputValueSegment = document.getElementById('inputValueSegment').value;
}

function saveValueFunction() {
    var inputValueFunction = document.getElementById('inputValueFunction').value;
}



// Adds functionality to different commands
JSXGraphAuthor.prototype.addCommands = function (id, commands) {
var i,
    iconsDiv = document.getElementById(id),
    commandsHTML = "";


// div for angle orientation, add radios

    commandsHTML += '<div id="angle_orientation_div_' + this.id + '" style="display:none; width:95%; background-color:#e3f2fd; padding-left:20px; padding-right:20px;">';
    commandsHTML += '<div class="form-check">';
    commandsHTML += '<input class="form-check-input" type="radio" name="angle_orientation_' + this.id + '" id="angle_left_orientation_' + this.id + '" checked>';
    commandsHTML += '<label class="form-check-label" for="angle_left_orientation_' + this.id + '">' + '<p id="angleAnticlockwiseText" class="text-center m-0"></p>' + '</label>';
    commandsHTML += '</div>';

    commandsHTML += '<div class="form-check">';
    commandsHTML += '<input class="form-check-input" type="radio" name="angle_orientation_' + this.id + '" id="angle_right_orientation_' + this.id + '">';
    commandsHTML += '<label class="form-check-label" for="angle_right_orientation_' + this.id + '">' + '<p id="angleClockwiseText" class="text-center m-0"></p>' + '</label>';
    commandsHTML += '</div>';
    commandsHTML += '</div>';


// div for angle help
commandsHTML += '<div id="input_text_div_' + this.id + '" style="display:none">' + JSXGraphAuthor.help[this.language].textCommand +
    ': <input type="text" name="inserted_text_' + this.id + '" id="inserted_text_' + this.id + '" style="width:200px" /></div>';
commandsHTML += '<div id="divhelp_' + this.id + '" style="width:95%; background-color:#e3f2fd; padding-left:20px; padding-right:20px;">' +
    '</div>';
iconsDiv.innerHTML = commandsHTML;
};



JSXGraphAuthor.prototype.getMouseCoords = function (e, n) { // n=0 for mouse events, e=1 for tablet events
var pos;
if (n === 0)
    pos = this.board.getMousePosition(e);
else
    pos = this.board.getMousePosition(e, 0);

var dx = pos[0], dy = pos[1];
return new JXG.Coords(JXG.COORDS_BY_SCREEN, [dx, dy], this.board);
};

JSXGraphAuthor.prototype.downEvent = function (e) {
var i, j,
    currX = Math.round(this.currentX / this.snapSizeX) * this.snapSizeX,
    currY = Math.round(this.currentY / this.snapSizeY) * this.snapSizeY,
    line, evt, n, d, circle, polygon, rpoly, bb, radiusSize,
    p1, p2, p3,
    genId, tmppoint, v, angle, angle1,
    intersection, perpendicular,
    strW, strW1, strW2, strW3,
    parallel, bisector, point1, point2,
    midpoint, segment_symmetry,
    x, y,
    tVector, translation, result, text,
    object, newP, point, point2;

switch (this.active_command) {

    case boundingBox:
        var inputValuex1 = document.getElementById('inputValuex1').value;
        var inputValuey1 = document.getElementById('inputValuey1').value;
        var inputValuex2 = document.getElementById('inputValuex2').value;
        var inputValuey2 = document.getElementById('inputValuey2').value;
        this.board.setBoundingBox([inputValuex1,inputValuey1,inputValuex2,inputValuey2]);
        break;

    case sketchNormal:
        this.sketchNormalMode = 1;
        break;

    case sketchPolynomial:
        this.sketchPolynomialMode = 1;
        break;

    case functionPlot:
        var indexPair = []
        indexPair.push(jsxgraphauthor.board.objectsList.length)

        var inputValueFunction = document.getElementById('inputValueFunction').value;
        n = inputValueFunction
        var left = document.getElementById('inputValueFunctionLeft').value;
        var right = document.getElementById('inputValueFunctionRight').value;
        console.log(left)
        console.log(right)
        if(isNaN(left) || isNaN(right)) {
            left = -10;
            right = 10;
        }
        var graph = this.board.create('functiongraph',
            [n, left, right]
        );

        indexPair.push(jsxgraphauthor.board.objectsList.length)
        backwardIndex.push(indexPair)
        break;

    case pointCommand:

        var indexPair = []
        indexPair.push(jsxgraphauthor.board.objectsList.length)

        object = this.getNearestObject(currX, currY);
        if (object !== null) {
            if (this.pointObjects.indexOf(object.elType) == -1) {
                object = this.board.create('glider', [currX, currY, object], { snapSizeX: this.snapSizeX, snapSizeY: this.snapSizeY, snapToGrid: true, fixed: false, highlight: true });
                if (this.board.options.point.withLabel)
                    object.setLabelText(object.getName());
            }
            return;
        }
        object = this.board.create('point', [currX, currY], { snapSizeX: this.snapSizeX, snapSizeY: this.snapSizeY, snapToGrid: true, fixed: false, highlight: true });
        object.setLabelText(object.getName());

        indexPair.push(jsxgraphauthor.board.objectsList.length)
        backwardIndex.push(indexPair)
        break;
    case lineNormal:
        var indexPair = []
        indexPair.push(jsxgraphauthor.board.objectsList.length)

        newP = false;
        object = this.getNearestObject(currX, currY);
        point = null;
        if (object === null) {
            point = this.board.create('point', [currX, currY], { snapSizeX: this.snapSizeX, snapSizeY: this.snapSizeY, snapToGrid: true, fixed: false, highlight: true });
            if (this.board.options.point.withLabel)
                point.setLabelText(point.getName());
        }
        else if (this.pointObjects.indexOf(object.elType) == -1) {
            point = this.board.create('glider', [currX, currY, object], { snapSizeX: this.snapSizeX, snapSizeY: this.snapSizeY, snapToGrid: true, fixed: false, highlight: true });
            if (this.board.options.point.withLabel)
                point.setLabelText(point.getName());
            newP = true;
        }
        else
            point = object;
        if (this.constructionPoints.length === 0) {
            this.constructionPoints.push(point);
            if (newP)
                this.newPoints.push(point);
            this.currentPoint = this.board.create('point', [function () { return _guis[this.board.id].currentX; }, function () { return _guis[this.board.id].currentY; }], { name: "" });
            this.animation = this.board.create('line', [point, this.currentPoint]);
        }
        else {
            line = this.board.create('line', [this.constructionPoints[0], point], { fixed: false, highlight: true });
            this.constructionPoints = [];
            this.newPoints = [];
            this.board.removeObject(this.animation);
            this.board.removeObject(this.currentPoint);
            this.animation = null;
        }

        indexPair.push(jsxgraphauthor.board.objectsList.length)
        backwardIndex.push(indexPair)
        break;
    case segmentNormal:
        var indexPair = []
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        newP = false;
        object = this.getNearestObject(currX, currY);
        point = null;
        if (object === null) {
            point = this.board.create('point', [currX, currY], { snapSizeX: this.snapSizeX, snapSizeY: this.snapSizeY, snapToGrid: true, fixed: false, highlight: true });
            if (this.board.options.point.withLabel)
                point.setLabelText(point.getName());
        }
        else if (this.pointObjects.indexOf(object.elType) == -1) {
            point = this.board.create('glider', [currX, currY, object], { snapSizeX: this.snapSizeX, snapSizeY: this.snapSizeY, snapToGrid: true, fixed: false, highlight: true });
            if (this.board.options.point.withLabel)
                point.setLabelText(point.getName());
            newP = true;
        }
        else
            point = object;
        if (this.constructionPoints.length === 0) {
            this.constructionPoints.push(point);
            if (newP)
                this.newPoints.push(point);
            this.currentPoint = this.board.create('point', [function () { return _guis[this.board.id].currentX; }, function () { return _guis[this.board.id].currentY; }], { name: "" });
            this.animation = this.board.create('segment', [point, this.currentPoint]);
        }
        else {
            line = this.board.create('segment', [this.constructionPoints[0], point], { fixed: false, highlight: true });
            this.constructionPoints = [];
            this.newPoints = [];
            this.board.removeObject(this.animation);
            this.board.removeObject(this.currentPoint);
            this.animation = null;
        }
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        backwardIndex.push(indexPair)
        break;
    case vectorNormal:
        var indexPair = []
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        newP = false;
        object = this.getNearestObject(currX, currY);
        point = null;
        if (object === null) {
            point = this.board.create('point', [currX, currY], { snapSizeX: this.snapSizeX, snapSizeY: this.snapSizeY, snapToGrid: true, fixed: false, highlight: true });
            if (this.board.options.point.withLabel)
                point.setLabelText(point.getName());
        }
        else
            point = object;
        if (this.constructionPoints.length === 0) {
            this.constructionPoints.push(point);
            if (newP)
                this.newPoints.push(point);
            this.currentPoint = this.board.create('point', [function () { return _guis[this.board.id].currentX; }, function () { return _guis[this.board.id].currentY; }], { name: "" });
            this.animation = this.board.create('arrow', [point, this.currentPoint]);
        }
        else {
            line = this.board.create('arrow', [this.constructionPoints[0], point], { fixed: false, highlight: true });
            this.constructionPoints = [];
            this.newPoints = [];
            this.board.removeObject(this.animation);
            this.board.removeObject(this.currentPoint);
            this.animation = null;
        }
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        backwardIndex.push(indexPair)
        break;
    case fixedSegment:
        var indexPair = []
        indexPair.push(jsxgraphauthor.board.objectsList.length)

        newP = false;
        object = this.getNearestObject(currX, currY);
        point = null;
        if (object === null) {
            point = this.board.create('point', [currX, currY], { snapSizeX: this.snapSizeX, snapSizeY: this.snapSizeY, snapToGrid: true, fixed: false, highlight: true });
            if (this.board.options.point.withLabel)
                point.setLabelText(point.getName());
        }
        else if (this.pointObjects.indexOf(object.elType) == -1) {
            point = this.board.create('glider', [currX, currY, object], { snapSizeX: this.snapSizeX, snapSizeY: this.snapSizeY, snapToGrid: true, fixed: false, highlight: true });
            if (this.board.options.point.withLabel)
                point.setLabelText(point.getName());
            newP = true;
        }
        else {
            point = object;
            evt = document.createEvent("MouseEvents");
            evt.initEvent("mouseup", true, true);
            document.dispatchEvent(evt);
        }
        var inputValueSegment = document.getElementById('inputValueSegment').value;
        n = inputValueSegment
        //n = window.prompt(JSXGraphAuthor.help[this.language].fixedSegmentPOPUP_, 5);
        while (isNaN(n)) {
            n = window.prompt(JSXGraphAuthor.help[this.language].fixedSegmentPOPUP_, 5);
        }
        d = parseFloat(n);
        point2 = this.board.create('point', [function () { return point.X() + d; }, function () { return point.Y(); }], { fixed: false, highlight: false });
        if (this.board.options.point.withLabel) {
            point2.setLabelText(point2.getName());
        }
        this.board.create('segment', [point, point2], { fixed: false, highlight: false });


        indexPair.push(jsxgraphauthor.board.objectsList.length)
        backwardIndex.push(indexPair)
        break;
    case hline:
        var indexPair = []
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        newP = false;
        object = this.getNearestObject(currX, currY);
        point = null;
        if (object === null) {
            point = this.board.create('point', [currX, currY], { snapSizeX: this.snapSizeX, snapSizeY: this.snapSizeY, snapToGrid: true, fixed: false, highlight: true });
            if (this.board.options.point.withLabel)
                point.setLabelText(point.getName());
        }
        else if (this.pointObjects.indexOf(object.elType) == -1) {
            point = this.board.create('glider', [currX, currY, object], { snapSizeX: this.snapSizeX, snapSizeY: this.snapSizeY, snapToGrid: true, fixed: false, highlight: true });
            if (this.board.options.point.withLabel)
                point.setLabelText(point.getName());
            newP = true;
        }
        else
            point = object;
        if (this.constructionPoints.length === 0) {
            this.constructionPoints.push(point);
            if (newP)
                this.newPoints.push(point);
            this.currentPoint = this.board.create('point', [function () { return _guis[this.board.id].currentX; }, function () { return _guis[this.board.id].currentY; }], { name: "" });
            this.animation = this.board.create('line', [point, this.currentPoint], { straightFirst: false });
        }
        else {
            line = this.board.create('line', [this.constructionPoints[0], point], { fixed: false, highlight: true, straightFirst: false });
            this.constructionPoints = [];
            this.newPoints = [];
            this.board.removeObject(this.animation);
            this.board.removeObject(this.currentPoint);
            this.animation = null;
        }
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        backwardIndex.push(indexPair)
        break;
    case circleNormal:
        var indexPair = []
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        newP = false;
        object = this.getNearestObject(currX, currY);
        point = null;
        if (object === null) {
            point = this.board.create('point', [currX, currY], { snapSizeX: this.snapSizeX, snapSizeY: this.snapSizeY, snapToGrid: true, fixed: false, highlight: true });
            if (this.board.options.point.withLabel)
                point.setLabelText(point.getName());
        }
        else if (this.pointObjects.indexOf(object.elType) == -1) {
            point = this.board.create('glider', [currX, currY, object], { snapSizeX: this.snapSizeX, snapSizeY: this.snapSizeY, snapToGrid: true, fixed: false, highlight: true });
            if (this.board.options.point.withLabel)
                point.setLabelText(point.getName());
            newP = true;
        }
        else
            point = object;
        if (this.constructionPoints.length === 0) {
            this.constructionPoints.push(point);
            if (newP)
                this.newPoints.push(point);
            this.currentPoint = this.board.create('point', [function () { return _guis[this.board.id].currentX; }, function () { return _guis[this.board.id].currentY; }], { name: "" });
            this.animation = this.board.create('circle', [point, this.currentPoint]);
        }
        else {
            circle = this.board.create('circle', [this.constructionPoints[0], point], { fixed: false, highlight: true });
            this.constructionPoints = [];
            this.newPoints = [];
            this.board.removeObject(this.animation);
            this.board.removeObject(this.currentPoint);
            this.animation = null;
        }
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        backwardIndex.push(indexPair)
        break;
    case circle3:
        var indexPair = []
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        newP = false;
        object = this.getNearestObject(currX, currY);
        point = null;
        if (object === null) {
            point = this.board.create('point', [currX, currY], { snapSizeX: this.snapSizeX, snapSizeY: this.snapSizeY, snapToGrid: true, fixed: false, highlight: true });
            if (this.board.options.point.withLabel)
                point.setLabelText(point.getName());
            newP = true;
        }
        else if (this.pointObjects.indexOf(object.elType) == -1) {
            point = this.board.create('glider', [currX, currY, object], { snapSizeX: this.snapSizeX, snapSizeY: this.snapSizeY, snapToGrid: true, fixed: false, highlight: true });
            if (this.board.options.point.withLabel)
                point.setLabelText(point.getName());
            newP = true;
        }
        else
            point = object;
        this.constructionPoints.push(point);
        if (newP)
            this.newPoints.push(point);
        if (this.constructionPoints.length == 2) {
            this.currentPoint = this.board.create('point', [function () { return _guis[this.board.id].currentX; }, function () { return _guis[this.board.id].currentY; }], { name: "" });
            this.animation = this.board.create('circle', [this.constructionPoints[0], this.constructionPoints[1], this.currentPoint]);
        }
        else if (this.constructionPoints.length == 3) {
            this.board.create('circle', [this.constructionPoints[0], this.constructionPoints[1], point], { fixed: false, highlight: true });
            this.constructionPoints = [];
            this.newPoints = [];
            this.board.removeObject(this.animation);
            this.board.removeObject(this.currentPoint);
            this.animation = null;
        }
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        indexPair.push(2)
        backwardIndex.push(indexPair)
        break;
    case conicSection5:
        var indexPair = []
        indexPair.push(jsxgraphauthor.board.objectsList.length)

        newP = false;
        object = this.getNearestObject(currX, currY);
        point = null;
        if (object === null) {
            point = this.board.create('point', [currX, currY], { snapSizeX: this.snapSizeX, snapSizeY: this.snapSizeY, snapToGrid: true, fixed: false, highlight: true });
            if (this.board.options.point.withLabel)
                point.setLabelText(point.getName());
            newP = true;
        }
        else if (this.pointObjects.indexOf(object.elType) == -1) {
            point = this.board.create('glider', [currX, currY, object], { snapSizeX: this.snapSizeX, snapSizeY: this.snapSizeY, snapToGrid: true, fixed: false, highlight: true });
            if (this.board.options.point.withLabel)
                point.setLabelText(point.getName());
            newP = true;
        }
        else {
            point = object;
            this.selectedObjects.push(point);
            point.setAttribute({ strokeWidth: 3 });
            point.setAttribute({ strokeColor: "blue" });
        }
        this.constructionPoints.push(point);
        if (newP)
            this.newPoints.push(point);
        if (this.constructionPoints.length == 4) {
            this.currentPoint = this.board.create('point', [function () { return _guis[this.board.id].currentX; }, function () { return _guis[this.board.id].currentY; }], { name: "" });
            this.animation = this.board.create('conic', [this.constructionPoints[0], this.constructionPoints[1],
            this.constructionPoints[2], this.constructionPoints[3], this.currentPoint]);
        }
        else if (this.constructionPoints.length == 5) {
            this.board.create('conic', [this.constructionPoints[0], this.constructionPoints[1],
            this.constructionPoints[2], this.constructionPoints[3], point], { fixed: false, highlight: true });

            for (i = 0; i < this.selectedObjects.length; i++)
                this.selectedObjects[i].setAttribute({ strokeWidth: 1 });

            this.selectedObjects = [];
            this.constructionPoints = [];
            this.newPoints = [];
            this.board.removeObject(this.animation);
            this.board.removeObject(this.currentPoint);
            this.animation = null;
        }

        indexPair.push(jsxgraphauthor.board.objectsList.length)
        indexPair.push(4)
        backwardIndex.push(indexPair)
        break;
    case circler:
        var indexPair = []
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        object = this.getNearestObject(currX, currY);
        point = null;
        newP = false;
        if (object === null) {
            point = this.board.create('point', [currX, currY], { snapSizeX: this.snapSizeX, snapSizeY: this.snapSizeY, snapToGrid: true, fixed: false, highlight: true });
            if (this.board.options.point.withLabel) {
                point.setLabelText(point.getName());
            }
            newP = true;
        } else if (this.pointObjects.indexOf(object.elType) == -1) {
            point = this.board.create('glider', [currX, currY, object], { snapSizeX: this.snapSizeX, snapSizeY: this.snapSizeY, snapToGrid: true, fixed: false, highlight: true });
            if (this.board.options.point.withLabel) {
                point.setLabelText(point.getName());
            }
            newP = true;
        } else {
            point = object;
            evt = document.createEvent("MouseEvents");
            evt.initEvent("mouseup", true, true);
            document.dispatchEvent(evt);
        }

        if (newP) {
            this.newPoints.push(point);
        }
        var inputValueCircler = document.getElementById('inputValueCircler').value;
        n = inputValueCircler
        //n = window.prompt(JSXGraphAuthor.help[this.language].fixedSegmentPOPUP_, 5);
        while (isNaN(n)) {
            n = window.prompt(JSXGraphAuthor.help[this.language].fixedSegmentPOPUP_, 5);
        }
        d = parseFloat(n);

        this.board.create('circle', [point, d], { fixed: false, highlight: true });
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        backwardIndex.push(indexPair)
        break;
    case polygonCommand:
        var indexPair = []
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        newP = false;
        object = this.getNearestObject(currX, currY);
        point = null;
        if (object === null) {
            point = this.board.create('point', [currX, currY], { snapSizeX: this.snapSizeX, snapSizeY: this.snapSizeY, snapToGrid: true, fixed: false, highlight: true });
            if (this.board.options.point.withLabel) {
                point.setLabelText(point.getName());
            }
            newP = true;
        }
        else if (this.pointObjects.indexOf(object.elType) == -1) {
            point = this.board.create('glider', [currX, currY, object], { snapSizeX: this.snapSizeX, snapSizeY: this.snapSizeY, snapToGrid: true, fixed: false, highlight: true });
            if (this.board.options.point.withLabel) {
                point.setLabelText(point.getName());
            }
            newP = true;
        }
        else {
            point = object;
            this.selectedObjects.push(point);
            point.setAttribute({ strokeWidth: 3 });
        }
        if (point != this.constructionPoints[0]) {
            this.constructionPoints.push(point);
            if (newP) {
                this.newPoints.push(point);
            }
            this.board.removeObject(this.animation);
            this.animation = this.board.create('polygon', this.constructionPoints, { highlight: false, withLines: false });
        }
        else {
            this.board.removeObject(this.animation);
            polygon = this.board.create('polygon', this.constructionPoints, { fixed: false, highlight: true, withLines: true, hasInnerPoints: true });

            for (i = 0; i < this.selectedObjects.length; i++) {
                this.selectedObjects[i].setAttribute({ strokeWidth: 1 });
                this.selectedObjects[i].setAttribute({ strokeColor: 'black' });
            }
            this.selectedObjects = [];
            this.constructionPoints = [];
            this.newPoints = [];
            this.animation = null;
        }

        indexPair.push(jsxgraphauthor.board.objectsList.length)
        indexPair.push(3)
        indexPair.push("regularPolygon")
        console.log(indexPair)
        backwardIndex.push(indexPair)
        break;
    case regularPolygon:
        var indexPair = []
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        newP = false;
        object = this.getNearestObject(currX, currY);
        point = null;
        if (object === null) {
            point = this.board.create('point', [currX, currY], { snapSizeX: this.snapSizeX, snapSizeY: this.snapSizeY, snapToGrid: true, fixed: false, highlight: true });
            if (this.board.options.point.withLabel)
                point.setLabelText(point.getName());
            newP = true;
        }
        else if (this.pointObjects.indexOf(object.elType) == -1) {
            point = this.board.create('glider', [currX, currY, object], { snapSizeX: this.snapSizeX, snapSizeY: this.snapSizeY, snapToGrid: true, fixed: false, highlight: true });
            if (this.board.options.point.withLabel)
                point.setLabelText(point.getName());
            newP = true;
        }
        else
            point = object;
        this.constructionPoints.push(point);
        if (newP) {
            this.newPoints.push(point);
        }
        if (this.constructionPoints.length == 2) {
            n = 5;

            var inputValuePolygon = document.getElementById('inputValuePolygon').value;
            n = inputValuePolygon;
            if(isNaN(n)) {
                n = 5;
            }

            d = Math.round(parseFloat(n));
            if (d < 3) {
                d = 3;
            }
            rpoly = this.board.create('regularpolygon', [this.constructionPoints[0], point, d], { vertices: { visible: false }, fixed: false, highlight: true });
            this.constructionPoints = [];
            this.newPoints = [];
        }
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        indexPair.push(1)
        backwardIndex.push(indexPair)
        break;
    case angleNormal:
        var indexPair = []
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        newP = false;
        object = this.getNearestObject(currX, currY);
        point = null;
        if (object === null) {
            point = this.board.create('point', [currX, currY], { snapSizeX: this.snapSizeX, snapSizeY: this.snapSizeY, snapToGrid: true, fixed: false, highlight: true });
            if (this.board.options.point.withLabel)
                point.setLabelText(point.getName());
        } else if (this.pointObjects.indexOf(object.elType) == -1) {
            point = this.board.create('glider', [currX, currY, object], { snapSizeX: this.snapSizeX, snapSizeY: this.snapSizeY, snapToGrid: true, fixed: false, highlight: true });
            if (this.board.options.point.withLabel) {
                point.setLabelText(point.getName());
            }
            newP = true;
        }
        else {
            point = object;
        }

        this.constructionPoints.push(point);
        if (newP) {
            this.newPoints.push(point);
        }
        bb = this.board.getBoundingBox();
        radiusSize = Math.abs(bb[0] - bb[2]) / 20;
        if (this.constructionPoints.length == 2) {
            this.currentPoint = this.board.create('point', [function () { return _guis[this.board.id].currentX; }, function () { return _guis[this.board.id].currentY; }], { name: "" });
            this.animation = this.board.create('angle', [this.constructionPoints[0], this.constructionPoints[1], this.currentPoint], { radius: radiusSize, withLabel: false, name: 'tmpangle' });
        }
        else if (this.constructionPoints.length == 3) {
            this.board.create('angle', [this.constructionPoints[0], this.constructionPoints[1], point], { fixed: false, radius: radiusSize, withLabel: false, highlight: true });
            this.constructionPoints = [];
            this.newPoints = [];
            this.board.removeObject(this.animation);
            this.board.removeObject(this.currentPoint);
            this.animation = null;
        }
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        indexPair.push(2)
        backwardIndex.push(indexPair)
        break;
    case angleS:
        var indexPair = []
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        newP = false;
        object = this.getNearestObject(currX, currY);
        point = null;
        if (object === null) {
            point = this.board.create('point', [currX, currY], { snapSizeX: this.snapSizeX, snapSizeY: this.snapSizeY, snapToGrid: true, fixed: false, highlight: true });
            if (this.board.options.point.withLabel)
                point.setLabelText(point.getName());
        }
        else if (this.pointObjects.indexOf(object.elType) == -1) {
            point = this.board.create('glider', [currX, currY, object], { snapSizeX: this.snapSizeX, snapSizeY: this.snapSizeY, snapToGrid: true, fixed: false, highlight: true });
            if (this.board.options.point.withLabel)
                point.setLabelText(point.getName());
            newP = true;
        }
        else
            point = object;
        this.constructionPoints.push(point);
        if (newP) {
            this.newPoints.push(point);
        }
        bb = this.board.getBoundingBox();
        radiusSize = Math.abs(bb[0] - bb[2]) / 20;
        if (this.constructionPoints.length == 2) {
            this.currentPoint = this.board.create('point', [function () { return _guis[this.board.id].currentX; }, function () { return _guis[this.board.id].currentY; }], { name: "" });
            this.animation = this.board.create('angle', [this.constructionPoints[0], this.constructionPoints[1], this.currentPoint], { radius: radiusSize, withLabel: false, name: 'tmpangle' });
        }
        else if (this.constructionPoints.length == 3) {
            p1 = this.constructionPoints[0];
            p2 = this.constructionPoints[1];
            p3 = point;

            this.board.create('angle', [this.constructionPoints[0], this.constructionPoints[1], point], {
                fixed: false, orthoSensitivity: 0.5, radius: radiusSize, highlight: true,
                label: { color: 'black' }, name: function () { return Math.round(JXG.Math.Geometry.trueAngle(p1, p2, p3)) + "°"; }
            });

            this.constructionPoints = [];
            this.newPoints = [];
            this.board.removeObject(this.animation);
            this.board.removeObject(this.currentPoint);
            this.animation = null;
        }
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        indexPair.push(2)
        backwardIndex.push(indexPair)
        break;
    case angleV:
        var indexPair = []
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        newP = false;
        object = this.getNearestObject(currX, currY);
        point = null;
        if (object === null) {
            point = this.board.create('point', [currX, currY], { snapSizeX: this.snapSizeX, snapSizeY: this.snapSizeY, snapToGrid: true, fixed: false, highlight: true });
            if (this.board.options.point.withLabel)
                point.setLabelText(point.getName());
        } else if (this.pointObjects.indexOf(object.elType) == -1) {
            point = this.board.create('glider', [currX, currY, object], { snapSizeX: this.snapSizeX, snapSizeY: this.snapSizeY, snapToGrid: true, fixed: false, highlight: true });
            if (this.board.options.point.withLabel)
                point.setLabelText(point.getName());
            newP = true;
        } else {
            point = object;
        }

        this.constructionPoints.push(point);
        if (newP) {
            this.newPoints.push(point);
        }
        bb = this.board.getBoundingBox();
        radiusSize = Math.abs(bb[0] - bb[2]) / 20;
        if (this.constructionPoints.length == 2) {
            genId = "_HIDDEN_" + new Date().getTime();
            tmppoint = this.board.create('point', [currX, currY], { id: genId, snapToGrid: false, fixed: false, visible: false });
            var inputValueAngle = document.getElementById('inputValueAngle').value;
            n = inputValueAngle
            if(isNaN(n)) {
                n = 45
            }

            if (document.getElementById("angle_left_orientation_" + this.id).checked) {
                v = Math.PI * (parseFloat(n) / 180);
                this.board.update();
                angle = this.board.create('angle', [this.constructionPoints[0], point, tmppoint], { fixed: false, radius: radiusSize, withLabel: false, highlight: true });
                angle.setAngle(v);
                this.board.create('line', [point, tmppoint], { fixed: false, straightFirst: false, highlight: true });
            }
            else {
                v = Math.PI * (360 - parseFloat(n) / 180);
                angle = this.board.create('angle', [this.constructionPoints[0], point, tmppoint], { fixed: false, visible: false });
                this.board.update();
                angle.setAngle(v);
                angle1 = this.board.create('angle', [tmppoint, point, this.constructionPoints[0]], { fixed: false, radius: radiusSize, withLabel: false, highlight: true });
                this.board.create('line', [point, tmppoint], { straightFirst: false, fixed: false, highlight: true });
            }
            this.constructionPoints = [];
            this.newPoints = [];
        }
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        indexPair.push(1)
        backwardIndex.push(indexPair)
        break;


    case angleSixty:
        var indexPair = []
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        newP = false;
        object = this.getNearestObject(currX, currY);
        point = null;
        if (object === null) {
            point = this.board.create('point', [currX, currY], { snapSizeX: this.snapSizeX, snapSizeY: this.snapSizeY, snapToGrid: true, fixed: false, highlight: true });
            if (this.board.options.point.withLabel)
                point.setLabelText(point.getName());
        } else if (this.pointObjects.indexOf(object.elType) == -1) {
            point = this.board.create('glider', [currX, currY, object], { snapSizeX: this.snapSizeX, snapSizeY: this.snapSizeY, snapToGrid: true, fixed: false, highlight: true });
            if (this.board.options.point.withLabel)
                point.setLabelText(point.getName());
            newP = true;
        } else {
            point = object;
        }

        this.constructionPoints.push(point);
        if (newP) {
            this.newPoints.push(point);
        }
        bb = this.board.getBoundingBox();
        radiusSize = Math.abs(bb[0] - bb[2]) / 20;
        if (this.constructionPoints.length == 2) {
            genId = "_HIDDEN_" + new Date().getTime();
            tmppoint = this.board.create('point', [currX, currY], { id: genId, snapToGrid: false, fixed: false, visible: false });
           n = 60
            if (document.getElementById("angle_left_orientation_" + this.id).checked) {
                v = Math.PI * (parseFloat(n) / 180);
                this.board.update();
                angle = this.board.create('angle', [this.constructionPoints[0], point, tmppoint], { fixed: false, radius: radiusSize, withLabel: false, highlight: true });
                angle.setAngle(v);
                this.board.create('line', [point, tmppoint], { fixed: false, straightFirst: false, highlight: true });
            }
            else {
                v = Math.PI * (360 - parseFloat(n) / 180);
                angle = this.board.create('angle', [this.constructionPoints[0], point, tmppoint], { fixed: false, visible: false });
                this.board.update();
                angle.setAngle(v);
                angle1 = this.board.create('angle', [tmppoint, point, this.constructionPoints[0]], { fixed: false, radius: radiusSize, withLabel: false, highlight: true });



                this.board.create('line', [point, tmppoint], { straightFirst: false, fixed: false, highlight: true });
            }
            this.constructionPoints = [];
            this.newPoints = [];
        }
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        indexPair.push(1)
        backwardIndex.push(indexPair)
        break;




    case erase:
        for (i = 0; i < this.board.downObjects.length; i++) {
            if (this.board.downObjects[i].getAttribute("fixed"))
                continue;
            if (this.board.downObjects[i].id.substring(0, 8) != '_STATIC_')
                this.board.removeObject(this.board.downObjects[i]);
        }
        break;



    case intersectionCommand:
        var indexPair = []
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        for (i = 0; i < this.board.downObjects.length; i++) {
            if (this.board.downObjects[i].id.substring(0, 8) == '_HIDDEN_') {
                continue;
            }
            if (this.nonPointObjects.indexOf(this.board.downObjects[i].elType) != -1) {
                for (j = 0; j < this.selectedObjects.length; j++) {
                    if (this.selectedObjects[j] == this.board.downObjects[i]) {
                        continue;
                    }
                }

                this.selectedObjects.push(this.board.downObjects[i]);
                this.board.downObjects[i].setAttribute({ strokeWidth: 3 });
                this.board.downObjects[i].setAttribute({ strokeColor: "blue" });
            }
        }
        if (this.selectedObjects.length == 2) {
            intersection = this.board.create('intersection', [this.selectedObjects[0], this.selectedObjects[1], 0], { fixed: false, highlight: true });
            if (this.board.options.point.withLabel)
                intersection.setLabelText(intersection.getName());
            if (this.selectedObjects[0].elType == 'circle' || this.selectedObjects[1].elType == 'circle')
                intersection = this.board.create('intersection', [this.selectedObjects[0], this.selectedObjects[1], 1], { fixed: false, highlight: true });
            if (this.board.options.point.withLabel)
                intersection.setLabelText(intersection.getName());
        }
        if (this.selectedObjects.length >= 2) {
            for (i = 0; i < this.selectedObjects.length; i++) {
                this.selectedObjects[i].setAttribute({ strokeWidth: 1 });
                this.selectedObjects[i].setAttribute({ strokeColor: 'black' });
            }
            this.selectedObjects = [];
        }
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        backwardIndex.push(indexPair)
        break;
    case perpendicularNormal:
        var indexPair = []
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        if (this.selectedObjects.length == 1) {
            object = this.getNearestObject(currX, currY);
            point = null;
            if (object === null) {
                point = this.board.create('point', [currX, currY], { snapSizeX: this.snapSizeX, snapSizeY: this.snapSizeY, snapToGrid: true, fixed: false, highlight: true });
                if (this.board.options.point.withLabel)
                    point.setLabelText(point.getName());
            }
            else if (this.pointObjects.indexOf(object.elType) == -1) {
                point = this.board.create('glider', [currX, currY, object], { snapSizeX: this.snapSizeX, snapSizeY: this.snapSizeY, snapToGrid: true, fixed: false, highlight: true });
                if (this.board.options.point.withLabel)
                    point.setLabelText(point.getName());
                newP = true;
            }
            else
                point = object;
            perpendicular = this.board.create('perpendicular', [this.selectedObjects[0], point], { fixed: false, highlight: true });
            strW1 = this.selectedObjects[0].getAttribute("strokeWidth") - 1;
            this.selectedObjects[0].setAttribute({ strokeWidth: strW1 });
            this.selectedObjects = [];
            this.board.removeObject(this.animation);
            this.board.removeObject(this.currentPoint);
            this.animation = null;
        }
        else {
            for (i = 0; i < this.board.downObjects.length; i++) {
                if (this.selectedObjects.length === 0 && this.nonPointObjects.indexOf(this.board.downObjects[i].elType) != -1) {
                    this.selectedObjects.push(this.board.downObjects[i]);
                    strW = this.board.downObjects[i].getAttribute("strokeWidth") + 1;
                    this.board.downObjects[i].setAttribute({ strokeWidth: strW });
                    this.currentPoint = this.board.create('point', [function () { return _guis[this.board.id].currentX; }, function () { return _guis[this.board.id].currentY; }], { name: "" });
                    this.animation = this.board.create('perpendicular', [this.selectedObjects[0], this.currentPoint]);
                }
            }
        }
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        indexPair.push(1)
        backwardIndex.push(indexPair)

        break;
    case parallelNormal:
        var indexPair = []
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        if (this.selectedObjects.length == 1) {
            object = this.getNearestObject(currX, currY);
            point = null;
            if (object === null) {
                point = this.board.create('point', [currX, currY], { snapSizeX: this.snapSizeX, snapSizeY: this.snapSizeY, snapToGrid: true, fixed: false, highlight: true });
                if (this.board.options.point.withLabel)
                    point.setLabelText(point.getName());
            }
            else if (this.pointObjects.indexOf(object.elType) == -1) {
                point = this.board.create('glider', [currX, currY, object], { snapSizeX: this.snapSizeX, snapSizeY: this.snapSizeY, snapToGrid: true, fixed: false, highlight: true });
                if (this.board.options.point.withLabel)
                    point.setLabelText(point.getName());
                newP = true;
            }
            else
                point = object;
            parallel = this.board.create('parallel', [this.selectedObjects[0], point], { highlight: true, fixed: false });
            strW1 = this.selectedObjects[0].getAttribute("strokeWidth") - 1;
            this.selectedObjects[0].setAttribute({ strokeWidth: strW1 });
            this.selectedObjects = [];
            this.board.removeObject(this.animation);
            this.board.removeObject(this.currentPoint);
            this.animation = null;
        }
        else {
            for (i = 0; i < this.board.downObjects.length; i++) {
                if (this.selectedObjects.length === 0 && this.nonPointObjects.indexOf(this.board.downObjects[i].elType) != -1) {
                    this.selectedObjects.push(this.board.downObjects[i]);
                    strW = this.board.downObjects[i].getAttribute("strokeWidth") + 1;
                    this.board.downObjects[i].setAttribute({ strokeWidth: strW });
                    this.currentPoint = this.board.create('point', [function () { return _guis[this.board.id].currentX; }, function () { return _guis[this.board.id].currentY; }], { name: "" });
                    this.animation = this.board.create('parallel', [this.selectedObjects[0], this.currentPoint]);
                }
            }
        }
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        indexPair.push(1)
        backwardIndex.push(indexPair)
        break;
    case symmetryNormal:
        var indexPair = []
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        for (i = 0; i < this.board.downObjects.length; i++) {
            if (this.board.downObjects[i].id.substring(0, 8) == '_HIDDEN_') {
                continue;
            }
            if (this.pointObjects.indexOf(this.board.downObjects[i].elType) != -1) {
                this.selectedObjects.push(this.board.downObjects[i]);
                strW = this.board.downObjects[i].getAttribute("size") + 1;
                this.board.downObjects[i].setAttribute({ size: strW });
            }
        }
        if (this.selectedObjects.length == 2) {
            line = this.board.create('line', [this.selectedObjects[0], this.selectedObjects[1]], { visible: false });
            circle = this.board.create('circle', [this.selectedObjects[1], this.selectedObjects[0]], { visible: false });
            var symmetry = this.board.create('intersection', [line, circle], { highlight: true, fixed: false });
            if (this.board.options.point.withLabel) {
                symmetry.setLabelText(this.selectedObjects[0].getName() + "'");
            }
            strW1 = this.selectedObjects[0].getAttribute("size") - 1;
            this.selectedObjects[0].setAttribute({ size: strW1 });
            strW2 = this.selectedObjects[1].getAttribute("size") - 1;
            this.selectedObjects[1].setAttribute({ size: strW2 });
            this.selectedObjects = [];
        }
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        backwardIndex.push(indexPair)
        break;
    case segmentSymmetry:
        var indexPair = []
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        for (i = 0; i < this.board.downObjects.length; i++) {
            if (this.board.downObjects[i].id.substring(0, 8) == '_HIDDEN_') {
                continue;
            }
            if (this.board.downObjects[i].elType == "segment") {
                point1 = this.board.downObjects[0].point1;
                point2 = this.board.downObjects[0].point2;
                genId = "_HIDDEN_" + new Date().getTime();
                midpoint = this.board.create("midpoint", [point1, point2], { id: genId, fixed: false, visible: false });
                segment_symmetry = this.board.create("perpendicular", [midpoint, this.board.downObjects[0]], { fixed: false, highlight: true });
                this.selectedObjects = [];
            }
        }
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        backwardIndex.push(indexPair)
        break;
    case angleBisector:
        var indexPair = []
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        for (i = 0; i < this.board.downObjects.length; i++) {
            if (this.board.downObjects[i].id.substring(0, 8) == '_HIDDEN_')
                continue;
            if (this.pointObjects.indexOf(this.board.downObjects[i].elType) != -1) {
                this.selectedObjects.push(this.board.downObjects[i]);
                strW = this.board.downObjects[i].getAttribute("size") + 1;
                this.board.downObjects[i].setAttribute({ size: strW });
            }
        }
        if (this.selectedObjects.length >= 3) {
            bisector = this.board.create('bisector', [this.selectedObjects[0], this.selectedObjects[1], this.selectedObjects[2]], { fixed: false, highlight: true });
            strW1 = this.selectedObjects[0].getAttribute("size") - 1;
            this.selectedObjects[0].setAttribute({ size: strW1 });
            strW2 = this.selectedObjects[1].getAttribute("size") - 1;
            this.selectedObjects[1].setAttribute({ size: strW2 });
            strW3 = this.selectedObjects[2].getAttribute("size") - 1;
            this.selectedObjects[2].setAttribute({ size: strW3 });
            this.selectedObjects = [];
        }
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        backwardIndex.push(indexPair)
        break;
    case midpointCommand:
        var indexPair = []
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        for (i = 0; i < this.board.downObjects.length; i++) {
            if (this.board.downObjects[i].id.substring(0, 8) == '_HIDDEN_') {
                continue;
            }
            if (this.pointObjects.indexOf(this.board.downObjects[i].elType) != -1) {
                this.selectedObjects.push(this.board.downObjects[i]);
                strW = this.board.downObjects[i].getAttribute("size") + 1;
                this.board.downObjects[i].setAttribute({ size: strW });
            }
        }
        if (this.selectedObjects.length > 1) {
            midpoint = this.board.create('midpoint', [this.selectedObjects[0], this.selectedObjects[1]], { highlight: true, fixed: false });
            if (this.board.options.point.withLabel) {
                midpoint.setLabelText(midpoint.getName());
            }
            strW1 = this.selectedObjects[0].getAttribute("size") - 1;
            this.selectedObjects[0].setAttribute({ size: strW1 });
            strW2 = this.selectedObjects[1].getAttribute("size") - 1;
            this.selectedObjects[1].setAttribute({ size: strW2 });
            this.selectedObjects = [];
        }
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        backwardIndex.push(indexPair)
        break;
    case lineSymmetry:
        var indexPair = []
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        for (i = 0; i < this.board.downObjects.length; i++) {
            if (this.board.downObjects[i].id.substring(0, 8) == '_HIDDEN_') {
                continue;
            }
            if (this.selectedObjects.length === 0 && this.pointObjects.indexOf(this.board.downObjects[i].elType) != -1) {
                this.selectedObjects.push(this.board.downObjects[i]);
                strW = this.board.downObjects[i].getAttribute("size") + 1;
                this.board.downObjects[i].setAttribute({ size: strW });
            }
            else if (this.selectedObjects.length == 1 && this.nonPointObjects.indexOf(this.board.downObjects[i].elType) != -1) {
                this.selectedObjects.push(this.board.downObjects[i]);
                strW = this.board.downObjects[i].getAttribute("size") + 1;
                this.board.downObjects[i].setAttribute({ size: strW });
            }
        }
        if (this.selectedObjects.length == 2) {
            var symmetry = this.board.create('reflection', [this.selectedObjects[0], this.selectedObjects[1]], { highlight: true, fixed: false });
            if (this.board.options.point.withLabel)
                symmetry.setLabelText(this.selectedObjects[0].getName() + "'");
            strW1 = this.selectedObjects[0].getAttribute("size") - 1;
            this.selectedObjects[0].setAttribute({ size: strW1 });
            strW2 = this.selectedObjects[1].getAttribute("size") - 1;
            this.selectedObjects[1].setAttribute({ size: strW2 });
            this.selectedObjects = [];
        }
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        backwardIndex.push(indexPair)
        break;
    case distance:
        var indexPair = []
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        for (i = 0; i < this.board.downObjects.length; i++) {
            if (this.board.downObjects[i].id.substring(0, 8) == '_HIDDEN_') {
                continue;
            }
            if (this.board.downObjects[i].elType == 'point' ||
                this.board.downObjects[i].elType == 'midpoint' ||
                this.board.downObjects[i].elType == 'glider' ||
                this.board.downObjects[i].elType == 'intersection' ||
                this.board.downObjects[i].elType == 'mirrorpoint' ||
                this.board.downObjects[i].elType == 'reflection') {
                this.selectedObjects.push(this.board.downObjects[i]);
                strW = this.board.downObjects[i].getAttribute("size") + 1;
                this.board.downObjects[i].setAttribute({ size: strW });

            }
            if (this.selectedObjects.length == 2)
                break;
        }
        if (this.selectedObjects.length == 2) {
            p1 = this.board.select(this.selectedObjects[0].id);
            p2 = this.board.select(this.selectedObjects[1].id);

            this.board.create("text", [(p1.X() + p2.X()) / 2, 0.5 + (p1.Y() + p2.Y()) / 2, function () { return "$d=" + (p1.Dist(p2)).toFixed(2).replace(".", ",") + "\\;\\mathbf{cm}$"; }], { highlight: true, fixed: false });

            strW1 = this.selectedObjects[0].getAttribute("size") - 1;
            this.selectedObjects[0].setAttribute({ size: strW1 });
            strW2 = this.selectedObjects[1].getAttribute("size") - 1;
            this.selectedObjects[1].setAttribute({ size: strW2 });
            this.selectedObjects = [];
        }
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        backwardIndex.push(indexPair)
        break;
    case area:
        var indexPair = []
        indexPair.push(jsxgraphauthor.board.objectsList.length)

        for (i = 0; i < this.board.downObjects.length; i++) {
            if (this.board.downObjects[i].id.substring(0, 8) == '_HIDDEN_')
                continue;

            if (this.board.downObjects[i].elType == "polygon") {
                polygon = this.board.select(this.board.downObjects[i].id);
                x = 0;
                y = 0;
                n = polygon.vertices.length - 1;
                for (j = 0; j < n; j++) {
                    x += polygon.vertices[j].X();
                    y += polygon.vertices[j].Y();
                }

                this.board.create("text", [x / n, y / n, function () {
                    return "$P=" + polygon.Area().toFixed(2).replace(".", ",") + "\\;\\mathbf{cm}^2$";
                }], { highlight: true, fixed: false });

            }
        }

        indexPair.push(jsxgraphauthor.board.objectsList.length)
        backwardIndex.push(indexPair)
        break;

    case translationCommand:
        var indexPair = []
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        for (i = 0; i < this.board.downObjects.length; i++) {
            if (this.board.downObjects[i].id.substring(0, 8) == '_HIDDEN_') {
                continue;
            }
            if (this.selectedObjects.length === 0 && this.pointObjects.indexOf(this.board.downObjects[i].elType) != -1) {
                this.selectedObjects.push(this.board.downObjects[i]);
                strW = this.board.downObjects[i].getAttribute("size") + 1;
                this.board.downObjects[i].setAttribute({ size: strW });
            }
            else if (this.selectedObjects.length == 1 && this.board.downObjects[i].elType == "arrow") {
                this.selectedObjects.push(this.board.downObjects[i]);
                strW = this.board.downObjects[i].getAttribute("size") + 1;
                this.board.downObjects[i].setAttribute({ size: strW });
            }
        }
        if (this.selectedObjects.length == 2) {
            tVector = this.selectedObjects[1];
            translation = this.board.create('transform', [
                function () { return tVector.point2.X() - tVector.point1.X() },
                function () { return tVector.point2.Y() - tVector.point1.Y() }], { type: 'translate' });
            result = this.board.create('point', [this.selectedObjects[0], translation], { highlight: true, fixed: false });
            if (this.board.options.point.withLabel)
                result.setLabelText(this.selectedObjects[0].getName() + "'");

            strW1 = this.selectedObjects[0].getAttribute("size") - 1;
            this.selectedObjects[0].setAttribute({ size: strW1 });
            strW2 = this.selectedObjects[1].getAttribute("size") - 1;
            this.selectedObjects[1].setAttribute({ size: strW2 });
            this.selectedObjects = [];
        }
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        backwardIndex.push(indexPair)
        break;
    case textCommand:
        var indexPair = []
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        var inputValueText= document.getElementById('inputValueText').value;
        text = inputValueText

        this.board.create('text', [currX, currY, text], { fontsize: 14, highlight: true, fixed: false });
        indexPair.push(jsxgraphauthor.board.objectsList.length)
        backwardIndex.push(indexPair)
        break;
}

this.board.update();
};

JSXGraphAuthor.prototype.getNearestObject = function (x, y) {
var minDist = 10000,
    i, el,
    nearestObject = null;

for (el in this.board.objects) {
    if (this.pointObjects.indexOf(this.board.objects[el].elType) != -1) {
        if (Math.sqrt(Math.pow(this.board.objects[el].X() - x, 2) + Math.pow(this.board.objects[el].Y() - y, 2)) < this.magnetSize
            && this.board.objects[el].id.substring(0, 8) != '_HIDDEN_' && this.board.objects[el] != this.currentPoint)
            if (Math.sqrt(Math.pow(this.board.objects[el].X() - x, 2) + Math.pow(this.board.objects[el].Y() - y, 2)) < minDist) {
                minDist = Math.sqrt(Math.pow(this.board.objects[el].X() - x, 2) + Math.pow(this.board.objects[el].Y() - y, 2));
                nearestObject = this.board.objects[el];
            }
    }
}
if (nearestObject != null) {
    return nearestObject;
}
for (i = 0; i < this.board.downObjects.length; i++) {
    if (this.board.downObjects[i] == this.animation || this.board.downObjects[i].id.substring(0, 8) == '_HIDDEN_') {
        continue;
    }
    if (this.nonPointObjects.indexOf(this.board.downObjects[i].elType) != -1) {
        nearestObject = this.board.downObjects[i];
    }
}
return nearestObject;
};

JSXGraphAuthor.prototype.addConsole = function (divId) {
var consoleDiv = document.getElementById(divId);

// consoleDiv.innerHTML = JSXGraphAuthor.help[this.language]._INPUT_ + ': <input type="text" id="' + this.id + '_input "style="width:' + (10 * _guis[this.id].bW - 40) + 'px" onkeypress="endInput(event, this, \'' + this.id + '\')" />';
consoleDiv.innerHTML = JSXGraphAuthor.help[this.language]._INPUT_ + ': <input type="text" id="' + this.id + '_input" style="width:' + (10 * _guis[this.id].bW - 40) + 'px" />';
document.getElementById(this.id + '_input').addEventListener('keypress', this.endInput.bind(this), false);
};

JSXGraphAuthor.prototype._mouseDown = function(e) {

    var coords = _guis[this.id].getMouseCoords(e, 0);
    _guis[this.id].currentX = coords.usrCoords[1];
    _guis[this.id].currentY = coords.usrCoords[2];
    _guis[this.id].downEvent(e);

    if (jsxgraphauthor.sketchNormalMode === 1) {
        if (jsxgraphauthor.board.mode !== jsxgraphauthor.board.BOARD_MODE_NONE) {
            return;
        }

        jsxgraphauthor.board.mode = jsxgraphauthor.board.BOARD_MODE_SKETCH;
        jsxgraphauthor.sketch = jsxgraphauthor.board.create('curve', [[], []], {
            strokeColor: '#bbbbbb',
            lineCap: 'round',
            strokeWidth: 10
        });
    }


    if (jsxgraphauthor.sketchPolynomialMode === 1) {

        if (jsxgraphauthor.board.mode !== jsxgraphauthor.board.BOARD_MODE_NONE) {
            return;
        }

        jsxgraphauthor.board.mode = jsxgraphauthor.board.BOARD_MODE_SKETCH;
        jsxgraphauthor.sketchPolynomial = jsxgraphauthor.board.create('curve', [[], []], {
            strokeColor: '#bbbbbb',
            lineCap: 'round',
            strokeWidth: 10
        });
    }

};

JSXGraphAuthor.prototype._mouseMove = function(e) {


    var coords = _guis[this.id].getMouseCoords(e, 0);
    _guis[this.id].currentX = coords.usrCoords[1];
    _guis[this.id].currentY = coords.usrCoords[2];
    if (_guis[this.id].constructionPoints.length !== 0 || _guis[this.id].selectedObjects.length !== 0)
        _guis[this.id].board.update();
    if (_guis[this.id].pencilPointsArray !== null) {
        var curvePoint = _guis[this.id].board.create('point', [_guis[this.id].currentX, _guis[this.id].currentY], { name: "", fixed: true, highlight: false, size: 2 });
        _guis[this.id].pencilPointsArray.push(curvePoint);
    }



    if (jsxgraphauthor.sketchNormalMode === 1 ) {

        var pos, c;

        if (jsxgraphauthor.board.mode !== jsxgraphauthor.board.BOARD_MODE_SKETCH) {
            return;
        }


        pos = jsxgraphauthor.board.getMousePosition(e, 0);

        c = new JXG.Coords(JXG.COORDS_BY_SCREEN, pos, jsxgraphauthor.board);
        jsxgraphauthor.sketch.dataX.push(c.usrCoords[1]);
        jsxgraphauthor.sketch.dataY.push(c.usrCoords[2]);
        jsxgraphauthor.board.update();

    }

    if (jsxgraphauthor.sketchPolynomialMode === 1) {

        var pos, c;
        if (jsxgraphauthor.board.mode !== jsxgraphauthor.board.BOARD_MODE_SKETCH) {
            return;
        }

        pos = jsxgraphauthor.board.getMousePosition(e, 0);

        c = new JXG.Coords(JXG.COORDS_BY_SCREEN, pos, jsxgraphauthor.board);
        jsxgraphauthor.sketchPolynomial.dataX.push(c.usrCoords[1]);
        jsxgraphauthor.sketchPolynomial.dataY.push(c.usrCoords[2]);

        jsxgraphauthor.board.update();


    }

};


JSXGraphAuthor.prototype._mouseUp = function(e) {


    var i;
    if (_guis[this.id].pencilPointsArray !== null) {
        for (i = 0; i < _guis[this.id].pencilPointsArray.length - 1; i++) {
            _guis[this.id].board.create('segment', [_guis[this.id].pencilPointsArray[i], _guis[this.id].pencilPointsArray[i + 1]], { strokeWidth: 8, highlight: false });
        }
        _guis[this.id].pencilPointsArray = null;
    }


    if (jsxgraphauthor.sketchNormalMode === 1) {

        if (jsxgraphauthor.board.mode !== jsxgraphauthor.board.BOARD_MODE_SKETCH) {
            return;
        }
        var coords = [], i, p;

        // Remove previous curve if it exists
        if (JXG.exists(jsxgraphauthor.curve)) {
            jsxgraphauthor.board.removeObject(jsxgraphauthor.curve);
            jsxgraphauthor.board.removeObject(jsxgraphauthor.points);
        }

        jsxgraphauthor.board.mode = jsxgraphauthor.board.BOARD_MODE_NONE;

        // Get list of coordinates from sketch curve
        for (i = 0; i < jsxgraphauthor.sketch.dataX.length; i++) {
            coords.push(new JXG.Coords(JXG.COORDS_BY_USER, [jsxgraphauthor.sketch.dataX[i], jsxgraphauthor.sketch.dataY[i]], jsxgraphauthor.board));
        }
        // Reduce the number of coordinate points to 6 internal coordinate points
        coords = JXG.Math.Numerics.Visvalingam(coords, 6);

        // Convert the output of Visvalingam to JSXGraph points
        jsxgraphauthor.points = [];
        for (i = 0; i < coords.length; i++) {
            jsxgraphauthor.points.push(
                jsxgraphauthor.board.create('point', [coords[i].usrCoords[1], coords[i].usrCoords[2]], {
                    withLabel: false,
                    visible: false
                })
            );
        }

        if (JXG.exists(jsxgraphauthor.tau)) {
            jsxgraphauthor.board.removeObject(jsxgraphauthor.tau);
        }
        jsxgraphauthor.tau = jsxgraphauthor.board.create('slider', [
            [1, 9],
            [7, 9],
            [0, 0.5, 1]
        ]);
        jsxgraphauthor.board.update();
        // Create cardinal spline from JSXGraph points

        jsxgraphauthor.curve = jsxgraphauthor.board.create('curve',
            JXG.Math.Numerics.CardinalSpline(jsxgraphauthor.points, () => jsxgraphauthor.tau.Value()), {
            strokeColor: '#000000',
                strokeWidth: 3,
                lineCap: 'round',
                fixed: false
        });
        // Remove the sketch curve
        jsxgraphauthor.board.removeObject(jsxgraphauthor.sketch);
        jsxgraphauthor.board.removeObject(jsxgraphauthor.points);
        jsxgraphauthor.sketchNormalMode = 0;
    }


    if (jsxgraphauthor.sketchPolynomialMode === 1) {

        if (jsxgraphauthor.board.mode !== jsxgraphauthor.board.BOARD_MODE_SKETCH) {
            return;
        }

        var coords = [], i, p;

        // Remove previous curve if it exists
        if (JXG.exists(jsxgraphauthor.curvePolynomial)) {
            jsxgraphauthor.board.removeObject(jsxgraphauthor.curvePolynomial);
            jsxgraphauthor.board.removeObject(jsxgraphauthor.pointsPolynomial);
        }

        jsxgraphauthor.board.mode = jsxgraphauthor.board.BOARD_MODE_NONE;
        // Get list of coordinates from sketch curve
        for (i = 0; i < jsxgraphauthor.sketchPolynomial.dataX.length; i++) {
            coords.push(new JXG.Coords(JXG.COORDS_BY_USER, [jsxgraphauthor.sketchPolynomial.dataX[i], jsxgraphauthor.sketchPolynomial.dataY[i]], jsxgraphauthor.board));
        }

        if (JXG.exists(jsxgraphauthor.degree) === false) {
            jsxgraphauthor.degree = jsxgraphauthor.board.create('slider', [
                [1, 8],
                [7, 8],
                [1, 3, 10]
            ], {
                name: 'degree',
                snapWidth: 1,
                digits: 0
            });
        }

        // Reduce the number of coordinate points to `degree + 1 - 2` internal coordinate points plus start point and end point.
        coords = JXG.Math.Numerics.Visvalingam(coords, jsxgraphauthor.degree.Value() - 1);

        // Convert the output of Visvalingam to JSXGraph points
        jsxgraphauthor.pointsPolynomial = [];
        for (i = 0; i < coords.length; i++) {
            jsxgraphauthor.pointsPolynomial.push(
                jsxgraphauthor.board.create('point', [coords[i].usrCoords[1], coords[i].usrCoords[2]], {
                    size: 5,
                    withLabel: false,
                    visible: true
                })
            );
        }

        // Create Lagrange polynomial from JSXGraph points
        jsxgraphauthor.curvePolynomial = jsxgraphauthor.board.create('functiongraph', [JXG.Math.Numerics.lagrangePolynomial(jsxgraphauthor.pointsPolynomial)], {
            strokeColor: '#000000',
            strokeWidth: 3,
            lineCap: 'round',
            fixed: false
        });

        // Remove the sketch curve
        jsxgraphauthor.board.removeObject(jsxgraphauthor.sketchPolynomial);
        jsxgraphauthor.sketchPolynomialMode = 0;
    }

};


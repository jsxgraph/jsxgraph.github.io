/*
Copyright 2023 Carsten Miller,
               Andreas Walter,
               Alfred Wassermann,

MIT License: https://github.com/jsxgraph/jsxgraph/blob/master/LICENSE.MIT

Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
and associated documentation files (the “Software”), to deal in the Software without restriction, 
including without limitation the rights to use, copy, modify, merge, publish, distribute, 
sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is 
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or 
substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE 
FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, 
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
SOFTWARE.

*/

JSXGraphAuthor.help = {};
JSXGraphAuthor.naming = {};
JSXGraphAuthor.modalShow = {};
JSXGraphAuthor.textModal = {};
JSXGraphAuthor.anglevModal = {};
JSXGraphAuthor.regularPolygonModal = {};
JSXGraphAuthor.fixedSegmentModal= {};
JSXGraphAuthor.boundingBoxModal= {};
JSXGraphAuthor.functionModal= {};
JSXGraphAuthor.circlerModal= {};
JSXGraphAuthor.dropdown = {};
JSXGraphAuthor.angleRotation = {};
JSXGraphAuthor.toolsDropdown = {};
JSXGraphAuthor.drawDropdown = {};
JSXGraphAuthor.helpDropdown = {};
JSXGraphAuthor.language = {};


JSXGraphAuthor.regularPolygonModal.en = {
    regularPolygonModal: "Number of vertices:"
};

JSXGraphAuthor.regularPolygonModal.ger = {
    regularPolygonModal: "Anzahl der Eckpunkte:"
};


JSXGraphAuthor.angleRotation.en = {
    angleAnticlockwise: "Anticlockwise",
    angleClockwise: "Clockwise"
};

JSXGraphAuthor.angleRotation.ger = {
    angleAnticlockwise: "Gegen den Uhrzeigersinn",
    angleClockwise: "Mit dem Uhrzeigersinn"
};

JSXGraphAuthor.boundingBoxModal.en= {
    boundingBoxModal: "Enter valid x,y values:"
};

JSXGraphAuthor.boundingBoxModal.ger= {
    boundingBoxModal: "Geben Sie valide x,y Werte an:"
};

JSXGraphAuthor.functionModal.en= {
    functionModal : "Enter a valid function"
};

JSXGraphAuthor.functionModal.ger= {
    functionModal : "Geben Sie eine valide Funktion ein"
};

JSXGraphAuthor.circlerModal.en= {
    circlerModal:"Enter a radius"
};

JSXGraphAuthor.circlerModal.ger= {
    circlerModal:"Geben Sie einen Radius an"
};

JSXGraphAuthor.fixedSegmentModal.en= {
    fixedSegmentModal: "Enter a length"
};

JSXGraphAuthor.fixedSegmentModal.ger= {
    fixedSegmentModal: "Geben Sie eine Länge an"
};

JSXGraphAuthor.anglevModal.en = {
    anglevModal: "Enter an angle"
};

JSXGraphAuthor.anglevModal.ger = {
    anglevModal: "Geben Sie einen Winkel an"
};

JSXGraphAuthor.textModal.en = {
    textModal: "Enter a text",
};

JSXGraphAuthor.textModal.ger = {
    textModal: "Geben Sie einen Text ein"
};

JSXGraphAuthor.language.en = {
    languageEn: "English",
    languageSlo: "Slovenian",
    languageGer: "German"
};

JSXGraphAuthor.language.ger = {
    languageEn: "Englisch",
    languageSlo: "Slowenisch",
    languageGer: "Deutsch"
};

JSXGraphAuthor.modalShow.en = {
    show : "Javascript Code:"
};

JSXGraphAuthor.modalShow.ger = {
    show : "Javascript Code:"
};

JSXGraphAuthor.dropdown.en = {
    tools : "Tools",
    draw : "Draw",
    help : "Help"

};

JSXGraphAuthor.dropdown.ger = {
    tools : "Werkzeuge",
    draw : "Zeichnen",
    help : "Hilfe"

};

JSXGraphAuthor.toolsDropdown.en = {
    downloadCode : "Download Code",
    downloadSVG : "Download SVG",
    downloadPNG : "Download PNG",
    showCode : "Show Code"
};

JSXGraphAuthor.toolsDropdown.ger = {
    downloadCode : "Code Herunterladen",
    downloadSVG : "SVG Herunterladen",
    downloadPNG : "PNG Herunterladen",
    showCode : "Code Anzeigen"
};

JSXGraphAuthor.drawDropdown.en = {
    pointDropdown : "Point",
    lineDropdown : "Line",
    circleDropdown : "Circle",
    angleDropdown : "Angle",
    transformDropdown : "Transform",
    textDropdown : "Text & Measure"
};

JSXGraphAuthor.drawDropdown.ger = {
    pointDropdown : "Punkt",
    lineDropdown : "Linie",
    circleDropdown : "Kreis",
    angleDropdown : "Winkel",
    transformDropdown : "Transformieren",
    textDropdown : "Text & Messen"
};

JSXGraphAuthor.helpDropdown.en = {
    languageDropdown : "Language",
    legalDropdown : "Legal Policies"
};

JSXGraphAuthor.helpDropdown.ger = {
    languageDropdown : "Sprache",
    legalDropdown : "Impressum"
};

JSXGraphAuthor.naming.ger = {
    arrow: "Auswählen",
    erase: "Löschen",
    sketchNormal: "Skizzieren",
    pointCommand: "Punkt",
    segmentNormal: "Segment",
    fixedSegment: "Festes Segment",
    lineNormal: "Linie",
    hline: "Strahl",
    circleNormal: "Kreis (Zentrum, Punkt)",
    circle3: "Kreis (3 Punkte)",
    conicSection5: "Ellipse",
    circler: "Kreis (Zentrum, Radius)",
    polygonCommand: "Polygon",
    regularPolygon: "Reguläres Polygon",
    angleNormal: "Zeichne Winkel",
    angleV: "Spezifischer Winkel",
    angleS: "Winkel-Beschriftung",
    intersectionCommand: "Schnittpunkt",
    angleBisector: "Winkelhalbierende",
    midpointCommand: "Mittelpunkt",
    perpendicularNormal: "Senkrechte",
    parallelNormal: "Parallele",
    symmetryNormal: "Punktreflexion",
    segmentSymmetry: "Mittelsenkrechte",
    lineSymmetry: "Linienreflexion",
    distance: "Distanz",
    area: "Fläche",
    vectorNormal: "Vektor",
    translationCommand: "Verschiebung",
    functionPlot: "Funktion",
    sketchPolynomial: "Skizziere polynomiell",
    textCommand: "Füge Beschriftung hinzu",
    angleSixty: "Winkel 60°",
    boundingBox:"Setze Begrenzungsrahmen"
}



JSXGraphAuthor.naming.en = {
    arrow: "Select",
    erase: "Delete",
    sketchNormal: "Sketch",
    pointCommand: "Point",
    segmentNormal: "Segment",
    fixedSegment: "Fixed Segment",
    lineNormal: "Line",
    hline: "Ray",
    circleNormal: "Circle (center, point)",
    circle3: "Circle (3 points)",
    conicSection5: "Ellipse",
    circler: "Circle (center, radius)",
    polygonCommand: "Polygon",
    regularPolygon: "Regular Polygon",
    angleNormal: "Draw Angle",
    angleV: "Specific Angle",
    angleS: "Angle-label",
    intersectionCommand: "Intersection",
    angleBisector: "Angle Bisector",
    midpointCommand: "Midpoint",
    perpendicularNormal: "Perpendicular",
    parallelNormal: "Parallel",
    symmetryNormal: "Reflection on point",
    segmentSymmetry: "Perpendicular bisector",
    lineSymmetry: "Reflection on line",
    distance: "Distance",
    area: "Area",
    vectorNormal: "Vector",
    translationCommand: "Translation",
    functionPlot: "Function",
    sketchPolynomial: "Sketch Polynomial",
    textCommand: "Add Label",
    angleSixty: "Angle 60°",
    boundingBox:"Set Bounding Box"
}


JSXGraphAuthor.naming.slo = {
    arrow: "Select",
    erase: "Delete",
    sketchNormal: "Scribble",
    pointCommand: "Point",
    segmentNormal: "Segment",
    fixedSegment: "Fixed Segment",
    lineNormal: "Line",
    hline: "Ray",
    circleNormal: "Circle (center, point)",
    circle3: "Circle (3 points)",
    conicSection5: "Ellipse",
    circler: "Circle (center, radius)",
    polygonCommand: "Polygon",
    regularPolygon: "Regular Polygon",
    angleNormal: "Draw Angle",
    angleV: "Specific Angle",
    angleS: "Angle-label",
    intersectionCommand: "Intersection",
    angleBisector: "Angle Bisector",
    midpointCommand: "Midpoint",
    perpendicularNormal: "Perpendicular",
    parallelNormal: "Parallel",
    symmetryNormal: "Reflection on line",
    segmentSymmetry: "Perpendicular bisector",
    lineSymmetry: "Reflection on point",
    distance: "Distance",
    area: "Area",
    vectorNormal: "Vector",
    translationCommand: "Translation",
    functionPlot: "Function",
    sketchPolynomial: "Sketch Polynomial",
    textCommand: "Add Label",
    angleSixty: "Angle 60°",
    boundingBox:"Set bounding box"
}


JSXGraphAuthor.help.en = {
    arrow: "Select tool",
    erase: "<strong>Delete object</strong>",
    sketchNormal: "<strong>Sketch</strong>",
    pointCommand: "<strong>Point</strong>: select coordinates",
    segmentNormal: "<strong>Segment</strong>: select two points",
    fixedSegment: "<strong>Segment with given length</strong>: select point and enter length",
    lineNormal: "<strong>Line</strong>: select two points",
    hline: "<strong>Ray</strong>: select two points",
    circleNormal: "<strong>Circle</strong>: select center and point on circle",
    circle3: "<strong>Circle through 3 points</strong>: select three points",
    conicSection5: "<strong>Conic through 5 points</strong>: select five points",
    circler: "<strong>Circle with given radius</strong>: select point and enter radius length",
    polygonCommand: "<strong>Polygon</strong>: select vertices (last must be equal to the first)",
    regularPolygon: "<strong>Regular polygon</strong>: select two points and enter number of edges",
    angleNormal: "<strong>Angle</strong>: select three points",
    angleV: "<strong>Angle with given size</strong>: select point and enter size",
    angleS: "<strong>Angle with size label</strong>: select three points",
    intersectionCommand: "<strong>Intersection</strong>: select objects",
    angleBisector: "<strong>Angle bisector</strong>: select three points",
    midpointCommand: "<strong>Midpoint</strong>: select two points",
    perpendicularNormal: "<strong>Perpendicular line</strong>: select segment/line/ray and point",
    parallelNormal: "<strong>Parallel line</strong>: select segment/line/ray and point",
    symmetryNormal: "<strong>Reflect about point</strong>: select two points",
    segmentSymmetry: "<strong>Perpendicular bisector</strong>: select segment",
    lineSymmetry: "<strong>Reflection about line</strong>: select point and line",
    distance: "<strong>Distance</strong>: select two points",
    area: "<strong>Area</strong>: select polygon",
    vectorNormal: "<strong>Vector</strong>: select two points",
    translationCommand: "<strong>Translation</strong>: select point and vector",
    _EMPTY_TEXT_: "Insert text",
    circlerPOPUP_: "Insert radius",
    angleVPOPUP_: "Insert angle size",
    fixedSegmentPOPUP_: "Length",
    _CONSOLE_POPUP_: "Invalid input value",
    _RPOLYGON_POPUP_: "Vertices",
    _INPUT_: "Input",
    _ACW_: "Anticlockwise",
    _CW_: "Clockwise",
    functionPlot: "Enter a valid Function",
    sketchPolynomial: "Scribble with mouse",
    textCommand: "Add Text",
    angleSixty: "Select two points"
};


JSXGraphAuthor.help.ger = {
    arrow: "Wähle Werkzeug aus",
    erase: "<strong>Lösche Objekt</strong>",
    sketchNormal: "<strong>Skizierren</strong>",
    pointCommand: "<strong>Punkt</strong>: wähle Koordinaten",
    segmentNormal: "<strong>Segment</strong>: wähle zwei Punkte",
    fixedSegment: "<strong>Segment mit fester Länge</strong>: wähle Punkt und setze Länge",
    lineNormal: "<strong>Linie</strong>: wähle zwei Punkte",
    hline: "<strong>Strahl</strong>: wähle zwei Punkte",
    circleNormal: "<strong>Kreis</strong>: wähle Zentrum und Punkt des Kreises",
    circle3: "<strong>Kreis durch 3 Punkte</strong>: wähle drei Punkte",
    conicSection5: "<strong>Ellipse durch 5 Punkte</strong>: wähle fünf Punkte",
    circler: "<strong>Kreis mit festen Radius</strong>: wähle einen Punkt und gebe die Länge an",
    polygonCommand: "<strong>Polygon</strong>: wähle Eckpunkte aus (letzter muss gleich dem ersten sein)",
    regularPolygon: "<strong>Reguläres Polygon</strong>: wähle zwei Punkte und gebe die Anzahl der Kanten ein",
    angleNormal: "<strong>Winkel</strong>: wähle drei Punkte",
    angleV: "<strong>Winkel mit fester Größe</strong>: wähle Punkt und gib Größe ein",
    angleS: "<strong>Winkel mit Beschriftung</strong>: wähle drei Punkte",
    intersectionCommand: "<strong>Überschneidung</strong>: wähle Objekte",
    angleBisector: "<strong>Angle bisector</strong>: wähle drei Punkte",
    midpointCommand: "<strong>Mittelpunkt</strong>: wähle zwei Punkte",
    perpendicularNormal: "<strong>Senkrechte Linie</strong>: wähle Segment/Linie/Strahl und Punkt",
    parallelNormal: "<strong>Parallele Linie</strong>: wähle Segment/Linie/Strahl und Punkt",
    symmetryNormal: "<strong>Punktreflexion</strong>: wähle zwei Punkte",
    segmentSymmetry: "<strong>Senkrechte Winkelhalbierende</strong>: Wähle ein Segment",
    lineSymmetry: "<strong>Linienreflektierung</strong>: wähle Punkt und Linie",
    distance: "<strong>Distanz</strong>: wähle zwei Punkte",
    area: "<strong>Fläche</strong>: wähle Polygon",
    vectorNormal: "<strong>Vektor</strong>: wähle zwei Punkte",
    translationCommand: "<strong>Verschiebung</strong>: wähle Punkt und Vektor aus",
    _EMPTY_TEXT_: "Geben Sie einen Text ein",
    circlerPOPUP_: "Geben sie den Radius an",
    angleVPOPUP_: "Geben sie die Winkelgöße an",
    fixedSegmentPOPUP_: "Länge",
    _CONSOLE_POPUP_: "Nicht valider Eingabewert",
    _RPOLYGON_POPUP_: "Eckpunkte",
    _INPUT_: "Input",
    _ACW_: "Gegen den Uhrzeigersinn",
    _CW_: "Im Uhrzeigersinn",
    functionPlot: "Geben Sie eine valide Funktion ein",
    sketchPolynomial: "Skizziere polynomielle Funktion",
    textCommand: "Füge Beschriftung zu",
    angleSixty: "<strong>Winkel</strong>: Wähle zwei Punkte"
};


JSXGraphAuthor.help.slo = {
    arrow: "Izberi orodje.",
    erase: "<strong>Brisanje objekta</strong>: izberi objekt, ki ga želiš odstraniti.",
    sketchNormal: "<strong>Pisalo</strong>: prostoročno risanje.",
    pointCommand: "<strong>Točka</strong>: izberi koordinate točke.",
    segmentNormal: "<strong>Daljica</strong>: izberi krajišči daljice.",
    fixedSegment: "<strong>Daljica z dano dolžino </strong>: izberi začetno točko in vnesi dolžino daljice.",
    lineNormal: "<strong>Premica</strong>: izberi dve točki, ki določata premico.",
    hline: "<strong>Poltrak</strong>: izberi začetno in dodatno točko, ki določata poltrak.",
    circleNormal: "<strong>Krožnica</strong>: izberi središče in točko na krožnici.",
    circle3: "<strong>Krožnica skozi tri točke</strong>: izberi tri točke, ki določajo krožnico.",
    conicSection5: "<strong>Stožnica skozi pet točk</strong>: izberi pet točk, ki določajo stožnico.",
    circler: "<strong>Krožnica s podanim polmerom</strong>: izberi središče krožnice in vnesi polmer.",
    polygonCommand: "<strong>Mnogokotnik</strong>: izberi oglišča mnogokotnika (zadnje mora biti enako začetnemu).",
    regularPolygon: "<strong>Pravilni mnogokotnik</strong>: izberi dve točki in število oglišč.",
    angleNormal: "<strong>Kot</strong>: izberi tri točke, ki določajo kot.",
    angleV: "<strong>Kot z izpisom velikosti</strong>: izberi tri točke, ki določajo kot.",
    angleS: "<strong>Kot</strong>: izberi tri točke, ki določajo kot.",
    intersectionCommand: "<strong>Presek</strong>: izberi objekte, katerih presek iščeš.",
    angleBisector: "<strong>Simetrala kota</strong>: izberi tri točke, ki določajo kot.",
    midpointCommand: "<strong>Središče daljice</strong>: izberi krajišči daljice.",
    perpendicularNormal: "<strong>Pravokotnica</strong>: izberi daljico/premico/poltrak in točko.",
    parallelNormal: "<strong>Vzporednica</strong>: izberi daljico/premico/poltrak in točko.",
    symmetryNormal: "<strong>Središčna simetrija</strong>: izberi točko, ki jo želiš preslikati, in središče simetrije.",
    segmentSymmetry: "<strong>Simetrala daljice</strong>: izberi daljico.",
    lineSymmetry: "<strong>Osna simetrija</strong>: izberi točko in os simetrije.",
    distance: "<strong>Razdalja</strong>: izberi dve točki.",
    area: "<strong>Ploščina</strong>: izberi mnogokotnik.",
    vectorNormal: "<strong>Vektor</strong>: izberi začetno in končno točko.",
    translationCommand: "<strong>Vzporedni premik za vektor</strong>: izberi točko in vektor.",
    textCommand: "Tekst",
    _EMPTY_TEXT_: "Vnesite tekst",
    circlerPOPUP_: "Vnesi polmer krožnice",
    angleVPOPUP_: "Vnesi velikost kota",
    fixedSegmentPOPUP_: "Dolžina",
    _CONSOLE_POPUP_: "Napaka! Napačen vnos",
    _RPOLYGON_POPUP_: "Oglišča",
    _INPUT_: "Vnos",
    _ACW_: "V nasprotni smeri urinega kazalca",
    _CW_: "V smeri urinega kazalca",
    functionPlot: "Enter a valid Function",
    sketchPolynomial: "Scribble with mouse",
    angleSixty: "S?"

};



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

"use strict";

/**
 * Computes the area of the graph. Returns an array of length 4 containing
 * the minimum and maximum x and y coordinates of the vertices.
 */
JXG.extend(Graph.prototype, {
  getGraphArea: function () {
    var graphArea;

    graphArea = [Infinity, -Infinity, -Infinity, Infinity];

    if (this.vertices.length > 0) {
      this.vertices.forEach((vertice) => {
        graphArea[0] = Math.min(graphArea[0], vertice.X());
        graphArea[1] = Math.max(graphArea[1], vertice.Y());
        graphArea[2] = Math.max(graphArea[2], vertice.X());
        graphArea[3] = Math.min(graphArea[3], vertice.Y());
      });
    }
    return graphArea;
  },
});

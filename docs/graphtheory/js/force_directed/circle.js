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

JXG.extend(Graph.prototype, {
  /**
   *  Runs an algorithm to order the vertices in a circle. The radius of the circle is 90% of the width or height, depending on which is smaller.
   * @param {Array} boundingbox - Boundingbox of the graph. [minX, maxY, maxX, minY]
   */
  orderCircular: function (boundingbox) {
    const angleSteps = (2 * Math.PI) / this.vertices.length;

    const radius =
      (Math.min(
        boundingbox[2] - boundingbox[0],
        boundingbox[1] - boundingbox[3]
      ) /
        2) *
      0.9;

    const center = [
      boundingbox[0] + (boundingbox[2] - boundingbox[0]) / 2,
      boundingbox[1] + (boundingbox[3] - boundingbox[1]) / 2,
    ];

    for (let i = 0; i < this.vertices.length; i++) {
      const angle = i * angleSteps;
      const x = center[0] + Math.cos(angle) * radius;
      const y = center[0] + Math.sin(angle) * radius;
      this.vertices[i].moveTo([x, y], 500);
    }
  },
});

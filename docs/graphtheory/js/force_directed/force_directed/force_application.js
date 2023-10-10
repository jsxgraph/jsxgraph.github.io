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
   * Private function to apply forces to the vertices using a cooldown. Function should be called by force directed algorithms.
   * @param {Array} forces - Array containing the forces for each vertice.
   * @param {Number} iteration - Current iteration of the algorithm.
   * @param {Number} cooldown - Cooldown factor of the algorithm. between between 0 and 1.
   * @param {Number} k - Optimal length of the edges like a spring without force in any direction.
   * @param {Array} boundingbox - Boundingbox of the graph. [minX, maxY, maxX, minY]
   * @param {Number} stepDuration - Duration of the step for animation.
   */
  _applyForcesWithCooldown: async function (
    forces,
    iteration,
    cooldown,
    k,
    boundingbox,
    stepDuration
  ) {
    var maxDelta, force, delta
    maxDelta = 0;

    for (let i = 0; i < this.vertices.length; i++) {
      force = Math.sqrt(
        Math.pow(forces[i][0], 2) + Math.pow(forces[i][1], 2)
      );

      delta = [0, 0];
      delta[0] =
        (forces[i][0] / force) *
        Math.min(force, Math.pow(cooldown, iteration) * k * 2);
      delta[1] =
        (forces[i][1] / force) *
        Math.min(force, Math.pow(cooldown, iteration) * k * 2);

      maxDelta = Math.max(
        maxDelta,
        Math.sqrt(Math.pow(delta[0], 2) + Math.pow(delta[1], 2))
      );

      delta[0] = this.vertices[i].X() + delta[0];
      delta[1] = this.vertices[i].Y() + delta[1];

      if (delta[0] < boundingbox[0]) {
        delta[0] = boundingbox[0];
      }
      if (delta[0] > boundingbox[2]) {
        delta[0] = boundingbox[2];
      }
      if (delta[1] < boundingbox[3]) {
        delta[1] = boundingbox[3];
      }
      if (delta[1] > boundingbox[1]) {
        delta[1] = boundingbox[1];
      }

      this.vertices[i].moveTo(
        [delta[0], delta[1]],
        stepDuration >= 55 ? stepDuration - 5 : 0
      );
    }
    await new Promise((resolve) => setTimeout(resolve, stepDuration));
    return maxDelta;
  },
});

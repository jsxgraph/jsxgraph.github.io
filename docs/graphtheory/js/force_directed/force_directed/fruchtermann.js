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
   *  Runs the Fruchtermann-Reingold algorithm on the graph with the given parameters.
   * Also calls the function to apply forces to the vertices. Creates a force directed layout of the graph.
   * @param {Object} options - Object containing the options for the algorithm.
   * The object can contain the following parameters:
   * <ul>
   * <li> <b>cooldown</b> - Cooldown factor for the algorithm. Default is 0.975.</li>
   * <li> <b>maxRepetitions</b> - Maximum number of iterations. Default is 300.</li>
   * <li> <b>minForceDelta</b> - Minimum force delta. Default is 0.01.</li>
   * <li> <b>optimalLength</b> - Optimal length of the edges like a spring without force in any direction. Default is 3.</li>
   * <li> <b>boundingBox</b> - Boundingbox of the graph. [minX, maxY, maxX, minY]</li>
   * <li> <b>stepDuration</b> - Duration of the animation step in milliseconds. Default is 50.</li>
   * </ul>
   */
  runFruchtermannReingold: async function (options) {
    var cooldown,
      maxRepetitions,
      minForceDelta,
      optimalLength,
      boundingBox,
      stepDuration,
      maxForce,
      forceInVertice,
      force;

    cooldown = options.cooldown ? options.cooldown : 0.975;
    maxRepetitions = options.maxRepetitions ? options.maxRepetitions : 300;
    minForceDelta = options.minForceDelta ? options.minForceDelta : 0.01;
    optimalLength = options.optimalLength ? options.optimalLength : 3;
    boundingBox = options.boundingBox
      ? options.boundingBox
      : this.board.getBoundingBox();
    stepDuration = options.stepDuration ? options.stepDuration : 50;

    if (this.vertices.length > 0) {
      maxForce = minForceDelta + 1;

      //i is just a iteration counter to ensure that the algorithm terminates if the termination fails or takes too long
      for (let i = 0; i < maxRepetitions && maxForce > minForceDelta; i++) {
        forceInVertice = [];
        maxForce = 0;

        //j is the index of the vertice we are currently computing the forces for
        for (let j = 0; j < this.vertices.length; j++) {
          forceInVertice[j] = [0, 0].slice();

          //k is index of a vertice which acts on the vertice j
          for (let k = 0; k < this.vertices.length; k++) {
            //skip if j and k are the same vertice
            if (j == k) {
              continue;
            }

            force = this._computeForcesFruchtermann(j, k, optimalLength);

            forceInVertice[j][0] += force[0];
            forceInVertice[j][1] += force[1];
          }
        }

        //apply forces to vertices
        maxForce = await this._applyForcesWithCooldown(
          forceInVertice,
          i,
          cooldown,
          optimalLength,
          boundingBox,
          stepDuration
        );
      }
    }
  },
  /**
   * Private function to compute the attractive and repulsive forces between two vertices.
   * @param {Number} nodeId - Index of the vertice we are computing the forces for.
   * @param {Number} contraNodeId - Index of the vertice which acts on the vertice node_id.
   * @param {Number} k - Optimal length of the edges like a spring without force in any direction.
   */
  _computeForcesFruchtermann: function (nodeId, contraNodeId, k) {
    var area,
      space,
      displacement,
      distance,
      attractiveForce,
      repulsiveForce,
      force;

    displacement = [0, 0];
    distance = 0;

    attractiveForce = [0, 0];
    repulsiveForce = [0, 0];

    force = [0, 0];

    //compute displacement
    displacement[0] =
      this.vertices[contraNodeId].X() - this.vertices[nodeId].X();

    displacement[1] =
      this.vertices[contraNodeId].Y() - this.vertices[nodeId].Y();

    //compute distance
    distance = Math.sqrt(
      Math.pow(displacement[0], 2) + Math.pow(displacement[1], 2)
    );

    if (this.adjacency_matrix[nodeId][contraNodeId] == 1) {
      //compute attractive force
      attractiveForce[0] =
        (Math.pow(distance, 2) / k) * normVector(displacement[0], distance);
      attractiveForce[1] =
        (Math.pow(distance, 2) / k) * normVector(displacement[1], distance);
    }

    //compute repulsive force
    repulsiveForce[0] =
      (-Math.pow(k, 2) / distance) * normVector(displacement[0], distance);
    repulsiveForce[1] =
      (-Math.pow(k, 2) / distance) * normVector(displacement[1], distance);

    force[0] = repulsiveForce[0] + attractiveForce[0];
    force[1] = repulsiveForce[1] + attractiveForce[1];

    return force;
  },
});

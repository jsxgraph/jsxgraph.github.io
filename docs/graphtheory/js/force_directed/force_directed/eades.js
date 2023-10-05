"use strict";

JXG.extend(Graph.prototype, {
  /**
   * Runs the Eades Algorithm on the graph.
   * Also calls the function to apply forces to the vertices. Creates a force directed layout of the graph.
   * @param {Object} options - Object containing the options for the algorithm.
   * The object can contain the following parameters:
   * <ul>
   *  <li> <b>cooldown</b> - Cooldown factor for the algorithm. Default is 0.99.</li>
   * <li> <b>maxRepetitions</b> - Maximum number of iterations. Default is 1000.</li>
   * <li> <b>minForceDelta</b> - Minimum force delta. Default is 0.01.</li>
   * <li> <b>optimalLength</b> - Optimal length of the edges like a spring without force in any direction. Default is 3.</li>
   * <li> <b>constantRepulsiveForce</b> - Constant for the repulsive force. Default is 2.</li>
   * <li> <b>constantSpring</b> - Constant for the attractive force. Default is 1.</li>
   * <li> <b>boundingBox</b> - Boundingbox of the graph. [minX, maxY, maxX, minY]</li>
   * <li> <b>stepDuration</b> - Duration of the animation step in milliseconds. Default is 10.</li>
   * </ul>
   */
  runEades: async function (options) {
    var cooldown,
      maxRepetitions,
      minForceDelta,
      optimalLength,
      constantRepulsiveForce,
      constantSpring,
      boundingBox,
      stepDuration,
      maxForce,
      forceInVertice,
      force;

    cooldown = options.cooldown ? options.cooldown : 0.99;
    maxRepetitions = options.maxRepetitions ? options.maxRepetitions : 1000;
    minForceDelta = options.minForceDelta ? options.minForceDelta : 0.01;
    optimalLength = options.optimalLength ? options.optimalLength : 3;
    constantRepulsiveForce = options.constantRepulsiveForce
      ? options.constantRepulsiveForce
      : 2;
    constantSpring = options.constantSpring ? options.constantSpring : 1;
    boundingBox = options.boundingBox
      ? options.boundingBox
      : this.board.getBoundingBox();
    stepDuration = options.stepDuration ? options.stepDuration : 10;

    console.log(constantRepulsiveForce);
    console.log(constantSpring);

    if (this.vertices.length > 0) {
      maxForce = minForceDelta + 1; //set maxForce to be always bigger than epsilon for initial iteration

      //iterative Algorithm
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

            force = this._computeForcesEades(
              j,
              k,
              optimalLength,
              constantRepulsiveForce,
              constantSpring
            );

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
   * @param {Number} nodeID - Index of the vertice we are currently computing the forces for.
   * @param {Number} contraNodeID - Index of a vertice which acts on the vertice j.
   * @param {Number} k - Optimal length of the edges like a spring without force in any direction.
   * @param {Number} constantRepulsiveForce - Constant for the repulsive force.
   * @param {Number} constantSpring - Constant for the attractive force.
   */
  _computeForcesEades: function (
    nodeID,
    contraNodeID,
    k,
    constantRepulsiveForce,
    constantSpring
  ) {
    var displacement,
      maxDisplacement,
      distance,
      attractiveForce,
      repulsiveForce,
      undirectedRepForce,
      undirectedAttrForce,
      force;
    displacement = [0, 0];
    maxDisplacement = 20;
    distance = 0;
    attractiveForce = [0, 0];
    repulsiveForce = [0, 0];
    force = [0, 0];

    //compute displacement
    displacement[0] =
      this.vertices[contraNodeID].X() - this.vertices[nodeID].X();

    displacement[1] =
      this.vertices[contraNodeID].Y() - this.vertices[nodeID].Y();

    //compute distance
    distance = Math.sqrt(
      Math.pow(displacement[0], 2) + Math.pow(displacement[1], 2)
    );

    //compute repulsive force

    undirectedRepForce =
      -constantRepulsiveForce / Math.max(Math.pow(distance, 2), 0.0001);

    repulsiveForce[0] =
      undirectedRepForce * normVector(displacement[0], distance);
    repulsiveForce[1] =
      undirectedRepForce * normVector(displacement[1], distance);

    if (this.adjacency_matrix[nodeID][contraNodeID] == 1) {
      undirectedAttrForce = constantSpring * Math.log(distance / k);

      //compute attractive force
      attractiveForce[0] =
        undirectedAttrForce * normVector(displacement[0], distance) -
        repulsiveForce[0];
      attractiveForce[1] =
        undirectedAttrForce * normVector(displacement[1], distance) -
        repulsiveForce[1];
    }

    force[0] = repulsiveForce[0] + attractiveForce[0];
    force[1] = repulsiveForce[1] + attractiveForce[1];

    return force;
  },
});

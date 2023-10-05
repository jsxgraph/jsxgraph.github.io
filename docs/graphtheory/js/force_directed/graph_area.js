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

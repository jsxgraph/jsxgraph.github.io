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

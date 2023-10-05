JXG.extend(Graph.prototype, {
  calculateOptimalLength: function () {
    var optimalLength, x1, x2, y1, y2, boundingbox, area;
    boundingbox = this.board.getBoundingBox();

    area = (Math.abs(boundingbox[0]) + Math.abs(boundingbox[2])) * 
      (Math.abs(boundingbox[1]) + Math.abs(boundingbox[3]));

    if (this.vertices.length >= 10) {
      optimalLength = Math.floor(
        area / (this.vertices.length * this.vertices.length)
      );
      if (optimalLength == 0) {
        return 2;
      }
      return optimalLength;
    } else {
      optimalLength = Math.floor(
        area / (this.vertices.length * this.vertices.length)
      );
      if (optimalLength > 20) {
        return 20;
      }
      return optimalLength - 1;
    }
  },
});

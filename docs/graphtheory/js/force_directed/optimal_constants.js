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

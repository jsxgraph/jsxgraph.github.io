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
  bipartite: function (boundingBox) {
    var bipartite;
    bipartite = g.isBipartite();

    if (bipartite == false) {
      bipartite = [];
      for (let i = 0; i < this.vertices.length; i++) {
        if (i % 2 == 0) {
          bipartite[i] = 0;
        } else {
          bipartite[i] = 1;
        }
      }
      console.log(bipartite);
      g.drawBipartite(bipartite, boundingBox);
      return;
    }
    g.drawBipartite(bipartite, boundingBox);
  },

  coloredPlacing: function (boundingBox) {
    var bipartite;

    if (this.colors.length == this.vertices.length) {
      bipartite = this.colors;
      g.drawBipartite(bipartite, boundingBox);
      return;
    } else {
      console.log("No groups are defined.");
    }
  },

  isBipartite: function () {
    var coloredVertices;
    coloredVertices = [];
    for (let i = 0; i < this.vertices.length; i++) {
      coloredVertices[i] = -1; //No node is colored in the beginning
    }
    for (let i = 0; i < this.vertices.length; i++) {
      if (
        coloredVertices[i] == -1 &&
        g.isBipartite2(i, coloredVertices) == false
      ) {
        return false;
      }
    }
    return coloredVertices;
  },

  isBipartite2: function (start, coloredVertices) {
    var queue, index;
    coloredVertices[start] = 1; //color first node
    queue = new Queue();
    queue.enqueue(start);

    while (queue.length() != 0) {
      index = queue.peek();
      queue.dequeue();
      if (this.adjacency_matrix[index][index] == 1) {
        return false;
      }
      for (let i = 0; i < coloredVertices.length; i++) {
        if (this.adjacency_matrix[index][i] == 1 && coloredVertices[i] == -1) {
          //test if index is connected to other nodes
          coloredVertices[i] = 1 - coloredVertices[index]; //gives alternating color to connected nodes
          queue.enqueue(i);
        } else {
          if (
            this.adjacency_matrix[index][i] == 1 &&
            coloredVertices[i] == coloredVertices[index]
          ) {
            return false; //if the nodes are connected and have the same color
          }
        }
      }
    }
    return coloredVertices; //if all tests didn´t return then the graph is bipartite
  },

  drawBipartite: function (bipartite, boundingBox) {
    var leftGroup, rightGroup, x, y, y1, y2, j, k;
    y1 = 0;
    y2 = 0;
    x = Math.abs(boundingBox[0]) + Math.abs(boundingBox[2]);
    y = Math.abs(boundingBox[1]) + Math.abs(boundingBox[3]);
    x /= 4;
    leftGroup = boundingBox[0] + x;
    rightGroup = boundingBox[2] - x;
    for (let i = 0; i < this.vertices.length; i++) {
      if (bipartite[i] == 0) {
        this.vertices[i].moveTo([leftGroup, this.vertices[i].Y()], 80);
        y1++;
      }
      if (bipartite[i] == 1) {
        this.vertices[i].moveTo([rightGroup, this.vertices[i].Y()], 80);
        y2++;
      }
    }

    y1 = y / y1;
    y2 = y / y2;

    j = 0;
    k = 0;

    for (let i = 0; i < this.vertices.length; i++) {
      if (bipartite[i] == 0) {
        this.vertices[i].moveTo(
          [leftGroup, y1 / 2 + boundingBox[3] + j * y1],
          80
        );
        j++;
      }
      if (bipartite[i] == 1) {
        this.vertices[i].moveTo(
          [rightGroup, y2 / 2 + boundingBox[3] + k * y2],
          80
        );
        k++;
      }
    }
  },
});

class Queue {
  constructor() {
    this.element = {};
    this.head = 0;
    this.tail = 0;
  }

  enqueue(element) {
    this.element[this.tail] = element;
    this.tail++;
  }

  dequeue() {
    const item = this.element[this.head];
    delete this.element[this.head];
    this.head++;
    return item;
  }

  peek() {
    return this.element[this.head];
  }

  length() {
    return this.tail - this.head;
  }

  isEmpty() {
    return this.length == 0;
  }
}

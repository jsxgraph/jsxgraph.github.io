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

var Graph = function (board, data, attributes) {
  this.board = board;

  /**
   * Number of vertices
   * @type number
   */
  this.number_vertices = 0;

  /**
   * Number of edges
   * @type number
   */
  this.number_edges = 0;

  /**
   * Array of strings containing the vertex labels.
   * If labels are not provided by the file format,
   * labels are 1, ..., number_vertices
   *
   * @type Array
   */
  this.vertex_labels = [];

  /**
   * Array of edges. An edge is an array of length two
   * containing two vertex numbers (zero based). These
   * are the position of the vertices in the array "vertices".
   *
   * @type Array
   */
  this.edges_list = [];

  /**
   * Array of JSXGraph points representing the vertices of the graph.
   *
   * @type Array
   */
  this.vertices = [];

  /**
   * Array containing the initial position [x, y] of the vertices, given
   * as arrays of length two. These initial positions are taken from the input data
   * for the graph, or are set randomly if not provided by the graph format.
   *
   * @type Array
   */
  this.vertices_start_position = [];

  /**
   * Array of JSXGraph segments representing the edges of the graph.
   *
   * @type Array
   */
  this.edges = [];

  /**
   * Array of indizes showing in which group the vertice at the same index is.
   *
   * @type Array
   */
  this.colors = [];

  /**
   * Two dimensional Array of indizes showing the groups of vertices.
   *
   * @type Array
   */
  this.vertice_groups = [];

  /**
   * Adjacency matrix of the graph.
   *
   * @type Array
   */
  this.adjacency_matrix = [];
  /**
   * Shortcut for the adjacency matrix of the graph.
   *
   * @type Array
   */
  this.A = this.adjacency_matrix;

  // Initialize Graph from input string
  this.init_graph(data, attributes);

  // Create JSXGraph points and edges
  this.init_plot(attributes);
};

JXG.extend(Graph.prototype, {
  /**
   * Read graph from string.
   * Supported file formats are:
   * <ul>
   *   <li> <a href="http://www.tcs.hut.fi/Software/bliss/fileformat.shtml">bliss</a> /
   *        <a href="">dimacs<a>
   * </ul>
   * @param {String} data
   * @param {Object} attributes
   */
  init_graph: function (data, attributes) {
    if (attributes.format.toLowerCase() === "dimacs") {
      this.read_dimacs(data);
      this.random_position();
    } else {
      throw new Error("Graph: format not yet supported.");
    }
  },

  /**
   * Create graph from string containing a graph in dimacs /
   * <a href="http://www.tcs.hut.fi/Software/bliss/fileformat.shtml">bliss format</a>.
   * So far, vertex colors are ignored.
   * @param {String} data String containing a graph
   */
  read_dimacs: function (data) {
    var i,
      line,
      le,
      token,
      j,
      inp = data.split("\n"); // Split string into lines

    le = inp.length;
    for (i = 0; i < le; i++) {
      // Remove whitespace.
      // If line is empty, skip it.
      line = inp[i].trim();
      if (line.length === 0) {
        continue;
      }

      switch (line[0]) {
        case "c":
          continue; // Skip comments
          break;
        case "n":
          token = line.split(" ");
          if (this.vertice_groups[parseInt(token[2]) - 1] === undefined) {
            this.vertice_groups[parseInt(token[2]) - 1] = [];
          }
          this.vertice_groups[parseInt(token[2]) - 1].push(
            parseInt(token[1] - 1)
          );
          this.colors[parseInt(token[1] - 1)] = parseInt(token[2] - 1);
          break;
        case "p":
          token = line.split(" ");
          this.number_vertices = parseInt(token[2]);
          this.number_edges = parseInt(token[3]);

          this.edges_list = [];
          this.vertex_labels = [];
          for (j = 0; j < this.number_vertices; j++) {
            this.vertex_labels.push(j + 1);
          }
          break;
        case "e":
          token = line.split(" ");
          // DIMACS is 1-based (i.e. vertices start at 1.)
          // Store the vertices 0-based.
          this.edges_list.push([
            parseInt(token[1]) - 1,
            parseInt(token[2]) - 1,
          ]);
          break;
        default:
          break;
      }
    }

    if (this.edges_list.length !== this.number_edges) {
      throw new Error(
        "Graph: number of edges not correct: " +
          this.edges_list.length +
          ". Expected are " +
          this.number_edges +
          "."
      );
    }

    this.set_adjacency_matrix();
  },

  /**
   * Compute the adjacency matrix from the list of edges of an
   * undirected graph.
   */
  set_adjacency_matrix: function () {
    var i, j, e;

    this.adjacency_matrix = [];
    for (i = 0; i < this.number_vertices; i++) {
      this.adjacency_matrix.push(Array(this.number_vertices));
      for (j = 0; j < this.number_vertices; j++) {
        this.adjacency_matrix[i][j] = 0;
      }
    }
    this.A = this.adjacency_matrix;

    for (i = 0; i < this.number_edges; i++) {
      e = this.edges_list[i];
      this.adjacency_matrix[e[0]][e[1]] = 1;
      this.adjacency_matrix[e[1]][e[0]] = 1;
    }
    // console.log(this.A);
  },

  /**
   * Set the initial coordinates of the vertices to random positions.
   */
  random_position: function () {
    var bb = this.board.getBoundingBox(),
      w = (bb[2] - bb[0]) * 0.9,
      h = (bb[3] - bb[1]) * 0.9,
      i;

    for (i = 0; i < this.number_vertices; i++) {
      this.vertices_start_position.push([
        (Math.random() - 0.5) * w,
        (Math.random() - 0.5) * h,
      ]);
    }
  },

  /**
   *
   * Create JSXGraph objects for the vertices and edges.
   *
   * @param {Object} attributes
   */
  init_plot: function (attributes) {
    var i, e, attr;

    attr = attributes.vertices || { size: 8 };

    for (i = 0; i < this.number_vertices; i++) {
      attr.name = this.vertex_labels[i];
      //add graphs without groups to default group (index 0) then add custom colors.
      if (this.colors[i] === undefined) {
        if (this.vertice_groups[0] === undefined) {
          this.vertice_groups[0] = [];
        }
        this.vertice_groups[0].push(i);
        this.colors[i] = 0;
      }
      if (attr.colors) {
        if (attr.colors[this.colors[i]]) {
          attr.color = attr.colors[this.colors[i]];
        }
      }

      this.vertices.push(
        this.board.create("point", this.vertices_start_position[i], attr)
      );
    }

    attr = attributes.edges || { strokeColor: "black" };
    for (i = 0; i < this.number_edges; i++) {
      e = this.edges_list[i];
      this.edges.push(
        this.board.create(
          "segment",
          [this.vertices[e[0]], this.vertices[e[1]]],
          attr
        )
      );
    }
  },
});

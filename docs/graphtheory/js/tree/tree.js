JXG.extend(Graph.prototype, {
  /**
   *
   * @param {Array} boundingBox [x1, y1, x2, y2]
   * @param {string} visualisation can hold the value of 'horizontal', 'vertical' or 'concentric'
   * @param {*} rootVertice the (int) id of the root vertice
   * @param {Int} childrenSpread changes the spread amongst the children
   * of each vertice
   * can also be 'min'/'max' to automatically calculate the root node with minimum/maximum depth
   */
  displayAsTree: function (
    boundingBox,
    visualisation,
    rootVertice,
    childrenSpread
  ) {
    var root;

    //check if it is a tree
    if (!this.isTree()) {
      throw new Error("Input graph is not a tree");
      return;
    }

    //check if the boundingbox is set accordingly
    if (boundingBox[0] >= boundingBox[2] || boundingBox[1] <= boundingBox[3]) {
      throw new Error("Incorrect BoundingBox");
      return;
    }

    //get root node
    if (rootVertice === "min") {
      root = this.minDepthRootVertice();
    } else if (rootVertice === "max") {
      root = this.maxDepthRootVertice();
    } else {
      if (
        Number.isInteger(rootVertice) &&
        rootVertice <= this.number_vertices
      ) {
        root = rootVertice - 1; //array starts with 0
      } else {
        root = this.minDepthRootVertice();
      }
    }

    //visualisation
    switch (visualisation) {
      case "vertical":
        this.showVerticalTree(root, boundingBox);
        break;

      case "horizontal":
        this.showHorizontalTree(root, boundingBox);
        break;

      case "concentric":
        this.showConCentricTree(root, boundingBox, childrenSpread);
        break;

      default:
        this.showVerticalTree(root, boundingBox);
    }

    return this;
  },

  /**
   * Checks if current graph is a tree.
   * Returns true or false accordingly
   */
  isTree: function () {
    var A = this.A,
      startingVert = 0,
      visited = Array(this.number_vertices).fill(false),
      queue = [], //contains [vertice, parent]
      current,
      parent;

    //correlation of vertices and edges must be v - 1 = e
    if (this.number_vertices - 1 !== this.number_edges) {
      return false;
    }
    /**
     * Searching for circles using a breadth first search approach
     */
    queue.push([startingVert, 0]);
    visited[startingVert] = true;

    while (queue.length > 0) {
      parent = queue[0][1];
      current = queue.shift()[0];

      for (let i = 0; i < A[current].length; i++) {
        //search for edges of current
        if (A[current][i] === 1 && parent !== i) {
          //if edge exists and not parent

          queue.push([i, current]);

          if (visited[i] === false) {
            visited[i] = true;
          } else {
            //already visted the vert -> circle in the graph
            return false;
          }
        }
      }
    }
    //passes both tests -> is a tree
    return true;
  },

  /**
   * Generates and returns a 2D Array,
   * where [i][j]:
   * i is the depth
   * j is the index for the verts in this depth
   * @param {int} root id of the root vertice
   */
  depthVerticeArray(root) {
    var depthVerticeArray = [[]], //array w e generate
      A = this.A,
      startingVert = root,
      visited = Array(this.number_vertices).fill(false),
      queue = [], //contains [vertice, depth][vertice_2, depth]...
      current,
      depthOfCurrent,
      depthOfGraph = 0;

    queue.push([startingVert, 0]);
    visited[startingVert] = true;

    while (queue.length > 0) {
      depthOfCurrent = queue[0][1];
      current = queue.shift()[0];

      if (depthOfCurrent > depthOfGraph) {
        depthVerticeArray.push([]);
        depthOfGraph = depthOfCurrent;
      }

      depthVerticeArray[depthOfCurrent].push(current);

      for (let i = 0; i < A[current].length; i++) {
        //search for edges of current
        if (A[current][i] === 1 && !visited[i]) {
          //if edge exists and not visted
          queue.push([i, depthOfCurrent + 1]);
          visited[i] = true;
        }
      }
    }
    return depthVerticeArray;
  },

  /**
   * Calculates wich vertice as root gives the smallest depth for the tree
   * @returns root vert id
   */
  minDepthRootVertice: function () {
    var depth, rootVertId, depthFromi;

    for (let i = 0; i < this.number_vertices; i++) {
      depthFromi = this.depthVerticeArray(i).length;
      if (depth == null) {
        depth = depthFromi;
        rootVertId = i;
      } else if (depthFromi < depth) {
        depth = depthFromi;
        rootVertId = i;
      }
    }

    return rootVertId;
  },

  /**
   * Calculates wich vertice as root gives the maximal depth for the tree
   * @returns root vert id
   */

  maxDepthRootVertice: function () {
    var depth, rootVertId, depthFromi;

    for (let i = 0; i < this.number_vertices; i++) {
      depthFromi = this.depthVerticeArray(i).length;
      if (depth == null) {
        depth = depthFromi;
        rootVertId = i;
      } else if (depthFromi > depth) {
        depth = depthFromi;
        rootVertId = i;
      }
    }

    return rootVertId;
  },

  /**
   * displays the tree vertically
   * @param {Int} root id from the root vertice
   * @param {Array} bb The Boundingbox of the graph, defines two points like this: [x1, y1, x2, y2]
   * Point 1 is the top left corner, Point 2 the bootom right
   */
  showVerticalTree: function (root, bb) {
    var bbLength = Math.abs(bb[0] - bb[2]),
      bbHeight = Math.abs(bb[1] - bb[3]),
      height,
      vertId,
      horizontal,
      //2D array with [depth][index] a sorted graph
      depthVerticeArray = this.depthVerticeArray(root),
      maxDepth = depthVerticeArray.length;

    for (let depth = 0; depth < maxDepth; depth++) {
      height = ((depth + 0.5) / maxDepth) * -bbHeight + bb[1];

      for (let i = 0; i < depthVerticeArray[depth].length; i++) {
        vertId = depthVerticeArray[depth][i];

        horizontal =
          ((i + 1 / 2) / depthVerticeArray[depth].length) * bbLength + bb[0];
        this.vertices[vertId].moveTo([horizontal, height], 500);
      }
    }
  },

  /**
   * displays the tree horizontally
   * @param {Int} root id from root vertice, if empty uses root node with smallest depth
   * @param {Array} bb bounding box of the graph
   */
  showHorizontalTree: function (root, bb) {
    var bbLength = Math.abs(bb[0] - bb[2]),
      bbHeight = Math.abs(bb[1] - bb[3]),
      width,
      vertId,
      vertical,
      //2D Array, with vertices sorted as [depth][index]
      depthVerticeArray = this.depthVerticeArray(root),
      maxDepth = depthVerticeArray.length;

    for (let depth = 0; depth < maxDepth; depth++) {
      width = ((depth + 1 / 2) / maxDepth) * bbLength + bb[0];

      for (let i = 0; i < depthVerticeArray[depth].length; i++) {
        vertId = depthVerticeArray[depth][i];
        vertical =
          ((i + 1 / 2) / depthVerticeArray[depth].length) * -bbHeight + bb[1];
        this.vertices[vertId].moveTo([width, vertical], 100);
      }
    }
  },

  /**
   *
   * @param {Int} root id from the root vertice, if not given,
   * it takes the optimal root
   * @param {[Int, Int, Int, Int]} bb bounding box of the graph
   * @param {Int} childrenSpread multiplier to change the spread among
   * the children of each vertice; multiplies with Pi
   * (recommended value is 0.5 to 1.5)
   *
   * places the tree in a circular format, with the root in the center and
   * every depth being on one circle
   *
   */
  showConCentricTree: function (root, bb, childrenSpread) {
    var bbLength = Math.abs(bb[0] - bb[2]),
      bbHeight = Math.abs(bb[1] - bb[3]),
      depthVerticeArray = this.depthVerticeArray(root),
      maxDepth = depthVerticeArray.length,
      xCenter = bb[0] + bbLength / 2,
      yCenter = bb[1] - bbHeight / 2,
      radius = bbHeight / (maxDepth + 2.5),
      angle,
      children = [],
      i,
      j;

    if (bbLength < bbHeight) {
      radius = bbLength / maxDepth;
    }
    //sets the default value of the spread-multiplier to 1.5
    if (childrenSpread == null) {
      childrenSpread = 1.5;
    }

    console.log("wurzel: " + root);

    //moves the root to the center of the bounding box
    this.vertices[root].moveTo([xCenter, yCenter], 0);

    //iterates over the adjacency MAtrix to find all the children and saves
    //their index in the children array
    for (i = 0; i < this.adjacency_matrix[root].length; i++) {
      if (this.adjacency_matrix[root][i] == 1 && i != root) {
        console.log("Kind erkannt: " + i);
        children.push(i);
      }
    }

    if (children.length == 0) {
      return; //returns if the vertice has no child vertices
    }
    angle = (Math.PI * 2) / children.length;
    console.log("Anzahl Kinder " + children.length);

    //iterates over the list of children
    //places them and then continues the recursion for their children
    for (j = 0; j < children.length; j++) {
      recursiveAngle = j * angle;
      x = xCenter + Math.cos(j * angle) * radius;
      y = yCenter + Math.sin(j * angle) * radius;
      this.vertices[children[j]].moveTo([x, y], 0);
      console.log("Moved " + children[j]);
      this.concentricViewRecursiveHelp(
        children[j],
        recursiveAngle,
        root,
        radius,
        1,
        x,
        y,
        depthVerticeArray,
        childrenSpread
      );
      console.log("recursion vorbei");
    }
  },

  /**function to help the original calling function in starting the recursion
   * for the placement called by init_concentric_view
   * @param {Int} root id of the root-vertice minus 1 (vertice Array starts
   * counting at 0 and the name starts counting at 1)
   * @param {Int} angle gives the angle of the previous iteration,
   *  so the algorithm knows in which direction the recursion has to prolong the tree
   * @param {Int} parent id of the parent vertice
   * so the child wont push its own parent into the array for the children
   * @param {Int} radius radius of the rotation
   * @param {Int} depth states the depth of the children to get the right angle
   * @param {Int} oldX x-coordinate of the root-vertice
   * @param {Int} oldY y-coordinate of the root-vertice
   */

  concentricViewRecursiveHelp: function (
    root,
    angle,
    parent,
    radius,
    depth,
    oldX,
    oldY,
    depthVerticeArray,
    childrenSpread
  ) {
    console.log("-----" + root + "----");

    //sets the angle between each child
    var deltaAngle,
      recursionChildren = [], //array containing all the ids of the child vertices
      newAngle,
      childAngle,
      l,
      k; //count variables for the loops

    console.log("Elternknoten: " + parent);
    for (l = 0; l < this.adjacency_matrix[root].length; l++) {
      if (this.adjacency_matrix[root][l] == 1 && l != root && l != parent) {
        console.log("Kind erkannt: " + l);
        recursionChildren.push(l);
      }
    }

    console.log("Anzahl Kinder: " + recursionChildren.length);
    if (recursionChildren.length == 0) {
      console.log("keine kinder");
      return; //returns if the vertice has no child vertices
    }

    //sets the starting position of the rotation, so the children rotate
    //symmetrical to both sides of their parent
    //so the picture looks better
    console.log("depth: " + depthVerticeArray[depth].length);

    deltaAngle = (Math.PI * childrenSpread) / depthVerticeArray[depth].length;
    console.log("Winkeländerung: " + deltaAngle);

    newAngle = angle - ((recursionChildren.length - 1) / 2) * deltaAngle;

    if (recursionChildren.length == 1) {
      newAngle = angle;
    }
    for (k = 0; k < recursionChildren.length; k++) {
      childAngle = newAngle + k * deltaAngle;

      console.log("Winkel: " + childAngle);
      x = oldX + Math.cos(childAngle) * radius;
      y = oldY + Math.sin(childAngle) * radius;

      this.vertices[recursionChildren[k]].moveTo([x, y], 0);
      console.log("Moved: " + recursionChildren[k]);

      this.concentricViewRecursiveHelp(
        recursionChildren[k],
        childAngle,
        root,
        radius,
        depth + 1,
        x,
        y,
        depthVerticeArray,
        childrenSpread
      );
    }
  },
});

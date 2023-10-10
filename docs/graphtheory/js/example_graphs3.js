var examples = [];


// simple tree examples
examples.push({
    name: 'Example 1',
    dimacs: `
    c another tree
    p edge 21 20
    e 1 2
    e 2 3
    e 2 4
    e 2 5
    e 2 6
    e 2 7
    e 3 8 
    e 3 9
    e 4 10
    e 5 11
    e 7 12
    e 7 13
    e 14 15
    e 10 15
    e 10 16
    e 12 17
    e 12 18
    e 18 19
    e 19 20
    e 3 21
`})

examples.push({
    name: 'Example 2',
    dimacs: `
    c An example tree.
    p edge 6 5
    n 1 1
    e 1 2
    e 1 3
    e 2 4
    e 2 5
    e 3 6`
    });

examples.push({
    name: 'Example 3',
    dimacs: `
    c Another example tree.
    p edge 10 9
    n 1 1

    e 1 2
    e 1 3
    e 1 4
    e 2 5
    e 2 6
    e 3 7
    e 6 8 
    e 6 9
    e 7 10`});


examples.push({
    name: 'Example 4',
    dimacs: `
    c An example graph.
    p edge 4 5
    n 1 1
    e 1 2
    e 1 3
    e 1 4
    e 2 3
    e 2 4`});

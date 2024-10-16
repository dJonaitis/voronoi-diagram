// THIS FILE GENERATES A VORONOI DIAGRAM AND APPLIES LLOYD'S RELAXATION TO IT

// Select the SVG element and get its width and height
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    
    // Generate an array of 1000 random sites within the SVG dimensions
    sites = d3.range(1000).map(function(d) {
      return [Math.random() * width, Math.random() * height];
    }),
    voronoi = d3.voronoi().extent([[0, 0], [width, height]]),// Create a Voronoi layout with the specified extent
    diagram = voronoi(sites),// Generate the initial Voronoi diagram from the site
    polygons = diagram.polygons(),// Get the polygons from the Voronoi diagram
    color = d3.scaleSequential(d3.interpolateSpectral);

// Draw the initial Voronoi polygons on the SVG
polygons.map(function(i, d) {
  svg.append("path")
     .attr("d", "M" + i.join("L") + "Z") // Create the path data string
     .attr("fill", color(d / 1000)); // Set the fill color based on the index
});

function relax() {
  // relaxation itself
  svg.selectAll("path").remove();
  sites = voronoi(sites).polygons().map(d3.polygonCentroid);
  diagram = voronoi(sites);
  polygons = diagram.polygons();
  
  // push neighbors indexes to each polygons element
  polygons.map(function(i, d) {
    i.index = d; // index of this element
    var neighbors = [];
    diagram.cells[d].halfedges.forEach(function(e) {
      var edge = diagram.edges[e], ea;
      if (edge.left && edge.right) {
        ea = edge.left.index;
        if (ea === d) {
          ea = edge.right.index;
        }
        neighbors.push(ea);
      }
    })
    i.neighbors = neighbors;
    svg.append("path").attr("d", "M" + i.join("L") + "Z").attr("fill", color(d/1000));
  });
  // show 1st array element in console
  console.log(polygons[10]);
}

// Relax 10 times
for (let i = 0; i < 10; i++) {
    setTimeout(relax, 3000);
}

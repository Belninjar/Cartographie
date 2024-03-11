
// Function to generate coordinates for concentric hexagonal rings
function hex_rings_at_d(d) {
    if (d == 0) return [{ x: 0, y: 0 }];
    
    const d2 = Math.sqrt(d ** 2 - (0.5 * d) ** 2);
    const d3 = 0.5 * d;
    
    const f = (a, b) => {
        const numPoints = d + 1;
        const step = (b - a) / (numPoints - 1);
        return Array.from({ length: numPoints }, (_, i) => a + i * step).slice(1);
    };
    
    const xValues = [].concat(
        f(d, d3), f(d3, -d3), f(-d3, -d),
        f(-d, -d3), f(-d3, d3), f(d3, d)
    );
    
    const yValues = [].concat(
        f(0, d2), f(d2, d2), f(d2, 0),
        f(0, -d2), f(-d2, -d2), f(-d2, 0)
    );

    return xValues.map((x, i) => ({ x, y: yValues[i] }));
}

// Function to create polygons in a concentric way
function createConcentricPolygons(container, numRings) {
            // Create a new SVG element for the ring
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("class", "hexagon");
            svg.setAttribute("viewBox", "0 0 86.6 100");
            svg.setAttribute("overflow","visible");
            svg.style.width = "86.6px";
            svg.style.height = "100px";

    // Loop through each ring
for (let d = 0; d < numRings; d++) {
    // Calculate the coordinates for the current ring
    const coordinates = hex_rings_at_d(d);
        // Calculate opacity based on ring number
        let opacity;
        if (d < 2) {
            opacity = 0;
        } else if (d === 2) {
            opacity = 0.7;
        } else {
            opacity = 1;
        }

    // Loop through each coordinate and create a polygon
    for (let i = 0; i < coordinates.length; i++) {

        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        // Add a unique ID to each polygon
        const polygonId = `polygon_${d}_${i}`;
        polygon.setAttribute("id", polygonId);
        polygon.setAttribute("points", "86.6 75 43.3 100 0 75 0 25 43.3 0 86.6 25");
        polygon.setAttribute("fill", `rgba(0, 0, 0, ${opacity})`);
        polygon.setAttribute("stroke", "black");
        const leftContainer = document.getElementById('hexContainer');
        const leftContainerHeight = leftContainer.offsetHeight;
        const leftContainerWidth = leftContainer.offsetWidth;

        // Position the polygon based on the coordinate
        polygon.style.transform = `translate(${(coordinates[i].x-0.5)*86.6+leftContainerWidth/2}px, ${(coordinates[i].y-0.5)*86.6+leftContainerHeight/2}px)`;
        
        // Append the polygon to the SVG element
        svg.appendChild(polygon);
    }

    // Append the SVG element to the container
    container.appendChild(svg);
}
}

// Call the function to create concentric polygons in the left container with 5 rings
    // Create a new SVG element for the ring
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "hexagon");
    svg.setAttribute("viewBox", "0 0 86.6 100");
    svg.setAttribute("overflow","visible");
    svg.style.width = "86.6px";
    svg.style.height = "100px";
const leftContainer = document.getElementById('hexContainer');
createConcentricPolygons(leftContainer, 10);

const polygons = document.querySelectorAll('.hexagon polygon');

    polygons.forEach(polygon => {
      polygon.addEventListener('mouseenter', function() {
        this.setAttribute('stroke', 'yellow');
        this.setAttribute('stroke-width', '4');
    });

      polygon.addEventListener('mouseleave', function() {
        this.setAttribute('stroke', 'black');
        this.setAttribute('stroke-width', '1');
    });
    });
    const zoomedSvg = document.querySelector('.zoomed-polygon');
    const zoomedPolygon = zoomedSvg.querySelector('polygon');
    const leftContainerHeight = leftContainer.offsetHeight;
    const leftContainerWidth = leftContainer.offsetWidth;

const translateX = leftContainerWidth / 2 - 86.6/2;
const translateY = leftContainerHeight / 2 - 86.6/2;

// Apply the initial position without animation
zoomedSvg.style.left = `${translateX}px`;
zoomedSvg.style.top = `${translateY}px`;
    
// Function to handle click events on polygons
function handlePolygonClick() {

    zoomedSvg.classList.toggle('show');
    
    
}

// Add event listeners to polygons
polygons.forEach(polygon => {
    polygon.addEventListener('click', handlePolygonClick);
});


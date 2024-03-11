// Get image container elements
const imageContainers = document.querySelectorAll('.image-container');

// Get SVG container
const svgContainer = document.querySelector('.svg-container');

const leftContainer = document.querySelector('.left-container');
const leftContainerRect = leftContainer.getBoundingClientRect();
const leftContainerCenterX = leftContainerRect.left + leftContainerRect.width / 2;
const leftContainerCenterY = leftContainerRect.top + leftContainerRect.height / 2;

// Define connections between images
const connections = [
    { from: 0, to: 4 }, // Connect Image 1 to Image 2
    { from: 0, to: 7 },  // Connect Image 2 to Image 3
    { from: 1, to: 9 },  // Connect Image 2 to Image 3
    { from: 1, to: 11 }  // Connect Image 2 to Image 3
    // Add more connections as needed
];

// Function to create a line between two points with animation and curvature
function createLineWithCurvature(x1, y1, x2, y2, centerX, centerY) {
  const controlX = (x1 + x2 + 2 * centerX) / 4;
  const controlY = (y1 + y2 + 2 * centerY) / 4;

  const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
  const pathData = `M ${x1},${y1} Q ${controlX},${controlY} ${x2},${y2}`;
  line.setAttribute("d", pathData);
  line.setAttribute("stroke", "white");
  line.setAttribute("stroke-width", "2");
  line.setAttribute("fill", "none");
  svgContainer.appendChild(line);

  const length = line.getTotalLength();

  // Set up animation
  line.style.strokeDasharray = length + ' ' + length;
  line.style.strokeDashoffset = length;

  // Trigger reflow and start animation
  line.getBoundingClientRect();
  line.style.transition = line.style.WebkitTransition =
    'stroke-dashoffset 1s ease-in-out';
  line.style.strokeDashoffset = '0';
  return line;
}

// Function to remove a line from the SVG container
function removeLine(line) {
    svgContainer.removeChild(line);
}

// Function to create a moving point along a path
function createMovingPoint(x, y) {
  const point = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  point.setAttribute("cx", x);
  point.setAttribute("cy", y);
  point.setAttribute("r", 25); // Adjust the radius as needed

  // Define the radial gradient for fading effect
  const gradient = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient");
  gradient.setAttribute("id", "fade");
  const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop1.setAttribute("offset", "10%");
  stop1.setAttribute("stop-color", "white");
  stop1.setAttribute("stop-opacity", "1");
  const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop2.setAttribute("offset", "30%");
  stop2.setAttribute("stop-color", "white");
  stop2.setAttribute("stop-opacity", "0");

  gradient.appendChild(stop1);
  gradient.appendChild(stop2);

  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  defs.appendChild(gradient);
  svgContainer.appendChild(defs);

  point.setAttribute("fill", "url(#fade)"); // Use the gradient as fill
  svgContainer.appendChild(point);
  return point;
}




// Function to animate the movement of the point along a path
function animateMovingPoint(point, path) {
  const length = path.getTotalLength();
  let distance = 0;

  function movePoint() {
      distance += length/200; // Adjust the speed of movement as needed
      const { x, y } = path.getPointAtLength(distance % length);
      point.setAttribute("cx", x);
      point.setAttribute("cy", y);
      requestAnimationFrame(movePoint);
  }

  movePoint();
}

// Add event listeners to each image container
imageContainers.forEach((container, index) => {
  let lines = []; // Initialize lines array
  let linesDrawn = false; // Flag to track if lines have been drawn

  container.addEventListener('mouseenter', () => {
    // Check if lines have already been drawn
    if (!linesDrawn) {
      // Remove all lines from the SVG container
      svgContainer.innerHTML = '';

      // Check for connections and create lines
      connections.forEach(connection => {
        if (connection.from === index) {
          const nextContainer = imageContainers[connection.to];
          const containerRect = container.getBoundingClientRect();
          const nextRect = nextContainer.getBoundingClientRect();
          const x1 = containerRect.left + containerRect.width / 2;
          const y1 = containerRect.top + containerRect.height / 2;
          const x2 = nextRect.left + nextRect.width / 2;
          const y2 = nextRect.top + nextRect.height / 2;
          const line = createLineWithCurvature(x1, y1, x2, y2, leftContainerCenterX, leftContainerCenterY);
          lines.push(line); // Push the line to the lines array
          movingPoint = createMovingPoint(x1, y1); // Create the moving point
          animateMovingPoint(movingPoint, line); // Animate the movement of the point along the line
        }
      });

      linesDrawn = true; // Update the flag to indicate that lines have been drawn
    }
  });

  container.addEventListener('mouseleave', () => {
    // Clear the lines array
    lines = [];
    // Reset the flag to indicate that lines need to be drawn again
    linesDrawn = false;
  });
});



// JavaScript code to handle click event
document.querySelectorAll('.image-container').forEach(container => {
  container.addEventListener('click', function(event) {
      // Prevent the default action
      event.preventDefault();

      // Modify the style of the clicked container
      this.style.transition = 'border 0.4s ease-in-out'; // Smooth transition for the border change
      this.style.border = '4px solid red'; // Adjust thickness and color as needed

      // Retrieve the URL from the data attribute of the container
      const url = this.getAttribute('data-page-url'); // Ensure the attribute name matches your HTML

      // Set a timeout to show the overlay after the border transition
      setTimeout(() => {
          // Show the overlay to turn the left-image container black
          document.querySelector('.overlay').style.opacity = '1'; // Adjust opacity as needed
      }, 800); // Adjust delay to match the transition duration of the border change

      // Set a timeout before navigating to give the border effect time to be seen
      setTimeout(() => {
          window.location.href = url;
      }, 1600); // Adjust delay as needed, should match the total transition duration

  });
});




// JavaScript code for zoom-in effect on page load
document.addEventListener('DOMContentLoaded', function() {
    // Apply a CSS class to the left-container for the downscaled state
    document.querySelector('.left-container').classList.add('downscaled');
    // After a delay, apply a class to trigger the zoom-in effect
    setTimeout(function() {
      document.querySelector('.left-container').classList.add('zoom-in2');
    }, 50); // Adjust the delay as needed to allow time for initial scaling to take effect
    setTimeout(function() {
      document.querySelectorAll('.image-container').forEach(container => {
        container.classList.add('show');
      });
  }, 2500); // Adjust the delay (in milliseconds) as needed
});

// JavaScript code to handle click event
document.querySelectorAll('.image-container2').forEach(imageContainer => {
    imageContainer.addEventListener('click', () => {
      // After a delay, navigate to the target page
      setTimeout(() => {
        // Get the URL associated with the clicked image
        const imageUrl = imageContainer.dataset.pageUrl;
        // Navigate to the corresponding HTML page
        window.location.href = imageUrl;
      }, 10); // Adjust the delay as needed to match the transition duration
    });
});

// Function to update the text content in the left container
function updateHoveredText(text) {
    hoveredText.textContent = text;
}


// Fetch and parse the CSV file
fetch('Data/COC.csv')
  .then(response => response.text())
  .then(data => {
    parseCSVData(data);
  })
  .catch(error => console.error('Error fetching the CSV file:', error));


  // Display the text on the webpage
function displayText(data) {
  const hoveredText = document.getElementById('hovered-text');
  hoveredText.textContent = data[0].text; // Assuming the first row contains the text
}

// Parse the CSV data
function parseCSVData(csvData) {
    Papa.parse(csvData, {
        header: false,
        complete: function(results) {
            console.log("Parsed CSV data:", results.data); // Log the parsed CSV data
            // Call a function to associate each image URL with its corresponding text
            associateTextWithImages(results.data);
        }
    });
}

// Associate each image URL with its corresponding text
function associateTextWithImages(data) {
    console.log("Associating text with images:", data); // Log the data array received
    // Assuming imageContainers is an array of image container elements
    imageContainers.forEach((container, index) => {
        // Get the text associated with the current image
        const text = data[index][1]; // Assuming the text is in the second column
        console.log("Text for image container", index, ":", text); // Log the text associated with each image
        // Set the data attribute for the text on the image container
        container.dataset.text = text;
    });
}

  
  // Function to update the text content in the right container
  function updateHoveredText(text) {
    const hoveredText = document.getElementById('hovered-text');
    hoveredText.textContent = text;
  }
  
  // Add event listeners to each image container
  imageContainers.forEach((container) => {
    container.addEventListener('mouseenter', () => {
      // Get the specific text associated with the image container
      const specificText = container.dataset.text;
      // Update the text content in the right container
      //updateHoveredText(specificText);
      updateHoveredTextWithFormatting(specificText);
    });
  
    container.addEventListener('mouseleave', () => {
      // Clear the text content when the mouse leaves the image container
      updateHoveredText('');
    });
  });
  
// Function to update the text content in the right container with formatting
function updateHoveredTextWithFormatting(text) {
    const hoveredText = document.getElementById('hovered-text');
    // Replace special characters with HTML markup for formatting
    const formattedText = text
        // Replace underscores with <u> tags for underline
        .replace(/_([^_]+)_/g, '<u>$1</u>')
        // Replace asterisks with <strong> tags for bold
        .replace(/\*([^\*]+)\*/g, '<strong>$1</strong>')
        // Replace newline characters with <br> tags for line breaks
        .replace(/\\n/g, '<br>');
    hoveredText.innerHTML = formattedText;
}


// Fetch and parse the CSV file
fetch('Data/Transverse.csv', { 
  headers: { 'Content-Type': 'text/csv; charset=iso-8859-1' } 
})
    .then(response => response.text())
    .then(data => {
        parseCSVData2(data);
    })
    .catch(error => console.error('Error fetching the CSV file:', error));

// Parse the CSV data
function parseCSVData2(csvData) {
    Papa.parse(csvData, {
        header: false,
        complete: function(results) {
            console.log("Parsed CSV data:", results.data); // Log the parsed CSV data
            // Call a function to handle the parsed data
            handleCSVData2(results.data);
        }
    });
}

function handleCSVData2(data) {
  // Add event listener to SVG container for mouseenter and mouseleave events
  svgContainer.addEventListener('mouseover', function(event) {
      if (event.target.tagName === 'path') {
          const index = Array.from(event.target.parentNode.children).indexOf(event.target);
          const text = data[index][2]; // Get the text associated with the current line
          updateHoveredText2(text); // Update the text in the right container
      }
  });

  svgContainer.addEventListener('mouseout', function(event) {
      if (event.target.tagName === 'path') {
          const index = Array.from(event.target.parentNode.children).indexOf(event.target);
          updateHoveredText2(''); // Clear the text in the right container when mouse leaves the line
      }
  });
}

// Function to update the text content in the right container
function updateHoveredText2(text) {
  const hoveredText = document.getElementById('hovered-text');
  // Replace special characters with HTML markup for formatting
  const formattedText = text
      // Replace underscores with <u> tags for underline
      .replace(/_([^_]+)_/g, '<u>$1</u>')
      // Replace asterisks with <strong> tags for bold
      .replace(/\*([^\*]+)\*/g, '<strong>$1</strong>')
      // Replace newline characters with <br> tags for line breaks
      .replace(/\\n/g, '<br>');
  hoveredText.innerHTML = formattedText;
}



